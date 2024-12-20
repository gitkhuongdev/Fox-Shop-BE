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
                    </>
                </Layout>
            )}
        </>
    );
}

export default Index;
