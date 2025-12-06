
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
// import { monthlyProgressData } from "../mockdata";

interface ProgressChartProps {
  monthlyBreakdown?: Record<string, number>;
}

export const ProgressChart = ({ monthlyBreakdown = {} }: ProgressChartProps) => {
  const getChartData = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString();
      return {
        month: new Date(2023, i).toLocaleString('default', { month: 'short' }),
        problems: monthlyBreakdown[month] || 0
      };
    });
  };

  if (!monthlyBreakdown) return <></>;

  return (
    <Card className="neo-blur animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Monthly Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={getChartData()} 
              margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="rgba(255,255,255,0.1)" 
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "calc(var(--radius) - 2px)",
                  boxShadow: "0 4px 12px -2px rgba(0,0,0,0.1)"
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--primary))" }}
              />
              <Bar
                dataKey="problems"
                name="Submissions"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                animationDuration={800}
                opacity={0.85}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};