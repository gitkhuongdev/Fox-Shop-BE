import React from "react";
import Layout from "../../components/Layout";
import PieChart from "../../components/PieChart";
import Container from "@mui/material/Container";

// import { PieChart } from "@mui/icons-material";

function Index() {
    return (
        <Layout>
            <>
                <Container>
                    <div className="row">
                        <div className="col-8">
                            <PieChart></PieChart>
                        </div>
                        <div className="col-4">
                            <div className="card">
                                <div className="card-header text-center">
                                    <h5>Danh sách bán chạy</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-8">
                                            <div>
                                                <div className="img">
                                                    <img
                                                        src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fstyle-republik.com%2F7-thuong-hieu-thoi-trang-trien-vong-cua-nam-2023%2F&psig=AOvVaw0fRpdjstZyHj3Gj8nlPkH7&ust=1731769992945000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNCOq4vQ3okDFQAAAAAdAAAAABAI"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </>
        </Layout>
    );
}

export default Index;
