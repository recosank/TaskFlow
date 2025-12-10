// components/Project/SidebarMobile.tsx
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Folder, Plus, LayoutDashboard, X } from "lucide-react";
import api from "../../api/axios";
import type { Project } from "../../lib/types";
import CreateProjectModal from "../Project/CreateProjectModal";
import { useState } from "react";
import taskFlow from "../../assets/taskFlow.png";

interface SidebarMobileProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function SidebarMobile({ onClose, isOpen }: SidebarMobileProps) {
  const location = useLocation();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects");
      return Array.isArray(res.data) ? res.data : res.data?.data || [];
    },
  });

  // Group projects into columns of 5
  const columns: Project[][] = [];
  if (projects) {
    for (let i = 0; i < projects.length; i += 5) {
      columns.push(projects.slice(i, i + 5));
    }
  }

  return (
    <>
      <div
        className={`fixed  bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-100 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 left-0 w-full max-w-md bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                <img src={taskFlow} />
              </div>
              <div>
                <h2 className="font-semibold">TaskFlow</h2>
                <p className="text-sm text-gray-500">Your projects</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-4 h-[calc(100vh-80px)] overflow-y-auto">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 p-3 mb-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            Create New Project
          </button>

          <Link
            to="/"
            onClick={onClose}
            className={`flex items-center gap-3 p-3 rounded-xl mb-6 ${
              location.pathname === "/"
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard size={20} />
            <div>
              <div className="font-medium">Dashboard</div>
              <div className="text-sm text-gray-500">Overview & analytics</div>
            </div>
          </Link>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">All Projects</h3>
              <span className="text-sm text-gray-500">
                {projects?.length || 0} total
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-100 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : projects?.length === 0 ? (
              <div className="text-center py-8">
                <Folder size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 mb-2">No projects yet</p>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="text-indigo-600 font-medium"
                >
                  Create your first project
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                  {columns.map((column, columnIndex) => (
                    <div
                      key={columnIndex}
                      className="w-64 flex-shrink-0 space-y-3"
                    >
                      {column.map((project) => (
                        <Link
                          key={project.id}
                          to={`/project/${project.id}`}
                          onClick={onClose}
                          className={`block p-4 rounded-xl border transition-all ${
                            location.pathname === `/project/${project.id}`
                              ? "border-indigo-300 bg-indigo-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Folder
                              size={20}
                              className="text-indigo-600 mt-0.5"
                            />
                            <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {project._count?.tasks || 0} tasks
                            </span>
                          </div>
                          <h4 className="font-semibold truncate mb-1">
                            {project.title}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {project.description || "No description"}
                          </p>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateProjectModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={onClose}
      />
    </>
  );
}
