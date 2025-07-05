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
        """Fetch current probabilities from ASX Rate
