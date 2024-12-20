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

import { Table, Pagination } from "react-bootstrap";
function ReviewForm({ review }) {
    const [data, setData] = useState(review);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
    console.log(currentData);
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <>
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
                </Container>
            </Layout>
        </>
    );
}

export default ReviewForm;
