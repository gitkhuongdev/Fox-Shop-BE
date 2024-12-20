import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Container } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { Notyf } from "notyf";
import axios from "axios";


function Edit({ payments }){
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
    if (loading) {
        return <div>Loading...</div>;
    }
    console.log(payments);
    const [method, setMethod] = useState(payments.method);
    const [id, setId] = useState(payments.id);
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

    const handleCancel = () => {
        window.location.href = "/admin/methods";
    };

    const handleUpdateMethod = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("method", method);
        axios
        .post("/admin/method/update/" + id, formData)
        .then((res) => {
            if (res.data.check === true) {
                notyf.open({
                    type: "success",
                    message: "Đã chỉnh sửa phương thức thanh toán",
                });
                window.location.href = "/admin/methods";
            } else if (res.data.check === false) {
                notyf.open({
                    type: "error",
                    message: "Đã xảy ra lỗi ",});
                }
            })
            .catch((err) => {
                console.log(err);
                notyf.open({
                    type: "error",
                    message: "Đã xảy ra lỗi vui lòng thử lại",
                });
            });
        }
    
        return (
            <Layout>
                <Container>
                <div className="card border-0 shadow">
                    <div className="card-header">
                        <div className="text-uppercase text-center">
                            <h4>Thêm mới phương thức thanh toán</h4>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="form-group">
                                <label htmlFor="">Phương thức thanh toán</label>
                                <input value={method} onChange ={(e) =>setMethod(e.target.value)} name="method" className="form-control" type="text" />
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex gap-3">
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdateMethod}
    
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleCancel}
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </Container>
        </Layout>
    );
}
export default Edit;