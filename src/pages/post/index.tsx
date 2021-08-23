import ProTable, { ProColumns } from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import dayjs from 'dayjs';
import './index.less';
import { Link } from 'umi';
import { queryPosts } from '@/pages/post/service';

const Posts = () => {
  const columns: ProColumns<{ id: number }>[] = [
    {
      title: 'title',
      dataIndex: 'title',
      className: 'post-list-title-no-wrap',
      render(_, record) {
        return <Link to={`/post/publish?id=${record.id}`}>{_}</Link>;
      },
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
