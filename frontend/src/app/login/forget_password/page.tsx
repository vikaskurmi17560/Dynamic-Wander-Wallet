"use client"
import React from 'react'
import styles from "./ForgetPassword.module.css";
import { useRouter } from 'next/navigation';

const ForgetPassword = () => {
    const router = useRouter();
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.heading}>
                    Forgot Password?
                </div>
                <div className={styles.desp}>
                    No Problem! Enter your email  below and we will send you an email with instructions to reset your password.
                </div>
                <input
                    type='email'
                    className={styles.email}
                    placeholder='Email'
                />
                <button type='submit' className={styles.button} onClick={() => router.push("/login/message")}>Send Request Link</button>
            </div>
        </div>
    )
}

export default ForgetPassword
