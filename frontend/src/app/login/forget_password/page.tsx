"use client"
import React from 'react'
import styles from "./ForgetPassword.module.css";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Forgot } from '@/connection/userConnection';

const ForgetPassword = () => {
    const router = useRouter();
    const {register,handleSubmit}=useForm();

    async function handleForgot(data:any){
        try{
            const response= await Forgot(data);
    
            if(response.success){
              router.replace("/login/message");
              toast.success(response.message);
            }
        }
        catch(error:any){
                
          toast.error(error.response.message)
      }
      }


    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit(handleForgot)} className={styles.card}>
                <div className={styles.heading}>
                    Forgot Password?
                </div>
                <div className={styles.desp}>
                    No Problem! Enter your email  below and we will send you an email with instructions to reset your password.
                </div>
                <input
                {...register("email")}
                    type='email'
                    className={styles.email}
                    placeholder='Email'
                />
                <button type='submit' className={styles.button}>Send Request Link</button>
            </form>
        </div>
    )
}

export default ForgetPassword
