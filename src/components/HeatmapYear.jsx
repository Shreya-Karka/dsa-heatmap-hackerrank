import React, { useMemo } from "react";
import MonthBlock from "./MonthBlock.jsx";

function* monthIter(startMonth, endMonth) {
  const d = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1);
  while (d <= endMonth) {
    const y = d.getFullYear(),
      m = d.getMonth();
    const ms = new Date(y, m, 1);
    const me = new Date(y, m + 1, 0);
    yield { year: y, month: m, start: ms, end: me };
    d.setMonth(m + 1);
  }
}

export default function HeatmapYear({
  startMonth,
  endMonth,
  rangeStart,
  rangeEnd,
  createdAt,
  counts,
}) {
  const months = useMemo(
    () => Array.from(monthIter(startMonth, endMonth)),
    [startMonth, endMonth]
  );
  return (
    <section className="leetcode-strip">
      {months.map(({ year, month, start, end }) => (
        <MonthBlock
          key={`${year}-${month}`}
          year={year}
          month={month}
          monthStart={start}
          monthEnd={end}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          createdAt={createdAt}
          counts={counts}
        />
      ))}
    </section>
  );
}
