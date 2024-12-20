import React from "react";
import Layout from "../../components/Layout";
import Container from "@mui/material/Container";

function Index() {
    return (
        <Layout>
            <Container>
                <div>
                    <h3>Quản lý đơn hàng</h3>
                </div>
                <div className="card"></div>
            </Container>
        </Layout>
    );
}

export default Index;
