// ==============================================================================
// HACKERRANK SUBMISSION EXPORTER
// ==============================================================================
//
// HOW TO USE:
// 1. Go to https://www.hackerrank.com/profile/shreyakarka (MUST BE LOGGED IN!)
// 2. Press F12 to open Developer Tools
// 3. Click "Console" tab
// 4. Copy and paste this ENTIRE script
// 5. Press ENTER
// 6. Wait 1-2 minutes
// 7. File "hackerrank_data.json" will download automatically
//
// SAVE THIS FILE - you'll need it monthly to update your heatmap!
//
// ==============================================================================

(async function () {
  console.clear();
  console.log(
    "%c🚀 HackerRank Data Exporter",
    "font-size: 20px; font-weight: bold; color: #4CAF50;"
  );
  console.log("%cStarting export...", "font-size: 14px; color: #888;");
  console.log("");

  // Configuration
  const USERNAME = "shreyakarka";
  const BATCH_SIZE = 200; // Fetch 200 submissions at a time
  const MAX_SUBMISSIONS = 2000; // Safety limit
  const DELAY_MS = 300; // Delay between requests (be nice to servers)

  // Data storage
  const submissions = {};
  let totalFetched = 0;
  let offset = 0;

  const startTime = Date.now();

  // Progress indicator
  console.log("📊 Configuration:");
  console.log(`   Username: ${USERNAME}`);
  console.log(`   Batch size: ${BATCH_SIZE}`);
  console.log(`   Max limit: ${MAX_SUBMISSIONS}`);
  console.log("");

  // Fetch submissions in batches
  while (offset < MAX_SUBMISSIONS) {
    const url = `https://www.hackerrank.com/rest/contests/master/submissions?offset=${offset}&limit=${BATCH_SIZE}`;

    try {
      console.log(`📡 Fetching batch at offset ${offset}...`);

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`❌ HTTP Error ${response.status}`);
        break;
      }

      const data = await response.json();

      // Check if we have submissions
      if (!data.models || data.models.length === 0) {
        console.log("✅ No more submissions found (reached the end)");
        break;
      }

      const batchSize = data.models.length;
      console.log(`   ✓ Received ${batchSize} submissions`);

      // Process each submission
      for (const submission of data.models) {
        if (submission.created_at) {
          // Convert Unix timestamp to YYYY-MM-DD format
          const date = new Date(submission.created_at * 1000)
            .toISOString()
            .split("T")[0];

          // Count submissions per date
          submissions[date] = (submissions[date] || 0) + 1;
        }
      }

      totalFetched += batchSize;

      // Show progress
      const uniqueDates = Object.keys(submissions).length;
      console.log(
        `   📊 Total: ${totalFetched} submissions, ${uniqueDates} unique dates`
      );

      // Check if we got less than requested (last batch)
      if (batchSize < BATCH_SIZE) {
        console.log("✅ Reached last batch");
        break;
      }

      // Move to next batch
      offset += BATCH_SIZE;

      // Delay to be respectful to servers
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    } catch (error) {
      console.error("❌ Error fetching data:", error.message);
      break;
    }
  }

  // Calculate elapsed time
  const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);

  // Display summary
  console.log("");
  console.log("═".repeat(70));
  console.log(
    "%c📊 EXPORT SUMMARY",
    "font-size: 16px; font-weight: bold; color: #4CAF50;"
  );
  console.log("═".repeat(70));
  console.log(`Total submissions fetched: ${totalFetched}`);
  console.log(`Unique active dates: ${Object.keys(submissions).length}`);

  if (Object.keys(submissions).length > 0) {
    const dates = Object.keys(submissions).sort();
    const oldestDate = dates[0];
    const newestDate = dates[dates.length - 1];
    console.log(`Date range: ${oldestDate} to ${newestDate}`);

    // Show submissions by year
    console.log("");
    console.log("Submissions by year:");
    const byYear = {};
    for (const date in submissions) {
      const year = date.split("-")[0];
      byYear[year] = (byYear[year] || 0) + submissions[date];
    }
    Object.keys(byYear)
      .sort()
      .forEach((year) => {
        console.log(`   ${year}: ${byYear[year]} submissions`);
      });

    // Show most recent dates
    console.log("");
    console.log("Most recent submission dates:");
    dates
      .slice(-5)
      .reverse()
      .forEach((date) => {
        console.log(`   ${date}: ${submissions[date]} submission(s)`);
      });
  }

  console.log("");
  console.log(`Time taken: ${elapsedTime} seconds`);
  console.log("═".repeat(70));
  console.log("");

  // Check if we got data
  if (Object.keys(submissions).length === 0) {
    console.error(
      "%c❌ NO DATA FOUND!",
      "font-size: 16px; font-weight: bold; color: #f44336;"
    );
    console.log("");
    console.log("Possible reasons:");
    console.log("1. You are not logged in to HackerRank");
    console.log("2. You have no submissions yet");
    console.log("3. Your profile is private");
    console.log("");
    console.log("Please verify:");
    console.log("- You are logged in");
    console.log(
      "- You can see your submissions at: https://www.hackerrank.com/profile/" +
        USERNAME
    );
    return;
  }

  // Create the JSON output
  const output = {
    username: USERNAME,
    lastUpdated:
      new Date().toISOString().split("T")[0] +
      " " +
      new Date().toTimeString().split(" ")[0],
    metadata: {
      createdAt: Object.keys(submissions).sort()[0] || "2020-01-01",
      name: "Shreya Karka",
      totalSubmissions: Object.values(submissions).reduce((a, b) => a + b, 0),
      exportDate: new Date().toISOString(),
    },
    submissions: submissions,
  };

  // Convert to formatted JSON
  const jsonString = JSON.stringify(output, null, 2);

  // Create and download the file
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hackerrank_data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Success message
  console.log(
    "%c✅ SUCCESS!",
    "font-size: 18px; font-weight: bold; color: #4CAF50;"
  );
  console.log("");
  console.log("📥 File downloaded: hackerrank_data.json");
  console.log(`   Size: ${(jsonString.length / 1024).toFixed(2)} KB`);
  console.log(
    `   Submissions: ${Object.values(submissions).reduce((a, b) => a + b, 0)}`
  );
  console.log(`   Unique dates: ${Object.keys(submissions).length}`);
  console.log("");
  console.log("📋 Next steps:");
  console.log("1. Find the downloaded file in your Downloads folder");
  console.log("2. Copy to your project folder:");
  console.log(
    "   cp ~/Downloads/hackerrank_data.json C:\\Shreya\\Projects\\hackerrank-heatmap\\"
  );
  console.log("3. Commit and push:");
  console.log("   git add hackerrank_data.json");
  console.log('   git commit -m "Update submissions"');
  console.log("   git push origin hackerrank");
  console.log("4. Your heatmap will update automatically!");
  console.log("");
  console.log("═".repeat(70));

  // Copy to clipboard (optional)
  try {
    await navigator.clipboard.writeText(jsonString);
    console.log("📋 JSON also copied to clipboard!");
  } catch (e) {
    // Silent fail - clipboard might not be available
  }

  console.log("");
  console.log(
    "%c💾 Save this script for next time!",
    "font-size: 14px; color: #2196F3;"
  );
  console.log("Run it monthly or whenever you solve new problems.");
})();
