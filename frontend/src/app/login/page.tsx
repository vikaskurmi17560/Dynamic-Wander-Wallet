"use client";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form'
import { Signin } from "@/connection/userConnection";


export default function page() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  
  async function handleSignin(data: any) {
    try {

        const response = await Signin(data);
        if (response.success ) {
          
          toast.success("Login Successfully");
          const expiresAt = Date.now() + 60 * 60 * 1000; 

         
          localStorage.setItem("token", JSON.stringify({ value: response.token, expiresAt }));
          localStorage.setItem("user_id", JSON.stringify({ value: response.user._id, expiresAt }));
          localStorage.setItem("user_name", JSON.stringify({ value: response.user.name, expiresAt }));
          localStorage.setItem("user_email", JSON.stringify({ value: response.user.email, expiresAt }));

          router.replace("/");
          
    }
  }
    catch (error:any) {

      console.error("Signin Error:", error.message);
      toast.error(error.message || "An unexpected error occurred");
    }
}

  return (
    <>
      <div className="flex justify-center mt-16">
        <div style={{ minWidth: "30%" }}>
          <div className="flex min-h-full shadow-lg flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              
              <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleSubmit(handleSignin)} >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                        {...register("email")}
                      type="email"
                      autoComplete="email"
                      required
                      className="px-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                     
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-semibold text-indigo-600 hover:text-indigo-500"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                    {...register("password")}
                      type="password"
                      autoComplete="current-password"
                      required
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
                Not a member?{" "}
                <span
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 cursor-pointer"
                  onClick={()=>{router.push("/registeruser")}}
                >
                  Start a 14 day free trial
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function encrypt(arg0: { response: any; expires: Date; }) {
  throw new Error("Function not implemented.");
}
