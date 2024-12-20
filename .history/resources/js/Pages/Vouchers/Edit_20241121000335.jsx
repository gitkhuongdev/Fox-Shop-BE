import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Container } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { Notyf } from "notyf";
import axios from "axios";

function Edit({ vouchers }) {
    console.log(vouchers);
    const [code, setCode] = useState(vouchers.code);
    const [type, setType] = useState(vouchers.discount_type);
    const [value, setValue] = useState(vouchers.discount_value);
    const [monney, setMonney] = useState(vouchers.minimum_monney);
    const [limit, setLimit] = useState(vouchers.usage_limit);
    const [start, setStart] = useState(vouchers.start_date);
    const [end, setEnd] = useState(vouchers.end_date);
    console.log(start,end)
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

    const handleCancel = () => {
        window.location.href = "/admin/vouchers";
    };

    const handleUpdateVoucher = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("code", code);
        formData.append("type", type);
        formData.append("value", value);
        formData.append("monney", monney);
        formData.append("limit", limit);
        formData.append("start", start);
        formData.append("end", end);
        axios
            .post("/admin/voucher/update/" + vouchers.id, formData)
            .then((res) => {
                if (res.data.check === true) {
                    notyf.open({
                        type: "success",
                        message: "Đã chỉnh sửa Voucher",
                    });
                    window.location.href = "/admin/vouchers";
                } else if (res.data.check === false) {
                    notyf.open({
                        type: "error",
                        message: "Đã xảy ra lỗi ",
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
            <Container>
                <div className="card border-0 shadow">
                    <div className="card-header">
                        <div className="text-uppercase text-center">
                            <h4>Chỉnh sửa Voucher</h4>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="form-group">
                                <label htmlFor="">Mã Voucher</label>

                                <input
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    type="text"
                                    name="code"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group mt-3">
                                    <label htmlFor="">Loại Voucher</label>
                                    <select
                                        name="type"
                                        id=""
                                        value={type}
                                        onChange={(e) =>
                                            setType(e.target.value)
                                        }
                                    >
                                        <option value="percentage">
                                            Phần trăm
                                        </option>
                                        <option value="fixed">
                                            Tiền cố định
                                        </option>
                                    </select>
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="">Giá trị Voucher</label>
                                    <input
                                        value={value}
                                        onChange={(e) =>
                                            setValue(e.target.value)
                                        }
                                        type="number"
                                        name="value"
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="">Mệnh giá áp dung</label>
                                    <input
                                        value={monney}
                                        onChange={(e) =>
                                            setMonney(e.target.value)
                                        }
                                        type="number"
                                        name="monney"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="">Giới hạn Voucher</label>
                                    <input
                                        value={limit}
                                        onChange={(e) =>
                                            setLimit(e.target.value)
                                        }
                                        type="number"
                                        name="limit"
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="">Ngày bắt đầu</label>
                                    <input
                                        value={start}
                                        onChange={(e) =>
                                            setStart(e.target.value)
                                        }
                                        type="date"
                                        name="start"
                                        className="form-control"
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="">Ngày kết thúc</label>
                                    <input
                                        value={end}
                                        onChange={(e) => setEnd(e.target.value)}
                                        type="date"
                                        name="end"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="d-flex gap-3">
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdateVoucher}
                                >
                                    Lưu Voucher
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
        </Layout>
    );
}
export default Edit;
