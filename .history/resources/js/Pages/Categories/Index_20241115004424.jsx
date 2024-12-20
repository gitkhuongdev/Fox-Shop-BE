import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Notyf } from "notyf";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "notyf/notyf.min.css";
import axios from "axios";
import Swal from "sweetalert2";
import Container from "@mui/material/Container";
function Index({ categories }) {
    const [category, setCategory] = useState("");
    const [data, setData] = useState(categories);
    const [show, setShow] = useState(false);
    const [images, setImages] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [position, setPosition] = useState(0);
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
                className: "notyf-error",
                dismissible: true,
            },
            {
                type: "success",
                background: "green",
                color: "white",
                duration: 2000,
                className: "notyf-success",
                dismissible: true,
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
            width: 40,
            renderCell: (params) => params.rowIndex,
        },
        {
            field: "name",
            headerName: "Tên danh mục",
            width: 200,
            editable: true,
        },
        {
            field: "images",
            headerName: "Hình ảnh",
            width: 200,
            editable: true,
            renderCell: (params) => (
                <img
                    src={params.value}
                    alt="Product Image"
                    style={{ width: "40px" }}
                />
            ),
        },
        { field: "position", headerName: "Thứ tự", width: 65, editable: true },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            valueGetter: (params) => formatCreatedAt(params),
        },
        {
            field: "editLink",
            headerName: "Sửa",
            width: 70,
            renderCell: (params) => {
                const categoryId = params.row.id;
                return (
                    <a
                        className="btn btn-sm btn-warning"
                        href={`/admin/categories/${categoryId}`}
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
                const categoryId = params.row.id;
                return (
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => handleDelete(categoryId)}
                    >
                        Xóa
                    </button>
                );
            },
        },
    ];
    const handleDelete = (categoryId) => {
        Swal.fire({
            icon: "question",
            text: "Xóa danh mục này ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Đúng",
            denyButtonText: `Không`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete("/admin/categories/" + categoryId).then((res) => {
                    if (res.data.check == true) {
                        setTimeout(() => {
                            notyf.success("Đã xóa thành công");
                        }, 17000);
                        window.location.replace("/admin/categories");
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

    const submitCategory = () => {
        const formData = new FormData();
        if (images) {
            formData.append("images", images);
        }
        formData.append("name", category);
        formData.append("position", Number(position));
        console.log(formData);

        axios
            .post("/admin/categories", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                if (res.data.check === true) {
                    notyf.open({
                        type: "success",
                        message: "Đã thêm thành công",
                    });
                    setData(res.data.data);
                    setShow(false);
                    setCategory("");
                    setImages([]);
                } else if (res.data.check === false) {
                    notyf.open({
                        type: "error",
                        message: res.data.msg,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                notyf.open({
                    type: "error",
                    message: "Đã có lỗi xảy ra. Vui lòng thử lại.",
                });
            });
    };
    const resetCreate = () => {
        setCategory("");
        setPosition(0);
        setImages([]); // Reset ảnh
        setShow(true);
    };
    const handleCellEditStop = (id, field, value) => {
        if (value == "") {
            Swal.fire({
                icon: "question",
                text: "Bạn muốn xóa loại sản phẩm này ?",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: "Đúng",
                denyButtonText: `Không`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    axios.delete("/admin/categories/" + id).then((res) => {
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
                    `/admin/categories/${id}`,
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
                            message: "Chỉnh sửa loại sản phẩm thành công",
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
                            <Modal.Title>Tạo mới danh mục</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <label htmlFor="">Loại sản phẩm</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tên Danh mục"
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            <label htmlFor="">Thứ tự</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Thứ tự"
                                onChange={(e) => setPosition(e.target.value)}
                            />
                            <label htmlFor="">Hình ảnh</label>
                            <input
                                type="file"
                                className="form-control"
                                multiple
                                onChange={(e) => setImages(e.target.files[0])}
                            />
                            {images.length > 0 && (
                                <div>
                                    <>Hình ảnh đã chọn:</>
                                    <div className="d-flex">
                                        {images.map((image, index) => (
                                            <img
                                                key={index}
                                                src={URL.createObjectURL(image)}
                                                alt="preview"
                                                width="100"
                                                height="100"
                                                className="m-2"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Đóng
                            </Button>
                            <Button
                                variant="primary text-light"
                                disabled={
                                    category == "" || position == 0
                                        ? true
                                        : false
                                }
                                onClick={(e) => submitCategory()}
                            >
                                Tạo mới
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container-fluid p-0">
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
                                            Thêm mới danh mục
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </Container>
                <div className="row">
                    {/* <div className="flex">
                        <h3 className="p-3">Danh sách danh mục</h3>
                    </div>
                    <div className="col-md-9">
                        {data && data.length > 0 && (
                            <Box sx={{ height: 500 }}>
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
                    </div> */}
                    <Container>
                        <div className="card">
                            <div className="card-header text-center fs-4">
                                DANH SÁCH DANH MỤC
                            </div>
                        </div>
                    </Container>
                </div>
            </>
        </Layout>
    );
}

export default Index;
