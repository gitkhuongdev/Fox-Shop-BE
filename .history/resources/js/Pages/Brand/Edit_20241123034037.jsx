import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "@mui/material/Container";
import Form from "react-bootstrap/Form";

function Edit({ result }) {
    const [name, setName] = useState(result.name);
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
                        <button
                            type="button"
                            className="btn btn-primary mt-3"
                            // onClick={handleUpdate}
                        >
                            Lưu thuộc tính
                        </button>
                    </div>
                </Container>
            </Layout>
        </div>
    );
}

export default Edit;
