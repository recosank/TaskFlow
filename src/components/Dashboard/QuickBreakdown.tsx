import { Card } from "../ui/card";
import CircularProgress from "../ui/circular-progress";
import { SkeletonCard } from "./Skeletons";
import { useMediaQuery } from "../../hooks/useMediaQuery";

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
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const getProgressConfig = () => {
    if (isMobile) {
      return {
        size: 100,
        stroke: 6,
        labelSize: "text-lg",
        gridCols: "grid-cols-2",
        gap: "gap-4",
        textSize: "text-xs",
        // marginTop: "30px",
      };
    }

    if (isTablet) {
      return {
        size: 125,
        stroke: 7,
        labelSize: "text-xl",
        gridCols: "grid-cols-4",
        gap: "gap-4",
        textSize: "text-sm",
      };
    }

    return {
      size: 158,
      stroke: 8,
      labelSize: "text-2xl",
      gridCols: "grid-cols-4",
      gap: "gap-6",
      textSize: "text-sm",
    };
  };

  const config = getProgressConfig();

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <Card className="rounded-2xl shadow p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6">
        Quick Breakdown
      </h3>

      <div className={`grid ${config.gridCols} ${config.gap}`}>
        <div className="flex flex-col items-center text-center">
          <div style={{ color: "#10b981" }}>
            <CircularProgress
              value={completed}
              max={Math.max(1, completed + pending + inprogress)}
              size={config.size}
              stroke={config.stroke}
              label={`${completed}`}
              labelClassName={config.labelSize}
            />
          </div>
          <div className={`mt-0 ${config.textSize} text-gray-600`}>
            Completed
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <div style={{ color: "#f59e0b" }}>
            <CircularProgress
              value={pending}
              max={Math.max(1, completed + pending + inprogress)}
              size={config.size}
              stroke={config.stroke}
              label={`${pending}`}
              labelClassName={config.labelSize}
            />
          </div>
          <div className={`mt-0 ${config.textSize} text-gray-600`}>Pending</div>
        </div>

        <div className="flex flex-col mt-10 sm:mt-0 items-center text-center">
          <div style={{ color: "#3b82f6" }}>
            <CircularProgress
              value={inprogress}
              max={Math.max(1, completed + pending + inprogress)}
              size={config.size}
              stroke={config.stroke}
              label={`${inprogress}`}
              labelClassName={config.labelSize}
            />
          </div>
          <div className={`mt-0 ${config.textSize} text-gray-600`}>
            In Progress
          </div>
        </div>

        <div className="flex flex-col mt-10 sm:mt-0 items-center text-center">
          <div style={{ color: "#7c3aed" }}>
            <CircularProgress
              value={progressPercent}
              max={100}
              size={config.size}
              stroke={config.stroke}
              label={`${Math.round(progressPercent)}%`}
              labelClassName={config.labelSize}
            />
          </div>
          <div className={`mt-0 ${config.textSize} text-gray-600`}>
            Overall Progress
          </div>
        </div>
      </div>

      <div
        className={`mt-4 text-xs text-gray-500 flex gap-4 justify-center ${config.textSize}`}
      >
        <div>Todo: {todo}</div>
      </div>
    </Card>
  );
}
