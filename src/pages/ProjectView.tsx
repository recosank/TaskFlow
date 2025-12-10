import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Plus } from "lucide-react";
import api from "../api/axios";
import TaskCard from "../components/Task/TaskCard";
import TaskModal from "../components/Task/TaskModal";
import CreateTaskModal from "../components/Task/CreateTaskModal";
import FilterBar from "../components/Task/FilterBar";
import useDebounce from "../hooks/useDebounce";
import Sidebar from "../components/Project/Sidebar";
import type { Filter } from "../lib/types";
import type { Task, Project } from "../lib/types";

export default function ProjectView() {
  const { id } = useParams<{ id: string }>();
  const projectId = id!;
  const qc = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    search: "",
    status: null,
    priority: null,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const { data: project, isLoading: loadingProject } = useQuery<Project>({
    queryKey: ["projectMeta", projectId],
    queryFn: async () => {
      const res = await api.get(`/projects/${projectId}`);
      return res.data as Project;
    },
    enabled: !!projectId,
  });

  const { data: tasksRes, isLoading: loadingTasks } = useQuery<Task[]>({
    queryKey: [
      "projectTasks",
      String(projectId),
      debouncedSearch,
      filters.priority,
      filters.status,
    ],
    queryFn: async () => {
      const res = await api.get("/tasks", {
        params: {
          projectId,
          q: debouncedSearch || undefined,
          priority: filters.priority || undefined,
          status: filters.status || undefined,
        },
      });
      const payload = res.data;
      return Array.isArray(payload) ? payload : payload?.data ?? [];
    },
    enabled: !!projectId,
    staleTime: 15_000,
    placeholderData: keepPreviousData,
  });

  const tasks: Task[] = useMemo(() => {
    const real = tasksRes ?? [];
    return real;
  }, [tasksRes]);

  if (loadingProject) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-[1200px]  grid grid-cols-3 gap-2">
          <Sidebar />
          <main className="col-span-2 p-6 bg-white rounded-2xl shadow mt-6">
            <div className="h-8 bg-gray-100 rounded w-1/3 mb-4 animate-pulse" />
            <div className="h-64 bg-gray-100 rounded animate-pulse" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen  ">
      <div className="max-w-[1200px]  grid grid-cols-3 gap-2">
        <Sidebar />
        <main className="col-span-2 p-6 bg-white rounded-2xl shadow mt-6 max-h-[97vh] ">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">
                {project?.title ?? `Project #${id}`}
              </h2>
              <p className="text-sm text-gray-500">
                {project?.description ?? ""}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCreateOpen(true)}
                className="ml-2 inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md"
              >
                <Plus size={14} />
                New Task
              </button>
            </div>
          </div>
          <div>
            <FilterBar filters={filters} setFilters={setFilters} />
          </div>

          <div className="space-y-3 mt-4 no-scrollbar overflow-auto h-[75%]">
            {loadingTasks ? (
              <>
                <div className="h-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-20 bg-gray-100 rounded animate-pulse" />
              </>
            ) : tasks.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-10">
                No tasks yet
              </div>
            ) : (
              tasks.map((t) => (
                <div key={t.id} onClick={() => setSelectedTask(t)}>
                  <TaskCard
                    title={t.title}
                    meta={`${t.status?.toUpperCase() ?? ""} • ${
                      t.dueDate
                        ? new Date(t.dueDate).toLocaleDateString()
                        : "No due date"
                    }`}
                    priority={t.priority}
                    status={t.status}
                  />
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        projectId={projectId}
      />

      <TaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onSaved={() =>
          qc.invalidateQueries({
            queryKey: ["projectTasks", String(projectId)],
          })
        }
      />
    </div>
  );
}
