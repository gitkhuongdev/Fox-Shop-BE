import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "@mui/material/Container";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
function Edit({ result }) {
    const [name, setName] = useState(result.name);
    const handleUpdate = (e) =>{
        e.preventDefault();
        axios
        .put("/admin/brands/" + result.id, {name: name})
        .then((res)=>{
            if (res.data.check === true) {
                notyf.open({
                    type: "success",
                    message: "Đã chỉnh sửa thuộc tính",
                });
                window.location.href = "/admin/attributes";
            } else if (res.data.check === false) {
                notyf.open({
                    type: "error",
                    message: "Đã xảy ra lỗi vui lòng thử lại",
                });
            }
        })
    }
    return (
        <div>
            <Layout>
                <Container>
                    <div>
                        <h5>Chỉnh sửa thương hiệu</h5>
                    </div>
                    <div className="w-25">
                        <label htmlFor="">Tên thương hiệu:</label> <br />
                        <input
                            className="form-control"
                            type="text"
                            name="name"
                            id=""
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <div className="d-flex mt-3">
                            <button
                                type="button"
                                className="btn btn-primary"
                                // onClick={handleUpdate}
                            >
                                Lưu thay đổi
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger ms-3"
                                onClick={handleUpdate}
                            >
                                Huỷ thay đổi
                            </button>
                        </div>
                    </div>
                </Container>
            </Layout>
        </div>
    );
}

export default Edit;
