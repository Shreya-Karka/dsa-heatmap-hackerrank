// src/components/MonthBlock.jsx
import React, { useMemo } from "react";
import WeekColumn from "./WeekColumn.jsx";

const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const fmtISO = (d) => d.toISOString().slice(0, 10);

function buildWeekColumns(
  monthStart,
  monthEnd,
  rangeStart,
  rangeEnd,
  createdAt,
  counts
) {
  const firstSunday = addDays(monthStart, -monthStart.getDay());
  const lastSaturday = addDays(monthEnd, 6 - monthEnd.getDay());

  const cols = [];
  for (
    let colStart = new Date(firstSunday);
    colStart <= lastSaturday;
    colStart = addDays(colStart, 7)
  ) {
    const days = [];
    for (let r = 0; r < 7; r++) {
      const d = addDays(colStart, r);
      const inMonth = d >= monthStart && d <= monthEnd;
      const inRange = d >= rangeStart && d <= rangeEnd;
      const visible = inMonth && inRange;
      const disabled = visible && createdAt && d < createdAt;
      const iso = fmtISO(d);
      const count = visible && !disabled ? counts[iso] ?? 0 : 0;
      days.push({ date: new Date(d), iso, visible, disabled, count });
    }
    if (days.some((s) => s.visible)) cols.push(days);
  }
  return cols;
}

export default function MonthBlock({
  year,
  month,
  monthStart,
  monthEnd,
  rangeStart,
  rangeEnd,
  createdAt,
  counts,
}) {
  const cols = useMemo(
    () =>
      buildWeekColumns(
        monthStart,
        monthEnd,
        rangeStart,
        rangeEnd,
        createdAt,
        counts
      ),
    [monthStart, monthEnd, rangeStart, rangeEnd, createdAt, counts]
  );

  const label = useMemo(
    () =>
      new Date(year, month, 1).toLocaleString("default", { month: "short" }),
    [year, month]
  );

  const monthPixelWidth = useMemo(() => {
    const tile = 11,
      gap = 3;
    const w = cols.length * tile + Math.max(0, cols.length - 1) * gap;
    return `${w}px`;
  }, [cols.length]);

  return (
    <div className="month-block">
      <div className="month-grid">
        {cols.map((col, i) => (
          <WeekColumn key={`wk-${i}`} days={col} />
        ))}
      </div>
      <div className="month-name" style={{ width: monthPixelWidth }}>
        {label}
      </div>
    </div>
  );
}
