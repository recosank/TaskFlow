import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Save, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../api/axios";
import type { Task } from "../../lib/types";

export default function TaskModal({
  task,
  onClose,
  onSaved,
}: {
  task: Task | null;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title ?? "",
        description: task.description ?? "",
        status: task.status ?? "pending",
        priority: task.priority ?? "medium",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      });
      setEditing(false);
    }
  }, [task]);

  const updateMutation = useMutation<any, any, Partial<Task>>({
    mutationFn: async (payload: Partial<Task>) => {
      if (!task) throw new Error("No task");
      const res = await api.put(`/tasks/${task.id}`, payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
      onSaved?.();
      toast.success("Task updated");
      setEditing(false);
      onClose();
    },
  });

  const deleteMutation = useMutation<any, any, number | void>({
    mutationFn: async () => {
      if (!task) throw new Error("No task");
      const res = await api.delete(`/tasks/${task.id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["projectTasks"] });
      onSaved?.();
      toast.success("Task deleted");
      onClose();
    },
  });

  if (!task) return null;

  const save = () => {
    updateMutation.mutate({
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <div className="text-xs text-gray-500">
              {task.priority?.toUpperCase()} • {task.status}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onClose()}
              className="p-2 rounded hover:bg-gray-100"
              aria-label="Close"
            >
              <X />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {!editing ? (
            <>
              <div className="text-sm text-gray-700">
                {task.description || "No description"}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div>
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleString()
                    : "No due date"}
                </div>
                <div>Priority: {task.priority ?? "N/A"}</div>
                <div>Status: {task.status ?? "N/A"}</div>
              </div>

              <div className="flex justify-end items-center gap-2">
                <div>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-2 border  bg-red-600 text-white rounded-md inline-flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    className=" border px-6 py-2 bg-indigo-600 text-white rounded-md"
                    onClick={() => {
                      setEditing(true);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm">Title</label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, title: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </div>

              <div>
                <label className="text-sm">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, description: e.target.value }))
                  }
                  className="w-full border px-3 py-2 rounded mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, status: e.target.value }))
                  }
                  className="border px-3 py-2 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="inprogress">In progress</option>
                  <option value="done">Done</option>
                </select>

                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, priority: e.target.value }))
                  }
                  className="border px-3 py-2 rounded"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, dueDate: e.target.value }))
                  }
                  className="border px-3 py-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-3 py-2 border rounded"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={updateMutation.status == "pending"}
                  className="px-3 py-2 bg-indigo-600 text-white rounded inline-flex items-center gap-2 disabled:opacity-60"
                >
                  <Save size={14} />
                  {updateMutation.status == "pending" ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
