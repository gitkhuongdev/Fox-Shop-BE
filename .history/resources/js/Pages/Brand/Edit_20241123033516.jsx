import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "@mui/material/Container";
import Form from "react-bootstrap/Form";

function Edit() {
  return (
    <div>
        <Layout>
            <Container>
                <div>
                    <h5>Chỉnh sửa thương hiệu</h5>
                </div>
            </Container>
        </Layout>
    </div>
  )
}

export default Edit