export interface UserData {
    username: string;
    name: string;
    bio?: string;
    memberSince?: string;
    image?: string;
    rank?: string;
    location?: string;
    company?: string;
    institute?: string;
    email?: string;
    mobile?: string;
    website?: string;
    github?: string;
    twitter?: string;
    emailVerified?: boolean;
    coins?: number;
}

export interface ContestInfo {
    rating: number;
    globalRank: number;
    totalParticipated: number;
    badges: number;
}

export interface CodingStats {
    problemsSolved: number;
    totalProblems: number;
    acceptanceRate: number;
    easyProblems: number;
    mediumProblems: number;
    hardProblems: number;
    submissionsInLastYear: number;
    longestStreak: number;
    currentStreak: number;
    contributionPoints: number;
    reputation: number;
    totalSubmissions: number;
}

export interface CodeProfileInfo {
    username: string;
    contest: ContestInfo;
    codingStats: CodingStats;
    skills: { [key: string]: number };
    languages: { [key: string]: number };
}

export interface RecentActivity {
    type: "coding" | "mcq" | "comment";
    title: string;
    link: string;
    timestamp: string;
}

export interface Badge {
    name: string;
    icon: string;
    level: number;
    description: string;
}

export interface HeatmapEntry {
    date: string;
    level: number;
    count: number;
}

export interface MonthlyProgress {
    month: string;
    problems: number;
}

export interface TotalProblems {
    totalProblems: number;
    totalEasyProblems: number;
    totalMediumProblems: number;
    totalHardProblems: number;
}

export interface CodeSubmissionStats {
    dailyBreakdown: Record<string, number>;
    monthlyBreakdown: Record<string, number>;
    dailyCount: number;
    monthlyCount: number;
    yearlyCount: number;
}


export interface userCodeProfile {
    userProfile: UserData;
    codeProfileInfo: CodeProfileInfo;
    recentActivity: RecentActivity[];
    badges: Badge[];
    totalProblems: TotalProblems;
    codeSubmissionStats: CodeSubmissionStats;
    // heatmapData: HeatmapEntry[];
    // monthlyProgress: MonthlyProgress[];
}