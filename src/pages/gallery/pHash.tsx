import React, { useState } from 'react';
import { Card, Pagination, Skeleton } from 'antd';
import { useEffectOnce } from '@powerfulyang/hooks';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import './index.less';
import { Spinner } from '@powerfulyang/components';

const GalleryPHash = () => {
  const [pagination, setPagination] = useState({ currentPage: 1, total: 1 });
  const [loading, setLoading] = useState(true);

  useEffectOnce(() => {
    setLoading(false);
  });

  return (
    <PageHeaderWrapper>
      <Card>
        {(!loading && <Spinner />) || <Skeleton />}
        <Pagination
          pageSize={20}
          current={pagination.currentPage}
          onChange={(page) => {
            setPagination({ ...pagination, currentPage: page });
          }}
          total={pagination.total}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default GalleryPHash;
