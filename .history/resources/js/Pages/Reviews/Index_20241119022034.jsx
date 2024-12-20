import React, { useState } from "react";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
function ReviewForm({ productId, userId, loginUrl }) {
    const notyf = new Notyf({
        duration: 1000,
        position: {
            x: "right",
            y: "top",
        },
        zIndex: 1000,
        types: [
            {
                type: "warning",
                background: "orange",
                duration: 2000,
                icon: {
                    className: "material-icons",
                    tagName: "i",
                    text: "warning",
                },
            },
            {
                type: "error",
                background: "indianred",
                duration: 2000,
                dismissible: true,
                className: "notyf-error",
            },
            {
                type: "success",
                background: "green",
                color: "white",
                duration: 2000,
                dismissible: true,
                className: "notyf-success",
            },
            {
                type: "info",
                background: "#24b3f0",
                color: "white",
                duration: 1500,
                dismissible: false,
                icon: '<i class="bi bi-bag-check"></i>',
            },
        ],
    });
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            window.location.href = loginUrl;
            return;
        }

        try {
            axios
                .post("/admin/review", {
                    id_product: productId,
                    id_user: userId,
                    rating,
                    comment,
                })
                .then((res) => {
                    if (res.data.check === true) {
                        notyf.open({
                            type: "success",
                            message: "Đã tạo thành công",
                        });
                        setComment("");
                        setRating(0);
                    }
                });

            alert("Bình luận của bạn đã được gửi!");
        } catch (error) {
            console.error("Lỗi gửi bình luận:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Bình luận sản phẩm</h3>
            <div>
                <label>Bình luận</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Viết bình luận của bạn"
                />
            </div>
            <div>
                <label>Đánh giá</label>
                {[...Array(5)].map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setRating(index + 1)}
                        style={{
                            cursor: "pointer",
                            color: index < rating ? "#ffc107" : "#e4e5e9",
                            fontSize: "1.5rem",
                        }}
                    >
                        ★
                    </span>
                ))}
            </div>
            <button type="submit">Gửi bình luận</button>
        </form>
    );
}

export default ReviewForm;
