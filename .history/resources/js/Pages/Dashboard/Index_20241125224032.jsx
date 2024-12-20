import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import RevenueChart from "../../components/RevenueChart";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import { PieChart } from "@mui/icons-material";

function Index(revenue) {
    const [data, setData] = useState(revenue.revenue);
    const [dataPro, setDataPro] = useState(revenue.databest);
    const [loading, setLoading] = useState(true);
    const [showLoad, setShowLoad] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoad(false);
        }, 2000);
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
