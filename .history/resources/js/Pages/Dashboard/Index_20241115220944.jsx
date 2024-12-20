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
                            
                        </div>
                    </div>
                </Container>
            </>
        </Layout>
    );
}

export default Index;
