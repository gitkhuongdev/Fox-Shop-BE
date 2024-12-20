import React, { useEffect, useState } from "react";
import axios from "axios";

function Index({ data }) {
    const [cart, setCart] = useState(data);
    const [orderInfo, setOrderInfo] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        note: "",
    });
    const [totalAmount, setTotalAmount] = useState(0);
    const [userId, setUserId] = useState("");
    const [voucher, setVoucher] = useState("");
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUserId(userData.id);
                console.log("user", userData.id);
                axios
                    .post("/api/voucher", { userid: userData.id })
                    .then((res) => {
                        if (res.data.check === true) {
                            setVoucher(res.data.data);
                        }
                    });
            }
        } catch (error) {
            console.error("Failed to parse user data:", error);
        }
    }, []);
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
        const amount = cart.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
        setTotalAmount(amount);
    }, [cart]);

    const handleRemoveItem = async (id) => {
        try {
            const response = await axios.delete(`/admin/cart/${id}`);
            console.log("Item removed from cart:", response.data);
            window.location.href = "/admin/products";
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    const handleQuantityChange = (id, newQuantity) => {
        const updatedCart = cart.map((item) => {
            if (item.product_id === id) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCart(updatedCart);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderInfo({ ...orderInfo, [name]: value });
    };

    const handleCheckout = async (paymentMethod) => {
        const orderDetails = cart.map((item) => ({
            id_product: item.product_id,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            total_money: item.product.price * item.quantity,
        }));

        try {
            if (paymentMethod === "cash") {
                const response = await axios.post("/api/orders", {
                    ...orderInfo,
                    id_user: userId,
                    total_amount: totalAmount,
                    order_details: orderDetails,
                    id_payment: 1,
                });
                handleRemoveItem(orderDetails[0].id_product);
                console.log("Order saved successfully:", response.data);
            } else if (paymentMethod === "card") {
                console.log(orderInfo);
                const response = await axios.post("/api/payment", {
                    ...orderInfo,
                    id_user: userId,
                    total_amount: totalAmount,
                    order_details: orderDetails,
                });
                console.log("Payment successful:", response.data);
                if (response.data.url) {
                    handleRemoveItem(orderDetails[0].id_product);
                    window.location.href = response.data.url;
                    console.log(response.data.url);
                } else {
                    console.error("URL not found in response");
                }
            }
        } catch (error) {
            console.error("Error processing checkout:", error);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
                <h1>Shopping Cart</h1>
                {cart.length === 0 ? (
                    <div>Your cart is empty.</div>
                ) : (
                    <>
                        <div>
                            {cart.map((item) => (
                                <div
                                    key={item.product_id}
                                    style={{
                                        border: "1px solid #ccc",
                                        margin: "10px",
                                        padding: "10px",
                                    }}
                                >
                                    <h3>{item.product.name}</h3>
                                    <img
                                        src={`/storage/products/${item.image}`}
                                        alt={item.product.name}
                                        style={{ width: "100px" }}
                                    />
                                    <div>Price: ${item.product.price}</div>
                                    <div>
                                        <strong>Size:</strong> {item.size}
                                    </div>
                                    <div>
                                        <strong>Color:</strong> {item.color}
                                    </div>
                                    <div>
                                        <label>Quantity:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    item.product_id,
                                                    Math.max(
                                                        1,
                                                        parseInt(
                                                            e.target.value,
                                                            10
                                                        )
                                                    )
                                                )
                                            }
                                        />
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleRemoveItem(item.product_id)
                                        }
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <h2>Total Amount: ${totalAmount}</h2>
                        </div>
                        <div>
                            <div className="d-flex">
                                {voucher.length === 0 ? (
                                    <p>Không có voucher nào.</p>
                                ) : (
                                    voucher.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "10px",
                                                margin: "10px",
                                            }}
                                        >
                                            <h3>{item.code}</h3>
                                            <p>{item.discount_value}</p>
                                            <p className="red">Áp dụng từ đơn hàng tối thiểu: {item.minimum_monney}</p>
                                            <p>
                                                <strong>Trạng thái:</strong>{" "}
                                                {item.status === "active"
                                                    ? "Còn hiệu lực"
                                                    : "Hết hiệu lực"}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div style={{ marginLeft: "20px" }}>
                <h2>Order Information</h2>
                <form>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Phone:</label>
                        <input
                            type="tel"
                            name="phone"
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Note:</label>
                        <textarea
                            name="note"
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                </form>
                <button onClick={() => handleCheckout("cash")}>
                    Checkout Cash
                </button>
                <button onClick={() => handleCheckout("card")}>
                    Checkout Card
                </button>
            </div>
        </div>
    );
}

export default Index;
