import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(4, { message: "Password must be at least 8 characters" }),
})

const signupFormSchema = z.object({
    username: z.string().min(5, { "message": "Username should have minimum 5 character" })
        .max(12, { message: "Maximum 12 characters are allowed" })
        .regex(/^[a-zA-Z0-9]+$/, { message: "Username can contain only alphabets and numbers" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    mobile: z.string().min(10, { message: "Enter a valid mobile number" }).max(10, { message: "Enter number in 10 digits" }),
    institute: z.string(),
}).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords is not matching',
            path: ['confirmPassword']
        })
    }
}
);

const editProfileSchema = z.object({
    username: z.string().min(5, { "message": "Username should have minimum 5 character" })
        .max(12, { message: "Maximum 12 characters are allowed" })
        .regex(/^[a-zA-Z0-9]+$/, { message: "Username can contain only alphabets and numbers" }),
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    mobile: z.string().min(10, { message: "Enter a valid mobile number" }).max(10, { message: "Enter number in 10 digits" }),
    institute: z.string().optional(),
});

const editPasswordSchema = z.object({
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    oldPassword: z.string().min(8, { message: "Password must be at least 8 characters" })
}).superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords is not matching',
            path: ['confirmPassword']
        })
    }
}
);

const resetPasswordSchema = z.object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
}).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords is not matching',
            path: ['confirmPassword']
        })
    }
}
);

export { signupFormSchema, editProfileSchema, editPasswordSchema, resetPasswordSchema };
