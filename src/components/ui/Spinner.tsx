import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Spinner({
  size = 32,
  label = "Loading...",
}: {
  size?: number;
  label?: string;
}) {
  return (
    <motion.div
      role="status"
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Loader2
        className="animate-spin text-indigo-600"
        size={size}
        aria-hidden="true"
      />
      <span className="text-sm text-gray-600">{label}</span>
    </motion.div>
  );
}
