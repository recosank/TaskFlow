import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import CreateProjectModal from "./CreateProjectModal";
import api from "../../api/axios";
import taskFlow from "../../assets/taskFlow.png";
import type { SideProject } from "../../lib/types";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: projectsRes,
    isLoading,
    isError,
  } = useQuery<SideProject[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return res.data as SideProject[];
    },
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

  const projects = projectsRes ?? [];

  const handleCreateSuccess = (createdProject: SideProject) => {
    queryClient.setQueryData<SideProject[] | undefined>(["projects"], (old) => {
      if (!old) return [createdProject];
      if (old.find((p) => p.id === createdProject.id)) return old;
      return [createdProject, ...old];
    });

    queryClient.invalidateQueries({ queryKey: ["projects"] });
    setOpen(false);
  };

  return (
    <>
      <aside className="w-64 p-5 h-screen bg-white rounded-2xl shadow">
        <div
          className="flex items-center gap-3 mt-6 mb-10 cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        >
          <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
            <img src={taskFlow} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">TaskFlow</h3>
            <p className="text-xs text-gray-500">Mini Project Manager</p>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-sm font-medium">Projects</h4>
          <button
            className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm"
            onClick={() => setOpen(true)}
          >
            + New
          </button>
        </div>

        <div className="flex-1 overflow-auto no-scrollbar space-y-2 h-[80%]">
          <div className="space-y-2">
            {isLoading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-3 rounded-md border">
                    <Skeleton height={12} width={`70%`} />
                    <div className="mt-2">
                      <Skeleton height={10} width={`40%`} />
                    </div>
                  </div>
                ))}
              </>
            ) : isError ? (
              <div className="p-3 text-xs text-red-600">
                Failed to load projects
              </div>
            ) : (
              <>
                {projects.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500">
                    No projects yet. Create one!
                  </div>
                ) : (
                  projects.map((p) => (
                    <Link
                      key={p.id}
                      to={`/project/${p.id}`}
                      className="block p-3 rounded-md border hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{p.title}</div>
                          <div className="text-xs text-gray-400">
                            {Array.isArray(p.tasks) ? p.tasks.length : 0} tasks
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">›</div>
                      </div>
                    </Link>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </aside>

      <CreateProjectModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
