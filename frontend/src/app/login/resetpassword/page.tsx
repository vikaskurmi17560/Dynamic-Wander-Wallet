import React from 'react'
import styles from "./resetpassword.module.css";

const ResetPassword = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.heading}>
                    Reset Password?
                </div>
                <div className={styles.box}>
                    <p className={styles.name}>New Password</p>
                    <input type='text' placeholder='Enter the New Password'
                        className={styles.input}
                    />
                </div>
                <div className={styles.box}>
                    <p className={styles.name}>Confirm Password</p>
                    <input type='text' placeholder='Enter the Confirm Password'
                        className={styles.input}
                    />
                </div>
                <button type='submit' className={styles.button}>Submit</button>
            </div>
        </div>
    )
}

export default ResetPassword
