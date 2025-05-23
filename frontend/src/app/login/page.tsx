"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { Signin } from "@/connection/userConnection";
import { useData } from "@/context/UserContext";
import styles from "./SigninForm.module.css";

export default function Page() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const { updateUserContext } = useData();

  async function handleSignin(data: any) {
    try {
      const response = await Signin(data);
      if (response.success) {
        toast.success("Login Successfully");
        const expiresAt = Date.now() + 60 * 60 * 1000;

        localStorage.setItem(
          "token",
          JSON.stringify({ value: response.token, expiresAt })
        );
        localStorage.setItem(
          "user_id",
          JSON.stringify({ value: response.user._id, expiresAt })
        );
        localStorage.setItem(
          "user_name",
          JSON.stringify({ value: response.user.name, expiresAt })
        );
        localStorage.setItem(
          "user_email",
          JSON.stringify({ value: response.user.email, expiresAt })
        );

        await updateUserContext();
        router.replace("/profile");
      }
      else {
      toast.error("Login failed. Please check your credentials.");
    }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Sign in to your account</h2>

        <form className={styles.form} onSubmit={handleSubmit(handleSignin)}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>
            <input
              {...register("email")}
              type="email"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button}>
            Sign in
          </button>
        </form>
        <div className={styles.forget}>
          <div className={styles.remember_div}>
            <input type="checkbox" className={styles.remember_input} />
            <p className={styles.remember_name}>Remember me</p>
          </div>
          <button className={styles.forget_btn} onClick={() => router.push("/login/forget_password")}>Forget Password?</button>
        </div>
        <p className={styles.footerText}>
          Not a member?{" "}
          <span
            className={styles.link}
            onClick={() => {
              router.push("/registeruser");
            }}
          >
            Start a 14 day free trial
          </span>
        </p>
      </div>
    </div>
  );
}
