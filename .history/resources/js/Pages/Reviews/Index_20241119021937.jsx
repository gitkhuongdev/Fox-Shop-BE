import React, { useState } from "react";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
function ReviewForm({ productId, userId, loginUrl }) {
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
      .then((res)=> {
        if(res.data.check === true){

        }
      })
      ;

      alert("Bình luận của bạn đã được gửi!");
      setComment("");
      setRating(0);
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
