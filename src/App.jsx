import React, { useEffect, useMemo, useState } from "react";
import HeatmapYear from "./components/HeatmapYear.jsx";
import RangeSelect from "./components/RangeSelect.jsx";

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfYear = (d) => new Date(d.getFullYear(), 0, 1);
const addYears = (d, n) =>
  new Date(d.getFullYear() + n, d.getMonth(), d.getDate());
const minusDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() - n);
  return x;
};

// Build anniversary pairs: [createdAt .. createdAt+1y-1d], etc.
function buildAnniversaryPairs(createdAt, today) {
  if (!createdAt) return [];
  const pairs = [];
  let s = new Date(createdAt);
  while (s <= today) {
    const e = minusDays(addYears(s, 1), 1);
    const label = `${s.getFullYear()}–${e.getFullYear()}`;
    pairs.push({ key: `anniv_${s.toISOString().slice(0, 10)}`, label, s, e });
    s = addYears(s, 1);
  }
  return pairs;
}

function computeRange(choice, today, createdAt, pairs) {
  const daySpan = (n) => {
    const end = today;
    const start = minusDays(today, n - 1);
    return { rangeStart: start, rangeEnd: end };
  };
  if (choice.startsWith("anniv_")) {
    const hit = pairs.find((p) => p.key === choice);
    if (hit) return { rangeStart: hit.s, rangeEnd: hit.e };
  }
  switch (choice) {
    case "last_30":
      return daySpan(30);
    case "last_90":
      return daySpan(90);
    case "last_180":
      return daySpan(180);
    case "last_365":
      return daySpan(365);
    case "this_year":
      return { rangeStart: startOfYear(today), rangeEnd: today };
    case "last_year": {
      const y = today.getFullYear() - 1;
      return { rangeStart: new Date(y, 0, 1), rangeEnd: new Date(y, 11, 31) };
    }
    default:
      return daySpan(365);
  }
}

export default function App() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [createdAt, setCreatedAt] = useState(null);
  const [counts, setCounts] = useState({});
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [rangeChoice, setRangeChoice] = useState("last_365");

  // Fetch HackerRank data from JSON file
  useEffect(() => {
    (async () => {
      try {
        // In production, this will be served from your GitHub Pages
        // During development, you might need to adjust the path
        const response = await fetch(
          `${import.meta.env.BASE_URL}hackerrank_data.json?v=${Date.now()}`
        );
        const data = await response.json();

        // Set submissions count data
        setCounts(data.submissions || {});

        // Set username
        setUsername(data.username || "");

        // Set account creation date
        if (data.metadata && data.metadata.createdAt) {
          setCreatedAt(new Date(data.metadata.createdAt + "T00:00:00Z"));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading HackerRank data:", error);
        setLoading(false);
      }
    })();
  }, []);

  const anniversaryPairs = useMemo(
    () => buildAnniversaryPairs(createdAt, today),
    [createdAt, today]
  );

  const rangeOptions = useMemo(() => {
    const base = [
      { key: "last_30", label: "Last 30 Days" },
      { key: "last_90", label: "Last 90 Days" },
      { key: "last_180", label: "Last 180 Days" },
      { key: "last_365", label: "Last 365 Days" },
      { key: "this_year", label: "This Year" },
      { key: "last_year", label: "Last Year" },
    ];
    if (anniversaryPairs.length) {
      base.push(
        ...anniversaryPairs.map((p) => ({ key: p.key, label: p.label }))
      );
    }
    return base;
  }, [anniversaryPairs]);

  const { rangeStart, rangeEnd } = useMemo(
    () => computeRange(rangeChoice, today, createdAt, anniversaryPairs),
    [rangeChoice, today, createdAt, anniversaryPairs]
  );

  const startMonth = new Date(
    rangeStart.getFullYear(),
    rangeStart.getMonth(),
    1
  );
  const endMonth = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth() + 1, 0);

  // Calculate total submissions in current range
  const totalInRange = useMemo(() => {
    let total = 0;
    for (const [date, count] of Object.entries(counts)) {
      const d = new Date(date + "T00:00:00Z");
      if (d >= rangeStart && d <= rangeEnd) {
        total += count;
      }
    }
    return total;
  }, [counts, rangeStart, rangeEnd]);

  if (loading) {
    return (
      <div className="page">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2>Loading HackerRank data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header
        className="header"
        style={{ justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}
      >
        <div>
          <h1 className="title">HackerRank Activity</h1>
          {username && (
            <div
              style={{
                color: "var(--muted)",
                fontSize: "14px",
                marginTop: "4px",
              }}
            >
              @{username} • {totalInRange} submissions in selected range
            </div>
          )}
        </div>
        <RangeSelect
          value={rangeChoice}
          onChange={setRangeChoice}
          options={rangeOptions}
        />
      </header>

      <HeatmapYear
        startMonth={startMonth}
        endMonth={endMonth}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        createdAt={createdAt}
        counts={counts}
      />

      <div className="legend">
        <span>Less</span>
        <span className="cell cell0" />
        <span className="cell cell1" />
        <span className="cell cell2" />
        <span className="cell cell3" />
        <span className="cell cell4" />
        <span>More</span>
      </div>
    </div>
  );
}
