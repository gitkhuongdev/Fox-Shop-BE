import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};
function Detail({ product }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [showFavorite, setShowFavorite] = useState(true);
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
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [userId, setUserId] = useState("");
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUserId(userData.id);
            }
        } catch (error) {
            console.error("Failed to parse user data:", error);
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            window.location.href = "https://foxshop.trungthanhzone.com/login";
            return;
        }

        try {
            axios
                .post("/api/review", {
                    id_product: product.id,
                    id_user: userId,
                    rating,
                    comment,
                })
                .then((res) => {
                    if (res.data.check === true) {
                        notyf.open({
                            type: "success",
                            message: "Đã tạo thành công",
                        });
                        setComment("");
                        setRating(0);
                    } else if (res.data.check === false) {
                        notyf.open({
                            type: "error",
                            message: res.data.msg,
                        });
                    }
                });
        } catch (error) {
            console.error("Lỗi gửi bình luận:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };
    const handleAddToCart = async () => {
        if (!selectedSize || !selectedColor) {
            alert("Please select size and color");
            return;
        }
        const cartItem = {
            productId: product.id,
            image: product.gallery[0].image,
            quantity,
            size: selectedSize,
            color: selectedColor,
        };

        try {
            const response = await axios.post("/admin/cart", cartItem);
            console.log("Item added to cart:", response.data);
            window.location.href = "/admin/cart";
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };
    const handleAddToWishlist = async (productId) => {
        try{
        const response = await axios.post("/api/wishlist",
            {
                id_product : productId,
                id_user : userId,
            });
            if(response.data.check === true){
                notyf.open({
                    type: "success",
                    message: "Thêm thành công",
                });
                setShowFavorite(false);
            }else{
                notyf.open({
                    type: "error",
                    message: "Thêm thất bại",
                });
            };
        }catch (error) {
            console.error('Lỗi khi thêm sản phẩm yêu thích:', error);
            notyf.open({
                type: "error",
                message: `Thêm thất bại ${error}`,
            });
        }
    };

    return (
        <>
            <div>
                <h1>{product.name}</h1>
                {product.gallery &&
                    product.gallery
                        .filter((img) => img.status === 1)
                        .map((img, index) => (
                            <img
                                key={index}
                                style={{ width: "200px", margin: "10px" }}
                                src={`/storage/products/${img.image}`}
                                alt={`Gallery image ${index + 1}`}
                            />
                        ))}
                <div>Price: {product.price}</div>
                <div>Discount: {product.discount}%</div>
                <div>In Stock: {product.in_stock}</div>

                <div>
                    <label>Quantity:</label>
                    <input
                        placeholder="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        type="number"
                        min="1"
                        max={product.in_stock}
                    />
                </div>

                {/* Chọn màu sắc */}
                <div>
                    <h3>Colors:</h3>
                    {console.log(product.attributes)}
                    {product.attributes
                        .filter((attr) => attr.type === "color")
                        .map((attr, index) => (
                            <div key={index}>
                                <label>
                                    <input
                                        type="radio"
                                        name="color"
                                        value={attr.name}
                                        onChange={(e) =>
                                            setSelectedColor(e.target.value)
                                        }
                                    />
                                    {attr.name}
                                </label>
                            </div>
                        ))}
                </div>

                <div>
                    <h3>Sizes:</h3>
                    {product.attributes
                        .filter((attr) => attr.type === "size")
                        .map((attr, index) => (
                            <div key={index}>
                                <label>
                                    <input
                                        type="radio"
                                        name="size"
                                        value={attr.name}
                                        onChange={(e) =>
                                            setSelectedSize(e.target.value)
                                        }
                                    />
                                    {attr.name}
                                </label>
                            </div>
                        ))}
                </div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleAddToWishlist(product.id)}
                    >
                        Yêu thích
                    </button>
                </div>

                <div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleAddToCart}
                    >
                        Add to cart
                    </button>
                </div>
            </div>
            <div>
                <Button onClick={handleOpen}>Bình luận</Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <form onSubmit={handleSubmit}>
                            <h3>Bình luận sản phẩm</h3>
                            <div>
                                <label>Bình luận</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Viết bình luận của bạn"
                                />
                            </div>
                            <div>
                                <label>Đánh giá</label>
                                {[...Array(5)].map((_, index) => (
                                    <span
                                        key={index}
                                        onClick={() => setRating(index + 1)}
                                        style={{
                                            cursor: "pointer",
                                            color:
                                                index < rating
                                                    ? "#ffc107"
                                                    : "#e4e5e9",
                                            fontSize: "1.5rem",
                                        }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <button type="submit">Gửi bình luận</button>
                        </form>
                    </Box>
                </Modal>
            </div>
        </>
    );
}

export default Detail;
