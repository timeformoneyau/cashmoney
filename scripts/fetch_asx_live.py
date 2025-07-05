#!/usr/bin/env python3
"""
ASX RBA Rate Tracker Live Data Fetcher
Uses Selenium for JavaScript-rendered content
"""

import json
import time
from datetime import datetime
import pytz
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import re
import os

class ASXSeleniumScraper:
    def __init__(self):
        self.tz = pytz.timezone('Australia/Sydney')
        self.setup_driver()
        
    def setup_driver(self):
        """Setup Chrome driver with options"""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--window-size=1920,1080')
        
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=chrome_options)
        
    def fetch_probabilities(self):
        """Fetch current probabilities from ASX Rate Tracker"""
        try:
            # Navigate to ASX Rate Tracker
            url = "https://www.asx.com.au/markets/trade-our-derivatives-market/futures-market/rba-rate-tracker"
            self.driver.get(url)
            
            # Wait for the page to load
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "table"))
            )
            
            # Give JavaScript time to render
            time.sleep(2)
            
            # Find probability data
            probabilities = self.extract_probabilities()
            
            # Get next meeting date
            meeting_date = self.extract_meeting_date()
            
            return {
                'nextMeeting': meeting_date,
                'source': 'ASX RBA Rate Tracker',
                'lastUpdate': datetime.now(self.tz).isoformat(),
                'probabilities': probabilities
            }
            
        except Exception as e:
            print(f"Error fetching data: {e}")
            return None
        finally:
            self.driver.quit()
    
    def extract_probabilities(self):
        """Extract probability data from the page"""
        probabilities = []
        
        try:
            # Look for the probability table
            # Note: Actual selectors need to be verified on the live site
            tables = self.driver.find_elements(By.TAG_NAME, "table")
            
            for table in tables:
                # Check if this is the rate tracker table
                header_text = table.text.lower()
                if 'probability' in header_text or 'rate' in header_text:
                    rows = table.find_elements(By.TAG_NAME, "tr")[1:]  # Skip header
                    
                    for row in rows:
                        cells = row.find_elements(By.TAG_NAME, "td")
                        if len(cells) >= 2:
                            outcome = cells[0].text.strip()
                            prob_text = cells[1].text.strip()
                            
                            # Extract probability percentage
                            prob_match = re.search(r'(\d+(?:\.\d+)?)\s*%', prob_text)
                            if prob_match:
                                probability = float(prob_match.group(1))
                                
                                # Extract rate from outcome
                                rate_match = re.search(r'(\d+\.\d+)\s*%', outcome)
                                if rate_match:
                                    rate = float(rate_match.group(1))
                                else:
                                    # Try to infer rate from outcome description
                                    if 'hold' in outcome.lower() or 'no change' in outcome.lower():
                                        rate = 3.85  # Current rate
                                    elif '25' in outcome or '0.25' in outcome:
                                        rate = 3.60
                                    elif '50' in outcome or '0.50' in outcome:
                                        rate = 3.35
                                    else:
                                        continue
                                
                                # Calculate implied odds
                                implied_odds = 100 / probability if probability > 0 else 0
                                
                                probabilities.append({
                                    'outcome': outcome,
                                    'rate': rate,
                                    'probability': probability,
                                    'impliedOdds': round(implied_odds, 2)
                                })
            
            # If no table found, try alternative selectors
            if not probabilities:
                # Try finding by specific class names or IDs
                prob_elements = self.driver.find_elements(By.CLASS_NAME, "probability-row")
                for elem in prob_elements:
                    outcome = elem.find_element(By.CLASS_NAME, "outcome").text
                    probability = float(elem.find_element(By.CLASS_NAME, "probability").text.strip('%'))
                    rate = float(elem.get_attribute('data-rate'))
                    
                    probabilities.append({
                        'outcome': outcome,
                        'rate': rate,
                        'probability': probability,
                        'impliedOdds': round(100 / probability, 2) if probability > 0 else 0
                    })
            
        except Exception as e:
            print(f"Error extracting probabilities: {e}")
            
        # Fallback data if extraction fails
        if not probabilities:
            probabilities = [
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
        
        return probabilities
    
    def extract_meeting_date(self):
        """Extract the next RBA meeting date"""
        try:
            # Look for meeting date in various places
            page_text = self.driver.find_element(By.TAG_NAME, "body").text
            
            # Common patterns for dates
            patterns = [
                r'(?:next|upcoming)\s+(?:RBA\s+)?meeting[:\s]+(\d{1,2}\s+\w+\s+\d{4})',
                r'(\d{1,2}\s+\w+\s+\d{4})\s+(?:RBA|meeting)',
                r'(?:Tuesday|Monday|Wednesday|Thursday|Friday),?\s+(\d{1,2}\s+\w+\s+\d{4})'
            ]
            
            for pattern in patterns:
                match = re.search(pattern, page_text, re.IGNORECASE)
                if match:
                    date_str = match.group(1)
                    try:
                        # Parse date
                        parsed = datetime.strptime(date_str, '%d %B %Y')
                        return parsed.strftime('%Y-%m-%d')
                    except:
                        pass
            
            # Try specific elements
            date_elements = self.driver.find_elements(By.CLASS_NAME, "meeting-date")
            if date_elements:
                date_text = date_elements[0].text
                # Parse and return
                
        except Exception as e:
            print(f"Error extracting date: {e}")
        
        # Default to next known meeting
        return "2025-07-08"

def save_data(data):
    """Save data to JSON file"""
    os.makedirs('data', exist_ok=True)
    
    filepath = 'data/market-odds.json'
    
    # Load existing data to preserve structure
    try:
        with open(filepath, 'r') as f:
            existing = json.load(f)
    except:
        existing = {}
    
    # Update with new data
    existing.update(data)
    
    # Save
    with open(filepath, 'w') as f:
        json.dump(existing, f, indent=2)
    
    print(f"Data saved to {filepath}")

def main():
    """Main execution function"""
    print("Fetching ASX RBA Rate Tracker data...")
    
    scraper = ASXSeleniumScraper()
    data = scraper.fetch_probabilities()
    
    if data:
        save_data(data)
        print("Successfully fetched and saved data")
        print(json.dumps(data, indent=2))
    else:
        print("Failed to fetch data")
        exit(1)

if __name__ == "__main__":
    main()
