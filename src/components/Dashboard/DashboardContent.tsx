import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import StatCard from "./StatCard";
import QuickBreakdown from "./QuickBreakdown";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { SkeletonWrapper } from "./Skeletons";

export default function DashboardContent() {
  const {
    data: projectsRes,
    isLoading: loadingProjects,
    isError: errorProjects,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => (await api.get("/projects")).data,
    staleTime: 60_000,
  });

  const {
    data: dashboardRes,
    isLoading: loadingDashboard,
    isError: errorDashboard,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => (await api.get("/tasks/dashboard")).data,
    staleTime: 30_000,
  });

  const loading = loadingProjects || loadingDashboard;

  const projects = React.useMemo(() => {
    if (!projectsRes) return [];
    return Array.isArray(projectsRes)
      ? projectsRes
      : projectsRes.data ?? projectsRes;
  }, [projectsRes]);

  const dashboard = React.useMemo(() => {
    if (!dashboardRes) return null;
    return dashboardRes?.totalTasks !== undefined
      ? dashboardRes
      : dashboardRes?.data ?? dashboardRes;
  }, [dashboardRes]);

  const totalProjects = projects.length;
  const totalTasks = dashboard?.totalTasks ?? 0;
  const completedTasks = dashboard?.completed ?? 0;
  const pendingTasks = dashboard?.pending ?? 0;
  const inprogressCount = dashboard?.inprogress ?? 0;
  const progressPercent = dashboard?.progressPercent ?? 0;
  const todoCount = dashboard?.totalTasks ?? 0;

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Project & task summary</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {loading ? (
          <>
            <SkeletonWrapper />
            <SkeletonWrapper />
            <SkeletonWrapper />
          </>
        ) : (
          <>
            <StatCard label="Total Projects" value={totalProjects} />
            <StatCard label="Total Tasks" value={totalTasks} />
            <Card className="py-4 shadow-sm border">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm text-gray-500">
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold flex items-center gap-1">
                  <span className="text-3xl font-semibold">
                    {progressPercent}
                  </span>
                  <span className="text-lg">%</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="mb-6">
        <QuickBreakdown
          loading={loading}
          completed={completedTasks}
          pending={pendingTasks}
          inprogress={inprogressCount}
          progressPercent={progressPercent}
          todo={todoCount}
        />
      </div>

      <div className="mt-6 text-xs text-gray-400">
        {loading
          ? "Loading latest stats..."
          : `Updated: ${new Date().toLocaleString()}`}
      </div>
    </>
  );
}
