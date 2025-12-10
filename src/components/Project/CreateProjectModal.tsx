// components/Project/ProjectFormModal.tsx
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { projectSchema } from "../../lib/schema";
import type { Project } from "../../lib/types";

type ProjectInput = z.infer<typeof projectSchema>;
type ProjectFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data?: any) => void;
  project?: Project | null;
};

export default function CreateProjectModal({
  open,
  onClose,
  onSuccess,
  project,
}: ProjectFormModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!project;

  const [form, setForm] = useState<ProjectInput>({
    title: "",
    description: "",
  });
  const [error, setError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project && open) {
      setForm({
        title: project.title,
        description: project.description || "",
      });
    } else {
      setForm({ title: "", description: "" });
    }
    setError("");
    setFieldErrors({});
  }, [project, open]);

  const mutation = useMutation({
    mutationFn: (payload: ProjectInput) => {
      if (isEditMode && project) {
        return api
          .put(`/projects/${project.id}`, payload)
          .then((res) => res.data);
      } else {
        return api.post("/projects", payload).then((res) => res.data);
      }
    },
    onMutate: () => {
      return {
        toastId: toast.loading(
          isEditMode ? "Updating project..." : "Creating project..."
        ),
      };
    },
    onSuccess: (data, _, context) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      if (isEditMode && project) {
        queryClient.invalidateQueries({
          queryKey: ["projectMeta", String(project.id)],
        });
      }

      onSuccess?.(data);
      toast.success(isEditMode ? "Project updated" : "Project created", {
        id: context?.toastId,
      });
      handleReset();
      onClose();
    },
    onError: (err: any, _, context) => {
      const message =
        err?.response?.data?.message ?? err?.message ?? "Something went wrong";
      setError(message);
      toast.error(message, { id: context?.toastId });
    },
  });

  const handleReset = () => {
    if (!isEditMode) {
      setForm({ title: "", description: "" });
    }
    setError("");
    setFieldErrors({});
  };

  const handleChange =
    (field: keyof ProjectInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setError("");
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = projectSchema.safeParse(form);
    if (!result.success) {
      const errors: any = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (typeof field === "string") {
          errors[field] = issue.message;
        }
      });

      setFieldErrors(errors);
      setError(result.error.issues[0]?.message || "Validation failed");
      return;
    }

    mutation.mutate(result.data);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          {isEditMode ? "Edit Project" : "Create New Project"}
        </h2>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Project title"
              className="w-full border p-2 rounded"
              value={form.title}
              onChange={handleChange("title")}
              disabled={mutation.isPending}
            />
          </div>

          <div>
            <textarea
              placeholder="Description (optional)"
              className="w-full border p-2 rounded"
              rows={3}
              value={form.description}
              onChange={handleChange("description")}
              disabled={mutation.isPending}
            />
            {fieldErrors.description && (
              <p className="text-red-500 text-xs mt-1">
                {fieldErrors.description}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-60"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                ? "Save Changes"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
