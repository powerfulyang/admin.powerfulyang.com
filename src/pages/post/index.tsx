import React from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { queryPosts } from '@/pages/post/service';
import dayjs from 'dayjs';
import './index.less';

const Posts = () => {
  const columns: ProColumns[] = [
    {
      title: 'title',
      dataIndex: 'title',
      className: 'post-list-title-no-wrap',
    },
    {
      title: 'content',
      dataIndex: 'content',
    },
    {
      title: 'createAt',
      dataIndex: 'createAt',
      renderText: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
      className: 'post-list-title-no-wrap',
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable rowKey="id" headerTitle="posts" request={() => queryPosts()} columns={columns} />
    </PageHeaderWrapper>
  );
};

export default Posts;
