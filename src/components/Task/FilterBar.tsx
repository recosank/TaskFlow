import React from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import type { Filter } from "@/lib/types";

export default function FilterBar({
  filters,
  setFilters,
}: {
  filters: Filter;
  setFilters: React.Dispatch<React.SetStateAction<Filter>>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="p-3 bg-gray-50 border rounded-xl mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <SlidersHorizontal size={16} /> Filters
        </div>

        <button
          onClick={() =>
            setFilters({ search: "", status: null, priority: null })
          }
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) =>
            setFilters((s) => ({ ...s, search: e.target.value }))
          }
          className="px-3 py-2 border rounded-md text-sm"
        />

        <select
          value={filters.status ?? ""}
          onChange={(e) =>
            setFilters((s) => ({ ...s, status: e.target.value || null }))
          }
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">All</option>
          <option value="inprogress">In progress</option>
          <option value="done">Done</option>
          <option value="pending">Pending</option>
        </select>

        <select
          value={filters.priority ?? ""}
          onChange={(e) =>
            setFilters((s) => ({
              ...s,
              priority: e.target.value || null,
            }))
          }
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">All priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </motion.div>
  );
}
