// src/components/Cell.jsx
import React from "react";

function colorClass(count, variant) {
  if (variant === "disabled") return "cell cell-disabled";
  if (count <= 0) return "cell cell0";
  if (count <= 1) return "cell cell1";
  if (count <= 3) return "cell cell2";
  if (count <= 7) return "cell cell3";
  return "cell cell4";
}

export default function Cell({ date, count, variant = "normal" }) {
  const shown = variant === "disabled" ? 0 : count ?? 0;
  const title = `${date.toDateString()}: ${shown} solves`;
  return <div className={colorClass(count, variant)} title={title} />;
}
