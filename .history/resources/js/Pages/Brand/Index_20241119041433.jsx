import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "@mui/material/Container";

import { Notyf } from "notyf";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "notyf/notyf.min.css";
import axios from "axios";
import Swal from "sweetalert2";
function Index({ brands }) {
    const [brand, setBrand] = useState("");
    const [data, setData] = useState(brands);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const api = "http://localhost:8000/api/";
    const app = "http://localhost:8000/";
    const formatCreatedAt = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };
    const notyf = new Notyf({
        duration: 1000,
        position: {
            x: "right",
            y: "top",
        },
        types: [
            {
                type: "warning",
                background: "orange",
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
    const columns = [
        {
            field: "id",
            headerName: "#",
            width: 100,
            renderCell: (params) => params.rowIndex,
        },
        {
            field: "name",
            headerName: "Thương hiệu",
            width: 200,
            editable: true,
        },
        { field: "slug", headerName: "Slug", width: 200, editable: true },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            valueGetter: (params) => formatCreatedAt(params),
        },
    ];
    const submitBrand = () => {
        axios
            .post("/admin/brands", {
                name: brand,
            })
            .then((res) => {
                if (res.data.check == true) {
                    notyf.open({
                        type: "success",
                        message: "Đã thêm thành công",
                    });
                    setData(res.data.data);
                    setShow(false);
                    setBrand("");
                } else if (res.data.check == false) {
                    notyf.open({
                        type: "error",
                        message: res.data.msg,
                    });
                }
            })
            .catch((err) => {
                // Optional: Handle other errors like network issues
                console.log(err);

                //   notyf.open({
                //     type: "error",
                //     message: "Đã có lỗi xảy ra. Vui lòng thử lại.",
                //   });
            });
    };
    const resetCreate = () => {
        setBrand("");
        setShow(true);
    };
    const handleCellEditStop = (id, field, value) => {
        if (value == "") {
            Swal.fire({
                icon: "question",
                text: "Bạn muốn xóa thương hiệu này ?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Đúng",
                denyButtonText: `Không`,
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete("/admin/brands/" + id).then((res) => {
                        if (res.data.check == true) {
                            notyf.success("Đã xóa thành công");
                            setData(res.data.data);
                        }
                    });
                } else if (result.isDenied) {
                }
            });
        } else {
            axios
                .put(
                    `/admin/brands/${id}`,
                    {
                        [field]: value,
                    }
                    // {
                    //     headers: {
                    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
                    //         Accept: "application/json",
                    //     },
                    // }
                )
                .then((res) => {
                    if (res.data.check == true) {
                        notyf.open({
                            type: "success",
                            message: "Chỉnh sửa thương hiệu thành công",
                        });
                        setData(res.data.data);
                    } else if (res.data.check == false) {
                        notyf.open({
                            type: "error",
                            message: res.data.msg,
                        });
                    }
                });
        }
    };
    return (
        <Layout>
            <>
                <Container>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Tạo thương hiệu sản phẩm</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <label htmlFor="">Thương hiệu sản phẩm</label>
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="Tên thương hiệu sản phẩm"
                                onChange={(e) => setBrand(e.target.value)}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Đóng
                            </Button>
                            <Button
                                variant="primary text-light"
                                disabled={brand == "" ? true : false}
                                onClick={(e) => submitBrand()}
                            >
                                Tạo mới
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid">
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon" />
                            </button>
                            <div
                                className="collapse navbar-collapse"
                                id="navbarSupportedContent"
                            >
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <a
                                            className="btn btn-primary text-light"
                                            onClick={(e) => resetCreate()}
                                            aria-current="page"
                                            href="#"
                                        >
                                            Tạo mới
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    {/* <div className="row">
                    <div className="col-md-7">
                        {data && data.length > 0 && (
                            <Box sx={{ height: 400, width: "100%" }}>
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
                                    onCellEditStop={(params, e) =>
                                        handleCellEditStop(
                                            params.row.id,
                                            params.field,
                                            e.target.value
                                        )
                                    }
                                />
                            </Box>
                        )}
                    </div>
                </div> */}
                    <div className="card">
                        <div className="card-header">
                            <h5>Danh sách thương hiệu</h5>
                        </div>
                    </div>
                </Container>
            </>
        </Layout>
    );
}

export default Index;
