import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Container from "@mui/material/Container";
import QuillEditor from "../../components/Quill";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import Swal from "sweetalert2";
import { Notyf } from "notyf";
import axios from "axios";

function Edit({ attribute }) {
    console.log(attribute);
    const [data, setData] = useState(attribute);
    const [value, setValue] = useState(data.value);
    const [name, setName] = useState(data.name);
    return (
        <Layout>
            <>
                <Container>
                    <div className="card border-0 shadow w-50">
                        <div className="card-header">
                            <h4 className="text-uppercase text-center">
                                Chỉnh sửa thuộc tính
                            </h4>
                        </div>
                        <div className="card-body">
                            <div>
                                <h6>Chỉnh sửa thuộc tính: {data.type} </h6>
                            </div>
                            <div>
                                <label htmlFor="">Giá trị thuộc tính:</label>{" "}
                                <br />
                                <input
                                    type="color"
                                    name=""
                                    id=""
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="">Tên thuộc tính:</label> <br />
                                <input
                                    className="form-control"
                                    type="text"
                                    name="name"
                                    id=""
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="card-footer">
                            <div className="d-flex gap-3">
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleUpdate}
                                    >
                                        Lưu thuộc tính
                                    </button>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        // onClick={handleCancel}
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
