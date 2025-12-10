import React from "react";
import Skeleton from "react-loading-skeleton";

export function SkeletonWrapper() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <div className="h-6 mb-3">
        <Skeleton width={120} height={18} />
      </div>
      <div>
        <Skeleton width={80} height={36} />
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl shadow p-6 bg-white">
      <div className="mb-4">
        <Skeleton width={160} height={20} />
      </div>

      <div className="grid grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton circle width={154} height={154} />
          </div>
        ))}
      </div>
    </div>
  );
}
