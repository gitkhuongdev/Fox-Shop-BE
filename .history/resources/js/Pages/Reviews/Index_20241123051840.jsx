import React, { useState } from "react";
import Layout from "../../components/Layout";
import Container from "@mui/material/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Switch from "@mui/material/Switch";

import { Table, Pagination } from "react-bootstrap";
function ReviewForm({ review, product }) {
    const [data, setData] = useState(review);
    const [pro, setPro] = useState(product);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(pro.length / itemsPerPage);
    const currentData = pro.slice(indexOfFirstItem, indexOfLastItem);
    // console.log(currentData);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleChangeSwitch = (id) => {
        axios.post(`/admin/review/switch/${id}`).then((res) => {
            if (res.data.check == true) {
                window.location.reload();
                notyf.open({
                    type: "success",
                    message: "Chỉnh trạng thái thành công",
                });
            } else if (res.data.check == false) {
                notyf.open({
                    type: "error",
                    message: res.data.msg,
                });
            }
        });
    };
    return (
        <>
            <Layout>
                <Container>
                    <div>
                        <h3>Quản lý đánh giá</h3>
                    </div>
                    <div className="row mt-3">
                        <Form inline>
                            <Row>
                                <Col xs="4">
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm kiếm đánh giá"
                                        className=" mr-sm-2"
                                        // value={searchQuery}
                                        // onChange={handleSearch}
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
                                        <th>Sản phẩm</th>
                                        <th>Mã khách hàng</th>
                                        <th>Đánh giá</th>
                                        <th>Nội dung</th>
                                        <th>Ngày tạo</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {console.log("fdsfdsf", pro)}
                                    {currentData &&
                                        currentData.length > 0 &&
                                        currentData.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <input type="checkbox" />
                                                </td>
                                                <td>
                                                    {item.product.gallery &&
                                                    item.product.gallery
                                                        .length > 0 ? (
                                                        <img
                                                            style={{
                                                                width: "50px",
                                                                height: "50px",
                                                            }}
                                                            src={`/storage/products/${item.product.gallery[0].image}`}
                                                            alt="Product Gallery"
                                                        />
                                                    ) : (
                                                        "No image"
                                                    )}
                                                </td>
                                                <td>{item.id_user}</td>
                                                <td>
                                                    {[...Array(5)].map(
                                                        (p, index) =>
                                                            index <
                                                            item.rating ? (
                                                                <StarIcon
                                                                    key={index}
                                                                    color="warning"
                                                                />
                                                            ) : (
                                                                <StarBorderIcon
                                                                    key={index}
                                                                />
                                                            )
                                                    )}
                                                </td>
                                                <td>{item.comment}</td>
                                                <td>{item.review_date}</td>
                                                <td>
                                                    <Switch
                                                        checked={
                                                            item.status === 1
                                                        }
                                                        onChange={() =>
                                                            handleChangeSwitch(
                                                                item.id
                                                            )
                                                        }
                                                    />
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
                                        onClick={() =>
                                            handlePageChange(page + 1)
                                        }
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
        </>
    );
}

export default ReviewForm;
