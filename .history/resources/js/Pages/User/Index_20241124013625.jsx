import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Box, Select, Switch, Typography } from "@mui/material";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import Container from "@mui/material/Container";
import { Table, Pagination } from "react-bootstrap";

function Index({ roles, users }) {
    // useEffect(() => {
    //     const storedUser = localStorage.getItem("user");
    //     if (storedUser) {
    //         try {
    //             const parsedUser = JSON.parse(storedUser);
    //             setUser(parsedUser);
    //             setUpdatedUser(parsedUser);
    //         } catch (error) {
    //             console.error("Failed to parse user data:", error);
    //         }
    //     } else {
    //         window.location.href = "/";
    //     }
    // }, []);
    const [show1, setShow1] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleClose1 = () => setShow1(false);
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [idRole, setIdRole] = useState(0);
    const [data, setData] = useState(users);
    const handleShow = () => setShow(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const resetCreate = () => {
        setName("");
        setEmail("");
        setIdRole(0);
        handleClose();
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
                background: "#7dd3e8",
                duration: 2000,
                className: "notyf-success",
                dismissible: true,
            },
        ],
    });
    const [idUser, setIdUser] = useState(0);

    const setEditRole = (idUser) => {
        setIdUser(idUser);
        setShow1(true);
    };
    const formatCreatedAt = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };
    const submitCreate = () => {
        if (name == "") {
            notyf.open({
                type: "error",
                message: "Username is required",
            });
        } else if (email == "") {
            notyf.open({
                type: "error",
                message: "Email is required",
            });
        } else if (idRole == 0) {
            notyf.open({
                type: "error",
                message: "Please choose a role",
            });
        } else {
            axios
                .post("/admin/users", {
                    name: name,
                    email: email,
                    idRole: idRole,
                })
                .then((res) => {
                    if (res.data.check == false) {
                        if (res.data.msg) {
                            notyf.open({
                                type: "error",
                                message: res.data.msg,
                            });
                        }
                    } else if (res.data.check == true) {
                        notyf.open({
                            type: "success",
                            message: "Create successfully",
                        });
                        resetCreate();
                        if (res.data.data) {
                            setData(res.data.data);
                            resetCreate();
                        } else {
                            setData([]);
                        }
                    }
                });
        }
    };
    function switchUser(id) {
        axios
            .post("/admin/users/switch" + id)
            .then((res) => {
                if (res.data.check == false) {
                    if (res.data.msg) {
                        notyf.open({
                            type: "error",
                            message: res.data.msg,
                        });
                    }
                } else if (res.data.check == true) {
                    notyf.open({
                        type: "success",
                        message: "Switch successfully",
                    });
                    if (res.data.data) {
                        setData(res.data.data);
                    } else {
                        setData([]);
                    }
                }
            });
    }
    const deleteUser = (id) => {
        Swal.fire({
            icon: "question",
            text: "Xóa tài khoản này ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Đúng",
            denyButtonText: `Không`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                axios.delete("/admin/users/" + id).then((res) => {
                    if (res.data.check == true) {
                        notyf.success("Đã xóa thành công");
                        setData(res.data.data);
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

    const submitEdit = () => {
        if (idRole == 0 || idUser == 0) {
            notyf.open({
                type: "error",
                message: "Data is missing",
            });
            console.log(idRole, idUser);
        } else {
            axios
                .put("/admin/users/" + idUser, {
                    idRole: idRole,
                })
                .then((res) => {
                    if (res.data.check == false) {
                        if (res.data.msg) {
                            notyf.open({
                                type: "error",
                                message: res.data.msg,
                            });
                        }
                    } else if (res.data.check == true) {
                        notyf.open({
                            type: "success",
                            message: "Create successfully",
                        });
                        const updatedUsers = res.data.data.map((user) => {
                            return {
                                ...user,
                                rolename: user.roles.name,
                            };
                        });
                        setData(updatedUsers);
                        setIdRole(0);
                        setShow1(false);
                    }
                });
        }
    };

    const columns = [
        {
            field: "id",
            headerName: "#",
            width: 100,
            renderCell: (params) => params.rowIndex,
        },
        {
            field: "name",
            headerName: "Tên tài khoản",
            width: 100,
            editable: true,
        },
        { field: "email", headerName: "Email", width: 200, editable: true },
        {
            field: "status",
            headerName: "Status",
            width: 70,
            renderCell: (params) => (
                <Switch
                    checked={params.value == 1}
                    onChange={(e) => switchUser(params, e.target.value)}
                    inputProps={{ "aria-label": "controlled" }}
                />
            ),
        },
        {
            field: "roleName",
            headerName: "Loại tài khoản",
            width: 130,
            renderCell: (params) => params.row.roles.name,
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            width: 200,
            valueGetter: (params) => formatCreatedAt(params),
        },
        {
            headerName: "Tùy chỉnh",
            width: 300,
            renderCell: (params) => (
                <>
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => setEditRole(params.id)}
                    >
                        Loại tài khoản
                    </button>
                    <button
                        className="btn btn-sm btn-danger ms-3"
                        onClick={() => deleteUser(params.id)}
                    >
                        Xóa
                    </button>
                </>
            ),
        },
    ];
    const handleCellEditStop = (id, field, params, value) => {
        let data = {
            field: value,
        };
        axios
            .put(`/admin/users/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            })
            .then((res) => {
                if (res.data.check == true) {
                    notyf.open({
                        type: "success",
                        message: "User is updated successfully",
                    });
                    setUsers(res.data.data);
                } else if (res.data.check == false) {
                    notyf.open({
                        type: "error",
                        message: res.data.msg,
                    });
                }
            });
    };
    useEffect(() => {}, []);
    return (
        <Layout>
            <>
                <Container>
                    <Modal show={show1} onHide={handleClose1}>
                        <Modal.Header closeButton>
                            <Modal.Title>Roles Modal</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <select
                                name=""
                                onChange={(e) => setIdRole(e.target.value)}
                                defaultValue={idRole}
                                className="form-control"
                            >
                                <option value="0" disabled>
                                    Choose a role
                                </option>
                                {roles &&
                                    roles.length > 0 &&
                                    roles.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleClose}
                            >
                                Close
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => submitEdit()}
                            >
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Tạo tài khoản</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <input
                                type="text"
                                placeholder={
                                    name == "" ? "Vui lòng nhập tên" : ""
                                }
                                value={name}
                                className="form-control mb-2"
                                onChange={(e) => setName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder={
                                    email == "" ? "Vui lòng nhập email " : ""
                                }
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control mb-2"
                            />
                            <select
                                defaultValue={idRole}
                                onChange={(e) => setIdRole(e.target.value)}
                                className="form-control"
                            >
                                <option value={0} disabled>
                                    Chọn quyền tài khoản
                                </option>
                                {roles &&
                                    roles.length > 0 &&
                                    roles.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleClose}
                            >
                                Đóng
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => submitCreate()}
                            >
                                Tạo tài khoản
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <div>
                        <div>
                            <h3>Quản lý đánh giá</h3>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-2">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={handleShow}
                                >
                                    Tạo tài khoản
                                </button>
                            </div>
                            <div className="card mt-5">
                                <div className="card-header text-center">
                                    <h5>Danh sách đánh giá</h5>
                                </div>
                                <div className="card-body">
                                    <Table striped>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <input type="checkbox" />
                                                </th>
                                                <th>Mã người dùng</th>
                                                <th>Email</th>
                                                <th>Loại tài khoản</th>
                                                <th>Ngày tạo</th>
                                                <th>Trạng thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData &&
                                                currentData.length > 0 &&
                                                currentData.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <input type="checkbox" />
                                                        </td>
                                                        <td>
                                                        {
                                                            item.id
                                                        }
                                                        </td>
                                                        <td>
                                                            <Switch
                                                                checked={
                                                                    item.status ===
                                                                    1
                                                                }
                                                                onChange={() =>
                                                                    switchUser(
                                                                        item.id
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
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
                                                handlePageChange(
                                                    currentPage - 1
                                                )
                                            }
                                            disabled={currentPage === 1}
                                        />
                                        {[...Array(totalPages).keys()].map(
                                            (page) => (
                                                <Pagination.Item
                                                    key={page + 1}
                                                    active={
                                                        page + 1 === currentPage
                                                    }
                                                    onClick={() =>
                                                        handlePageChange(
                                                            page + 1
                                                        )
                                                    }
                                                >
                                                    {page + 1}
                                                </Pagination.Item>
                                            )
                                        )}
                                        <Pagination.Next
                                            onClick={() =>
                                                handlePageChange(
                                                    currentPage + 1
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        />
                                        <Pagination.Last
                                            onClick={() =>
                                                handlePageChange(totalPages)
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        />
                                    </Pagination>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-9">
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
                                                params,
                                                e.target.value
                                            )
                                        }
                                    />
                                </Box>
                            )}
                        </div>
                    </div>
                </Container>
            </>
        </Layout>
    );
}

export default Index;
