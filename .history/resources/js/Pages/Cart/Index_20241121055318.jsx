import React, { useEffect, useState } from "react";
import { Notyf } from "notyf";
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
    const [appliedVoucher, setAppliedVoucher] = useState(false);
    const [showBtn, setShowBtn] = useState(null);

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

    const outOfStockItem = cart.find((item) => item.product.in_stock === 0);

    if (outOfStockItem) {
        notyf.open({
            type: "error",
            message: `Sản phẩm "${outOfStockItem.product.name}" không có sẵn.`,
        });
        window.location.replace("/dashboard"); // chỉnh lại đươờng dẫn qua trang sản phẩm
        return;
    }
    const applyVoucher = (voucher) => {
        if (totalAmount >= voucher.minimum_monney) {
            let discountedAmount = 0;
            if (voucher.discount_type === "fixed") {
                discountedAmount = totalAmount - voucher.discount_value;
            } else {
                discountedAmount =
                    totalAmount - totalAmount * (voucher.discount_value / 100);
            }
            setTotalAmount(discountedAmount > 0 ? discountedAmount : 0);
            setAppliedVoucher(true);
            setShowBtn(voucher);
            alert(`Đã áp dụng voucher "${voucher.code}" thành công!`);
        } else {
            alert(
                `Không đủ điều kiện áp dụng voucher. Tổng tiền tối thiểu: ${voucher.minimum_monney} VNĐ.`
            );
        }
    };
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
    const cancelVoucher = () => {
        setTotalAmount(
            cart.reduce(
                (total, item) => total + item.product.price * item.quantity,
                0
            )
        );
        setAppliedVoucher(false);
        setShowBtn(null);
        alert("Đã hủy voucher.");
    };
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
                const availableStock = item.product.in_stock;
                const validQuantity = Math.min(
                    Math.max(1, newQuantity),
                    availableStock
                );
                return { ...item, quantity: validQuantity };
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
                if (appliedVoucher === true && voucher) {
                    try {
                        const voucherResponse = await axios.delete(
                            "/api/user_vouchers",
                            {
                                data: {
                                    id_voucher: voucher.id,
                                    id_user: userId,
                                },
                            }
                        );
                        if (voucherResponse.data.success) {
                            console.log(
                                `Voucher ${voucher.code} đã bị xóa khỏi dữ liệu.`
                            );
                            setAppliedVoucher(false);
                            setVoucher(""); // Reset voucher state nếu cần
                        }
                    } catch (error) {
                        console.error("Error deleting voucher:", error);
                    }
                }
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
                                            <p>
                                                Giảm giá: {item.discount_value}{" "}
                                                {item.discount_type === "fixed"
                                                    ? "VNĐ"
                                                    : "%"}
                                            </p>
                                            <p className="red">
                                                Áp dụng từ đơn hàng tối thiểu:{" "}
                                                {item.minimum_monney} VNĐ
                                            </p>
                                            <p>
                                                <strong>Trạng thái:</strong>{" "}
                                                {item.status === "active"
                                                    ? "Còn hiệu lực"
                                                    : "Hết hiệu lực"}
                                            </p>
                                            <button
                                                onClick={() =>
                                                    applyVoucher(item)
                                                }
                                                disabled={appliedVoucher}
                                            >
                                                {appliedVoucher
                                                    ? "Đã áp dụng"
                                                    : "Áp dụng"}
                                            </button>
                                            {showBtn &&
                                            showBtn.id === item.id ? (
                                                <button onClick={cancelVoucher}>
                                                    Hủy
                                                </button>
                                            ) : null}
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
                {cart.some((item) => item.product.in_stock === 0) ? (
                    <div>Sản phẩm không có sẵn. Không thể thanh toán.</div>
                ) : (
                    <>
                        <button onClick={() => handleCheckout("cash")}>
                            Checkout Cash
                        </button>
                        <button onClick={() => handleCheckout("card")}>
                            Checkout Card
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Index;
