import { motion } from "framer-motion";

export default function TaskCard({
  title,
  meta,
  priority,
}: {
  title: string;
  meta?: string;
  priority?: string;
  status?: string;
}) {
  const priorityColor =
    priority === "high"
      ? "bg-red-50 text-red-700"
      : priority === "medium"
      ? "bg-yellow-50 text-yellow-700"
      : "bg-green-50 text-green-700";

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between rounded-md p-3 bg-white shadow-sm cursor-pointer"
    >
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-gray-400">{meta}</div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor}`}
        >
          {priority ? priority.toUpperCase() : "N/A"}
        </div>
      </div>
    </motion.div>
  );
}
