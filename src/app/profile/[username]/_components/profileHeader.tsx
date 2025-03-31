import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Building2, Globe, Github, Twitter, MapPin, Calendar, Edit2, Lock } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { handlePostMethod } from "@/utils/apiCall";
import { changePasswordEndpoint } from "@/consts";

const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;

interface ProfileHeaderProps {
    user: UserData;
    updateUser: (userData: Partial<UserData | undefined>) => void;
}

const ProfileHeader = ({ user, updateUser }: ProfileHeaderProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const userDetails = useAppSelector((state) => state.user);
    const isEditingMode = user.username === userDetails.username;

    const form = useForm<PasswordChangeForm>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

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

    const onSubmitPasswordChange = async (values: PasswordChangeForm) => {
        try {
            const response = await handlePostMethod(changePasswordEndpoint, values);
            if(response instanceof Response) {
                const res = await response.json();
                if(response.status === 200) {
                toast.success("Password changed successfully");
                    setIsPasswordDialogOpen(false);
                    form.reset();
                }
                else {
                    toast.error(res.message);
                }
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
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
                                {isEditingMode && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 gap-1"
                                            onClick={handleEditProfile}
                                        >
                                            <Edit2 size={16} />
                                            <span className="hidden sm:inline">Edit Profile</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-9 gap-1"
                                            onClick={() => setIsPasswordDialogOpen(true)}
                                        >
                                            <Lock size={16} />
                                            <span className="hidden sm:inline">Change Password</span>
                                        </Button>
                                    </>
                                )}
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

            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and set a new password.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitPasswordChange)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsPasswordDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">Change Password</Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProfileHeader;