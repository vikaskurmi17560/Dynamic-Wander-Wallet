"use client";

import { Register } from "@/connection/userConnection";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import styles from "./RegisterForm.module.css";
import { useState } from "react";

export default function Page() {
    const router = useRouter();
    const { register, handleSubmit } = useForm();
    const [isError, setIsError] = useState<Boolean | null>(false);
    async function handleRegister(data: any) {
        try {
            const response = await Register(data);
            if (response.success) {
                toast.success("Account created successfully");
                router.push("/login");
            }
        } catch (error: any) {
            const message = error.response.data.message;
            setIsError(message);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.formWrapper}>
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 ">
                            Create a new account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={handleSubmit(handleRegister)}>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Name
                                </label>
                                <div className="mt-2">
                                    <input type="text" required {...register("name")} className={styles.input} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="tel"
                                        autoComplete="phone"
                                        required
                                        {...register("phone_no")}
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        required
                                        {...register("email")}
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        {...register("password")}
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Confirm Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        {...register("confirm_password")}
                                        className={styles.input}
                                    />
                                </div>
                            </div>
                            {
                                isError && <p className={styles.error}>{isError}</p>
                            }
                            <div>
                                <button type="submit" className={styles.button}>
                                    Sign in
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <span onClick={() => router.push("/login")} className={styles.link}>
                                Sign In
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
