import JoditEditor from "jodit-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import axios from "axios";
import { Notyf } from "notyf";
import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import Modal from "react-bootstrap/Modal";
import "notyf/notyf.min.css";
import CKEditor from "../../components/CKEditor";
import QuillEditor from "../../components/Quill";
import Swal from "sweetalert2";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useTheme } from "@mui/material/styles";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Quill from "quill";
import Container from "@mui/material/Container";

function Edit({
    dataId,
    dataBrand,
    dataCate,
    dataproduct,
    datagallery,
    dataimage,
    dataColor,
    dataSize,
    cate,
    dataQuantity,
    selectedAttributes,
}) {
    const [id, setId] = useState(dataId);
    const [show, setShow] = useState(false);
    const [categories, setCategories] = useState(dataCate);
    const [category, setCategory] = useState(cate);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [brands, setBrands] = useState(dataBrand);
    const [gallery, setGallery] = useState(datagallery);
    const [image, setImage] = useState(dataimage);
    const [product, setProduct] = useState(dataproduct);
    const [files, setFiles] = React.useState([]);
    const [color, setColor] = useState(dataColor);
    const [size, setSize] = useState(dataSize);

    const REACT_APP_API_IMG_URL = "";
    useEffect(() => {
        var arr = [];
        dataproduct.categories.forEach((el) => {
            arr.push(el.id);
        });
        setCategory(arr);
        var colorsArr = [];
        var sizesArr = [];
        dataproduct.attributes.forEach((attribute) => {
            if (attribute.type === "color") {
                colorsArr.push(attribute.id);
            } else if (attribute.type === "size") {
                sizesArr.push(attribute.id);
            }
        });
        setSelectedColors(colorsArr);
        setSelectedSizes(sizesArr);
    }, []);
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setCategory(typeof value === "string" ? value.split(",") : value);
    };
    const handleColorChange = (event) => {
        const value = parseInt(event.target.value);
        setSelectedColors((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };

    // Hàm xử lý khi chọn size
    const handleSizeChange = (event) => {
        const value = parseInt(event.target.value);
        setSelectedSizes((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        );
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
        console.log(product);
    };
    const updateFiles = (incommingFiles) => {
        setFiles(incommingFiles);
    };
    const config = {
        height: "400px",
    };
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
    const handleRemoveImage = (index) => {
        const path = gallery[index].split("/");
        const imageName = path[3];
        const check = window.confirm("Delete this image");
        if (check) {
            axios
                .delete("/admin/products/drop-image/" + id + "/" + imageName, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        Accept: "application/json",
                    },
                })
                .then((res) => {
                    if (res.data.check == true) {
                        setGallery(res.data.gallery);
                        notyf.open({
                            type: "success",
                            message: "Drop image successfully",
                        });
                    }
                });
        }
    };
    const uploadImage = () => {
        var formData = new FormData();
        files.forEach((file) => {
            formData.append("files[]", file.file);
        });
        axios
            .post("/admin/products/upload-images/" + id, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            })
            .then((res) => {
                if (res.data.check == true) {
                    notyf.open({
                        type: "success",
                        message: "Upload image successfully",
                    });
                    setGallery(res.data.result);
                    window.location.reload();
                } else if (res.data.check == false) {
                    if (res.data.msg) {
                        notyf.open({
                            type: "error",
                            message: res.data.msg,
                        });
                    }
                }
            })
            .catch((error) => {});
    };
    const handleSetProductImage = (index) => {
        const path = gallery[index].split("/");
        const imageName = path[3];
        axios
            .post(
                "/admin/products/set-image/" + id + "/" + imageName,
                {},
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
                if (res.data.check === true) {
                    setImage(res.data.result);
                    notyf.open({
                        type: "success",
                        message: "Set image successfully",
                    });
                }
            })
            .catch((error) => {
                console.error("Error setting image:", error);
                notyf.open({
                    type: "error",
                    message: "Failed to drop image",
                });
            });
    };

    const handleDelete = (e) => {
        Swal.fire({
            icon: "question",
            text: "Xóa sản phẩm này ?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Đúng",
            denyButtonText: `Không`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                axios.delete("/admin/products/" + dataId).then((res) => {
                    if (res.data.check == true) {
                        setTimeout(() => {
                            notyf.success("Đã xóa thành công");
                        }, 17000);
                        window.location.replace("/admin/products");
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

    const handleSubmit = () => {
        const updatedProduct = {
            ...product,
            categories: category,
            color: selectedColors,
            size: selectedSizes,
        };
        console.log("updatedProduct", updatedProduct);
        axios
            .put(`/admin/products/${id}`, updatedProduct, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    Accept: "application/json",
                },
            })
            .then((res) => {
                if (res.data.check == true) {
                    window.location.replace("/admin/products");
                } else if (res.data.check == false) {
                    if (res.data.msg) {
                        notyf.open({
                            type: "error",
                            message: res.data.msg,
                        });
                    }
                }
            });
    };
    useEffect(() => {
        console.log("prosssduct", product); // In ra product mỗi khi nó thay đổi
    }, [product]);
    // console.log("product", dataproduct);
    return (
        <Layout>
            <Modal show={show} fullscreen={true} onHide={() => setShow(false)}>
                <Container>
                    <Modal.Header closeButton>
                        <Modal.Title>Thư viện ảnh</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row">
                            <div
                                className="col-md"
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fill, minmax(100px, 1fr))",
                                    gap: "10px",
                                }}
                            >
                                {gallery.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            marginTop: "10px",
                                        }}
                                    >
                                        <img
                                            src={REACT_APP_API_IMG_URL + item}
                                            alt={`Prevtretreiew ${index}`}
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                marginBottom: "5px",
                                            }}
                                        />
                                        <button
                                            className="btn btn-danger btn-sm w-100"
                                            onClick={() =>
                                                handleRemoveImage(index)
                                            }
                                        >
                                            Xoá
                                        </button>
                                        <button
                                            className="btn btn-success btn-sm w-100 mt-2"
                                            onClick={() =>
                                                handleSetProductImage(index)
                                            }
                                        >
                                            Mặc định
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Modal.Body>
                </Container>
            </Modal>
            {/* ===================================================== */}
            <Container>
                <div className="row">
                    <div className="col-md-12">
                        <div class="card border-0 ps-2 shadow">
                            <div className="card-header text-center">
                                <h4>Chỉnh sửa sản phẩm</h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-4">
                                        <h5>Thông tin sản phẩm</h5>
                                        <div className="row mt-3">
                                            <label>Tên sản phẩm:</label>
                                            <input
                                                type="text"
                                                className="form-control ms-3"
                                                name="name"
                                                value={product.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="row mt-3">
                                            <label>Giá sản phẩm:</label>
                                            <input
                                                type="number"
                                                className="form-control ms-3"
                                                name="price"
                                                value={product.price}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="row mt-3">
                                            <label>Giảm giá:</label>
                                            <input
                                                type="number"
                                                className="form-control ms-3"
                                                name="discount"
                                                value={product.discount}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-4"></div>
                                    <div className="col-4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9">
                        <div className="row">
                            <div className="col-md-3">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={product.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label>Price:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={product.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label>Discount:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="discount"
                                    value={product.discount}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label>Tồn kho:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="in_stock"
                                    value={product.in_stock}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <label>Color:</label>
                                <FormGroup>
                                    {dataColor.map((color) => (
                                        <FormControlLabel
                                            key={color.id}
                                            control={
                                                <Checkbox
                                                    value={color.id}
                                                    checked={selectedColors.includes(
                                                        color.id
                                                    )}
                                                    onChange={handleColorChange}
                                                />
                                            }
                                            label={color.name}
                                        />
                                    ))}
                                </FormGroup>
                            </div>
                            <div className="col-md-4">
                                <label>Size:</label>
                                <FormGroup>
                                    {dataSize.map((size) => (
                                        <FormControlLabel
                                            key={size.id}
                                            control={
                                                <Checkbox
                                                    value={size.id}
                                                    checked={selectedSizes.includes(
                                                        size.id
                                                    )}
                                                    onChange={handleSizeChange}
                                                />
                                            }
                                            label={size.name}
                                        />
                                    ))}
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-4">
                                <label>Danh mục sản phẩm:</label>
                                <FormControl fullWidth>
                                    <InputLabel id="category-select-label"></InputLabel>
                                    <Select
                                        labelId="category-select-label"
                                        id="category-select"
                                        name="categories"
                                        multiple
                                        value={category}
                                        onChange={handleChange}
                                        renderValue={(selected) => {
                                            // Tìm tên danh mục dựa trên ID đã chọn
                                            const selectedNames = selected.map(
                                                (id) => {
                                                    const found =
                                                        categories.find(
                                                            (item) =>
                                                                item.id === id
                                                        );
                                                    return found
                                                        ? found.name
                                                        : "";
                                                }
                                            );
                                            return selectedNames.join(", ");
                                        }}
                                    >
                                        {categories.map((item) => (
                                            <MenuItem
                                                key={item.id}
                                                value={item.id}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        category.indexOf(
                                                            item.id
                                                        ) > -1
                                                    }
                                                    readOnly
                                                />{" "}
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-md-4">
                                <label>Brands:</label>
                                <select
                                    name="id_brand"
                                    className="form-control"
                                    value={product.id_brand}
                                    onChange={handleInputChange}
                                >
                                    <option value="0" disabled>
                                        Choose a Brand
                                    </option>
                                    {brands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <br />
                                <button
                                    className="btn btn-sm btn-warning"
                                    onClick={(e) => setShow(true)}
                                >
                                    Show images
                                </button>
                            </div>
                        </div>
                        <div className="row mb-2 mt-2">
                            <div className="col-md-7">
                                <Dropzone
                                    onChange={updateFiles}
                                    accept="image/*"
                                    value={files}
                                >
                                    {files.map((file) => (
                                        <FileMosaic {...file} preview />
                                    ))}
                                </Dropzone>
                                <button
                                    onClick={(e) => uploadImage()}
                                    className="btn btn-sm btn-primary"
                                >
                                    Upload
                                </button>
                            </div>
                            <div className="col-md">
                                <img
                                    style={{ height: "200px", width: "auto" }}
                                    src={REACT_APP_API_IMG_URL + image}
                                    className="img-fluid"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <QuillEditor
                                value={product.content}
                                onBlur={(newContent) =>
                                    setProduct({
                                        ...product,
                                        content: newContent,
                                    })
                                }
                            />
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmit}
                                >
                                    Lưu thông tin
                                </button>
                                <button
                                    className="btn btn-danger ms-3"
                                    onClick={(e) => handleDelete()}
                                >
                                    Xóa sản phẩm
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
