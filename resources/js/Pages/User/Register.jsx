import React, { useState } from "react";
import axios from "axios";
import { colors } from "@mui/material";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState(null);

    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name === "") {
            return setMessage("Vui lòng nhập tên");
        } else if (email === "") {
            return setMessage("Vui lòng nhập email");
        } else if (phone === "") {
            return setMessage("Vui lòng nhập sđt");
        } else if (password !== passwordConfirm) {
            return setMessage("Mật khẩu nhập lại không đúng");
        } else if (password.length < 6) {
            return setMessage("Mật khẩu phải nhiều hơn 6 ký tự");
        } 
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("password", password);
        if (avatar) {
            formData.append("avatar", avatar);
        }

        try {
            const response = await axios.post("/api/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setMessage(response.data.message);
            setName("");
            setEmail("");
            setPassword("");
            setPhone("");
            setAvatar("");
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <div>
                    <label>Password Confirm:</label>
                    <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        placeholder="Enter your password confirm"
                    />
                </div>
                <div>
                    <label>Số diện thoại:</label>
                    <input
                        type="number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                    />
                </div>
                <div>
                    <label>Profile Picture:</label>
                    <input
                        type="file"
                        onChange={(e) => setAvatar(e.target.files[0])}
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
    );
};

export default Register;
