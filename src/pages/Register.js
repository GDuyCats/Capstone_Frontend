import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "antd";
import Register from "../components/registerpage/Register";
const { Content } = Layout;
export default function ModalExample() {

  return (
    <Layout class="flex w-screen min-h-screen" >
      <Layout>
        <Content>
          <div>
            <Register/>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
