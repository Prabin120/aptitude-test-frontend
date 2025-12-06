import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Award, Code, FileQuestion, Target, Trophy } from "lucide-react";
import { TotalProblems } from "../schema";

interface CodingStats {
    problemsSolved: number;
    totalProblems: number;
    acceptanceRate: number;
    easyProblems: number;
    mediumProblems: number;
    hardProblems: number;
    submissionsInLastYear: number;
    contributionPoints: number;
    reputation: number;
    totalSubmissions: number;
}

interface MCQStats {
    questionsAnswered: number;
    totalQuestions: number;
    correctRate: number;
    basicQuestions: { solved: number; total: number };
    intermediateQuestions: { solved: number; total: number };
    advancedQuestions: { solved: number; total: number };
    attemptsInLastYear: number;
    averageResponseTime: string;
    topPerformingCategories: string[];
}

interface StatsProps {
    stats: CodingStats | MCQStats;
    contests: {
        rating?: number;
        globalRank?: number;
        totalParticipated?: number;
        badges?: number;
    };
    skills: { [key: string]: number };
    languages: { [key: string]: number };
    viewMode: "coding" | "mcq";
    totalProblems: TotalProblems;
    totalSubmissions?: number;
}

const ProfileStats = ({ stats, contests, skills, languages, viewMode, totalProblems }: StatsProps) => {
    const isCoding = viewMode === "coding";
    const codingStats = stats as CodingStats;
    const mcqStats = stats as MCQStats;

    return (
        <Tabs defaultValue={isCoding ? "problems" : "questions"} className="w-full animate-fade-in">
            <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger
                    value={isCoding ? "problems" : "questions"}
                    className="flex items-center gap-2"
                >
                    {isCoding ? <Code size={16} /> : <FileQuestion size={16} />}
                    <span>{isCoding ? "Problems" : "Questions"}</span>
                </TabsTrigger>
                <TabsTrigger value="contests" className="flex items-center gap-2">
                    <Trophy size={16} />
                    <span>Contests</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-2">
                    <Award size={16} />
                    <span>Skills</span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value={isCoding ? "problems" : "questions"} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="neo-blur">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex items-center justify-between">
                                <span>{isCoding ? "Solved" : "Answered"}</span>
                                <span className="text-lg text-gradient">
                                    {isCoding ? codingStats.problemsSolved : mcqStats.questionsAnswered}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span>
                                        {isCoding
                                            ? Math.round((codingStats.problemsSolved / totalProblems.totalProblems) * 100)
                                            : Math.round((mcqStats.questionsAnswered / mcqStats.totalQuestions) * 100)
                                        }%
                                    </span>
                                </div>
                                <Progress
                                    value={isCoding
                                        ? (codingStats.problemsSolved / totalProblems.totalProblems) * 100
                                        : (mcqStats.questionsAnswered / mcqStats.totalQuestions) * 100
                                    }
                                    className="h-2"
                                />
                                <div className="text-xs text-muted-foreground">
                                    {isCoding
                                        ? `${codingStats.problemsSolved} / ${totalProblems.totalProblems} problems`
                                        : `${mcqStats.questionsAnswered} / ${mcqStats.totalQuestions} questions`
                                    }
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="neo-blur">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium flex items-center justify-between">
                                <span>{isCoding ? "Difficulty" : "Level"}</span>
                                <span className="text-xs text-muted-foreground">Solved/Total</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {isCoding ? (
                                    <>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="problem-easy">Easy</span>
                                                <span className="font-medium">
                                                    {codingStats.easyProblems??0} / {totalProblems.totalEasyProblems}
                                                </span>
                                            </div>
                                            <Progress
                                                value={(codingStats.easyProblems / totalProblems.totalEasyProblems) * 100}
                                                className="h-2 bg-secondary"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="problem-medium">Medium</span>
                                                <span className="font-medium">
                                                    {codingStats.mediumProblems??0} / {totalProblems.totalMediumProblems}
                                                </span>
                                            </div>
                                            <Progress
                                                value={(codingStats.mediumProblems / totalProblems.totalMediumProblems) * 100}
                                                className="h-2 bg-secondary"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="problem-hard">Hard</span>
                                                <span className="font-medium">
                                                    {codingStats.hardProblems??0} / {totalProblems.totalHardProblems??0}
                                                </span>
                                            </div>
                                            <Progress
                                                value={(codingStats.hardProblems / totalProblems.totalHardProblems) * 100}
                                                className="h-2 bg-secondary"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-green-400">Basic</span>
                                                <span className="font-medium">
                                                    {mcqStats.basicQuestions.solved} / {mcqStats.basicQuestions.total}
                                                </span>
                                            </div>
                                            <Progress
                                                value={(mcqStats.basicQuestions.solved / mcqStats.basicQuestions.total) * 100}
                                                className="h-2 bg-secondary"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-yellow-400">Intermediate</span>
                                                <span className="font-medium">
                                                    {mcqStats.intermediateQuestions.solved} / {mcqStats.intermediateQuestions.total}
                                                </span>
                                            </div>
                                            <Progress
                                                value={(mcqStats.intermediateQuestions.solved / mcqStats.intermediateQuestions.total) * 100}
                                                className="h-2 bg-secondary"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-red-400">Advanced</span>
                                                <span className="font-medium">
                                                    {mcqStats.advancedQuestions.solved} / {mcqStats.advancedQuestions.total}
                                                </span>
                                            </div>
                                            <Progress
                                                value={(mcqStats.advancedQuestions.solved / mcqStats.advancedQuestions.total) * 100}
                                                className="h-2 bg-secondary"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {isCoding ? (
                        <Card className="neo-blur">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-medium">Languages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Object.entries(languages).map(([language, level], index) => (
                                        <div key={index}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>{language}</span>
                                                <span>{level}%</span>
                                            </div>
                                            <Progress
                                                value={level}
                                                className="h-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="neo-blur">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-medium">Top Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {mcqStats.topPerformingCategories.map((category, index) => (
                                        <div key={index} className="bg-secondary/50 p-3 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <span className="text-primary font-medium">{index + 1}</span>
                                                <span>{category}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <Card className="neo-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                            {isCoding ? "Submission Stats" : "MCQ Stats"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {isCoding ? (
                                <>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Acceptance Rate</div>
                                        <div className="text-2xl font-semibold">{codingStats.acceptanceRate.toFixed(2)}%</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Total Submissions</div>
                                        <div className="text-2xl font-semibold">{codingStats.totalSubmissions}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Contribution Points</div>
                                        <div className="text-2xl font-semibold">{codingStats.contributionPoints}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Reputation</div>
                                        <div className="text-2xl font-semibold">{codingStats.reputation}</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Correct Rate</div>
                                        <div className="text-2xl font-semibold">{mcqStats.correctRate.toPrecision(2)}%</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Attempts (Year)</div>
                                        <div className="text-2xl font-semibold">{mcqStats.attemptsInLastYear}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Avg. Response Time</div>
                                        <div className="text-2xl font-semibold">{mcqStats.averageResponseTime}</div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-sm text-muted-foreground">Categories</div>
                                        <div className="text-2xl font-semibold">{mcqStats.topPerformingCategories.length}</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="contests" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="neo-blur">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center justify-center space-y-1">
                                <div className="p-3 bg-primary/10 rounded-full mb-2">
                                    <Trophy className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-sm text-muted-foreground">Contest Rating</div>
                                <div className="text-2xl font-bold text-gradient">{contests?.rating}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="neo-blur">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center justify-center space-y-1">
                                <div className="p-3 bg-primary/10 rounded-full mb-2">
                                    <ArrowUpRight className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-sm text-muted-foreground">Global Rank</div>
                                <div className="text-2xl font-bold text-gradient">#{contests?.globalRank}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="neo-blur">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center justify-center space-y-1">
                                <div className="p-3 bg-primary/10 rounded-full mb-2">
                                    <Target className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-sm text-muted-foreground">Contests Joined</div>
                                <div className="text-2xl font-bold text-gradient">{contests?.totalParticipated}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="neo-blur">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center justify-center space-y-1">
                                <div className="p-3 bg-primary/10 rounded-full mb-2">
                                    <Award className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-sm text-muted-foreground">Contest Badges</div>
                                <div className="text-2xl font-bold text-gradient">{contests?.badges}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="neo-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Upcoming Contests</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                        <div className="text-muted-foreground">No upcoming contests scheduled</div>
                        <button className="mt-4 text-primary underline text-sm">View Contest History</button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
                <Card className="neo-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Skill Proficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-6">
                            {Object.entries(skills).map(([skillName, skillLevel], index) => (
                                <span key={index} className="flex items-center">
                                    <Badge>{skillName}</Badge><span>x</span><span>{skillLevel}</span>
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="neo-blur">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                            {isCoding ? "Recommended Practice" : "Recommended MCQ Topics"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isCoding ? (
                                <>
                                    <div className="bg-secondary/50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium">String Algorithms</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Based on your performance, we recommend practicing more string problems
                                                </p>
                                            </div>
                                            <button className="text-primary text-sm">View Problems</button>
                                        </div>
                                    </div>

                                    <div className="bg-secondary/50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium">Bit Manipulation</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Improve your skills in bit manipulation techniques
                                                </p>
                                            </div>
                                            <button className="text-primary text-sm">View Problems</button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-secondary/50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium">React Fundamentals</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Practice questions on React hooks and lifecycle methods
                                                </p>
                                            </div>
                                            <button className="text-primary text-sm">Start Quiz</button>
                                        </div>
                                    </div>

                                    <div className="bg-secondary/50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-medium">Advanced SQL</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Test your knowledge of complex SQL queries and optimizations
                                                </p>
                                            </div>
                                            <button className="text-primary text-sm">Start Quiz</button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
};

export default ProfileStats;