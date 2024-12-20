import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Container from "@mui/material/Container";

function Index( orders ) {
 console.log(orders)
 const [data, setData] = useState(orders)
    return (
        <Layout>
            <Container>
                <div>
                    <h3>Quản lý đơn hàng</h3>
                </div>
                <div className="card">
                  <div className="card-header text-center">
                    <h5>
                      Danh sách đơn hàng
                    </h5>
                  </div>
                  <div className="card-body">

                  </div>
                </div>
            </Container>
        </Layout>
    );
}

export default Index;
