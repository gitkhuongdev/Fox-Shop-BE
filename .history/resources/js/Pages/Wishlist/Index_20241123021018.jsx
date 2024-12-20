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
                                                <th>Sản phẩm</th>
                                                <th>Mã khách hàng</th>
                                                <th>Ngày tạo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data &&
                                                data.length > 0 &&
                                                data.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <input type="checkbox" />
                                                        </td>
                                                        <td>{item.id}</td>
                                                        {item.items.map(
                                                            (productItem) => (
                                                                <td
                                                                    key={
                                                                        productItem.id
                                                                    }
                                                                >
                                                                    <div>
                                                                        Mã sản
                                                                        phẩm:   
                                                                        {
                                                                            productItem
                                                                                .product
                                                                                .id
                                                                        }
                                                                    </div>
                                                                </td>
                                                            )
                                                        )}
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                ))}
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
