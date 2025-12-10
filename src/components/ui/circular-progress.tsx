import React from "react";
import { motion } from "framer-motion";

export default function CircularProgress({
  value,
  max = 100,
  size = 84,
  stroke = 8,
  label,
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  label?: React.ReactNode;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, value / max));
  const center = size / 2;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          style={{ color: "var(--progress-color)" }}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>

      <div className="-mt-[72px] w-full text-center ">
        <div className="text-sm font-medium">
          {label ?? `${Math.round(value)}${max === 100 ? "%" : ""}`}
        </div>
      </div>
    </div>
  );
}
