import React, { useState } from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
function Detail({ product }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

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
                        onClick={handleAddToCart}
                    >
                        Add to cart
                    </button>
                </div>
            </div>
            <div>

            </div>
        </>
    );
}

export default Detail;
