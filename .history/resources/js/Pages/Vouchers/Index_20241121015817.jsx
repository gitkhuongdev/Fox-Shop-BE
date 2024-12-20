import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Container from "@mui/material/Container";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { Table, Pagination } from "react-bootstrap";
import { Notyf } from "notyf";
import Swal from "sweetalert2";
import axios from "axios";
import "notyf/notyf.min.css";

function Index({ voucher }) {
    const [data, setData] = useState(voucher);
    const [code, setCode] = useState("");
    const [type, setType] = useState("percentage");
    const [value, setValue] = useState("");
    const [monney, setMonney] = useState("");
    const [limit, setLimit] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [create, setCreate] = useState(false);

    function switchVoucher(params, value) {
        axios
            .put(
                "/admin/vouchers/switch/" + params.id,
                { status: value },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        Accept: "application/json",
                    },
                }
            )
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
                    setData(res.data.data);
                }
            });
    }
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const date = today.getDate().toString().padStart(2, "0");

        return `${year}-${month}-${date}`; // Trả về định dạng YYYY-MM-DD
    };

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const date = getCurrentDate();
        console.log("Ngày hiện tại:", date);

        voucher.map((item) => {
            const startDate = formatDate(item.start_date);
            const endDate = formatDate(item.end_date);
            console.log("Ngày bắt đầu:", startDate);
            console.log("Ngày kết thúc:", endDate);

            if (date >= startDate && date <= endDate) {
                if (item.status === "inactive") {
                    console.log("Voucher đang inactive, chuyển thành active");
                    axios
                        .post(`/admin/vouchers/status/${item.id}`, {
                            status: "active",
                        })
                        .then((res) => {
                            if (res.data.check === true) {
                                console.log("Voucher đã được kích hoạt.");
                                setData(res.data.data);
                            } else {
                                console.log(res.data.err);
                            }
                        });
                }
            } else if (date < startDate || date > endDate) {
                if (item.status === "active") {
                    console.log("Voucher đang active, chuyển thành inactive");
                    axios
                        .post(`/admin/vouchers/status/${item.id}`, {
                            status: "inactive",
                        })
                        .then((res) => {
                            if (res.data.check === true) {
                                console.log("Voucher đã bị vô hiệu hóa.");
                                setData(res.data.data);
                            } else {
                                console.log(res.data.err);
                            }
                        });
                }
            } else if (item.usage_limit <= 0) {
                if (item.status === "active") {
                    console.log("Voucher đang active, chuyển thành inactive");
                    axios
                        .post(`/admin/vouchers/status/${item.id}`, {
                            status: "inactive",
                        })
                        .then((res) => {
                            if (res.data.check === true) {
                                console.log("Voucher đã bị vô hiệu hóa.");
                                setData(res.data.data);
                            } else {
                                console.log(res.data.err);
                            }
                        });
                }
            }
        });
    }, [voucher]);

    const columns = [
        {
            field: "id",
            headerName: "#",
            width: 40,
        },
        {
            field: "code",
            headerName: "Mã Voucher",
            width: 100,
            editable: true,
        },
        {
            field: "discount_type",
            headerName: "Loại Voucher",
            width: 100,
            editable: true,
        },
        {
            field: "discount_value",
            headerName: "Giá trị Voucher",
            width: 100,
            editable: true,
        },
        {
            field: "usage_limit",
            headerName: "Giới hạn",
            width: 100,
            editable: true,
        },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 100,
            // renderCell: (params) => (
            //     <Switch
            //         checked={params.value === 1}
            //         onChange={(e) =>
            //             switchVoucher(params, e.target.checked ? 1 : 0)
            //         }
            //         inputProps={{ "aria-label": "controlled" }}
            //     />
            // ),
            editable: true,
        },
        {
            field: "start_date",
            headerName: "Ngày bắt đầu",
            width: 100,
            editable: true,
        },
        {
            field: "end_date",
            headerName: "Ngày kết thúc",
            width: 100,
            editable: true,
        },
        {
            field: "editLink",
            headerName: "Sửa",
            width: 100,
            renderCell: (params) => {
                const vouchId = params.row.id;
                return (
                    <a
                        className="btn btn-sm btn-warning"
                        href={`/admin/vouchers/${vouchId}`}
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
                const vouchId = params.row.id;
                return (
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => handleDelete(vouchId)}
                    >
                        Xóa
                    </button>
                );
            },
        },
    ];
    const handleDelete = (vouchId) => {
        Swal.fire({
            icon: "question",
            text: "Xóa Voucher này ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Đúng",
            denyButtonText: `Không`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete("/admin/vouchers/" + vouchId).then((res) => {
                    if (res.data.check == true) {
                        setTimeout(() => {
                            notyf.success("Đã xóa thành công");
                        }, 17000);
                        window.location.replace("/admin/vouchers");
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
                duration: 1000,
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
    const handleSubmit = () => {
        if (code === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập mã Voucher",
            });
        } else if (type === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập loại Voucher",
            });
        } else if (value === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập Giá trị Voucher",
            });
        } else if (monney === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập mệnh giá áp dụng Voucher",
            });
        } else if (start === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập ngày bắt đầu Voucher",
            });
        } else if (end === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập ngày kết thúc Voucher",
            });
        } else if (limit === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập giới hạn lượt dùng Voucher",
            });
        } else if (new Date(start) > new Date(end)) {
            notyf.open({
                type: "error",
                message: "Ngày bắt đầu không được lớn hơn ngày kết thúc",
            });
        } else {
            var formData = new FormData();
            formData.append("code", code);
            formData.append("type", type);
            formData.append("value", value);
            formData.append("monney", monney);
            formData.append("start", start);
            formData.append("end", end);
            formData.append("limit", limit);
            axios.post("/admin/vouchers", formData).then((res) => {
                if (res.data.check === true) {
                    notyf.open({
                        type: "success",
                        message: "Đã tạo thành công",
                    });
                    setCreate(false);
                    setData(res.data.data);
                    window.location.reload();
                } else if (res.data.check === false) {
                    notyf.open({
                        type: "error",
                        message: res.data.msg,
                    });
                }
            });
        }
    };
    const handleCreate = () => {
        setCreate(true);
    };
    const handleCancel = () => {
        setCreate(false);
    };
    return (
        <>
            <Layout>
                <div>
                    {create === true && (
                        <Container>
                            <div className="card border-0 shadow">
                                <div className="card-header">
                                    <div className="text-uppercase text-center">
                                        <h4>Thêm mới Voucher</h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="form-group">
                                            <label htmlFor="">Mã Voucher</label>
                                            <input
                                                onChange={(e) =>
                                                    setCode(e.target.value)
                                                }
                                                name="code"
                                                className="form-control"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group mt-3">
                                                <label htmlFor="">
                                                    Loại Voucher
                                                </label>
                                                <select
                                                    onChange={(e) =>
                                                        setType(e.target.value)
                                                    }
                                                    name="type"
                                                    id=""
                                                    value={type}
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
                                                <label htmlFor="">
                                                    Giá trị Voucher
                                                </label>
                                                <input
                                                    onChange={(e) =>
                                                        setValue(e.target.value)
                                                    }
                                                    name="value"
                                                    className="form-control"
                                                    type="number"
                                                />
                                            </div>
                                            <div className="form-group mt-3">
                                                <label htmlFor="">
                                                    Mệnh giá áp dụng Voucher
                                                </label>
                                                <input
                                                    onChange={(e) =>
                                                        setMonney(
                                                            e.target.value
                                                        )
                                                    }
                                                    name="monney"
                                                    className="form-control"
                                                    type="number"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group mt-3">
                                                <label htmlFor="">
                                                    Giới hạn Voucher
                                                </label>
                                                <input
                                                    onChange={(e) =>
                                                        setLimit(e.target.value)
                                                    }
                                                    name="limit"
                                                    className="form-control"
                                                    type="number"
                                                />
                                            </div>
                                            <div className="form-group mt-3">
                                                <label htmlFor="">
                                                    Ngày bắt đầu
                                                </label>
                                                <input
                                                    onChange={(e) =>
                                                        setStart(e.target.value)
                                                    }
                                                    name="start"
                                                    className="form-control"
                                                    type="date"
                                                />
                                            </div>
                                            <div className="form-group mt-3">
                                                <label htmlFor="">
                                                    Ngày kết thúc
                                                </label>
                                                <input
                                                    onChange={(e) =>
                                                        setEnd(e.target.value)
                                                    }
                                                    name="end"
                                                    className="form-control"
                                                    type="date"
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
                                                onClick={handleSubmit}
                                            >
                                                Tạo Voucher
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
                    )}
                    {create === false && (
                        <Container>
                            <div>
                                <div>
                                    <h3>Quản lý Vouchers</h3>
                                </div>
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleCreate}
                                    >
                                        Tạo mới Voucher
                                    </button>
                                </div>
                                <div>
                                    <div className="card mt-5">
                                        <div className="card-header text-center">
                                            <h5>Danh sách đơn hàng</h5>
                                        </div>
                                        <div className="card-body">
                                            <Table striped>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <input type="checkbox" />
                                                        </th>
                                                        <th>Mã voucher</th>
                                                        <th>Mã Code</th>
                                                        <th>Loại voucher</th>
                                                        <th>Giá trị</th>
                                                        <th>Số lượng</th>
                                                        <th>Trạng thái</th>
                                                        <th>Ngày bắt đầu</th>
                                                        <th>Ngày kết thúc</th>
                                                        <th>Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data &&
                                                        data.length > 0 &&
                                                        data.map((item) => (
                                                            <tr key={item.id}>
                                                                <td>
                                                                    <input type="checkbox" />
                                                                </td>
                                                                <td>
                                                                    {item.id}
                                                                </td>
                                                                <td>
                                                                    {item.code}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.discount_type
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.discount_value
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.usage_limit
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {item.status &&
                                                                    item.status ==
                                                                        "inactive" ? (
                                                                        <Badge bg="danger">
                                                                            Không
                                                                            hợp
                                                                            lệ
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge bg="primary">
                                                                            Hoạt
                                                                            động
                                                                        </Badge>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {formatDate(
                                                                        item.start_date
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {formatDate(
                                                                        item.end_date
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex">
                                                                        <div>
                                                                            <a
                                                                                className="btn btn-sm btn-warning"
                                                                                href={`/admin/vouchers/${item.id}`}
                                                                                
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
                                                                                onClick={() =>
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
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    )}
                </div>
            </Layout>
        </>
    );
}

export default Index;
