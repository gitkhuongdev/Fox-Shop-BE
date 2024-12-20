import React, { useState } from "react";
import Layout from "../../components/Layout";
import Container from "@mui/material/Container";
import { Table, Pagination } from "react-bootstrap";
function Index({ wishlist }) {
    const [data, setData] = useState(wishlist);
    console.log(data);
    return (
        <div>
            <Layout>
                <Container>
                    <div>
                        <div>
                            <h3>Quản lý danh sách yêu thích</h3>
                        </div>
                        <div>
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
                                                <th>Mã</th>
                                                <th>Mã sản phẩm</th>
                                                <th>Mã khách hàng</th>
                                                <th>Ngày tạo</th>
                                                <th>Số lượng</th>
                                                <th>Trạng thái</th>
                                                <th>Ngày bắt đầu</th>
                                                <th>Ngày kết thúc</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Layout>
        </div>
    );
}

export default Index;
