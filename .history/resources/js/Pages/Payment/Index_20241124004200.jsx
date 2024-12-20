import React, { useEffect, useState } from "react";
import axios from "axios";

function Index({ data }) {
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };
    const handleSubmit = () => {
        console.log("data", data);
        axios
                   
            .post("/api/vnpay-data", 
              {data,
               id_user: userId}
            )
            .then((res) => {
                window.location.href = "https://foxshop.trungthanhzone.com/";
            })
            .catch((err) => {
                console.log("err", err);
            });
    };
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUserId(userData.id);
            }
        } catch (error) {
            console.error("Failed to parse user data:", error);
        }
    }, []);
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setUpdatedUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse user data:", error);
            }
        } else {
            window.location.href = "/";
        }
        setLoading(false);
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="container mt-5 w-25">
            <h2 className="text-center">Xác Thực Đơn Hàng</h2>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Thông Tin Đơn Hàng</h5>
                    <p>
                        <strong>Mã Đơn Hàng:</strong> {data.vnp_TxnRef}
                    </p>
                    <p>
                        <strong>Số Tiền:</strong>{" "}
                        {formatCurrency(data.vnp_Amount/100)}
                    </p>
                    <p>
                        <strong>Nội Dung Thanh Toán:</strong>{" "}
                        {data.vnp_OrderInfo}
                    </p>
                    <p>
                        <strong>Mã Giao Dịch tại VNPAY:</strong>
                        {data.transactionId}
                    </p>
                    <p>
                        <strong>Mã Ngân Hàng:</strong>
                        {data.bankCode}
                    </p>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Quay Lại
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Index;
