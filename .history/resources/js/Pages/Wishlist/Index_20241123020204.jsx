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
                                                <th>Mã voucher</th>
                                                <th>Mã Code</th>
                                                <th>Loại voucher</th>
                                                <th>Giá trị</th>
                                                <th>Số lượng</th>
                                                <th>Trạng thái</th>
                                                <th>Ngày bắt đầu</th>
                                                <th>Ngày kết thúc</th>
                                                <th>Thao tác</th>
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
                                                        <td>{item.code}</td>
                                                        <td>
                                                            {item.discount_type}
                                                        </td>
                                                        <td>
                                                            {
                                                                item.discount_value
                                                            }
                                                        </td>
                                                        <td>
                                                            {item.usage_limit}
                                                        </td>
                                                        <td>
                                                            {item.status &&
                                                            item.status ==
                                                                "inactive" ? (
                                                                <Badge bg="danger">
                                                                    Không hợp lệ
                                                                </Badge>
                                                            ) : (
                                                                <Badge bg="primary">
                                                                    Hoạt động
                                                                </Badge>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {formatDate(
                                                                item.start_date
                                                            )}
                                                        </td>
                                                        <td>
                                                            {formatDate(
                                                                item.end_date
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <div>
                                                                    <a
                                                                        className="btn btn-sm btn-warning"
                                                                        href=""
                                                                        // href={`/admin/vouchers/${item.id}`}
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
                                                                        // onClick={() =>
                                                                        //     handleDelete(
                                                                        //         item.id
                                                                        //     )
                                                                        // }
                                                                    >
                                                                        Xóa
                                                                    </button>
                                                                </div>
                                                                <div className="p-2 pt-0 pb-0">
                                                                    |
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        className="btn btn-sm btn-info"
                                                                        // onClick={() =>
                                                                        //     handleReceiveVoucher(
                                                                        //         item.id
                                                                        //     )
                                                                        // }
                                                                    >
                                                                        Nhận
                                                                        Voucher
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
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
