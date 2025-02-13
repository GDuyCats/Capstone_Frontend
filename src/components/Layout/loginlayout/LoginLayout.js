import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Footer from './footer/Footer';
import { Layout } from 'antd';
import LayoutCom from '../LayoutCom';

const { Content } = Layout;


function LoginLayout() {
    return (
        <Layout class="min-h-screen flex flex-col">
            <Header />
            <div class="flex flex-1">
                <Content class="flex flex-1">
                    <Outlet />
                </Content>
            </div>
            <Footer/>
        </Layout>
    );
}

export default LoginLayout;
