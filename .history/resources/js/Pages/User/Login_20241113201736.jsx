import React, { useState } from "react";
import axios from "axios";
import Container from "@mui/material/Container";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault(); // Ngăn không cho trang bị load lại
        try {
            const response = await axios.post("/api/login", {
                email,
                password,
            });
            console.log("Response from login:", response.data);
            if (response.status === 200) {
                // Lưu token vào localStorage
                const { token, user } = response.data;
                if (user) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));
                    window.location.href = "/api/info";
                } else {
                    console.error("User data is invalid or undefined.");
                }
            }
        } catch (err) {
            setError("Đăng nhập không thành công. Vui lòng kiểm tra lại!");
        }
    };

    return (
        <>
                <div className="d-flex justify-content-center">
                    <div className="w-25 mt-5 shadow p-5">
                        <h2 className="mb-5">Đăng nhập quản trị</h2>
                        <form onSubmit={handleLogin}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mb-3 form-control"
                            />{" "}
                            <br />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mb-3 form-control"
                            />{" "}
                            <br />
                            <button type="submit" className="btn btn-primary">
                                Login
                            </button>
                        </form>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <a href="/api/registerform">Đăng kí</a>
                        <a href="/api/forgot">Quên mật khẩu?</a>
                    </div>
                </div>
        </>
    );
}
export default Login;
