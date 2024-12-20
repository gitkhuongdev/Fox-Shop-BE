import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "@mui/material/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Switch from "@mui/material/Switch";
import { Table, Pagination } from "react-bootstrap";

import { Notyf } from "notyf";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "notyf/notyf.min.css";
import axios from "axios";
import Swal from "sweetalert2";
function Index({ brands }) {
    const [loading, setLoading] = useState(true);
    const [brand, setBrand] = useState("");
    const [data, setData] = useState(brands);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
    // console.log(currentData);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleChangeSwitch = (id) => {
        axios.post(`/admin/brands/switch/${id}`).then((res) => {
            if (res.data.check == true) {
                window.location.reload();
                notyf.open({
                    type: "success",
                    message: "Chỉnh trạng thái thành công",
                });
            } else if (res.data.check == false) {
                notyf.open({
                    type: "error",
                    message: res.data.msg,
                });
            }
        });
    };
    const handleDelete = (brandsId) => {
        Swal.fire({
            icon: "question",
            text: "Xóa thương hiệu này ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Đúng",
            denyButtonText: `Không`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete("/admin/brands/" + brandsId).then((res) => {
                    if (res.data.check == true) {
                        setTimeout(() => {
                            notyf.success("Đã xóa thành công");
                        }, 17000);
                        window.location.replace("/admin/brands");
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
    return (
        <Layout>
            <>
                <Container>
                    <h3>Quản lý thương hiệu</h3>
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
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container-fluid ps-0">
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

                    <div className="row mt-3">
                        <Form inline>
                            <Row>
                                <Col xs="4">
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm thương hiệu"
                                        className=" mr-sm-2"
                                        // value={searchQuery}
                                        // onChange={handleSearch}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button type="submit">Tìm kiếm</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div className="card mt-5">
                        <div className="card-header text-center">
                            <h5>Danh sách thương hiệu</h5>
                        </div>
                        <div className="card-body">
                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>
                                            <input type="checkbox" />
                                        </th>
                                        <th>Mã thương hiệu</th>
                                        <th>Tên thương hiệu</th>
                                        <th>Slug</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                {console.log(data)}
                                {currentData && currentData.length > 0 && (
                                    <tbody>
                                        {currentData.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <input type="checkbox" />
                                                </td>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.slug}</td>
                                                <td>
                                                <Switch
                                                        checked={
                                                            item.status === 1
                                                        }
                                                        onChange={() =>
                                                            handleChangeSwitch(
                                                                item.id
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div>
                                                            <a
                                                                className="btn btn-sm btn-warning"
                                                                href={`/admin/brands/${item.id}`}
                                                            >
                                                                Sửa
                                                            </a>
                                                        </div>
                                                        <div className="p-2 pt-0 pb-0">
                                                            |
                                                        </div>
                                                        <div>
                                                            <button
                                                                className="btn btn-sm btn-danger"
                                                                onClick={(e) =>
                                                                    handleDelete(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                Xóa
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                )}
                            </Table>
                        </div>
                        <div className="card-footer">
                            <Pagination className="justify-content-center">
                                <Pagination.First
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                />
                                <Pagination.Prev
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                />
                                {[...Array(totalPages).keys()].map((page) => (
                                    <Pagination.Item
                                        key={page + 1}
                                        active={page + 1 === currentPage}
                                        onClick={() =>
                                            handlePageChange(page + 1)
                                        }
                                    >
                                        {page + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                />
                                <Pagination.Last
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </div>
                    </div>
                </Container>
            </>
        </Layout>
    );
}

export default Index;
