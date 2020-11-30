import React from 'react';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => (
  <DefaultFooter
    copyright="2020 菜🐔前端-D3.js从入门到放弃"
    links={[
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/jrs64/D3_demo',
        blankTarget: true,
      }
    ]}
  />
);
