import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';

import { __dev__ } from '@powerfulyang/utils';
import { Button } from 'antd';
import { queryBucket } from './service';
import CreateForm from './components/CreateForm';

const BucketList: React.FC = () => {
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
    {
      title: 'acl',
      dataIndex: 'acl',
    },
    {
      title: 'RefererType',
      dataIndex: ['referer', 'RefererType'],
    },
    {
      title: 'RefererStatue',
      dataIndex: ['referer', 'Status'],
    },
    {
      title: 'Referer-DomainList',
      dataIndex: ['referer', 'DomainList', 'Domains'],
      render(_, __) {
        return __.referer?.DomainList?.Domains.join(',');
      },
    },
  ];
  const hideModal = () => handleModalVisible(false);
  return (
    <PageContainer
      extra={[
        <Button type="primary" key="create" onClick={() => handleModalVisible(true)}>
          create new bucket
        </Button>,
      ]}
    >
      <ProTable
        rowKey="bucketName"
        headerTitle="bucket"
        request={() => queryBucket()}
        columns={columns}
      />
      <CreateForm onCancel={hideModal} onOk={hideModal} modalVisible={createModalVisible} />
    </PageContainer>
  );
};

if (__dev__) {
  BucketList.displayName = 'BucketList';
}

export default BucketList;
