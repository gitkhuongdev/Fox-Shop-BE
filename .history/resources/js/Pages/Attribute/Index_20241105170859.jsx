import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Layout from "../../components/Layout";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
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
        marginTop:2,
        p: 4,
        paddingTop:5,
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
            },
            {
                type: "success",
                background: "green",
                color: "white",
                duration: 2000,
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
            name : name,
        };
        console.log(data)

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
        { field: "name", headerName: "Thuộc tính", width: 150 },
        {
            field: "type",
            headerName: "Giá trị",
            width: 150,
            renderCell: (params) => {
                const { name, type } = params.row;
                return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {name === "color" ? (
                            <div
                                style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: type,
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
                            <span>{type}</span>
                        )}
                    </div>
                );
            },
        },
    ];
    return (
        <Layout>
            <div>
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
                <div className="col-md-7">
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
            </div>
        </Layout>
    );
}

export default Index;
