import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';

import { queryBucket } from './service';
import CreateForm from './components/CreateForm';

const TableList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const columns: ProColumns[] = [
    {
      title: 'bucketName',
      dataIndex: 'bucketName',
    },
    {
      title: 'bucketRegion',
      dataIndex: 'bucketRegion',
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable rowKey="id" headerTitle="bucket" request={() => queryBucket()} columns={columns} />
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible} />
    </PageHeaderWrapper>
  );
};

export default TableList;
