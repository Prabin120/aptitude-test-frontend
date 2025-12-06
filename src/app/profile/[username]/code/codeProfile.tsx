"use client"
import { useState, useEffect } from "react";
import ProfileHeader from "../_components/profileHeader";
import ProfileStats from "../_components/profileStats";
import RecentActivity from "../_components/recentActivity";
import BadgesSection from "../_components/badgesSection";
import { userCodeProfile, UserData } from "../schema";
import { fetchCodeProfile } from "../apiCalls";
import { usePathname } from "next/navigation";
import { ProgressChart } from "../_components/progressChart";
import ContributionGraph from "../_components/activityCalender";

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<userCodeProfile>();
    const useParams = usePathname()
    const username = useParams.split("/").at(-2);
    // Simulate data loading
    useEffect(() => {
        username && (async () => {
            const data = await fetchCodeProfile(username);
            setUserProfile({
                userProfile: data.userProfile,
                codeProfileInfo: data.codingInfo.codeProfileInfo,
                recentActivity: data.codingInfo.recentActivity,
                badges: data.codingInfo.badges,
                totalProblems: data.codingInfo.totalProblems,
                codeSubmissionStats: data.codingInfo.codeSubmissionStats
            });
            setIsLoading(false);
        })()
    }, [username]);


    const updateUserProfile = (newData: Partial<UserData | undefined>) => {
        setUserProfile(prevData => prevData ? ({
            ...prevData,
            userProfile: { ...prevData.userProfile, ...newData }
        }) : undefined);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="space-y-4 flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground animate-pulse">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="space-y-4 flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground animate-pulse">User not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container py-8">
                <div className="space-y-6">
                    <div className="flex items-center mb-4">
                        {/* <FileQuestion className="h-6 w-6 text-primary mr-2" /> */}
                        <h1 className="text-2xl font-bold">Coding Performance</h1>
                    </div>
                    <ProfileHeader
                        user={userProfile?.userProfile}
                        updateUser={updateUserProfile}
                    />

                    {/* <div className="flex items-center justify-end">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="aptitude" className="flex items-center gap-2">
                                <span>View MCQ Performance</span>
                            </Link>
                        </Button>
                    </div> */}

                    {userProfile?.codeProfileInfo.skills ? (
                        <>
                            <ContributionGraph
                                dailyBreakdown={userProfile.codeSubmissionStats?.dailyBreakdown}
                                currentStreak={userProfile.codeProfileInfo?.codingStats?.currentStreak}
                                longestStreak={userProfile.codeProfileInfo?.codingStats?.longestStreak}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <ProfileStats
                                        stats={userProfile.codeProfileInfo?.codingStats}
                                        contests={userProfile.codeProfileInfo?.contest}
                                        skills={userProfile.codeProfileInfo?.skills}
                                        languages={userProfile.codeProfileInfo?.languages}
                                        totalProblems={userProfile.totalProblems}
                                        viewMode="coding"
                                    />
                                </div>

                                <div className="space-y-6">
                                    <RecentActivity activities={userProfile.recentActivity} viewMode="coding" />
                                </div>
                            </div>

                            <BadgesSection badges={userProfile.badges} />
                            <ProgressChart monthlyBreakdown={userProfile.codeSubmissionStats?.monthlyBreakdown}/>
                        </>
                    ) : (
                        <div className="flex items-center justify-center">
                            <p className="text-muted-foreground">No coding data available, Please submit some coding problems</p>
                        </div>)
                    }
                </div>
            </div>
        </div>
    );
};

export default Profile;