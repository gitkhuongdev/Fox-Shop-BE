import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Container from "@mui/material/Container";
import QuillEditor from "../../components/Quill";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { Notyf } from "notyf";
import axios from "axios";

function Edit({ post }) {
    const [content, setContent] = useState(post.content);
    const [title, setTitle] = useState(post.title);
    const [short, setShort] = useState(post.short_description);
    const [start, setStart] = useState(post.start_date);
    const [end, setEnd] = useState(post.end_date);
    const [image, setImage] = useState("");
    const [showImg, setShowImg] = useState(true);
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
    const changeImage = (e) => {
        setShowImg(false);
        const imageFiles = Array.from(e.target.files);
        console.log("imageFiles", imageFiles);
        setImage(imageFiles);
    };
    const handleCancel = () => {
        window.location.href = "/admin/posts";
    };
    const handleUpdatePost = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("short", short);
        formData.append("content", content);
        formData.append("start", start);
        formData.append("end", end);
        if (image.length > 0) {
            formData.append("image", image[0]);
        }
        axios
            .post("/admin/post/update/" + post.id, formData)
            .then((res) => {
                if (res.data.check === true) {
                    notyf.open({
                        type: "success",
                        message: "Đã chỉnh sửa cái bài viết",
                    });
                    window.location.href = "/admin/posts";
                } else if (res.data.check === false) {
                    notyf.open({
                        type: "error",
                        message: "Đã xảy ra lỗi vui lòng thử lại",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                notyf.open({
                    type: "error",
                    message: "Đã xảy ra lỗi vui lòng thử lại",
                });
            });
    };
    return (
        <Layout>
            <>
                <Container>
                    <div className="card border-0 shadow">
                        <div className="card-header">
                            <h4 className="text-uppercase text-center">
                                Chỉnh sửa bài viết
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
                                            value={title}
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
                                            value={short}
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
                                                    value={start}
                                                    onChange={(e) =>
                                                        setStart(e.target.value)
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
                                                    value={end}
                                                    onChange={(e) =>
                                                        setEnd(e.target.value)
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
                                                        onChange={changeImage}
                                                        name="images"
                                                        id=""
                                                        className="mb-3"
                                                    />
                                                </button>
                                                {showImg === true && (
                                                    <div>
                                                        <img
                                                            src={post.image}
                                                            alt="preview"
                                                            width="100"
                                                            height="100"
                                                            className="m-2"
                                                        />
                                                    </div>
                                                )}
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
                                <label htmlFor="">Nội dung bài viết:</label>
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
                                        onClick={handleUpdatePost}
                                    >
                                        Lưu bài viết
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
        </Layout>
    );
}

export default Edit;
