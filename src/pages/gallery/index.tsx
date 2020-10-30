import React, { useState } from 'react';
import { Card, Modal, Pagination, Skeleton, Upload } from 'antd';
import request from '@/utils/request';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { UploadFile } from 'antd/es/upload/interface';
import './index.less';
import { useRequest } from '@/hooks/useRequest';

const Gallery = () => {
  const [pagination, setPagination] = useState({ currentPage: 1, total: 1 });
  const [loading, assets] = useRequest<any>('/asset', { pagination });
  const [visible, setVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const remove = async (info: UploadFile) => {
    if (info.status === ('uploaded' as any)) {
      const id = info.uid;
      const res = await request('/static', {
        method: 'DELETE',
        data: { id },
      });
      return res?.status === 'ok';
    }
    return true;
  };

  return (
    <PageHeaderWrapper>
      <Card>
        {(!loading && (
          <Upload
            multiple
            listType="picture-card"
            defaultFileList={assets.data.map((img: any) => ({
              url: img.cosUrl,
              uid: img.id,
              status: 'done',
            }))}
            onPreview={(url) => {
              setVisible(true);
              setPreviewUrl((url as any).origin);
            }}
            onRemove={remove}
          >
            upload
          </Upload>
        )) || <Skeleton />}
        <Modal visible={visible} footer={null} onCancel={() => setVisible(false)}>
          <img alt="preview" style={{ width: '100%' }} src={previewUrl} />
        </Modal>
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

export default Gallery;
