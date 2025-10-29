// src/components/WeekColumn.jsx
import React from "react";
import Cell from "./Cell.jsx";

export default function WeekColumn({ days }) {
  return (
    <div className="week-col">
      {days.map((d) =>
        d.visible ? (
          <Cell
            key={d.iso}
            date={d.date}
            count={d.count}
            variant={d.disabled ? "disabled" : "normal"}
          />
        ) : (
          <div key={d.iso} className="gap" />
        )
      )}
    </div>
  );
}
