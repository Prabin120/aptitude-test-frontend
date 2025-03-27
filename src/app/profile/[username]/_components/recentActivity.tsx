import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, Code, FileQuestion, MessageSquare, Trophy } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import Link from "next/link";

type ActivityItem = {
    type: string;
    title?: string;
    link?: string;
    timestamp: string;
};

interface RecentActivityProps {
    activities: ActivityItem[];
    viewMode: "coding" | "mcq";
}

const RecentActivity = ({ activities, viewMode }: RecentActivityProps) => {
    const getActivityIcon = (activity: ActivityItem) => {
        if (activity.type === "solved") return <Check className="h-5 w-5 text-green-400" />;
        if (activity.type === "contest") return <Trophy className="h-5 w-5 text-yellow-400" />;
        if (activity.type === "comment") return <MessageSquare className="h-5 w-5 text-blue-400" />;
        if (activity.type === "mcq") return <FileQuestion className="h-5 w-5 text-purple-400" />;
        return <Code className="h-5 w-5 text-primary" />;
    };

    return (
        <Card className="neo-blur">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">
                    {viewMode === "coding" ? "Recent Activity" : "Recent MCQ Activity"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                                {getActivityIcon(activity)}
                            </div>
                            <div className="flex-1 space-y-1">
                                <Link href={activity.link || ""} className="font-medium text-primary hover:underline">{activity.title}</Link>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar size={12} />
                                    <span>{formatDistanceToNow(new Date(activity.timestamp))} ago</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentActivity;