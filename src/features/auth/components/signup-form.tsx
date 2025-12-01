"use client"

import { Button } from "@/components/ui/button";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const SignupSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is require"),
    confirmPassword: z.string()

}).refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"]
});

type SignupFormValue = z.infer<typeof SignupSchema>;

export function SignupForm() {
    const router = useRouter();

    const form = useForm<SignupFormValue>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
    });

    const onSubmit = async (values: SignupFormValue) => {
        await authClient.signUp.email({
            name: values.email,
            email: values.email,
            password: values.password,
            callbackURL: "/"
        }, {
            onSuccess: () => {
                router.push("/")
            },
            onError: (ctx) => {
                toast.error(ctx.error.message)
            }
        });
    }

    const isPending = form.formState.isSubmitting;

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Signup Page</CardTitle>
                    <CardDescription>
                        Enter your details to create account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button variant="outline" className="w-full" type="button" disabled={isPending}>
                                        <Image src="/github.svg" width={20} height={20} alt="github image"/>
                                        Continue with Github
                                    </Button>
                                    <Button variant="outline" className="w-full" type="button" disabled={isPending}>
                                        <Image src="google.svg" width={20} height={20} alt="google image"/>
                                        Continue with Google
                                    </Button>
                                </div>
                                <div>
                                    <div className="grid gap-6">
                                        <FormField 
                                            control={form.control}
                                            name="email"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="abc@example.com" {...field}/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField 
                                            control={form.control}
                                            name="password"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="*******" {...field}/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField 
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Confirm password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="*******" {...field}/>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full" disabled={isPending}>
                                            Signup
                                        </Button>
                                    </div>
                                    <div className="text-center text-sm">
                                       Already have an accout? {" "}
                                        <Link href="/login" className="underline underline-offset-4">
                                        Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}