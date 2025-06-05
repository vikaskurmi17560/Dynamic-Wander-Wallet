import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from "./Wanderpoint.module.css";

interface BadgeUsage {
    product_id: string;
    used_points: number;
    used_at: string;
}

interface Product {
    _id: string;
    name: string;
    image?: string;
    description?: string;
    price: number;
    category?: string;
    available: boolean;
}

interface WanderPointProps {
    WanderPoint?: number;
    badgeUsageHistory: BadgeUsage[];
}

const WanderPoint: React.FC<WanderPointProps> = ({ WanderPoint, badgeUsageHistory }) => {
    const [products, setProducts] = useState<Record<string, Product>>({});

    useEffect(() => {
        const fetchProducts = async () => {
            const uniqueProductIds = [...new Set(badgeUsageHistory.map(item => item.product_id))];
            const productMap: Record<string, Product> = {};

            await Promise.all(uniqueProductIds.map(async (id) => {
                try {
                    const res = await axios.get(`https://dynamic-wander-wallet.onrender.com/api/v1/product/get`, {
                        params: { productId: id },
                    });
                    productMap[id] = res.data;
                } catch (err) {
                    console.error(`Failed to fetch product ${id}`, err);
                }
            }));

            setProducts(productMap);
        };

        if (badgeUsageHistory.length > 0) {
            fetchProducts();
        }
    }, [badgeUsageHistory]);


    const sortedHistory = [...badgeUsageHistory].sort(
        (a, b) => new Date(b.used_at).getTime() - new Date(a.used_at).getTime()
    );

    return (
        <div className={styles.cardContainer}>
            <div className={styles.card}>
                {sortedHistory.length === 0 ? (
                    <p>No history found.</p>
                ) : (
                    <div className={styles.gridContainer}>
                        {sortedHistory.map((item, index) => {
                            const product = products[item.product_id];
                            return (
                                <div key={index} className={styles.historyCard}>
                                    {product ? (
                                        <>
                                            <img
                                                src={product.image || '/placeholder.jpg'}
                                                alt={product.name}
                                                className={styles.productImage}
                                            />
                                            <div className={styles.productContent}>
                                                <h4 className={styles.product_name}>{product.name}</h4>
                                                <p className={styles.product_desp}> {product.description}</p>
                                                <p className={styles.product_points}> <strong>Points Used</strong> {item.used_points}</p>
                                                <p className={styles.product_date}>{new Date(item.used_at).toLocaleString()}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={styles.productContent}>
                                            <p><strong>Product ID:</strong> {item.product_id}</p>
                                            <p><strong>Points Used:</strong> {item.used_points}</p>
                                            <p><strong>Date:</strong> {new Date(item.used_at).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WanderPoint;
