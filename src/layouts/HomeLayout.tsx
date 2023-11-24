import React, { useState } from 'react';
import { Layout, theme, Image } from 'antd';
import Quark from "../assets/Quark.png"
import QuarkSmall from "../assets/QuarkSmall.png"

import styles from "../styles/Layouts/HomeLayout.module.css"
import UserMenu from '../components/UserMenu';
import SettingsMenu from '../components/SettingsMenu';
import { Outlet } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const HomeLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className={styles.layout_main}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        {collapsed ? <Image src={QuarkSmall} preview={false} width={64} className={styles.layout_title_small} /> :
          <Image src={Quark} preview={false} width={200} className={styles.layout_title} />}
        <div className={styles.layout_menus}>
          <UserMenu />
          <SettingsMenu />
        </div>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </React.Suspense>
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomeLayout;