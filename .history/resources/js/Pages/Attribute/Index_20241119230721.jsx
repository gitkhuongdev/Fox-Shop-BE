import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Layout from "../../components/Layout";
import Box from "@mui/material/Box";
import Button from "react-bootstrap/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "@mui/material/Badge";
import { Table, Pagination } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { Notyf } from "notyf";
import axios from "axios";
import { render } from "react-dom";
function Index({ attributes }) {
    const style = {
        position: "absolute",
        top: "15%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        marginTop: 2,
        p: 4,
        paddingTop: 5,
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [attr, setAttr] = useState(attributes);
    const [colorInput, setColorInput] = useState("");
    const [name, setName] = useState("");
    const [sizeInput, setSizeInput] = useState("");
    const [selectedValue, setSelectedValue] = useState("");

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
    const handleChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value);
        console.log(value);
    };
    const handleColorChange = (event) => {
        setColorInput(event.target.value); // Cập nhật giá trị input màu sắc
    };
    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSizeChange = (event) => {
        setSizeInput(event.target.value); // Cập nhật giá trị input kích thước
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form

        const data = {
            attribute: selectedValue,
            value: selectedValue === "color" ? colorInput : sizeInput,
            name: name,
        };
        console.log(data);

        axios
            .post("/admin/attributes", data)
            .then((response) => {
                if (response.data.check === true) {
                    notyf.open({
                        type: "success",
                        message: "Đã thêm thành công",
                    });
                    setAttr(response.data.data);
                    handleClose();
                    setColorInput("");
                    setSizeInput("");
                    setSelectedValue("");
                    window.location.reload("/admin/attributes");
                } else if (response.data.check === false) {
                    notyf.open({
                        type: "error",
                        message: response.data.msg,
                    });
                }
            })
            .catch((error) => {
                console.error("Có lỗi xảy ra khi gửi dữ liệu:", error);
            });
    };
    const columns = [
        { field: "id", headerName: "ID", width: 90 },
        { field: "type", headerName: "Thuộc tính", width: 150 },
        { field: "name", headerName: "Tên thuộc tính", width: 150 },
        {
            field: "value",
            headerName: "Giá trị",
            width: 150,
            renderCell: (params) => {
                const { type, value } = params.row;
                return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {type === "color" ? (
                            <div
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: value,
                                    border: "1px solid #000",
                                    borderRadius: "2px",
                                    marginRight: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: "10px",
                                }}
                            />
                        ) : (
                            <span>{value}</span>
                        )}
                    </div>
                );
            },
        },
        {
            field: "editLink",
            headerName: "Sửa",
            width: 100,
            renderCell: (params) => {
                const attributeId = params.row.id;
                return (
                    <a
                        className="btn btn-sm btn-warning"
                        href={`/admin/attributes/${attributeId}`}
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
                const attributeId = params.row.id;
                return (
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={(e) => handleDelete(attributeId)}
                    >
                        Xóa
                    </button>
                );
            },
        },
    ];
    const handleDelete = (attributeId) => {
        Swal.fire({
            icon: "question",
            text: "Xóa thuộc tính này ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Đúng",
            denyButtonText: `Không`,
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete("/admin/attributes/" + attributeId).then((res) => {
                    if (res.data.check == true) {
                        setTimeout(() => {
                            notyf.success("Đã xóa thành công");
                        }, 17000);
                        window.location.replace("/admin/attributes");
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
    return (
        <Layout>
            <Container>
                <div>
                    <h3>Quản lý thuộc tính sản phẩm</h3>
                </div>
                <div className="row mt-3">
                    <Form inline>
                        <Row>
                            <Col xs="4">
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm kiếm thuộc tính"
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
                        <h5>Danh sách thuộc tính</h5>
                    </div>
                    <div className="card-body">
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>
                                        <input type="checkbox" />
                                    </th>
                                    <th>Mã thuộc tính</th>
                                    <th>Thuộc tính</th>
                                    <th>Tên thuộc tính</th>
                                    <th>Giá trị</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attr &&
                                    attr.length > 0 &&
                                    attr.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <input type="checkbox" />
                                            </td>
                                            <td>{item.id}</td>
                                            <td>{item.type}</td>
                                            <td>{item.name}</td>
                                            <td>
                                                {item.value &&
                                                item.type == "color" ? (
                                                    <div
                                                        style={{
                                                            width: "20px",
                                                            height: "20px",
                                                            backgroundColor:
                                                                item.value,
                                                            border: "1px solid #000",
                                                            borderRadius: "2px",
                                                            marginRight: "8px",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            marginTop: "10px",
                                                        }}
                                                    />
                                                ) : (
                                                    item.value
                                                )}
                                            </td>
                                            <td>
                                                <div className="d-flex">
                                                    <div>
                                                        <a
                                                            className="btn btn-sm btn-warning"
                                                            href={`/admin/attributes/${item.id}`}
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
                                                            onClick={(e) =>
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
            </Container>
            {/* <div>
                <Button onClick={handleOpen}>Tạo mới</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Thêm thuộc tính sản phẩm
                        </Typography>
                        <FormControl sx={{ m: 1, minWidth: 300 }} size="large">
                            <InputLabel id="demo-select-small-label">
                                Tên thuộc tính
                            </InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={selectedValue}
                                label="Age"
                                sx={{ minWidth: "100%" }}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Chọn thuộc tính</MenuItem>
                                <MenuItem value="color">Màu sắc</MenuItem>
                                <MenuItem value="size">Size</MenuItem>
                            </Select>
                            {selectedValue === "color" && (
                                <div>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            alignItems: "center",
                                            marginTop: "16px",
                                        }}
                                    >
                                        <input
                                            type="color" // Input kiểu màu
                                            value={colorInput}
                                            onChange={handleColorChange}
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                border: "none",
                                                padding: "0",
                                                cursor: "pointer",
                                            }}
                                        />
                                        <span
                                            style={{
                                                marginLeft: "10px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {colorInput}{" "}
                                        </span>
                                    </div>
                                    <div>
                                        <TextField
                                            label="Nhập tên thuộc tính"
                                            sx={{ mt: 2, width: "100%" }}
                                            onChange={handleNameChange}
                                            type="text"
                                            name=""
                                            id=""
                                        />
                                    </div>
                                </div>
                            )}
                            {selectedValue === "size" && (
                                <div>
                                    <TextField
                                        label="Nhập kích thước"
                                        value={sizeInput}
                                        onChange={handleSizeChange}
                                        sx={{ mt: 2, width: "100%" }}
                                    />
                                    <TextField
                                        label="Nhập tên thuộc tính"
                                        sx={{ mt: 2, width: "100%" }}
                                        onChange={handleNameChange}
                                        type="text"
                                        name=""
                                        id=""
                                    />
                                </div>
                            )}
                            {selectedValue === "" && (
                                <Typography
                                    variant="body2"
                                    sx={{ mt: 2, color: "red" }}
                                >
                                    {" "}
                                    Vui lòng chọn thuộc tính
                                </Typography>
                            )}
                        </FormControl>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
                        >
                            Success
                        </Button>
                    </Box>
                </Modal>
            </div>
            <div className="row">
                <div className="col-md-8">
                    {attributes && attributes.length > 0 && (
                        <Box sx={{ height: 400, width: "100%" }}>
                            <DataGrid
                                rows={attributes}
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
                                        e.target.value
                                    )
                                }
                            />
                        </Box>
                    )}
                </div>
            </div> */}
        </Layout>
    );
}

export default Index;
