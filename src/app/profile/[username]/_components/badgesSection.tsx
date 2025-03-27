import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Brain, Flame, Layers, Network, Trophy, Zap } from "lucide-react";

interface BadgeItem {
  name: string;
  icon: string;
  level: number;
  description: string;
}

interface BadgesSectionProps {
  badges: BadgeItem[];
}

const BadgesSection = ({ badges }: BadgesSectionProps) => {
  // Map badge icons to Lucide components
  const getIcon = (iconName: string, size: number = 24) => {
    switch (iconName) {
      case "flame":
        return <Flame size={size} />;
      case "brain":
        return <Brain size={size} />;
      case "trophy":
        return <Trophy size={size} />;
      case "zap":
        return <Zap size={size} />;
      case "network":
        return <Network size={size} />;
      case "layers":
        return <Layers size={size} />;
      default:
        return <Trophy size={size} />;
    }
  };

  // Get color based on badge level
  const getBadgeLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return "bg-zinc-400/20 text-zinc-400";
      case 2:
        return "bg-blue-400/20 text-blue-400";
      case 3:
        return "bg-indigo-400/20 text-indigo-400";
      case 4:
        return "bg-yellow-400/20 text-yellow-400";
      default:
        return "bg-zinc-400/20 text-zinc-400";
    }
  };

  // Get title based on badge level
  const getLevelTitle = (level: number) => {
    switch (level) {
      case 1:
        return "Bronze";
      case 2:
        return "Silver";
      case 3:
        return "Gold";
      case 4:
        return "Platinum";
      default:
        return "Basic";
    }
  };

  return (
    <Card className="neo-blur animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Badges & Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {badges?.map((badge, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center space-y-2 p-3 transition-all hover:scale-105">
                    <div className={`p-4 rounded-lg ${getBadgeLevelColor(badge.level)} animate-pulse-soft`}>
                      {getIcon(badge.icon)}
                    </div>
                    <span className="text-xs text-center font-medium truncate w-full">{badge.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {getLevelTitle(badge.level)}
                    </Badge>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="space-y-1 max-w-xs">
                    <p className="font-semibold">{badge.name}</p>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    <p className="text-xs font-medium">{getLevelTitle(badge.level)} Level</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BadgesSection;