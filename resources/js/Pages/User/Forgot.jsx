import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/api/forgot", {
                email,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(
                error.response.data.email || "Có lỗi xảy ra. Vui lòng thử lại."
            );
        }
    };

    return (
        <div>
            <h2>Quên mật khẩu</h2>
            <form onSubmit={handleForgotPassword}>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Gửi link reset mật khẩu</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ForgotPassword;
