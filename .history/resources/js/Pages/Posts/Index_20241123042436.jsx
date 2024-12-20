import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Container from "@mui/material/Container";
import QuillEditor from "../../components/Quill";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { Table, Pagination } from "react-bootstrap";

function Index({ posts }) {
    const [postsList, setPostsList] = useState(posts);
    const [create, setCreate] = useState(false);
    const [image, setImage] = useState("");
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [short, setShort] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

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
    const columns = [
        {
            field: "id",
            headerName: "#",
            width: 40,
            renderCell: (params) => params.rowIndex,
        },
        {
            field: "title",
            headerName: "Tiêu đề",
            width: 300,
            editable: true,
        },
        {
            field: "start_date",
            headerName: "Ngày bắt đầu",
            width: 200,
            editable: true,
        },
        {
            field: "end_date",
            headerName: "Ngày kết thúc",
            width: 200,
            editable: true,
        },
        {
            field: "editLink",
            headerName: "Sửa",
            width: 100,
            renderCell: (params) => {
                const postId = params.row.id;
                return (
                    <a
                        className="btn btn-sm btn-warning"
                        href={`/admin/posts/${postId}`}
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
                const postId = params.row.id;
                return (
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => handleDelete(postId)}
                    >
                        Xóa
                    </button>
                );
            },
        },
    ];
    const handleDelete = (postId) => {
        Swal.fire({
            icon: "question",
            text: "Xóa bài viết này ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Đúng",
            denyButtonText: `Không`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete("/admin/posts/" + postId).then((res) => {
                    if (res.data.check == true) {
                        setTimeout(() => {
                            notyf.success("Đã xóa thành công");
                        }, 17000);
                        window.location.replace("/admin/posts");
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

    const changeImage = (e) => {
        setImage(Array.from(e.target.files));
    };
    const changeCreate = () => {
        setCreate(true);
    };
    const handleCreatePost = () => {
        if (title === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập tiêu đề bài viết",
            });
        } else if (short === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng điền mô tả ngắn bài viết",
            });
        } else if (start === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng điền ngày bắt đầu bài viết",
            });
        } else if (end === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng điền ngày kết thúc bài viết",
            });
        } else if (content === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng điền nội dung bài viết",
            });
        } else if (new Date(end) < new Date(start)) {
            notyf.open({
                type: "error",
                message: "Ngày kết thúc không thể sớm hơn ngày bắt đầu",
            });
        } else {
            var formData = new FormData();
            formData.append("image", image[0]);
            formData.append("content", content);
            formData.append("title", title);
            formData.append("short", short);
            formData.append("start", start);
            formData.append("end", end);
            axios
                .post("/admin/posts", formData)
                .then((res) => {
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
                })
                .catch((error) => {
                    notyf.open({
                        type: "error",
                        message: error,
                    });
                });
        }
        console.log("content", content, title, short, start, end, image[0]);
    };
    const handleCancel = () => {
        setCreate(false);
    };
    const handleChangeSwitch = (id) => {
        axios.post(`/admin/posts/switch/${id}`).then((res) => {
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(postsList.length / itemsPerPage);
    const currentData = postsList.slice(indexOfFirstItem, indexOfLastItem);
    // console.log(currentData);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <Layout>
            <div>
                {create === true && (
                    <>
                        <Container>
                            <div className="card border-0 shadow">
                                <div className="card-header">
                                    <h4 className="text-uppercase text-center">
                                        Thêm mới bài viết
                                    </h4>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label htmlFor="">
                                                    Tiêu đề bài viết:
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="title"
                                                    onChange={(e) =>
                                                        setTitle(e.target.value)
                                                    }
                                                />
                                            </div>
                                            <div className="form-group mt-3">
                                                <label htmlFor="">
                                                    Mô tả ngắn bài viết:
                                                </label>
                                                <textarea
                                                    name="short"
                                                    className="form-control"
                                                    id=""
                                                    onChange={(e) =>
                                                        setShort(e.target.value)
                                                    }
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="col-6">
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="">
                                                            Ngày bắt đầu:
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            type="date"
                                                            name="start"
                                                            onChange={(e) =>
                                                                setStart(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="form-group mt-3">
                                                        <label htmlFor="">
                                                            Ngày kết thúc:
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            type="date"
                                                            name="end"
                                                            onChange={(e) =>
                                                                setEnd(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label htmlFor="">
                                                            Hình ảnh:
                                                        </label>
                                                        <button class="container-btn-file">
                                                            Tải hình ảnh
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={
                                                                    changeImage
                                                                }
                                                                name="images"
                                                                id=""
                                                                className="mb-3"
                                                            />
                                                        </button>
                                                        {image.length > 0 && (
                                                            <div>
                                                                <div className="d-flex">
                                                                    {image.map(
                                                                        (
                                                                            img,
                                                                            index
                                                                        ) => (
                                                                            <img
                                                                                key={
                                                                                    index
                                                                                }
                                                                                src={URL.createObjectURL(
                                                                                    img
                                                                                )}
                                                                                alt={`preview-${index}`}
                                                                                width="100"
                                                                                height="100"
                                                                                className="m-2"
                                                                            />
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="">
                                            Nội dung bài viết:
                                        </label>
                                        <QuillEditor
                                            value={content}
                                            onBlur={setContent}
                                        />
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="d-flex gap-3">
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={handleCreatePost}
                                            >
                                                Tạo bài viết
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
                    </>
                )}
                {create === false && (
                    <Container>
                        <div>
                            <h3>Quản lý bài viết</h3>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="btn btn-primary mt-3"
                                onClick={changeCreate}
                            >
                                Tạo bài viết
                            </button>
                        </div>
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
                                            <th>Mã</th>
                                            <th>Hình ảnh</th>
                                            <th>Tiêu đề</th>
                                            <th>Nội dung ngắn</th>
                                            <th>Slug</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    {currentData && currentData.length > 0 && (
                                        <tbody>
                                            {currentData.map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <input type="checkbox" />
                                                    </td>
                                                    <td>{item.id}</td>
                                                    <td>
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            style={{
                                                                width: "50px",
                                                                height: "50px",
                                                            }}
                                                        />
                                                    </td>
                                                    <td>{item.title}</td>
                                                    <td>
                                                        {item.short_description}
                                                    </td>
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
                                    {[...Array(totalPages).keys()].map(
                                        (page) => (
                                            <Pagination.Item
                                                key={page + 1}
                                                active={
                                                    page + 1 === currentPage
                                                }
                                                onClick={() =>
                                                    handlePageChange(page + 1)
                                                }
                                            >
                                                {page + 1}
                                            </Pagination.Item>
                                        )
                                    )}
                                    <Pagination.Next
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                    />
                                    <Pagination.Last
                                        onClick={() =>
                                            handlePageChange(totalPages)
                                        }
                                        disabled={currentPage === totalPages}
                                    />
                                </Pagination>
                            </div>
                        </div>
                    </Container>
                    // <div>
                    //
                    //     <div>
                    //         <div className="mt-3">
                    //             <h4>Danh sách bài viết</h4>
                    //         </div>
                    //         <div className="col-md-12">
                    //             {postsList && postsList.length > 0 && (
                    //                 <Box sx={{ height: 500 }}>
                    //                     <DataGrid
                    //                         rows={postsList}
                    //                         columns={columns}
                    //                         initialState={{
                    //                             pagination: {
                    //                                 paginationModel: {
                    //                                     pageSize: 5,
                    //                                 },
                    //                             },
                    //                         }}
                    //                         pageSizeOptions={[5]}
                    //                         checkboxSelection
                    //                         disableRowSelectionOnClick
                    //                     />
                    //                 </Box>
                    //             )}
                    //         </div>
                    //     </div>
                    // </div>
                )}
            </div>
        </Layout>
    );
}

export default Index;
