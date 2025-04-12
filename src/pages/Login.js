import React from "react";
import { Layout } from "antd";
import LoginForm from "../components/loginpage/Loginform";
import background from "../assets/backbround.avif";
const { Content } = Layout;

function Login() {
  return (
    <Layout class="flex w-screen min-h-screen">
      <Layout>
        <Content class="flex flex-col relative bg-steam overflow-x-hidden xl:overflow-y-hidden">
          <div class="absolute inset-0 w-full h-full ">
            <img
              src={background}
              class="hidden md:block w-full h-full object-top object-cover xl:object-scale-down"
            />
          </div>

          <div className="relative z-10 flex justify-center items-start min-h-screen mt-10 shadow-2xl">
            <LoginForm />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
export default Login;
