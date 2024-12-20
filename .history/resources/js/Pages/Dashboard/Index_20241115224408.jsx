import React from "react";
import Layout from "../../components/Layout";
import PieChart from "../../components/PieChart";
import Container from "@mui/material/Container";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import { PieChart } from "@mui/icons-material";

function Index() {
    return (
        <Layout>
            <>
                <Container>
                    <div>
                        <h4></h4>
                    </div>
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
                                            <div style={{ fontWeight: "bold" }}>
                                                Ten san pham
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div style={{ fontWeight: "bold" }}>
                                                So luong
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="row p-3 mb-1"
                                        style={{ backgroundColor: "#ddd" }}
                                    >
                                        <div className="col-8">
                                            <div>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <div className="img">
                                                        <img
                                                            style={{
                                                                width: "50px",
                                                                height: "50px",
                                                            }}
                                                            src="https://cdn2.yame.vn/pimg/ao-so-mi-co-tru-tay-ngan-soi-nhan-tao-tham-hut-bieu-tuong-dang-rong-on-gian-seventy-seven-24-0023268/4fa711be-99c7-8e00-4d3a-001b3cbd3797.jpg?w=540&h=756"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="name ms-1">
                                                        Ao nam thoi trang nam
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <Stack
                                                spacing={1}
                                                sx={{ alignItems: "center" }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                >
                                                    <Chip
                                                        icon={
                                                            <ArrowUpwardIcon />
                                                        }
                                                        label="5%"
                                                        color="success"
                                                    />
                                                </Stack>
                                            </Stack>
                                        </div>
                                    </div>
                                    <div
                                        className="row p-3 mb-1"
                                        style={{ backgroundColor: "#ddd" }}
                                    >
                                        <div className="col-8">
                                            <div>
                                                <div className="d-flex justify-content-center align-items-center">
                                                    <div className="img">
                                                        <img
                                                            style={{
                                                                width: "50px",
                                                                height: "50px",
                                                            }}
                                                            src="https://cdn2.yame.vn/pimg/ao-so-mi-co-tru-tay-ngan-soi-nhan-tao-tham-hut-bieu-tuong-dang-rong-on-gian-seventy-seven-24-0023268/4fa711be-99c7-8e00-4d3a-001b3cbd3797.jpg?w=540&h=756"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="name ms-1">
                                                        Ao nam thoi trang nam
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <Stack
                                                spacing={1}
                                                sx={{ alignItems: "center" }}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                >
                                                    <Chip
                                                        icon={
                                                            <ArrowUpwardIcon />
                                                        }
                                                        label="5%"
                                                        color="success"
                                                    />
                                                </Stack>
                                            </Stack>
                                        </div>
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
