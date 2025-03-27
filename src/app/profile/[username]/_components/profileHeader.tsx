import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Building2, Globe, Github, Twitter, MapPin, Calendar, Edit2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ProfileEditForm } from "../editForm";
import { UserData } from "../schema";
import { useAppSelector } from "@/redux/store";

interface ProfileHeaderProps {
    user: UserData;
    updateUser: (userData: Partial<UserData | undefined>) => void;
}

const ProfileHeader = ({ user, updateUser }: ProfileHeaderProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const userDetails = useAppSelector((state) => state.user);
    const isEditingMode = user.username === userDetails.username;

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = (values: UserData) => {
        if (updateUser) {
            updateUser(values);
        }

        toast.success("Profile updated successfully");
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    if (!user) {
        return <div>Not a valid user</div>;
    }
    
    return (
        <>
            <Card className="neo-blur overflow-hidden animate-fade-in">
                <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
                <div className="p-6 -mt-12">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col items-center md:items-start">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-xl animate-scale-in">
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback className="text-2xl">{user.name?.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="mt-4 text-center md:text-left">
                                <h1 className="text-2xl font-bold text-gradient">{user.name}</h1>
                                <p className="text-muted-foreground">@{user.username}</p>
                                {user.rank && (
                                    <Badge variant="secondary" className="mt-2 animate-pulse-soft">
                                        {user.rank}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            {user.bio && <p className="text-foreground/90 mt-4 md:mt-0">{user.bio}</p>}

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {user.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin size={16} />
                                        <span>{user.location}</span>
                                    </div>
                                )}
                                {user.company && (
                                    <div className="flex items-center gap-1">
                                        <Building2 size={16} />
                                        <span>{user.company}</span>
                                    </div>
                                )}
                                {user.memberSince && (
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        <span>Joined on {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {user.website && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-9 gap-1" asChild>
                                                    <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer">
                                                        <Globe size={16} />
                                                        <span className="hidden sm:inline">Website</span>
                                                    </a>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{user.website}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                {user.github && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-9 gap-1" asChild>
                                                    <a href={`https://${user.github}`} target="_blank" rel="noopener noreferrer">
                                                        <Github size={16} />
                                                        <span className="hidden sm:inline">GitHub</span>
                                                    </a>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{user.github}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}

                                {user.twitter && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="sm" className="h-9 gap-1" asChild>
                                                    <a href={`https://${user.twitter}`} target="_blank" rel="noopener noreferrer">
                                                        <Twitter size={16} />
                                                        <span className="hidden sm:inline">Twitter</span>
                                                    </a>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{user.twitter}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                                {isEditingMode && 
                                    <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 gap-1"
                                    onClick={handleEditProfile}
                                    >
                                        <Edit2 size={16} />
                                        <span className="hidden sm:inline">Edit Profile</span>
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Update your profile information. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    <ProfileEditForm
                        defaultValues={{
                            username: user.username,
                            name: user.name,
                            bio: user.bio,
                            location: user.location,
                            company: user.company,
                            institute: user.institute,
                            email: user.email,
                            mobile: user.mobile,
                            website: user.website,
                            github: user.github,
                            twitter: user.twitter,
                        }}
                        onSubmit={handleSaveProfile}
                        onCancel={handleCancelEdit}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProfileHeader;