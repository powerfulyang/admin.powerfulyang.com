import React, { useState } from 'react';
import { Card, Modal, Pagination, Skeleton, Upload } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import './index.less';
import { useRequest } from '@/hooks/useRequest';
import { getCosObjectThumbnailUrl, getCosObjectUrl } from '@/utils/cosUtils';
import { useImmer } from '@powerfulyang/hooks';

const Gallery = () => {
  const [pagination, setPagination] = useImmer({ currentPage: 1, total: 1, pageSize: 20 });
  const [loading, assets] = useRequest<any, typeof pagination>('/asset', { params: pagination });
  const [visible, setVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();

  return (
    <PageHeaderWrapper>
      <Card>
        {(!loading && (
          <Upload
            multiple
            listType="picture-card"
            defaultFileList={assets.data[0].map((img: any) => ({
              url: getCosObjectThumbnailUrl(img.objectUrl),
              uid: img.id,
              preview: getCosObjectUrl(img.objectUrl),
            }))}
            onPreview={(obj) => {
              setPreviewUrl(obj.preview);
              setVisible(true);
            }}
            disabled
          >
            upload
          </Upload>
        )) || <Skeleton />}
        <Modal visible={visible} footer={null} onCancel={() => setVisible(false)}>
          {visible && <img alt="preview" style={{ width: '100%' }} src={previewUrl} />}
        </Modal>
        <Pagination
          pageSize={20}
          current={pagination.currentPage}
          onChange={(page) => {
            setPagination((draft) => {
              draft.currentPage = page;
            });
          }}
          total={assets?.data[1] || pagination.total}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default Gallery;
