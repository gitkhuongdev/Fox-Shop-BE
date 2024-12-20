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
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Table, Pagination } from "react-bootstrap";
import Switch from "@mui/material/Switch";
function Index({ categories }) {
    const [category, setCategory] = useState("");
    const [data, setData] = useState(categories);
    const [show, setShow] = useState(false);
    const [images, setImages] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [searchQuery, setSearchQuery] = useState("");
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
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

    // Hàm xử lý khi nhấp vào tiêu đề cột
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Hàm sắp xếp dữ liệu
    const sortedData = [...data].sort((a, b) => {
        if (sortConfig.key) {
            const valueA = a[sortConfig.key];
            const valueB = b[sortConfig.key];
            if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
            if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });
    const renderSortArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "asc" ? " ▲" : " ▼";
        }
        return null;
    };
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
    console.log(currentData);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
    const handleChangeSwitch = (id) => {
        axios.post(`/admin/categories/switch/${id}`).then((res) => {
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
                .put(`/admin/categories/${id}`, {
                    [field]: value,
                })
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
                    <div>
                        <h3>Quản lý danh mục</h3>
                    </div>
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
                    <div className="row mt-3">
                        <Form inline>
                            <Row>
                                <Col xs="4">
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm danh mục"
                                        className=" mr-sm-2"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button type="submit">Tìm kiếm</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    <div className="row mt-3 p-3">
                        {data && data.length > 0 && (
                            <div className="card">
                                <div className="card-header text-center fs-4">
                                    DANH SÁCH DANH MỤC
                                </div>

                                <div className="card-body">
                                {searchQuery != "" ? ():()
                                }
                                    {filteredData && filteredData.length > 0 ? (
                                        <Table striped>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <input type="checkbox" />
                                                    </th>
                                                    <th
                                                        onClick={() =>
                                                            handleSort("id")
                                                        }
                                                    >
                                                        #{" "}
                                                        {renderSortArrow("id")}
                                                    </th>
                                                    <th>Hình ảnh</th>
                                                    <th
                                                        onClick={() =>
                                                            handleSort("name")
                                                        }
                                                    >
                                                        Tên{" "}
                                                        {renderSortArrow(
                                                            "name"
                                                        )}
                                                    </th>
                                                    <th>Slug</th>
                                                    <th
                                                        onClick={() =>
                                                            handleSort("status")
                                                        }
                                                    >
                                                        Trạng thái{" "}
                                                        {renderSortArrow(
                                                            "status"
                                                        )}
                                                    </th>
                                                    <th>Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredData.map(
                                                    (item, index) => (
                                                        <tr key={item.id}>
                                                            <td>
                                                                <input type="checkbox" />
                                                            </td>
                                                            <td>
                                                                {indexOfFirstItem +
                                                                    index +
                                                                    1}
                                                            </td>
                                                            <td>
                                                                <img
                                                                    src={
                                                                        item.images
                                                                    }
                                                                    alt={
                                                                        item.name
                                                                    }
                                                                    style={{
                                                                        width: "50px",
                                                                        height: "50px",
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>{item.name}</td>
                                                            <td>{item.slug}</td>
                                                            <td>
                                                                <Switch
                                                                    checked={
                                                                        item.status ===
                                                                        1
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
                                                                            href={`/admin/categories/${item.id}`}
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
                                                                            onClick={(
                                                                                e
                                                                            ) =>
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
                                                    )
                                                )}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <>
                                            <Table striped>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <input type="checkbox" />
                                                        </th>
                                                        <th
                                                            onClick={() =>
                                                                handleSort("id")
                                                            }
                                                        >
                                                            #{" "}
                                                            {renderSortArrow(
                                                                "id"
                                                            )}
                                                        </th>
                                                        <th>Hình ảnh</th>
                                                        <th
                                                            onClick={() =>
                                                                handleSort(
                                                                    "name"
                                                                )
                                                            }
                                                        >
                                                            Tên{" "}
                                                            {renderSortArrow(
                                                                "name"
                                                            )}
                                                        </th>
                                                        <th>Slug</th>
                                                        <th
                                                            onClick={() =>
                                                                handleSort(
                                                                    "status"
                                                                )
                                                            }
                                                        >
                                                            Trạng thái{" "}
                                                            {renderSortArrow(
                                                                "status"
                                                            )}
                                                        </th>
                                                        <th>Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentData.map(
                                                        (item, index) => (
                                                            <tr key={item.id}>
                                                                <td>
                                                                    <input type="checkbox" />
                                                                </td>
                                                                <td>
                                                                    {indexOfFirstItem +
                                                                        index +
                                                                        1}
                                                                </td>
                                                                <td>
                                                                    <img
                                                                        src={
                                                                            item.images
                                                                        }
                                                                        alt={
                                                                            item.name
                                                                        }
                                                                        style={{
                                                                            width: "50px",
                                                                            height: "50px",
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {item.name}
                                                                </td>
                                                                <td>
                                                                    {item.slug}
                                                                </td>
                                                                <td>
                                                                    <Switch
                                                                        checked={
                                                                            item.status ===
                                                                            1
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
                                                                                href={`/admin/categories/${item.id}`}
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
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
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
                                                        )
                                                    )}
                                                </tbody>
                                            </Table>
                                            <Pagination className="justify-content-center">
                                                <Pagination.First
                                                    onClick={() =>
                                                        handlePageChange(1)
                                                    }
                                                    disabled={currentPage === 1}
                                                />
                                                <Pagination.Prev
                                                    onClick={() =>
                                                        handlePageChange(
                                                            currentPage - 1
                                                        )
                                                    }
                                                    disabled={currentPage === 1}
                                                />
                                                {[
                                                    ...Array(totalPages).keys(),
                                                ].map((page) => (
                                                    <Pagination.Item
                                                        key={page + 1}
                                                        active={
                                                            page + 1 ===
                                                            currentPage
                                                        }
                                                        onClick={() =>
                                                            handlePageChange(
                                                                page + 1
                                                            )
                                                        }
                                                    >
                                                        {page + 1}
                                                    </Pagination.Item>
                                                ))}
                                                <Pagination.Next
                                                    onClick={() =>
                                                        handlePageChange(
                                                            currentPage + 1
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                        totalPages
                                                    }
                                                />
                                                <Pagination.Last
                                                    onClick={() =>
                                                        handlePageChange(
                                                            totalPages
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                        totalPages
                                                    }
                                                />
                                            </Pagination>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Container>
            </>
        </Layout>
    );
}

export default Index;
