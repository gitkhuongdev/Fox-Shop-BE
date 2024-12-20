import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Notyf } from "notyf";
import { Form } from "react-bootstrap";
import "notyf/notyf.min.css";

function Edit({ category }) {
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [fileImg, setFileImg] = useState([]);
    const [showImg, setShowImg] = useState(true);
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
    const changeImage = (e) => {
        setFileImg(Array.from(e.target.files));
        setShowImg(false);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("position", position);
        if (fileImg.length > 0) {
            formData.append("images", ...fileImg);
        }
        console.log(...formData);

        axios
            .post("/admin/categories/imgaes/" + category.id, formData)
            .then((res) => {
                if (res.data.check === true) {
                    notyf.open({
                        type: "success",
                        message: "Đã chỉnh sửa thành công",
                    });
                    window.location.href = "/admin/categories";
                } else {
                    notyf.open({
                        type: "error",
                        message: res.data.msg,
                    });
                }
            });
    };

    useEffect(() => {
        setName(category?.name);
        setPosition(category?.position);
        setFileImg(category?.images);
    }, [category]);
    return (
        <Layout>
            <div>
                <div className="container">
                    <h2>Chỉnh sửa danh mục</h2>

                    <form
                        onSubmit={handleSubmit}
                        enctype="multipart/form-data"
                        method="POST"
                    >
                        <div className="row">
                            <div className="col-6">
                                <div className="form-group">
                                    <label htmlFor="name">Tên danh mục</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name}
                                        name="name"
                                        placeholder="Tên danh mục"
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="name">Tên danh mục</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={position}
                                        name="name"
                                        onChange={(e) =>
                                            setPosition(e.target.value)
                                        }
                                        placeholder="Tên danh mục"
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <div>
                                    <label htmlFor="">Hình Ảnh</label>
                                    <br />
                                    {showImg === true && (
                                        <img
                                            className="mb-3"
                                            style={{ width: "100px" }}
                                            src={fileImg}
                                            alt=""
                                        />
                                    )}
                                    {showImg === false &&
                                        Array.isArray(fileImg) &&
                                        fileImg.length > 0 && (
                                            <div>
                                                <div className="d-flex">
                                                    {fileImg.map(
                                                        (file, index) => (
                                                            <img
                                                                key={index}
                                                                src={URL.createObjectURL(
                                                                    file
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
                                    <br />
                                    <button
                                        class="container-btn-file"
                                    >
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
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <button
                                type="submit"
                                // onClick={handleSubmit}
                                className="btn btn-primary"
                            >
                                Lưu danh mục
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default Edit;
