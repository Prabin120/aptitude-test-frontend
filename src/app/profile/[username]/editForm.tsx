import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { setUserState, userInitialState } from "@/redux/user/userSlice";
import { useAppDispatch } from "@/redux/store";
import { editProfile, sendMailVerificationLink } from "@/consts";
import { setAuthState } from "@/redux/auth/authSlice";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleGetMethod, handlePutMethod } from "@/utils/apiCall";

const profileFormSchema = z.object({
    username: z.string().min(3, {
        message: "Username must be at least 3 characters.",
    }),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    bio: z.string().max(160).optional(),
    location: z.string().optional(),
    company: z.string().optional(),
    institute: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    mobile: z
        .string()
        .regex(/^[0-9+\s-]*$/, {
            message: "Please enter a valid phone number",
        })
        .optional(),
    website: z.string().url().optional().or(z.literal("")),
    github: z.string().optional(),
    twitter: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileEditFormProps {
    defaultValues: Partial<ProfileFormValues>;
    emailVerified: boolean | undefined;
    onSubmit: (values: ProfileFormValues) => void;
    onCancel: () => void;
}

export function ProfileEditForm({
    defaultValues,
    emailVerified,
    onSubmit,
    onCancel,
}: ProfileEditFormProps) {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    });

    const [loading, setLoading] = useState(false)
    const [emailVerifyResponse, setEmailVerifyResponse] = useState("")
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleSubmit = async (values: ProfileFormValues) => {
        setLoading(true)
        const response = await handlePutMethod(editProfile, values)
        if (response instanceof Response) {
            if (response.status === 200 || response.status === 201) {
                onSubmit(values);
                toast("Profile updated successfully");
            }
            else if (response.status === 401 || response.status === 403) {
                dispatch(setUserState(userInitialState));
                dispatch(setAuthState(false))
                router.push('/login')
                return;
            }
        }
        setLoading(false)
    }

    const sentVerifyMail = async () => {
        const response = await handleGetMethod(sendMailVerificationLink);
        if (response instanceof Response) {
            if (response.status === 200 || response.status === 201) {
                toast("A link for verification is sent to your email.");
                setEmailVerifyResponse("A link for verification is sent to your email.");
            }
        }
        emailVerified = true;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="space-y-4 flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground animate-pulse">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display username.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your full name as displayed to others.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        disabled={true}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="youremail@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Your contact email.
                                </FormDescription>
                                <FormMessage />
                                {
                                    emailVerified ?
                                        <span className="text-sm text-muted-foreground">Verified</span>
                                    :
                                    emailVerifyResponse?
                                        <span className="text-sm text-muted-foreground"> {emailVerifyResponse}</span>
                                        : 
                                        <Button size={"sm"} type="button" onClick={sentVerifyMail}>Verify Email</Button>
                                }
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+1 (555) 123-4567" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your contact number.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="institute"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Institute</FormLabel>
                                <FormControl>
                                    <Input placeholder="University/School name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Where you study or studied.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                    <Input placeholder="Where you work" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your current workplace.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="City, Country" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Where you&apos;re based.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://yourwebsite.com" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your personal website.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a little bit about yourself"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Brief description for your profile. Maximum 160 characters.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="github"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>GitHub</FormLabel>
                                <FormControl>
                                    <Input placeholder="github.com/username" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your GitHub profile.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Twitter</FormLabel>
                                <FormControl>
                                    <Input placeholder="twitter.com/username" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your Twitter profile.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">Save changes</Button>
                </div>
            </form>
        </Form>
    );
}
