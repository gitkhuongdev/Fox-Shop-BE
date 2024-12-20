// eslint-disable
import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Notyf } from "notyf";
import { Box, Switch, Typography } from "@mui/material";
import "notyf/notyf.min.css";
import CKEditor from "../../components/CKEditor";
import QuillEditor from "../../components/Quill";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useTheme } from "@mui/material/styles";
import Swal from "sweetalert2";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import Container from "@mui/material/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Table, Pagination } from "react-bootstrap";
function Index({
    dataproducts,
    databrands,
    datacategories,
    datacolor,
    datasize,
}) {
    const [loading, setLoading] = useState(true);
    const [create, setCreate] = useState(false);
    const [categories, setCategories] = useState(datacategories);
    const [brands, setBrands] = useState(databrands);
    const [products, setProducts] = useState(dataproducts);
    const [searchQuery, setSearchQuery] = useState("");
    const ITEM_HEIGHT = 15;
    const ITEM_PADDING_TOP = 0;

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

    const formatCreatedAt = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };
    const formatPrice = (params) => {
        return new Intl.NumberFormat("en-US").format(params);
    };
    const formatDiscount = (params) => {
        return new Intl.NumberFormat("en-US").format(params);
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

    function switchProduct(id) {
        axios.put(`/admin/products/switch/${id}`).then((res) => {
            if (res.data.check == false) {
                if (res.data.msg) {
                    notyf.open({
                        type: "error",
                        message: res.data.msg,
                    });
                }
            } else if (res.data.check == true) {
                window.location.reload();
                notyf.open({
                    type: "success",
                    message: "Cập nhật trạng thái thành công",
                });
                setProducts(res.data.data);
            }
        });
    }
    useEffect(() => {
        products.map((item) => {
            console.log("sp", item.id);
            if (item.in_stock <= 0) {
                if (item.status == 1) {
                    axios
                        .post(`/admin/products/switch_qty/${item.id}`, {
                            status: "0",
                        })
                        .then((res) => {
                            if (res.data.check === true) {
                                console.log("sản phẩm ẩn.");
                                setData(res.data.data);
                                window.location.reload();
                            } else {
                                console.log(res.data.err);
                            }
                        });
                }
            }
        });
    }, []);
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [idCate, setIdCate] = useState(0);
    const [idBrand, setIdBrand] = useState(0);
    const [content, setContent] = useState("");
    const [cate, setCate] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const theme = useTheme();
    const [colors, setColor] = useState(datacolor);
    const [sizes, setSize] = useState(datasize);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSize, setSelectedSize] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const ChangeCreate = () => {
        if (create == false) {
            setCreate(true);
        } else {
            setCreate(false);
        }
    };
    const handleColorChange = (e, colorId) => {
        if (e.target.checked) {
            setSelectedColors([...selectedColors, colorId]);
        } else {
            setSelectedColors(selectedColors.filter((id) => id !== colorId));
        }
    };
    const handleSizeChange = (e, sizeId) => {
        if (e.target.checked) {
            setSelectedSize([...selectedSize, sizeId]);
        } else {
            setSelectedSize(selectedSize.filter((id) => id !== sizeId));
        }
    };
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setCate(typeof value === "string" ? value.split(",") : value);
    };

    const resetCreate = () => {
        setName("");
        setColor("");
        setSize("");
        setPrice(0);
        setQuantity(0);
        setDiscount(0);
        setIdCate(0);
        setIdBrand(0);
        setContent("");
        setSelectedFiles([]);
        setFilePreviews([]);
        setCreate(false);
        setSelectedColors([]);
        setSelectedSize([]);
    };

    const SubmitProduct = () => {
        if (name === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập tên sản phẩm",
            });
        } else if (selectedColors.length === 0) {
            notyf.open({
                type: "error",
                message: "Vui lòng chọn màu sắc cho sản phẩm",
            });
        } else if (price === 0) {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập giá sản phẩm",
            });
        } else if (quantity === 0) {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập số lượng sản phẩm",
            });
        } else if (categories.length === 0) {
            notyf.open({
                type: "error",
                message: "Vui lòng chọn danh mục cho sản phẩm",
            });
        } else if (idBrand === 0) {
            notyf.open({
                type: "error",
                message: "Vui lòng chọn thương hiệu sản phẩm",
            });
        } else if (content === "") {
            notyf.open({
                type: "error",
                message: "Vui lòng nhập mô tả sản phẩm",
            });
        } else if (selectedFiles.length === 0) {
            notyf.open({
                type: "error",
                message: "Vui lòng upload hình ảnh sản phẩm",
            });
        } else {
            var formData = new FormData();
            formData.append("name", name);
            formData.append("idCate", idCate);
            formData.append("idBrand", idBrand);
            formData.append("content", content);
            formData.append("discount", discount);
            formData.append("price", price);
            formData.append("quantity", quantity);
            console.log(selectedColors);
            // Kiểm tra selectedColors
            if (Array.isArray(selectedColors) && selectedColors.length > 0) {
                selectedColors.forEach((color) => {
                    if (color) {
                        formData.append("colors[]", color);
                    } else {
                        console.error("Màu sắc không hợp lệ:", color);
                    }
                });
            } else {
                console.error(
                    "selectedColors không phải là một mảng hợp lệ hoặc rỗng."
                );
            }

            console.log(selectedSize);
            if (Array.isArray(selectedSize) && selectedSize.length > 0) {
                selectedSize.forEach((size) => {
                    if (size) {
                        formData.append("sizes[]", size); // Thêm kích thước vào formData
                    } else {
                        console.error("Kích thước không hợp lệ:", size);
                    }
                });
            } else {
                console.error(
                    "selectedSize không phải là một mảng hợp lệ hoặc rỗng."
                );
            }

            selectedFiles.forEach((file) => {
                formData.append("files[]", file);
            });
            if (Array.isArray(cate) && cate.length > 0) {
                cate.forEach((id) => {
                    if (id) {
                        formData.append("categories[]", id);
                    } else {
                        console.error("Category không hợp lệ:", id);
                    }
                });
            } else {
                console.error(
                    "Categories không phải là một mảng hợp lệ hoặc rỗng."
                );
            }

            axios
                .post("/admin/products", formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        Accept: "application/json",
                    },
                })
                .then((res) => {
                    if (res.data.check === true) {
                        notyf.open({
                            type: "success",
                            message: "Them san pham thanh cong!",
                        });
                        setProducts(res.data.data);
                        resetCreate();
                        window.location.replace("/admin/products");
                    }
                })
                .catch((error) => {
                    notyf.open({
                        type: "error",
                        message: "Đã có lỗi xảy ra, vui lòng thử lại!",
                    });
                });
        }
    };

    const handleRemoveImage = (index) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);

        const updatedPreviews = [...filePreviews];
        updatedPreviews.splice(index, 1);
        setFilePreviews(updatedPreviews);
    };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);

        const previews = files.map((file) => URL.createObjectURL(file));
        setFilePreviews(previews);
    };
    const handleChangeSize = (event) => {
        setSelectedSize(event.target.value); // Cập nhật state với giá trị đã chọn
    };
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const currentData = products.slice(indexOfFirstItem, indexOfLastItem);
    console.log(currentData);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    //
    const itemsPerPageCZ = 5;
    const [currentPageSize, setCurrentPageSize] = useState(1);
    const [currentPageColor, setCurrentPageColor] = useState(1);
    const totalPagesSize = Math.ceil(sizes.length / itemsPerPageCZ);
    const totalPagesColor = Math.ceil(colors.length / itemsPerPageCZ);
    const paginatedSizes = sizes.slice(
        (currentPageSize - 1) * itemsPerPageCZ,
        currentPageSize * itemsPerPageCZ
    );

    const paginatedColors = colors.slice(
        (currentPageColor - 1) * itemsPerPageCZ,
        currentPageColor * itemsPerPageCZ
    );
    const handlePageChangeSize = (page) => {
        if (page >= 1 && page <= totalPagesSize) {
            setCurrentPageSize(page);
        }
    };

    const handlePageChangeColor = (page) => {
        if (page >= 1 && page <= totalPagesColor) {
            setCurrentPageColor(page);
        }
    };

    //
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    const filteredData = products.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setUpdatedUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse user data:", error);
            }
        } else {
            window.location.href = "/";
        }
        setLoading(false);
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <Layout>
                <Container>
                    <div className="row">
                        <div className="col-md">
                            <div>
                                <h3>Quản lý sản phẩm</h3>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-2">
                                    <button
                                        className="btn btn-sm btn-primary mb-3"
                                        onClick={(e) => ChangeCreate()}
                                    >
                                        Tạo mới sản phẩm
                                    </button>
                                </div>
                                <div className="col-md"></div>
                            </div>
                            {create == true && (
                                <>
                                    <div className="col-md-12">
                                        <div class="card border-0 ps-2 shadow">
                                            <div className="card-header text-center">
                                                <h4>Thêm sản phẩm mới</h4>
                                            </div>
                                            <div class="card-body">
                                                <div className="row">
                                                    <div className="col-4">
                                                        <h5>
                                                            Nhập thông tin sản
                                                            phẩm
                                                        </h5>
                                                        <div className="row mt-3">
                                                            <label>
                                                                Tên sản phẩm:
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control ms-3"
                                                                onChange={(e) =>
                                                                    setName(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="row mt-3">
                                                            <label>
                                                                Giá sản phẩm:
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="form-control ms-3"
                                                                onChange={(e) =>
                                                                    setPrice(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="row mt-3">
                                                            <label>
                                                                Giảm giá:
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="form-control ms-3"
                                                                onChange={(e) =>
                                                                    setDiscount(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="row mt-3">
                                                            <label>
                                                                Tồn kho :
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="form-control ms-3"
                                                                onChange={(e) =>
                                                                    setQuantity(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-4 p-5 pt-0 pb-0">
                                                        <h5>Chọn thuộc tính</h5>
                                                        <div className="row">
                                                            <label>
                                                                Danh mục sản
                                                                phẩm:
                                                            </label>
                                                            <FormControl
                                                                fullWidth
                                                            >
                                                                <InputLabel id="category-select-label">
                                                                    Chọn danh
                                                                    mục
                                                                </InputLabel>
                                                                <Select
                                                                    labelId="category-select-label"
                                                                    id="category-select"
                                                                    name="categories"
                                                                    multiple
                                                                    value={cate}
                                                                    onChange={
                                                                        handleChange
                                                                    }
                                                                    renderValue={(
                                                                        selected
                                                                    ) => {
                                                                        const selectedNames =
                                                                            selected.map(
                                                                                (
                                                                                    id
                                                                                ) => {
                                                                                    const found =
                                                                                        categories.find(
                                                                                            (
                                                                                                item
                                                                                            ) =>
                                                                                                item.id ===
                                                                                                id
                                                                                        );
                                                                                    return found
                                                                                        ? found.name
                                                                                        : "";
                                                                                }
                                                                            );
                                                                        return selectedNames.join(
                                                                            ", "
                                                                        );
                                                                    }}
                                                                >
                                                                    {categories.map(
                                                                        (
                                                                            item
                                                                        ) => (
                                                                            <MenuItem
                                                                                key={
                                                                                    item.id
                                                                                }
                                                                                value={
                                                                                    item.id
                                                                                }
                                                                            >
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={
                                                                                        cate.indexOf(
                                                                                            item.id
                                                                                        ) >
                                                                                        -1
                                                                                    }
                                                                                    readOnly
                                                                                />{" "}
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </MenuItem>
                                                                        )
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <label>
                                                                Thương hiệu sản
                                                                phẩm:
                                                            </label>
                                                            <select
                                                                name="brandId"
                                                                defaultValue={0}
                                                                className="form-control"
                                                                value={idBrand}
                                                                onChange={(e) =>
                                                                    setIdBrand(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                <option
                                                                    value="0"
                                                                    disabled
                                                                >
                                                                    Chọn thương
                                                                    hiệu
                                                                </option>
                                                                {brands.map(
                                                                    (brand) => (
                                                                        <option
                                                                            key={
                                                                                brand.id
                                                                            }
                                                                            value={
                                                                                brand.id
                                                                            }
                                                                        >
                                                                            {
                                                                                brand.name
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <div className="col-12">
                                                                <label htmlFor="">
                                                                    Kích cỡ:
                                                                </label>
                                                                <br />
                                                                <div className="checkbox">
                                                                    {paginatedSizes.map(
                                                                        (
                                                                            size
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    size.id
                                                                                }
                                                                            >
                                                                                <label>
                                                                                    <input
                                                                                        className="form-check-input"
                                                                                        style={{
                                                                                            marginRight:
                                                                                                "7px",
                                                                                            border: "1px solid #000",
                                                                                            borderRadius:
                                                                                                "0px",
                                                                                        }}
                                                                                        type="checkbox"
                                                                                        value={
                                                                                            size.id
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleSizeChange(
                                                                                                e,
                                                                                                size.id
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                    {
                                                                                        size.name
                                                                                    }
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>

                                                                {/* Pagination for sizes */}
                                                                <Pagination className="justify-content-center mt-3">
                                                                    <Pagination.First
                                                                        onClick={() =>
                                                                            handlePageChangeSize(
                                                                                1
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            currentPageSize ===
                                                                            1
                                                                        }
                                                                    />
                                                                    <Pagination.Prev
                                                                        onClick={() =>
                                                                            handlePageChangeSize(
                                                                                currentPageSize -
                                                                                    1
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            currentPageSize ===
                                                                            1
                                                                        }
                                                                    />
                                                                    {[
                                                                        ...Array(
                                                                            totalPagesSize
                                                                        ).keys(),
                                                                    ].map(
                                                                        (
                                                                            page
                                                                        ) => (
                                                                            <Pagination.Item
                                                                                key={
                                                                                    page +
                                                                                    1
                                                                                }
                                                                                active={
                                                                                    page +
                                                                                        1 ===
                                                                                    currentPageSize
                                                                                }
                                                                                onClick={() =>
                                                                                    handlePageChangeSize(
                                                                                        page +
                                                                                            1
                                                                                    )
                                                                                }
                                                                            >
                                                                                {page +
                                                                                    1}
                                                                            </Pagination.Item>
                                                                        )
                                                                    )}
                                                                    <Pagination.Next
                                                                        onClick={() =>
                                                                            handlePageChangeSize(
                                                                                currentPageSize +
                                                                                    1
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            currentPageSize ===
                                                                            totalPagesSize
                                                                        }
                                                                    />
                                                                    <Pagination.Last
                                                                        onClick={() =>
                                                                            handlePageChangeSize(
                                                                                totalPagesSize
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            currentPageSize ===
                                                                            totalPagesSize
                                                                        }
                                                                    />
                                                                </Pagination>
                                                            </div>

                                                            {/* Màu sắc */}
                                                            <div className="col-12">
                                                                <label htmlFor="">
                                                                    Màu sắc:
                                                                </label>
                                                                <br />
                                                                <div className="checkbox row">
                                                                    {paginatedColors.map(
                                                                        (
                                                                            color
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    color.id
                                                                                }
                                                                                className="col-md-12"
                                                                            >
                                                                                <div
                                                                                    className="row m-1 p-1"
                                                                                    style={{
                                                                                        border: "1px solid #cdcd",
                                                                                    }}
                                                                                >
                                                                                    <div className="col-md-8">
                                                                                        <label>
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                style={{
                                                                                                    marginRight:
                                                                                                        "7px",
                                                                                                    border: "1px solid #000",
                                                                                                    borderRadius:
                                                                                                        "0px",
                                                                                                }}
                                                                                                type="checkbox"
                                                                                                value={
                                                                                                    color.id
                                                                                                }
                                                                                                onChange={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    handleColorChange(
                                                                                                        e,
                                                                                                        color.id
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                            {
                                                                                                color.name
                                                                                            }
                                                                                        </label>
                                                                                    </div>

                                                                                    <div
                                                                                        className=""
                                                                                        style={{
                                                                                            width: 20,
                                                                                            height: 20,
                                                                                            backgroundColor:
                                                                                                color.value,
                                                                                            border: "1px solid #000",
                                                                                        }}
                                                                                    ></div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>

                                                                {/* Pagination for colors */}
                                                                <Pagination className="justify-content-center mt-3">
                                                                    <Pagination.First
                                                                        onClick={() =>
                                                                            handlePageChangeColor(
                                                                                1
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            currentPageColor ===
                                                                            1
                                                                        }
                                                                    />
                                                                    <Pagination.Prev
                                                                        onClick={() =>
                                                                            handlePageChangeColor(
                                                                                currentPageColor -
                                                                                    1
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            currentPageColor ===
                                                                            1
                                                                        }
                                                                    />
                                                                    {[
                                                                        ...Array(
                                                                            totalPagesColor
                                                                        ).keys(),
                                                                    ].map(
                                                                        (
                                                                            page
                                                                        ) => (
                                                                            <Pagination.Item
                                                                                key={
                                                                                    page +
                                                                                    1
                                                                                }
                                                                                active={
                                                                                    page +
                                                                                        1 ===
                                                                                    currentPageColor
                                                                                }
                                                                                onClick={() =>
                                                                                    handlePageChangeColor(
                                                                                        page +
                                                                                            1
                                                                                    )
                                                                                }
                                                                            >
                                                                                {page +
                                                                                    1}
                                                                            </Pagination.Item>
                                                                        )
                                                                    )}
                                                                    <Pagination.Next
                                                                        onClick={() =>
                                                                            handlePageChangeColor(
                                                                                currentPageColor +
                                                                                    1
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            currentPageColor ===
                                                                            totalPagesColor
                                                                        }
                                                                    />
                                                                    <Pagination.Last
                                                                        onClick={() =>
                                                                            handlePageChangeColor(
                                                                                totalPagesColor
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            currentPageColor ===
                                                                            totalPagesColor
                                                                        }
                                                                    />
                                                                </Pagination>
                                                            </div>
                                                        </div>
                                                        <div className="row mt-3"></div>
                                                    </div>
                                                    <div className="col-4">
                                                        <h5>Chọn hình ảnh</h5>
                                                        <div className="row w-50">
                                                            <label htmlFor="">
                                                                Hình ảnh:
                                                            </label>
                                                            <button class="container-btn-file ms-3">
                                                                Tải hình ảnh
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    multiple
                                                                    onChange={
                                                                        handleImageChange
                                                                    }
                                                                    className="mb-3"
                                                                />
                                                            </button>
                                                        </div>
                                                        <div className="row mt-3">
                                                            <div
                                                                className="col-md"
                                                                style={{
                                                                    display:
                                                                        "grid",
                                                                    gridTemplateColumns:
                                                                        "repeat(auto-fill, minmax(100px, 1fr))",
                                                                    gap: "10px",
                                                                }}
                                                            >
                                                                {filePreviews.map(
                                                                    (
                                                                        image,
                                                                        index
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            style={{
                                                                                display:
                                                                                    "flex",
                                                                                flexDirection:
                                                                                    "column",
                                                                                alignItems:
                                                                                    "center",
                                                                                marginTop:
                                                                                    "10px",
                                                                            }}
                                                                        >
                                                                            <img
                                                                                src={
                                                                                    image
                                                                                }
                                                                                alt={`Preview ${index}`}
                                                                                style={{
                                                                                    width: "100px",
                                                                                    height: "100px",
                                                                                    marginBottom:
                                                                                        "5px",
                                                                                }}
                                                                            />
                                                                            <button
                                                                                className="btn btn-danger btn-sm w-100"
                                                                                onClick={() =>
                                                                                    handleRemoveImage(
                                                                                        index
                                                                                    )
                                                                                }
                                                                            >
                                                                                Xóa
                                                                                ảnh
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col-md">
                                                        <label htmlFor="">
                                                            Mô tả sản phẩm
                                                        </label>
                                                        <QuillEditor
                                                            value={content}
                                                            onBlur={setContent}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-2">
                                                        {create == true && (
                                                            <button
                                                                className="btn w-100 btn-primary"
                                                                onClick={(e) =>
                                                                    SubmitProduct()
                                                                }
                                                            >
                                                                Thêm mới
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {create == false &&
                                currentData &&
                                currentData.length > 0 && (
                                    <>
                                        <div className="row mt-3">
                                            <Form inline>
                                                <Row>
                                                    <Col xs="4">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Tìm kiếm sản phẩm"
                                                            className=" mr-sm-2"
                                                            value={searchQuery}
                                                            onChange={
                                                                handleSearch
                                                            }
                                                        />
                                                    </Col>
                                                    <Col xs="auto">
                                                        <Button type="submit">
                                                            Tìm kiếm
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </div>
                                        <div className="row mt-3 p-3">
                                            {searchQuery != "" ? (
                                                <div className="card">
                                                    <div className="card-header text-center fs-4">
                                                        DANH SÁCH SẢN PHẨM TÌM
                                                        KIẾM
                                                    </div>
                                                    <div className="card-body">
                                                        <Table striped>
                                                            <thead>
                                                                <tr>
                                                                    <th>Mã</th>
                                                                    <th>
                                                                        Sản phẩm
                                                                    </th>
                                                                    <th>Giá</th>
                                                                    <th>
                                                                        Tồn kho
                                                                    </th>
                                                                    <th>
                                                                        Trạng
                                                                        thái
                                                                    </th>
                                                                    <th>
                                                                        Thao tác
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {filteredData.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                item.id
                                                                            }
                                                                        >
                                                                            <td
                                                                                width={
                                                                                    10
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.id
                                                                                }
                                                                            </td>
                                                                            <td
                                                                                width={
                                                                                    400
                                                                                }
                                                                            >
                                                                                <div className="d-flex">
                                                                                    <div>
                                                                                        <img
                                                                                            style={{
                                                                                                width: "80px",
                                                                                            }}
                                                                                            src={`/storage/products/${item.gallery[0].image}`}
                                                                                            alt=""
                                                                                        />
                                                                                    </div>
                                                                                    <div className="ms-3">
                                                                                        <div>
                                                                                            <strong>
                                                                                                Tên:
                                                                                            </strong>
                                                                                            <span className="ms-2">
                                                                                                {
                                                                                                    item.name
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>
                                                                                                Thương
                                                                                                hiệu:
                                                                                            </strong>
                                                                                            <span className="ms-2">
                                                                                                {
                                                                                                    item
                                                                                                        .brands
                                                                                                        .name
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>
                                                                                                Danh
                                                                                                mục:
                                                                                            </strong>
                                                                                            <span className="ms-2">
                                                                                                {
                                                                                                    item
                                                                                                        .categories[0]
                                                                                                        .name
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <span>
                                                                                    {new Intl.NumberFormat(
                                                                                        "vi-VN",
                                                                                        {
                                                                                            style: "currency",
                                                                                            currency:
                                                                                                "VND",
                                                                                        }
                                                                                    ).format(
                                                                                        item.price
                                                                                    )}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.in_stock
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <Switch
                                                                                    checked={
                                                                                        item.status ===
                                                                                        1
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        switchProduct(
                                                                                            item.id
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <div className="d-flex">
                                                                                    <div>
                                                                                        <a
                                                                                            className="btn btn-sm btn-warning"
                                                                                            href={`/admin/products/${item.id}`}
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
                                                                                            onClick={(
                                                                                                e
                                                                                            ) =>
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
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="card">
                                                    <div className="card-header text-center fs-4">
                                                        DANH SÁCH SẢN PHẨM
                                                    </div>
                                                    <div className="card-body">
                                                        <Table striped>
                                                            <thead>
                                                                <tr>
                                                                    <th>Mã</th>
                                                                    <th>
                                                                        Sản phẩm
                                                                    </th>
                                                                    <th>Giá</th>
                                                                    <th>
                                                                        Tồn kho
                                                                    </th>
                                                                    <th>
                                                                        Trạng
                                                                        thái
                                                                    </th>
                                                                    <th>
                                                                        Thao tác
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {currentData.map(
                                                                    (
                                                                        item,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                item.id
                                                                            }
                                                                        >
                                                                            <td
                                                                                width={
                                                                                    10
                                                                                }
                                                                            >
                                                                                {
                                                                                    item.id
                                                                                }
                                                                            </td>
                                                                            <td
                                                                                width={
                                                                                    400
                                                                                }
                                                                            >
                                                                                <div className="d-flex">
                                                                                    <div>
                                                                                        <img
                                                                                            style={{
                                                                                                width: "80px",
                                                                                            }}
                                                                                            src={`/storage/products/${item.gallery[0].image}`}
                                                                                            alt=""
                                                                                        />
                                                                                    </div>
                                                                                    <div className="ms-3">
                                                                                        <div>
                                                                                            <strong>
                                                                                                Tên:
                                                                                            </strong>
                                                                                            <span className="ms-2">
                                                                                                {
                                                                                                    item.name
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>
                                                                                                Thương
                                                                                                hiệu:
                                                                                            </strong>
                                                                                            <span className="ms-2">
                                                                                                {
                                                                                                    item
                                                                                                        .brands
                                                                                                        .name
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                        <div>
                                                                                            <strong>
                                                                                                Danh
                                                                                                mục:
                                                                                            </strong>
                                                                                            <span className="ms-2">
                                                                                                {
                                                                                                    item
                                                                                                        .categories[0]
                                                                                                        .name
                                                                                                }
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <span>
                                                                                    {new Intl.NumberFormat(
                                                                                        "vi-VN",
                                                                                        {
                                                                                            style: "currency",
                                                                                            currency:
                                                                                                "VND",
                                                                                        }
                                                                                    ).format(
                                                                                        item.price
                                                                                    )}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    item.in_stock
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <Switch
                                                                                    checked={
                                                                                        item.status ===
                                                                                        1
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        switchProduct(
                                                                                            item.id
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </td>
                                                                            <td>
                                                                                <div className="d-flex">
                                                                                    <div>
                                                                                        <a
                                                                                            className="btn btn-sm btn-warning"
                                                                                            href={`/admin/products/${item.id}`}
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
                                                                                            onClick={(
                                                                                                e
                                                                                            ) =>
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
                                                                    )
                                                                )}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                    <div className="card-footer">
                                                        <Pagination className="justify-content-center">
                                                            <Pagination.First
                                                                onClick={() =>
                                                                    handlePageChange(
                                                                        1
                                                                    )
                                                                }
                                                                disabled={
                                                                    currentPage ===
                                                                    1
                                                                }
                                                            />
                                                            <Pagination.Prev
                                                                onClick={() =>
                                                                    handlePageChange(
                                                                        currentPage -
                                                                            1
                                                                    )
                                                                }
                                                                disabled={
                                                                    currentPage ===
                                                                    1
                                                                }
                                                            />
                                                            {[
                                                                ...Array(
                                                                    totalPages
                                                                ).keys(),
                                                            ].map((page) => (
                                                                <Pagination.Item
                                                                    key={
                                                                        page + 1
                                                                    }
                                                                    active={
                                                                        page +
                                                                            1 ===
                                                                        currentPage
                                                                    }
                                                                    onClick={() =>
                                                                        handlePageChange(
                                                                            page +
                                                                                1
                                                                        )
                                                                    }
                                                                >
                                                                    {page + 1}
                                                                </Pagination.Item>
                                                            ))}
                                                            <Pagination.Next
                                                                onClick={() =>
                                                                    handlePageChange(
                                                                        currentPage +
                                                                            1
                                                                    )
                                                                }
                                                                disabled={
                                                                    currentPage ===
                                                                    totalPages
                                                                }
                                                            />
                                                            <Pagination.Last
                                                                onClick={() =>
                                                                    handlePageChange(
                                                                        totalPages
                                                                    )
                                                                }
                                                                disabled={
                                                                    currentPage ===
                                                                    totalPages
                                                                }
                                                            />
                                                        </Pagination>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>
                </Container>
            </Layout>
        </>
    );
}

export default Index;
