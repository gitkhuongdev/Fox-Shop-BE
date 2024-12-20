import React, { useEffect, useState } from "react";
import axios from "axios";
import { usePage } from "@inertiajs/react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false); // State to track success
    const { token, email } = usePage().props;

    useEffect(() => {
        document.title = "Đặt lại mật khẩu";
    }, []);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("/api/reset-password", {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            setMessage({ type: "success", text: response.data.status });
            setSuccess(true); // Set success state to true when the reset is successful
            setErrors({});
        } catch (error) {
            setErrors(error.response?.data.errors || {});
            setMessage({
                type: "danger",
                text:
                    error.response?.data.message ||
                    "Có lỗi xảy ra. Vui lòng thử lại.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
        >
            <Row className="w-100 justify-content-center">
                <Col md={6} lg={5} xl={4}>
                    {message && (
                        <Alert variant={message.type} className="text-center">
                            {message.text}
                        </Alert>
                    )}
                    <Form
                        onSubmit={handleResetPassword}
                        className="shadow p-5 bg-white rounded"
                    >
                        <div className="text-center mb-4">
                            <h2>Đặt lại mật khẩu</h2>
                        </div>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                isInvalid={!!errors.password}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="formPasswordConfirmation"
                        >
                            <Form.Label>Nhập lại mật khẩu</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                value={passwordConfirmation}
                                onChange={(e) =>
                                    setPasswordConfirmation(e.target.value)
                                }
                                isInvalid={!!errors.passwordConfirmation}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.passwordConfirmation}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-grid">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                            </Button>
                        </div>
                    </Form>

                    {/* Show the login link after successful password reset */}
                    {success && (
                        <div className="text-center mt-4">
                            <p>
                                Mật khẩu đã được thay đổi thành công!
                                <a href="https://foxshop.one">
                                    Vui lòng đăng nhập lại tại đây
                                </a>
                            </p>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ResetPassword;
