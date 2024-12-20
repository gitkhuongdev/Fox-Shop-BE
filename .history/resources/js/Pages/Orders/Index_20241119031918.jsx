import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Container from "@mui/material/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { Table, Pagination } from "react-bootstrap";
function Index( orders ) {
 console.log(orders)
 const [data, setData] = useState(orders)
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
                <div className="card">
                  <div className="card-header text-center">
                    <h5>
                      Danh sách đơn hàng
                    </h5>
                  </div>
                  <div className="card-body">

                  </div>
                </div>
            </Container>
        </Layout>
    );
}

export default Index;
