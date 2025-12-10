import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Plus, MoreVertical, Menu } from "lucide-react";
import api from "../api/axios";
import TaskCard from "../components/Task/TaskCard";
import TaskModal from "../components/Task/TaskModal";
import CreateTaskModal from "../components/Task/CreateTaskModal";
import FilterBar from "../components/Task/FilterBar";
import useDebounce from "../hooks/useDebounce";
import { useMediaQuery } from "../hooks/useMediaQuery";
import SidebarDesktop from "../components/Project/Sidebar";
import SidebarMobile from "../components/Project/SidebarMobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import toast from "react-hot-toast";
import CreateProjectModal from "../components/Project/CreateProjectModal";
import type { Filter } from "../lib/types";
import type { Task, Project } from "../lib/types";

export default function ProjectView() {
  const { id } = useParams<{ id: string }>();
  const projectId = id!;
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  const handleDeleteProject = async () => {
    try {
      await api.delete(`/projects/${projectId}`);

      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
      qc.invalidateQueries({ queryKey: ["projectMeta", projectId] });

      toast.success("Project deleted successfully");
      navigate("/");
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to delete project";
      toast.error(message);
    }
  };

  const handleProjectUpdated = () => {
    qc.invalidateQueries({ queryKey: ["projectMeta", projectId] });
    qc.invalidateQueries({ queryKey: ["projects"] });
    toast.success("Project updated");
  };

  const tasks: Task[] = useMemo(() => {
    const real = tasksRes ?? [];
    return real;
  }, [tasksRes]);

  if (loadingProject) {
    return (
      <div className="min-h-screen ">
        <div className="max-w-[1200px]  grid grid-cols-3 gap-2">
          <SidebarDesktop />
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
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b z-40 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3 mt-1 mb-1 cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold">TaskFlow</h3>
              <p className="text-xs text-gray-500">Mini Project Manager</p>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-[1200px]  grid grid-cols-3 gap-2">
        <div className="hidden md:block ">
          <SidebarDesktop />
        </div>
        <main className="col-span-3 md:col-span-2 p-6 mt-25 md:mt-6 bg-white rounded-2xl shadow min-h-screen md:max-h-[97vh] ">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-md border hover:bg-gray-50 transition">
                    <MoreVertical size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-38 py-3" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setEditProjectOpen(true)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span>Edit Project</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDeleteProject}
                      className="flex items-center gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                    >
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex justify-end items-end gap-3 my-3">
            <button
              onClick={() => setCreateOpen(true)}
              className="ml-2 inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md"
            >
              <Plus size={14} />
              New Task
            </button>
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
      {project && (
        <CreateProjectModal
          open={editProjectOpen}
          onClose={() => setEditProjectOpen(false)}
          project={project}
          onSuccess={handleProjectUpdated}
        />
      )}

      {!isDesktop && (
        <SidebarMobile
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />
      )}

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
