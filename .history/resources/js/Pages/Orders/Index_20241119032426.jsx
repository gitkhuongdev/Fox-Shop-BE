import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Container from "@mui/material/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Table, Pagination } from "react-bootstrap";
function Index(orders) {
    console.log(orders);
    const [data, setData] = useState(orders);
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
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>1</td>
                                    <td>
                                        {/* <img
                                            src={item.images}
                                            alt={item.name}
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                            }}
                                        /> */}
                                        èer
                                    </td>
                                    <td>tretr</td>
                                    <td>tretrêt</td>
                                    <td>
                                        traânggs
                                    </td>
                                    <td>
                                        <div className="d-flex">
                                            <div>
                                                <a
                                                    className="btn btn-sm btn-warning"
                                                    href=""
                                                    // href={`/admin/categories/${item.id}`}
                                                >
                                                    Sửa
                                                </a>
                                            </div>
                                            <div className="p-2 pt-0 pb-0">
                                                |
                                            </div>
                                            <div>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    // onClick={(e) =>
                                                    //     handleDelete(item.id)
                                                    // }
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            </Container>
        </Layout>
    );
}

export default Index;
