import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Container from "@mui/material/Container";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Table, Pagination } from "react-bootstrap";
import { Notyf } from "notyf";
import Swal from "sweetalert2";
import axios from "axios";
import "notyf/notyf.min.css";

function Index({ payment }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(payment);
    const [method, setMethod] = useState("");
    const [create, setCreate] = useState(false);
    const columns = [
        {
            field: "id",
            headerName: "#",
            width: 40,
        },
        {
            field: "method",
            headerName: "Phương thức",
            width: 100,
            editable: true,
        },
        {
            field: "editLink",
            headerName: "Sửa",
            width: 100,
            renderCell: (params) => {
                const methodId = params.row.id;
                return (
                    <a
                        className="btn btn-sm btn-warning"
                        href={`/admin/methods/${methodId}`}
                    >
                        Sửa
                    </a>
                );
            },
        },
        {
            field: "deleteLink",
            headerName: "Xóa",
            renderCell: (params) => {
                const methodId = params.row.id;
                return (
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => handleDelete(methodId)}
                    >
                        Xóa
                    </button>
                );
            },
        },
    ];
    const handleDelete = (methodId) => {
        Swal.fire({
            icon: "question",
            text: "Xóa phương thức này ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Đúng",
            denyButtonText: `Không`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete("/admin/methods/" + methodId).then((res) => {
                    if (res.data.check == true) {
                        setTimeout(() => {
                            notyf.success("Đã xóa thành công");
                        }, 17000);
                        window.location.replace("/admin/methods");
                    } else if (res.data.check == false) {
                        if (res.data.msg) {
                            notyf.error(res.data.msg);
                        }
                    }
                });
            } else if (result.isDenied) {
            }
        });
    };
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
                duration: 1000,
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
    const handleSubmit = () => {
        if (method === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập mã Voucher",
            });
        } else {
            var formData = new FormData();
            formData.append("method", method);
            axios.post("/admin/methods", formData).then((res) => {
                if (res.data.check === true) {
                    notyf.open({
                        type: "success",
                        message: "Đã tạo thành công",
                    });
                    setCreate(false);
                } else if (res.data.check === false) {
                    notyf.open({
                        type: "error",
                        message: res.data.msg,
                    });
                }
            });
        }
    };
    const handleCancel = () => {
        setCreate(false);
    };
    const handleCreate = () => {
        setCreate(true);
    };
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
        <>
            <Layout>
                <Container>
                    <div>
                        {create === true && (
                            <Container>
                                <div className="card border-0 shadow mt-3">
                                    <div className="card-header">
                                        <div className="text-uppercase text-center">
                                            <h4>
                                                Thêm mới phương thức
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="form-group">
                                                <label htmlFor="">
                                                    Phương thức thanh toán
                                                </label>
                                                <input
                                                    onChange={(e) =>
                                                        setMethod(
                                                            e.target.value
                                                        )
                                                    }
                                                    name="method"
                                                    className="form-control"
                                                    type="text"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <div className="d-flex gap-3">
                                            <div>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={handleSubmit}
                                                >
                                                    Tạo phương thức thanh toán
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
                        )}
                        {create === false && (
                            <div>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleCreate}
                                    >
                                        Tạo mới Phương thức
                                    </button>
                                </div>
                                <div>
                                    <div className="mt-3">
                                        <h4>
                                            Danh sách Phương thức thanh toán
                                        </h4>
                                    </div>
                                    <div className="col-md-12">
                                        {data && data.length > 0 && (
                                            <Box sx={{ height: 300 }}>
                                                <DataGrid
                                                    rows={data}
                                                    columns={columns}
                                                    initialState={{
                                                        pagination: {
                                                            paginationModel: {
                                                                pageSize: 5,
                                                            },
                                                        },
                                                    }}
                                                    pageSizeOptions={[5]}
                                                    checkboxSelection
                                                    disableRowSelectionOnClick
                                                />
                                            </Box>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Container>
            </Layout>
        </>
    );
}
export default Index;
