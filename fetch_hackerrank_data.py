#!/usr/bin/env python3
"""
HackerRank Submission Scraper - Updated for 2025 API
Uses the correct /rest/contests/master/submissions endpoint
"""

import requests
import json
from datetime import datetime
from collections import defaultdict
import sys
import time

def fetch_all_submissions(username):
    """
    Fetch all submissions using the working API endpoint
    """
    print(f"\n{'='*60}")
    print(f"Fetching submissions for: {username}")
    print(f"{'='*60}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': f'https://www.hackerrank.com/profile/{username}',
    }
    
    submissions_by_date = defaultdict(int)
    all_submissions = []
    
    # Fetch in batches
    offset = 0
    limit = 100  # Fetch 100 at a time
    total_fetched = 0
    
    while True:
        url = f"https://www.hackerrank.com/rest/contests/master/submissions?offset={offset}&limit={limit}"
        
        print(f"\nFetching batch: offset={offset}, limit={limit}")
        
        try:
            # Add cookies to simulate browser request
            response = requests.get(
                url,
                headers=headers,
                timeout=15,
                cookies={'hackerrank_mixpanel_token': username}
            )
            
            print(f"Status code: {response.status_code}")
            
            if response.status_code != 200:
                print(f"⚠️  API returned status {response.status_code}")
                break
            
            data = response.json()
            
            # Check if we have models (submissions)
            if 'models' not in data or len(data['models']) == 0:
                print("✓ No more submissions to fetch")
                break
            
            batch_size = len(data['models'])
            print(f"✓ Fetched {batch_size} submissions")
            
            # Process this batch
            for submission in data['models']:
                all_submissions.append(submission)
                
                # Extract timestamp
                timestamp = None
                if 'created_at' in submission:
                    timestamp = submission['created_at']
                elif 'time_from_now' in submission:
                    # Skip relative time entries
                    continue
                
                if timestamp:
                    try:
                        # Convert Unix timestamp to date
                        date = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
                        submissions_by_date[date] += 1
                        
                        # Show progress every 20 submissions
                        if total_fetched % 20 == 0:
                            print(f"  Processing... {total_fetched} submissions so far")
                    except Exception as e:
                        print(f"  ⚠️  Error processing timestamp {timestamp}: {e}")
            
            total_fetched += batch_size
            
            # Check if there are more pages
            if 'total' in data and total_fetched >= data['total']:
                print(f"✓ Reached total: {data['total']}")
                break
            
            if batch_size < limit:
                print(f"✓ Last batch (only {batch_size} items)")
                break
            
            # Move to next batch
            offset += limit
            
            # Be nice to HackerRank servers
            time.sleep(0.5)
            
            # Safety limit: stop after 500 submissions
            if total_fetched >= 500:
                print(f"✓ Reached safety limit (500 submissions)")
                break
        
        except requests.RequestException as e:
            print(f"❌ Network error: {e}")
            break
        except json.JSONDecodeError as e:
            print(f"❌ JSON decode error: {e}")
            break
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            break
    
    print(f"\n{'='*60}")
    print(f"✓ Total submissions fetched: {total_fetched}")
    print(f"✓ Unique dates with activity: {len(submissions_by_date)}")
    print(f"{'='*60}")
    
    return dict(submissions_by_date)

def fetch_profile_metadata(username):
    """
    Try to fetch profile metadata (account creation date, etc.)
    """
    print(f"\nAttempting to fetch profile metadata...")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    # Try the profile API
    url = f"https://www.hackerrank.com/rest/hackers/{username}/profile"
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            metadata = {}
            
            if 'model' in data:
                if 'created_at' in data['model']:
                    timestamp = data['model']['created_at']
                    metadata['createdAt'] = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
                    print(f"✓ Account created: {metadata['createdAt']}")
                
                if 'name' in data['model']:
                    metadata['name'] = data['model']['name']
                    print(f"✓ Name: {metadata['name']}")
            
            return metadata
        else:
            print(f"⚠️  Profile API returned {response.status_code}")
    
    except Exception as e:
        print(f"⚠️  Could not fetch profile metadata: {e}")
    
    return {}

def merge_submission_data(old_data, new_data):
    """
    Merge old and new submission data, keeping the highest count
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
    
    print(f"\n{'#'*60}")
    print(f"# HACKERRANK DATA FETCHER")
    print(f"# Username: {username}")
    print(f"# Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'#'*60}")
    
    # Load existing data
    try:
        with open('hackerrank_data.json', 'r') as f:
            existing_data = json.load(f)
            old_submissions = existing_data.get('submissions', {})
            old_metadata = existing_data.get('metadata', {})
            print(f"\n✓ Loaded existing data: {len(old_submissions)} dates")
    except FileNotFoundError:
        old_submissions = {}
        old_metadata = {}
        print(f"\n✓ Starting fresh (no existing data)")
    
    # Fetch new submissions
    new_submissions = fetch_all_submissions(username)
    
    # Fetch metadata
    metadata = fetch_profile_metadata(username)
    
    # Merge data
    merged_submissions = merge_submission_data(old_submissions, new_submissions)
    merged_metadata = {**old_metadata, **metadata}
    
    # Create output
    output = {
        'username': username,
        'lastUpdated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'metadata': merged_metadata,
        'submissions': merged_submissions
    }
    
    # Save to file
    with open('hackerrank_data.json', 'w') as f:
        json.dump(output, f, indent=2)
    
    # Final summary
    print(f"\n{'#'*60}")
    print(f"# RESULTS")
    print(f"{'#'*60}")
    print(f"New submissions fetched: {len(new_submissions)} dates")
    print(f"Total dates in database: {len(merged_submissions)}")
    print(f"Data saved to: hackerrank_data.json")
    print(f"{'#'*60}")
    
    # Show sample of recent dates
    if merged_submissions:
        print(f"\nMost recent submission dates:")
        for date in sorted(merged_submissions.keys(), reverse=True)[:10]:
            count = merged_submissions[date]
            print(f"  {date}: {count} submission(s)")
    else:
        print(f"\n⚠️  WARNING: No submission data found!")
        print(f"   Please verify your username: {username}")
        print(f"   Profile should be at: https://www.hackerrank.com/profile/{username}")
    
    print()

if __name__ == "__main__":
    main()