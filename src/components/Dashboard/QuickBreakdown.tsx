import { Card } from "../ui/card";
import CircularProgress from "../ui/circular-progress";
import { SkeletonCard } from "./Skeletons";

export default function QuickBreakdown({
  loading,
  completed,
  pending,
  inprogress,
  progressPercent,
  todo,
}: {
  loading: boolean;
  completed: number;
  pending: number;
  inprogress: number;
  progressPercent: number;
  todo: number;
}) {
  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <Card className="rounded-2xl shadow p-6">
      <h3 className="text-lg font-medium mb-6">Quick Breakdown</h3>

      <div className="grid grid-cols-4 gap-6">
        <div className="flex flex-col items-center text-center">
          <div style={{ color: "#10b981" }}>
            <CircularProgress
              value={completed}
              max={Math.max(1, completed + pending + inprogress)}
              size={158}
              stroke={8}
              label={`${completed}`}
            />
          </div>
          <div className="mt-0 text-sm">Completed</div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div style={{ color: "#f59e0b" }}>
            <CircularProgress
              value={pending}
              max={Math.max(1, completed + pending + inprogress)}
              size={158}
              stroke={8}
              label={`${pending}`}
            />
          </div>
          <div className="mt-0 text-sm">Pending</div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div style={{ color: "#3b82f6" }}>
            <CircularProgress
              value={inprogress}
              max={Math.max(1, completed + pending + inprogress)}
              size={158}
              stroke={8}
              label={`${inprogress}`}
            />
          </div>
          <div className="mt-0 text-sm">In Progress</div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div style={{ color: "#7c3aed" /* purple */ }}>
            <CircularProgress
              value={progressPercent}
              max={100}
              size={158}
              stroke={8}
              label={`${Math.round(progressPercent)}%`}
            />
          </div>
          <div className="mt-0 text-sm">Overall Progress</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 flex gap-4 justify-center">
        <div>Todo: {todo}</div>
      </div>
    </Card>
  );
}
