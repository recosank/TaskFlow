import React from "react";

export default function TaskColumn({
  title,
  count = 0,
  children,
}: {
  title: string;
  count?: number;
  children?: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="text-xs text-gray-500">{count}</div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
