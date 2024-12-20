import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "@mui/material/Container";
import { Notyf } from "notyf";
import Form from "react-bootstrap/Form";
import axios from "axios";
import "notyf/notyf.min.css";
function Edit({ result }) {
    const [loading, setLoading] = useState(true);
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
    const [name, setName] = useState(result.name);
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
    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put("/admin/brands/" + result.id, { name: name }).then((res) => {
            if (res.data.check === true) {
                notyf.open({
                    type: "success",
                    message: "Đã chỉnh sửa thương hiệu",
                });
                window.location.href = "/admin/brands";
            } else if (res.data.check === false) {
                notyf.open({
                    type: "error",
                    message: "Đã xảy ra lỗi vui lòng thử lại",
                });
            }
        });
    };
    return (
        <div>
            <Layout>
                <Container>
                    <div>
                        <h5>Chỉnh sửa thương hiệu</h5>
                    </div>
                    <div className="w-25">
                        <label htmlFor="">Tên thương hiệu:</label> <br />
                        <input
                            className="form-control"
                            type="text"
                            name="name"
                            id=""
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="d-flex mt-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleUpdate}
                            >
                                Lưu thay đổi
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger ms-3"
                                onClick={handleUpdate}
                            >
                                Huỷ thay đổi
                            </button>
                        </div>
                    </div>
                </Container>
            </Layout>
        </div>
    );
}

export default Edit;
