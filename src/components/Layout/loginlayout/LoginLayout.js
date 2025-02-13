import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Footer from './footer/Footer';
import { Layout } from 'antd';
import LayoutCom from '../LayoutCom';

const { Content } = Layout;


function LoginLayout() {
    return (
        <Layout class="min-h-screen flex flex-col relative">
            <Header />
            <Content >
                <Outlet />
            </Content>
            <Footer />
        </Layout>
    );
}

export default LoginLayout;
