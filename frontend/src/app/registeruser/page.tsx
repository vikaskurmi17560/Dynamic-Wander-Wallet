"use client";
import { Register } from "@/connection/userConnection";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form'

export default function page() {
    const router = useRouter();
    const { register, handleSubmit } = useForm();

    async function handleRegister(data: any) {
        try {
            const response = await Register(data);
            if (response.success) {
                toast.success("Account created successfully");
                router.push("/login");
            }
        }
        catch (error: any) {

            toast.error(error.response.message)
        }
    }
    return (
        <div className="flex justify-center mt-8">
            <div style={{ minWidth: "30%" }}>
                <div className="flex min-h-full shadow-lg flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Create a new account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={handleSubmit(handleRegister)} >

                            <div>
                                <label
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Name
                                </label>
                                <div className="mt-2">
                                    <input

                                        type="name"
                                        required
                                        {...register("name")}
                                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:loading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label

                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Number
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="phone"
                                        autoComplete="phone"
                                        required
                                        {...register("phone_no")}
                                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:loading-6"
                                    />
                                </div>
                            </div>


                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input

                                        type="email"
                                        autoComplete="email"
                                        required
                                        {...register("email")}
                                        className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:loading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input

                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        {...register("password")}
                                        className=" px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="confirmpassword"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Confirm Password
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input

                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        {...register("confirm_password")}
                                        className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <span
                                onClick={() => router.push("/login")}
                                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 cursor-pointer"
                            >
                                Sign In
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}