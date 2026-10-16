"use client";

import { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import 'antd/dist/antd.variable.min.css';

export default function AntdProvider({ children }) {
  useEffect(() => {
    ConfigProvider.config({
      theme: {
        primaryColor: '#E0720A'
      },
    });
  }, []);

  return <>{children}</>;
}