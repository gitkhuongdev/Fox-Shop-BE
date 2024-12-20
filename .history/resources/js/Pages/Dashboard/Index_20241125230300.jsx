import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import RevenueChart from "../../components/RevenueChart";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import { PieChart } from "@mui/icons-material";
import { Table, Pagination } from "react-bootstrap";


function Index(revenue) {
    const [data, setData] = useState(revenue.revenue);
    const [dataPro, setDataPro] = useState(revenue.databest);
    const [loading, setLoading] = useState(true);
    const [showLoad, setShowLoad] = useState(true);
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
                                <h4>Thống kê</h4>
                            </div>
                            <div className="row">
                                <div className="col-8">
                                    <RevenueChart data={data} />
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
                                                        <th>
                                                            <input type="checkbox" />
                                                        </th>
                                                        <th>Mã đơn hàng</th>
                                                        <th>Mã sản phẩm</th>
                                                        <th>Mã khách hàng</th>
                                                        <th>Tổng tiền</th>
                                                        <th>Địa chỉ</th>
                                                        <th> Phương thức</th>
                                                        <th>Ngày đặt</th>
                                                        <th>Trạng thái</th>
                                                        <th>Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {console.log(orders)}
                                                    {currentData &&
                                                        currentData.length >
                                                            0 &&
                                                        currentData.map(
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
                                                                        {
                                                                            item.order_date
                                                                        }
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
                                                                    <td>
                                                                        <Form.Select
                                                                            aria-label="Chọn trạng thái"
                                                                            value={
                                                                                item.status
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleStatusChange(
                                                                                    e,
                                                                                    item.id
                                                                                )
                                                                            }
                                                                        >
                                                                            <option value="pending">
                                                                                Đang
                                                                                chờ
                                                                                xử
                                                                                lý
                                                                            </option>
                                                                            <option value="processing">
                                                                                Đang
                                                                                xử
                                                                                lý
                                                                            </option>
                                                                            <option value="completed">
                                                                                Đã
                                                                                hoàn
                                                                                thành
                                                                            </option>
                                                                            <option value="cancelled">
                                                                                Đã
                                                                                hủy
                                                                            </option>
                                                                        </Form.Select>
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
                        </Container>
                    </>
                </Layout>
            )}
        </>
    );
}

export default Index;
