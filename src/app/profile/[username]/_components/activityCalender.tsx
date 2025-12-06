import React from "react";
import CalendarHeatmap, { TooltipDataAttrs } from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import { format, parseISO, subDays } from "date-fns";
import "react-calendar-heatmap/dist/styles.css";
import "@/styles/heatmap.css"; // Import custom styles

interface ContributionGraphProps {
  dailyBreakdown: Record<string, number>;
  currentStreak?: number;
  longestStreak?: number;
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({
  dailyBreakdown,
}) => {
  // Convert dailyBreakdown to array format
  const heatmapData = Object.entries(dailyBreakdown).map(([date, count]) => ({
    date: parseISO(date),
    count,
  }));

  const getColorClass = (count: number) => {
    if (count === 0) return "bg-gray-800";
    else if (count === 1) return "heatmap-color-1";
    else if (count === 2) return "heatmap-color-2";
    else if (count === 3) return "heatmap-color-3";
    else if (count === 4) return "heatmap-color-4";
    else return "heatmap-color-5";
  };

  return (
    <div className="w-full p-4 text-white rounded-lg shadow-lg border border-neutral-800">
      <h2 className="text-xl font-bold mb-2">Coding Submissions (Past Year)</h2>
      {/* <p className="text-sm text-gray-400">
        Current Streak: <strong>{currentStreak ?? 0}</strong> | Longest Streak: <strong>{longestStreak ?? 0}</strong>
      </p>   */}

      <div className="overflow-x-auto mt-4">
        <CalendarHeatmap
          startDate={subDays(new Date(), 364)}
          endDate={new Date()}
          values={heatmapData}
          classForValue={(value) => (value ? getColorClass(value.count) : "bg-gray-800")}
          tooltipDataAttrs={(value) => ({
            "data-tooltip-id": "tooltip",
            "data-tooltip-content": `${format(
              value?.date || new Date(),
              "PPP"
            )}: ${value?.count || 0} submissions`,
          }) as TooltipDataAttrs}
          showWeekdayLabels
          showMonthLabels
        />
      </div>

      <Tooltip id="tooltip" place="top" />
    </div>
  );
};

export default ContributionGraph;
