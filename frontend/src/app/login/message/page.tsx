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
                If mail not sent <button onClick={() => router.push("/login")} style={{color:"blue"}}>Login?</button>
            </div>
        </div>
    )
}

export default Message
