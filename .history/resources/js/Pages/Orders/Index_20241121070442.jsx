import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Container from "@mui/material/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Badge from 'react-bootstrap/Badge';
import { Table, Pagination } from "react-bootstrap";
import axios from 'axios';

function Index({ orders }) {
    const [data, setData] = useState(orders.orders);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Hàm để thay đổi trạng thái đơn hàng
    const handleChangeOrder = async (orderId, newStatus) => {
        try {
            // Gửi yêu cầu PUT để cập nhật trạng thái đơn hàng
            const response = await axios.put(`/api/orders/${orderId}`, {
                status: newStatus,  // Truyền trạng thái mới
            });
            
            if (response.status === 200) {
                // Cập nhật lại danh sách đơn hàng sau khi thay đổi trạng thái
                setData(data.map(order => 
                    order.id === orderId ? { ...order, status: newStatus } : order
                ));
                alert("Trạng thái đơn hàng đã được cập nhật!");
            }
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng:", error);
            alert("Không thể cập nhật trạng thái đơn hàng!");
        }
    };

    return (
        <Layout>
            <Container>
                <div>
                    <h3>Quản lý đơn hàng</h3>
                </div>
                <div className="row mt-3">
                    <Form inline>
                        <Row>
                            <Col xs="4">
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm kiếm đơn hàng"
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
                        <h5>Danh sách đơn hàng</h5>
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
                                {currentData &&
                                    currentData.length > 0 &&
                                    currentData.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <input type="checkbox" />
                                            </td>
                                            <td>{item.id}</td>
                                            <td>
                                                {item.order_details.map(
                                                    (detail) => (
                                                        <span key={detail.id}>
                                                            {detail.id_product}{" "}
                                                        </span>
                                                    )
                                                )}
                                            </td>
                                            <td>{item.id_user}</td>
                                            <td>{item.total_amount}</td>
                                            <td>{item.address}</td>
                                            <td>{item.payment?.method}</td>
                                            <td>{item.order_date}</td>
                                            <td>
                                                {item.status === "pending" ? (
                                                    <Badge bg="danger">Đang chờ xử lý</Badge>
                                                ) : (
                                                    <Badge bg="primary">{item.status}</Badge>
                                                )}
                                            </td>
                                            <td>
                                                <div className="d-flex">
                                                    <div>
                                                        <button
                                                            className="btn btn-sm btn-info"
                                                            onClick={() =>
                                                                handleChangeOrder(item.id, 'processing')
                                                            }
                                                        >
                                                            Chuyển sang xử lý
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-success ml-2"
                                                            onClick={() =>
                                                                handleChangeOrder(item.id, 'completed')
                                                            }
                                                        >
                                                            Hoàn thành
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </div>
                    <div className="card-footer">
                        <Pagination className="justify-content-center">
                            <Pagination.First
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                            />
                            <Pagination.Prev
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                            />
                            {[...Array(totalPages).keys()].map((page) => (
                                <Pagination.Item
                                    key={page + 1}
                                    active={page + 1 === currentPage}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    {page + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                            />
                            <Pagination.Last
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </div>
                </div>
            </Container>
        </Layout>
    );
}

export default Index;
