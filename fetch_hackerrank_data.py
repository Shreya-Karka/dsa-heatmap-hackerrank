#!/usr/bin/env python3
"""
HackerRank Submission Scraper
Fetches submission history from HackerRank profile page and saves to JSON
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime
from collections import defaultdict
import sys

def fetch_hackerrank_submissions(username):
    """
    Scrape HackerRank submissions from user profile
    Returns: dict of {date: count} submissions
    """
    
    # HackerRank profile URL
    profile_url = f"https://www.hackerrank.com/rest/hackers/{username}/recent_challenges"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        # Fetch recent challenges
        response = requests.get(profile_url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Parse submissions by date
        submissions_by_date = defaultdict(int)
        
        if 'models' in data:
            for challenge in data['models']:
                # Get last submission time
                if 'last_submitted_at' in challenge and challenge['last_submitted_at']:
                    timestamp = challenge['last_submitted_at']
                    # Convert timestamp to date
                    date = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
                    submissions_by_date[date] += 1
        
        # Also try to get more data from submissions endpoint
        submissions_url = f"https://www.hackerrank.com/rest/hackers/{username}/submissions"
        try:
            sub_response = requests.get(submissions_url, headers=headers, timeout=10)
            if sub_response.status_code == 200:
                sub_data = sub_response.json()
                if 'models' in sub_data:
                    for submission in sub_data['models']:
                        if 'created_at' in submission and submission['created_at']:
                            timestamp = submission['created_at']
                            date = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
                            # Avoid double counting - only add if not already counted
                            if date not in submissions_by_date:
                                submissions_by_date[date] += 1
        except:
            pass  # Submissions endpoint might not be available
        
        return dict(submissions_by_date)
    
    except requests.RequestException as e:
        print(f"Error fetching data from HackerRank: {e}", file=sys.stderr)
        return {}

def fetch_profile_metadata(username):
    """
    Fetch user profile metadata (creation date, etc.)
    """
    profile_url = f"https://www.hackerrank.com/rest/hackers/{username}/profile"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(profile_url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        metadata = {}
        if 'model' in data:
            # Extract account creation date
            if 'created_at' in data['model']:
                timestamp = data['model']['created_at']
                metadata['createdAt'] = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
            
            # Add other useful info
            if 'name' in data['model']:
                metadata['name'] = data['model']['name']
            if 'country' in data['model']:
                metadata['country'] = data['model']['country']
        
        return metadata
    
    except requests.RequestException as e:
        print(f"Error fetching profile metadata: {e}", file=sys.stderr)
        return {}

def merge_submission_data(old_data, new_data):
    """
    Merge old and new submission data, keeping the maximum count for each date
    """
    merged = old_data.copy()
    for date, count in new_data.items():
        if date in merged:
            merged[date] = max(merged[date], count)
        else:
            merged[date] = count
    return merged

def main():
    if len(sys.argv) < 2:
        print("Usage: python fetch_hackerrank_data.py <username>")
        sys.exit(1)
    
    username = sys.argv[1]
    print(f"Fetching data for HackerRank user: {username}")
    
    # Load existing data if available
    try:
        with open('hackerrank_data.json', 'r') as f:
            existing_data = json.load(f)
            old_submissions = existing_data.get('submissions', {})
            old_metadata = existing_data.get('metadata', {})
    except FileNotFoundError:
        old_submissions = {}
        old_metadata = {}
    
    # Fetch new data
    new_submissions = fetch_hackerrank_submissions(username)
    metadata = fetch_profile_metadata(username)
    
    # Merge data
    merged_submissions = merge_submission_data(old_submissions, new_submissions)
    merged_metadata = {**old_metadata, **metadata}
    
    # Prepare output
    output = {
        'username': username,
        'lastUpdated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'metadata': merged_metadata,
        'submissions': merged_submissions
    }
    
    # Save to JSON
    with open('hackerrank_data.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"✓ Fetched {len(new_submissions)} dates from recent submissions")
    print(f"✓ Total dates in database: {len(merged_submissions)}")
    print(f"✓ Data saved to hackerrank_data.json")

if __name__ == "__main__":
    main()
