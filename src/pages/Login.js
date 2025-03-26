import React from "react";
import { Layout } from "antd";
import LoginForm from "../components/loginpage/Loginform";
import background from "../assets/maxresdefault.jpg";
const { Content } = Layout;
function Login() {
  return (
    <Layout class="flex w-screen min-h-screen">
      <Layout>
        <Content class="flex flex-col relative bg-steam overflow-x-hidden xl:overflow-y-hidden">
          <div class="absolute inset-0 w-full h-full ">
            <img src={background} class="hidden md:block w-full h-full object-top object-cover xl:object-scale-down" />
          </div>

          <div className="relative z-10 flex justify-center items-start min-h-screen mt-10 shadow-2xl">
            <LoginForm />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
export default Login;
{/* <div class='flex flex-col bg-steam overflow-x-hidden xl:overflow-y-hidden h-screen'>
        <div class='relative'>
          <img src={background} class='w-auto h-auto object-none xl:object-scale-down object-top' />
          <div class="absolute inset-0 bg-gradient-to-r from-steam via-transparent to-steam">
            <div class="h-full bg-gradient-to-b from-steam via-transparent to-steam brightness-95" />
          </div>
          <div class='absolute top-[100px]  left-1/2 translate-x-1/2 lg:top-1/2 xl:top-[350px] pb-[550px] lg:pb-0'>
            <LoginForm />
          </div>
        </div>
      </div> */}