import React, { useState } from "react";
import axios from "axios";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };
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
                        <label className="mb-1" htmlFor="email">
                            Nhập email của bạn:
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mb-3 form-control"
                        />
                        <br />
                        <label className="mb-1" htmlFor="password">
                            Nhập mật khẩu của bạn:
                        </label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mb-3 form-control"
                        />{" "}
                        {/*  */}
                        <FormControl
                            sx={{ m: 1, width: "25ch" }}
                            variant="filled"
                        >
                            <InputLabel htmlFor="filled-adornment-password">
                                Password
                            </InputLabel>
                            <FilledInput
                                id="filled-adornment-password"
                                type={showPassword ? "text" : "password"}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword
                                                    ? "hide the password"
                                                    : "display the password"
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={
                                                handleMouseDownPassword
                                            }
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        {/*  */}
                        <br />
                        <button
                            type="submit"
                            className="btn btn-primary w-100 mb-3"
                        >
                            Login
                        </button>
                    </form>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <div className="d-flex justify-content-between">
                        <div>
                            <a href="/api/registerform">Trở về</a>
                        </div>
                        <div>
                            <a href="/api/forgot">Quên mật khẩu?</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login;
