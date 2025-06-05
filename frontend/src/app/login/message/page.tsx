"use client"

import { useRouter } from 'next/navigation'
import React from 'react'
import style from "./message.module.css";

const Message = () => {
    const router = useRouter();
    return (
        <div className={style.container}>
            <div className={style.heading}>
                Password Change Notification or Email will be sent Successfully!
            </div>
            <div className={style.link}>
                If mail not sent <button onClick={() => router.push("/login")} style={{color:"blue"}} className='bg-blue-200 cursor-pointer hover:bg-blue-900 text-white p-2 rounded-full shadow-md rounded-md'>Login?</button>
            </div>
        </div>
    )
}

export default Message
