"use client"

import { useEffect, useState } from "react";
import styles from "./ProductPage.module.css";
import { useData } from "@/context/UserContext";
import axios from "axios";

export interface Product {
    _id: string;
    name: string;
    image: string;
    description: string;
    price: number;
    category?: string;
    available: boolean;
}

interface ProductPageProps {
    WanderPoint?: number;
    onPurchaseSuccess: () => void;
}


const ProductPage = ({ WanderPoint, onPurchaseSuccess }: ProductPageProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPoints, setCurrentPoints] = useState<number>(WanderPoint);
    const { userId } = useData();
    const fetchProducts = async () => {
        try {
            const res = await fetch("https://dynamic-wander-wallet.onrender.com/api/v1/product/getall");
            if (!res.ok) throw new Error("Failed to fetch products");
            const data: Product[] = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const calculateWanderPoints = (price: number): number => {
        if (price <= 500) return 5;
        if (price <= 1000) return 1000 * 2;
        if (price <= 1500) return 1500 * 2;
        if (price <= 2000) return 5;
        return price * 2;
    };

    const handleBuy = async (productId: string, price: number) => {
        const pointsNeeded = calculateWanderPoints(price);
        console.log(currentPoints);
        if (currentPoints < pointsNeeded) {
            alert(`Not enough Wander Points! You need ${pointsNeeded} but have only ${currentPoints}.`);
            return;
        }

        try {
            const res = await fetch("https://dynamic-wander-wallet.onrender.com/api/v1/user/useBadgePoint", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    productId,
                    pointsToUse: pointsNeeded,
                }),
            });

            const data = await res.json();
            const cashback = price <= 500 ? 40 : price <= 1000 ? 80 : price <= 1500 ? 100 : price <= 2000 ? 150 : 250;

            const responce = await axios.post("https://dynamic-wander-wallet.onrender.com/api/v1/product/cashback", { cashback, userId }, {
                headers: {
                    "content-Type": "application/json"
                }
            })
            console.log(responce);
            onPurchaseSuccess();
            if (data.success) {
                alert("Purchase successful!");
                setCurrentPoints(data.remaining_points);
            } else {
                alert(data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error buying product:", error);
            alert("Server error during purchase.");
        }
    };

    if (loading) return <p className={styles.loading}>Loading products...</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Our Products</h1>
            <div className={styles.grid}>
                {products.map((product) => (
                    <div className={styles.card} key={product._id}>
                        <img
                            src={product.image}
                            alt={product.name}
                            className={styles.image}
                        />
                        <div className={styles.content}>
                            <h3 className={styles.name}>{product.name}</h3>
                            <p className={styles.desp}>{product.description}</p>
                            <div className={styles.info}>
                                <p className={styles.price}>₹{product.price}</p>
                                <p className={product.available ? styles.available : styles.unavailable}>
                                    {product.available ? "In Stock" : "Out of Stock"}
                                </p>
                            </div>
                            <p className={styles.wanderPoints}>
                                Wander Points - {calculateWanderPoints(product.price)}
                            </p>
                            <button
                                className={styles.buyButton}
                                onClick={() => handleBuy(product._id, product.price)}
                            >
                                Buy
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default ProductPage;
