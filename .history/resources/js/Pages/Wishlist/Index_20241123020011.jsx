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
                    hfaads
                </Container>
            </Layout>
        </div>
    );
}

export default Index;
