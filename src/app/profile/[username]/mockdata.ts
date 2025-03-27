// export const userData = {
//     username: "alexcoder",
//     displayName: "Alex Chen",
//     bio: "Software Engineer | Algorithm Enthusiast | Problem Solver",
//     memberSince: "May 2021",
//     avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
//     rank: "Master",
//     location: "San Francisco, CA",
//     company: "TechInnovate",
//     institute: "Stanford University",
//     email: "alex@example.com",
//     mobile: "+1 (555) 123-4567",
//     website: "alexchen.dev",
//     github: "github.com/alexcoder",
//     twitter: "twitter.com/alexcode",
// }

// export const codeProfileInfo = {
//     userId: "alexcoder",
//     contest: {
//         rating: 2145,
//         globalRank: 7342,
//         totalParticipated: 28,
//         badges: 4
//     },
//     codingStats: {
//         problemsSolved: 834,
//         totalProblems: 2413,
//         acceptanceRate: 68.7,
//         easyProblems: { solved: 237, total: 592 },
//         mediumProblems: { solved: 412, total: 1220 },
//         hardProblems: { solved: 185, total: 601 },
//         submissionsInLastYear: 548,
//         longestStreak: 72,
//         currentStreak: 14,
//         contributionPoints: 2840,
//         reputation: 4290,
//     },
//     skills: [
//         { name: "Data Structures", level: 4 },
//         { name: "Algorithms", level: 3 },
//         { name: "Problem Solving", level: 5 },
//         { name: "Coding Skills", level: 4 },
//     ],
//     languages: [
//         { name: "C++", level: 80 },
//         { name: "Java", level: 70 },
//         { name: "Python", level: 90 },
//     ]
// }

// export const recentActivity = [
//     {
//         type: "coding",
//         title: "Maximum Subarray",
//         link: "https://apticode.in/problems/maximum-subarray",
//         timestamp: "2022-01-01T12:00:00Z"
//     },
//     {
//         type: "mcq",
//         title: "Data Structures",
//         link: "https://apticode.in/mcq/data-structures",
//         timestamp: "2022-01-01T12:00:00Z"
//     },
//     {
//         type: "comment",
//         title: "Maximum Subarray",
//         link: "https://apticode.in/problems/maximum-subarray",
//         timestamp: "2022-01-01T12:00:00Z"
//     }
// ]

// export const badges = [
//     { name: "100 Days Streak", icon: "flame", level: 3, description: "Maintained a coding streak for 100 days" },
//     { name: "Algorithm Master", icon: "brain", level: 4, description: "Demonstrated mastery in algorithmic problem-solving" },
//     { name: "Contest Winner", icon: "trophy", level: 2, description: "Placed in the top 10 in a weekly contest" },
// ]
   
//     // mcqStats: {
//     //     questionsAnswered: 425,
//     //     totalQuestions: 950,
//     //     correctRate: 78.3,
//     //     basicQuestions: { solved: 184, total: 300 },
//     //     intermediateQuestions: { solved: 156, total: 400 },
//     //     advancedQuestions: { solved: 85, total: 250 },
//     //     attemptsInLastYear: 320,
//     //     averageResponseTime: "45 seconds",
//     //     topPerformingCategories: ["Data Structures", "JavaScript", "System Design"]
//     // },
//     // mcqActivity: [
//     //     { type: "mcq", topic: "JavaScript Fundamentals", category: "intermediate", score: 92, totalQuestions: 10, timestamp: "2023-11-02T10:15:00Z" },
//     //     { type: "mcq", topic: "Data Structures", category: "advanced", score: 85, totalQuestions: 15, timestamp: "2023-10-29T16:30:00Z" },
//     //     { type: "mcq", topic: "Algorithms Basics", category: "basic", score: 100, totalQuestions: 8, timestamp: "2023-10-25T11:45:00Z" },
//     //     { type: "mcq", topic: "System Design", category: "advanced", score: 78, totalQuestions: 12, timestamp: "2023-10-21T14:20:00Z" },
//     //     { type: "mcq", topic: "Database Concepts", category: "intermediate", score: 88, totalQuestions: 10, timestamp: "2023-10-18T09:30:00Z" }
//     // ],
//     // mcqSkills: [
//     //     { name: "JavaScript", level: 96 },
//     //     { name: "Data Structures", level: 91 },
//     //     { name: "System Design", level: 82 },
//     //     { name: "Database Concepts", level: 88 },
//     //     { name: "Frontend Development", level: 94 },
//     //     { name: "Backend Development", level: 85 }
//     // ],
export const heatmapData = Array.from({ length: 365 }, (_, i) => {
        // Generate random activity data for the heatmap
        const activity = Math.random();
        let level = 0;
        if (activity > 0.85) level = 4;
        else if (activity > 0.7) level = 3;
        else if (activity > 0.5) level = 2;
        else if (activity > 0.3) level = 1;

        // Create date for this entry (going back from today)
        const date = new Date();
        date.setDate(date.getDate() - (364 - i));

        return {
            date: date.toISOString().split('T')[0],
            level,
            count: Math.floor(level * Math.random() * 5)
        };
    })
// };

export const monthlyProgressData = [
    { month: "1", problems: 24 },
    { month: "2", problems: 31 },
    { month: "3", problems: 28 },
    { month: "4", problems: 42 },
    { month: "5", problems: 38 },
    { month: "6", problems: 33 },
    { month: "7", problems: 45 },
    { month: "8", problems: 35 },
    { month: "9", problems: 40 },
    { month: "10", problems: 52 },
    { month: "11", problems: 47 },
    { month: "12", problems: 38 },
];