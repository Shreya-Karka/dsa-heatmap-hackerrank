// src/components/RangeSelect.jsx
import React from "react";
export default function RangeSelect({ value, onChange, options }) {
  return (
    <div className="range-bar">
      <label className="range-label">Range</label>
      <select
        className="range-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
