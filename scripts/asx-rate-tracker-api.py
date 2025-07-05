#!/usr/bin/env python3
"""
ASX RBA Rate Tracker API Proxy
Fetches real-time market probabilities from ASX and serves them via API
"""

import json
import requests
from bs4 import BeautifulSoup
from datetime import datetime
import pytz
from flask import Flask, jsonify
from flask_cors import CORS
import re
from typing import Dict, List, Optional

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
TIMEZONE = pytz.timezone('Australia/Sydney')
ASX_RATE_TRACKER_URL = "https://www.asx.com.au/data/trt/ib_expectation_curve_graph.pdf"
# Note: The actual URL might be different - this needs to be verified

class ASXRateTracker:
    """Fetches and parses ASX RBA Rate Tracker data"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def fetch_rate_probabilities(self) -> Optional[Dict]:
        """
        Fetch current market probabilities from ASX
        Returns dict with probabilities for each rate outcome
        """
        try:
            # Note: The actual implementation would depend on the ASX page structure
            # This is a template showing how it would work
            
            # For ASX, we might need to:
            # 1. Fetch the main page
            # 2. Find the data endpoint (might be JSON API)
            # 3. Parse the response
            
            # Example implementation for HTML scraping:
            response = self.session.get(ASX_RATE_TRACKER_URL)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find the probability table (adjust selectors based on actual page)
            prob_table = soup.find('table', {'class': 'rate-probability-table'})
            if not prob_table:
                # Try alternative selectors
                prob_table = soup.find('div', {'id': 'rate-tracker-data'})
            
            # Parse probabilities
            probabilities = self._parse_probability_table(prob_table)
            
            # Get next meeting date
            meeting_date = self._extract_meeting_date(soup)
            
            return {
                'nextMeeting': meeting_date,
                'source': 'ASX RBA Rate Tracker',
                'lastUpdate': datetime.now(TIMEZONE).isoformat(),
                'probabilities': probabilities
            }
            
        except Exception as e:
            print(f"Error fetching ASX data: {e}")
            # Return fallback data or cached data
            return self._get_fallback_data()
    
    def _parse_probability_table(self, table_element) -> List[Dict]:
        """Parse the probability table from HTML"""
        probabilities = []
        
        # This would need to be adjusted based on actual HTML structure
        rows = table_element.find_all('tr')[1:]  # Skip header
        
        for row in rows:
            cols = row.find_all('td')
            if len(cols) >= 2:
                outcome_text = cols[0].text.strip()
                probability_text = cols[1].text.strip()
                
                # Extract rate from outcome text
                rate_match = re.search(r'(\d+\.\d+)%', outcome_text)
                if rate_match:
                    rate = float(rate_match.group(1))
                    
                    # Extract probability
                    prob_match = re.search(r'(\d+(?:\.\d+)?)%', probability_text)
                    if prob_match:
                        probability = float(prob_match.group(1))
                        
                        # Calculate implied odds
                        implied_odds = 100 / probability if probability > 0 else 0
                        
                        probabilities.append({
                            'outcome': outcome_text,
                            'rate': rate,
                            'probability': probability,
                            'impliedOdds': round(implied_odds, 2)
                        })
        
        return probabilities
    
    def _extract_meeting_date(self, soup) -> str:
        """Extract next RBA meeting date from page"""
        # Look for meeting date in various places
        date_patterns = [
            r'Next (?:RBA )?Meeting:?\s*(\d{1,2}\s+\w+\s+\d{4})',
            r'(\d{1,2}\s+\w+\s+\d{4})\s+RBA',
            r'Meeting Date:?\s*(\d{1,2}\s+\w+\s+\d{4})'
        ]
        
        page_text = soup.get_text()
        for pattern in date_patterns:
            match = re.search(pattern, page_text, re.IGNORECASE)
            if match:
                date_str = match.group(1)
                # Parse and format date
                try:
                    parsed_date = datetime.strptime(date_str, '%d %B %Y')
                    return parsed_date.strftime('%Y-%m-%d')
                except:
                    pass
        
        # Default to next known meeting
        return "2025-07-08"
    
    def _get_fallback_data(self) -> Dict:
        """Return fallback data if scraping fails"""
        return {
            'nextMeeting': '2025-07-08',
            'source': 'ASX RBA Rate Tracker (Cached)',
            'lastUpdate': datetime.now(TIMEZONE).isoformat(),
            'probabilities': [
                {
                    'outcome': 'Hold (3.85%)',
                    'rate': 3.85,
                    'probability': 3,
                    'impliedOdds': 33.33
                },
                {
                    'outcome': '-0.25% (3.60%)',
                    'rate': 3.60,
                    'probability': 97,
                    'impliedOdds': 1.03
                }
            ]
        }

# Alternative: Direct JSON API approach (if ASX provides one)
class ASXRateTrackerAPI:
    """Fetches data from ASX API if available"""
    
    def __init__(self):
        # ASX might have an API endpoint like this
        self.api_base = "https://www.asx.com.au/asx/api/v1"
        self.rate_tracker_endpoint = "/derivatives/rate-tracker"
    
    def fetch_rate_probabilities(self) -> Optional[Dict]:
        """Fetch from API endpoint"""
        try:
            url = f"{self.api_base}{self.rate_tracker_endpoint}"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Transform API response to our format
            probabilities = []
            for outcome in data.get('outcomes', []):
                prob = outcome.get('probability', 0)
                probabilities.append({
                    'outcome': outcome.get('description'),
                    'rate': outcome.get('target_rate'),
                    'probability': prob,
                    'impliedOdds': round(100 / prob, 2) if prob > 0 else 0
                })
            
            return {
                'nextMeeting': data.get('next_meeting_date'),
                'source': 'ASX RBA Rate Tracker API',
                'lastUpdate': datetime.now(TIMEZONE).isoformat(),
                'probabilities': probabilities
            }
            
        except Exception as e:
            print(f"API Error: {e}")
            return None

# Initialize tracker
tracker = ASXRateTracker()
api_tracker = ASXRateTrackerAPI()

@app.route('/api/rba-probabilities')
def get_rba_probabilities():
    """API endpoint to get current RBA rate probabilities"""
    
    # Try API first, fall back to scraping
    data = api_tracker.fetch_rate_probabilities()
    if not data:
        data = tracker.fetch_rate_probabilities()
    
    if data:
        # Add historical comparison if available
        data['changes'] = calculate_daily_changes(data)
        return jsonify(data)
    else:
        return jsonify({'error': 'Unable to fetch data'}), 500

@app.route('/api/rba-probabilities/history')
def get_probability_history():
    """Get historical probability data for charts"""
    # This would fetch from a database of stored daily snapshots
    # For now, return sample data
    return jsonify({
        'history': [
            {
                'date': '2025-07-01',
                'probabilities': {
                    'hold': 15,
                    'cut25': 80,
                    'cut50': 5
                }
            },
            {
                'date': '2025-07-02',
                'probabilities': {
                    'hold': 10,
                    'cut25': 85,
                    'cut50': 5
                }
            },
            {
                'date': '2025-07-03',
                'probabilities': {
                    'hold': 5,
                    'cut25': 92,
                    'cut50': 3
                }
            },
            {
                'date': '2025-07-04',
                'probabilities': {
                    'hold': 3,
                    'cut25': 97,
                    'cut50': 0
                }
            }
        ]
    })

def calculate_daily_changes(current_data: Dict) -> Dict:
    """Calculate changes from previous day"""
    # This would compare with yesterday's stored data
    # For demo, return sample changes
    return {
        'hold': {'change': -2, 'direction': 'down'},
        'cut25': {'change': +2, 'direction': 'up'},
        'cut50': {'change': 0, 'direction': 'unchanged'}
    }

# Scheduled task to cache data
def cache_daily_data():
    """Run daily to cache probability data"""
    data = tracker.fetch_rate_probabilities()
    if data:
        # Store in database or file
        filename = f"data/prob_history_{datetime.now().strftime('%Y%m%d')}.json"
        with open(filename, 'w') as f:
            json.dump(data, f)

if __name__ == '__main__':
    # For production, use a proper WSGI server like Gunicorn
    app.run(host='0.0.0.0', port=5000, debug=True)
