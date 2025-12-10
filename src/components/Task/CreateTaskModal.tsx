import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TaskSchema } from "../../lib/schema";
import type { CreateTask } from "../../lib/types";

type FormData = z.infer<typeof TaskSchema>;

export default function CreateTaskModal({
  open,
  onClose,
  projectId,
}: {
  open: boolean;
  onClose: () => void;
  projectId: string | number;
}) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: FormData & { projectId: number }) => {
      const body = {
        projectId: Number(payload.projectId),
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        dueDate: payload.dueDate || null,
      };

      const res = await api.post("/tasks", body);
      return res.data as CreateTask;
    },

    onMutate: async (newTask) => {
      await queryClient.cancelQueries({
        queryKey: ["projectTasks", projectId.toString()],
      });

      const previous = queryClient.getQueryData<CreateTask[]>([
        "projectTasks",
        projectId.toString(),
      ]);

      const tempId = -Date.now();
      const optimisticTask: CreateTask = {
        id: tempId,
        projectId: Number(newTask.projectId),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        dueDate: newTask.dueDate || null,
        status: "pending",
      };

      queryClient.setQueryData<CreateTask[]>(
        ["projectTasks", projectId.toString()],
        (old = []) => [optimisticTask, ...old]
      );

      const toastId = toast.loading("Creating task...");
      onClose();
      return { previous, tempId, toastId };
    },

    onError: (err: any, _, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["projectTasks", projectId.toString()],
          context.previous
        );
      }

      const message =
        err?.response?.data?.message ?? err?.message ?? "Failed to create task";
      toast.error(message, { id: context?.toastId });
    },

    onSuccess: (data, _, context: any) => {
      if (context?.tempId != null) {
        queryClient.setQueryData<CreateTask[]>(
          ["projectTasks", projectId.toString()],
          (old = []) => old.map((t) => (t.id === context.tempId ? data : t))
        );
      }

      toast.success("Task created", { id: context?.toastId });
      reset();
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", projectId.toString()],
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutate({ ...data, projectId: Number(projectId) });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">New Task</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="text-sm">Title</label>
            <input
              {...register("title")}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="Task title"
              disabled={isPending}
            />
            {errors.title && (
              <div className="text-xs text-red-600 mt-1">
                {errors.title.message}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="Brief description"
              disabled={isPending}
            />
            {errors.description && (
              <div className="text-xs text-red-600 mt-1">
                {errors.description.message}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm">Priority</label>
              <select
                {...register("priority")}
                className="w-full border px-3 py-2 rounded mt-1"
                disabled={isPending}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.priority.message}
                </div>
              )}
            </div>

            <div className="col-span-2">
              <label className="text-sm">Due date</label>
              <input
                {...register("dueDate")}
                type="date"
                className="w-full border px-3 py-2 rounded mt-1"
                disabled={isPending}
              />
              {errors.dueDate && (
                <div className="text-xs text-red-600 mt-1">
                  {errors.dueDate.message}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
            >
              {isPending ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
