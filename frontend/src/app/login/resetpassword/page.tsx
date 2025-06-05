'use client';
import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import styles from "./resetpassword.module.css";
import { Reset } from '@/connection/userConnection';

const ResetPassword = () => {
    const {register,handleSubmit}=useForm();
    const params=useSearchParams();
    const router=useRouter();
    const token=params.get("token");
  
    async function handleReset(data: any) {
        try {
            const formdata = { ...data };
            formdata.token = token; 
      
            const res = await Reset(formdata);
            if (res.success) {
                toast.success(res.message);
                router.replace("/login");
            } else {
                toast.error(res.message || 'Something went wrong');
            }
        } catch (error) {
            toast.error("Something went wrong, please try again.");
        }
      }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit(handleReset)} className={styles.card}>
                <div className={styles.heading}>
                    Reset Password?
                </div>
                <div className={styles.box}>
                    <p className={styles.name}>New Password</p>
                    <input {...register("password")} type='text' placeholder='Enter the New Password'
                        className={styles.input}
                    />
                </div>
                <div className={styles.box}>
                    <p className={styles.name}>Confirm Password</p>
                    <input  {...register("confirm_password")} type='password' placeholder='Enter the Confirm Password'
                        className={styles.input}
                    />
                </div>
                <button type='submit' className={`${styles.button} bg-blue-400 cursor-pointer hover:bg-blue-700 text-white p-2 rounded-full shadow-md`}>Submit</button>
            </form>
        </div>
    )
}

export default ResetPassword
