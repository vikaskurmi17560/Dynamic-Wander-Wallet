import React, { useState, useEffect } from "react";
import styles from "./voucher.module.css";
export interface Voucher {
    code: string;
    discountType: "percent" | "flat"; 
    amount: number;
    isRedeemed: boolean;
    expiresAt: string; 
    company: string;
    product: string;
}


const VouchersPage: React.FC = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]); 
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
       
        const fetchVouchers = async () => {
            try {
                const response = await fetch("https://dynamic-wander-wallet.onrender.com/api/v1/voucher/vouchers");
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data: Voucher[] = await response.json();
                setVouchers(data); 
            } catch (error) {
                setError("Error fetching data: " + error);
            } finally {
                setLoading(false); 
            }
        };

        fetchVouchers();
    }, []); 

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.voucherContainer}>
            <h1 className={styles.voucherTitle}>Vouchers</h1>
            <div className={styles.voucherGrid}>
                {vouchers.map((voucher) => (
                    <div className={styles.voucherCard} key={voucher.code}>
                        <div className={styles.voucherHeader}>
                            <h3>{voucher.company}</h3>
                            <span className={styles.voucherDiscount}>
                                {voucher.discountType === 'percent'
                                    ? `${voucher.amount}% OFF`
                                    : `₹${voucher.amount} OFF`}
                            </span>
                        </div>
                        <p><strong>Code:</strong> {voucher.code}</p>
                        <p><strong>Type:</strong> {voucher.discountType}</p>
                        <p><strong>Expires:</strong> {new Date(voucher.expiresAt).toLocaleDateString()}</p>
                        <p className={`${styles.status} ${voucher.isRedeemed ? styles.redeemed : styles.active}`}>
                            <strong>Status:</strong> {voucher.isRedeemed ? 'Redeemed' : 'Active'}
                        </p>
                        <button
                            className={styles.redeemBtn}
                            disabled={voucher.isRedeemed}
                        >
                            {voucher.isRedeemed ? 'Redeemed' : 'Redeem Now'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VouchersPage;
