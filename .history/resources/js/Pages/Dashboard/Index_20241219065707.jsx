import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import RevenueChart from "../../components/RevenueChart";
import Container from "@mui/material/Container";
import { format } from "date-fns";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { Table, Pagination } from "react-bootstrap";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Badge from "react-bootstrap/Badge";

function Index(revenue) {
    const [data, setData] = useState(revenue.revenue);
    const [dataNew, setDataNew] = useState("");
    const [dataPro, setDataPro] = useState(revenue.databest);
    const [dataReviews, setdataReviews] = useState(revenue.reviews);
    const [dataOrders, setdataOrders] = useState(revenue.orders);
    const [dataProducts, setdataProducts] = useState(revenue.products);
    const [loading, setLoading] = useState(true);
    const [showLoad, setShowLoad] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
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
    const handleSubmit = async () => {
        try {
            const response = await axios.post("/admin/dashboard/date",{
                    start_date: startDate,
                    end_date: endDate,
                });
            if (response.data.check === true) {
                notyf.open({
                    type: "success",
                    message: "Đã lọc thành công",
                });
                setData(response.data.data);
            } else {
                notyf.open({
                    type: "error",
                    message: "Không có dữ liệu",
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoad(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
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
            {showLoad ? (
                <Loading />
            ) : (
                <Layout>
                    <>
                        <Container>
                            <div>
                                <h3>Thống kê</h3>
                            </div>
                            <div className="row">
                                <div className="col-8">
                                    <h5 className="mt-5">
                                        Biểu đồ Doanh thu theo ngày
                                    </h5>
                                    <div className="col-4 mt-3">
                                        <div className="mt-3">
                                            <label htmlFor="">
                                                Ngày bắt đầu
                                            </label>
                                            <input
                                                className="form-control mt-1"
                                                type="date"
                                                name="start_date"
                                                id=""
                                                onChange={(e) =>
                                                    setStartDate(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <label htmlFor="">
                                                Ngày kết thúc
                                            </label>
                                            <input
                                                className="form-control mt-1"
                                                type="date"
                                                name="end_date"
                                                id=""
                                                onChange={(e) =>
                                                    setEndDate(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                onClick={handleSubmit}
                                                className="btn btn-primary mt-3"
                                            >
                                                Lọc theo ngày
                                            </button>
                                        </div>
                                    </div>
                                    <RevenueChart data={data} />

                                    <div className="mt-5">
                                        <div className="card">
                                            <div className="card-header text-center">
                                                <h5>Đánh giá mới nhất</h5>
                                            </div>
                                            <div className="card-body">
                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th>Sản phẩm</th>
                                                            <th>Số sao</th>
                                                            <th>Nội dung</th>
                                                            <th>
                                                                Ngày đánh giá
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataReviews &&
                                                            dataReviews.length >
                                                                0 &&
                                                            dataReviews.map(
                                                                (item) => (
                                                                    <tr
                                                                        key={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        <td>
                                                                            <div className="d-flex">
                                                                                <div>
                                                                                    <img
                                                                                        src={`/storage/products/${item.product.gallery[0].image}`}
                                                                                        alt=""
                                                                                        style={{
                                                                                            width: "50px",
                                                                                            height: "50px",
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <div className="ms-2">
                                                                                    <p>
                                                                                        {
                                                                                            item.name
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            {[
                                                                                ...Array(
                                                                                    5
                                                                                ),
                                                                            ].map(
                                                                                (
                                                                                    p,
                                                                                    index
                                                                                ) =>
                                                                                    index <
                                                                                    item.rating ? (
                                                                                        <StarIcon
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                            color="warning"
                                                                                        />
                                                                                    ) : (
                                                                                        <StarBorderIcon
                                                                                            key={
                                                                                                index
                                                                                            }
                                                                                        />
                                                                                    )
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.comment
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {format(
                                                                                new Date(
                                                                                    item.review_date
                                                                                ),
                                                                                "dd-MM-yyyy"
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="card">
                                        <div className="card-header text-center">
                                            <h5>Danh sách bán chạy</h5>
                                        </div>
                                        <div className="card-body">
                                            <Table striped>
                                                <thead>
                                                    <tr>
                                                        <th>Sản phẩm</th>
                                                        <th>Số lượng</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {console.log(dataPro)}
                                                    {dataPro &&
                                                        dataPro.length > 0 &&
                                                        dataPro.map((item) => (
                                                            <tr key={item.id}>
                                                                <td>
                                                                    <div className="d-flex">
                                                                        <div>
                                                                            <img
                                                                                src={`/storage/products/${item.gallery[0].image}`}
                                                                                alt=""
                                                                                style={{
                                                                                    width: "50px",
                                                                                    height: "50px",
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="ms-2">
                                                                            <p>
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {
                                                                        item.total_sold
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mt-5">
                                    <div className="card">
                                        <div className="card-header text-center">
                                            <h5>Sản phẩm mới nhất</h5>
                                        </div>
                                        <div className="card-body">
                                            <Table striped>
                                                <thead>
                                                    <tr>
                                                        <th>Sản phẩm</th>
                                                        <th>Giá sản phẩm</th>
                                                        <th>Số lượng</th>
                                                        <th>Ngày tạo</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataProducts &&
                                                        dataProducts.length >
                                                            0 &&
                                                        dataProducts.map(
                                                            (item) => (
                                                                <tr
                                                                    key={
                                                                        item.id
                                                                    }
                                                                >
                                                                    <td>
                                                                        <div className="d-flex">
                                                                            <div>
                                                                                <img
                                                                                    src={`/storage/products/${item.gallery[0].image}`}
                                                                                    alt=""
                                                                                    style={{
                                                                                        width: "50px",
                                                                                        height: "50px",
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                            <div className="ms-2">
                                                                                {
                                                                                    item.name
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.price
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.in_stock
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {format(
                                                                            new Date(
                                                                                item.created_at
                                                                            ),
                                                                            "dd-MM-yyyy"
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="mt-5">
                                        <div className="card mt-5">
                                            <div className="card-header text-center">
                                                <h5>Đơn hàng mới nhất</h5>
                                            </div>
                                            <div className="card-body">
                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th>
                                                                <input type="checkbox" />
                                                            </th>
                                                            <th>Mã đơn hàng</th>
                                                            <th>Mã sản phẩm</th>
                                                            <th>
                                                                Mã khách hàng
                                                            </th>
                                                            <th>Tổng tiền</th>
                                                            <th>Địa chỉ</th>
                                                            <th>Phương thức</th>
                                                            <th>Ngày đặt</th>
                                                            <th>Trạng thái</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {dataOrders &&
                                                            dataOrders.length >
                                                                0 &&
                                                            dataOrders.map(
                                                                (item) => (
                                                                    <tr
                                                                        key={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        <td>
                                                                            <input type="checkbox" />
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.id
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {item.order_details.map(
                                                                                (
                                                                                    detail
                                                                                ) => (
                                                                                    <span
                                                                                        key={
                                                                                            detail.id
                                                                                        }
                                                                                    >
                                                                                        {
                                                                                            detail.id_product
                                                                                        }{" "}
                                                                                    </span>
                                                                                )
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.id_user
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.total_amount
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item.address
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                item
                                                                                    .payment
                                                                                    ?.method
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {format(
                                                                                new Date(
                                                                                    item.order_date
                                                                                ),
                                                                                "dd-MM-yyyy"
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {item.status &&
                                                                            item.status ===
                                                                                "pending" ? (
                                                                                <Badge bg="danger">
                                                                                    Đang
                                                                                    chờ
                                                                                    xử
                                                                                    lý
                                                                                </Badge>
                                                                            ) : (
                                                                                <Badge bg="primary">
                                                                                    {
                                                                                        item.status
                                                                                    }
                                                                                </Badge>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </>
                </Layout>
            )}
        </>
    );
}

export default Index;
