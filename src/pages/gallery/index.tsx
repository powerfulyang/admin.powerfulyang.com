import React, { useState } from 'react';
import { Card, Modal, Pagination, Skeleton, Upload } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import './index.less';
import { useRequest } from '@/hooks/useRequest';
import { getCosObjectThumbnailUrl, getCosObjectUrl } from '@/utils/cosUtils';
import { useImmer } from '@powerfulyang/hooks';
import { __dev__ } from '@powerfulyang/utils';

const Gallery = () => {
  const [pagination, setPagination] = useImmer({ currentPage: 1, total: 1, pageSize: 10 });
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
          />
        )) || <Skeleton />}
        <Modal
          width="70%"
          bodyStyle={{ textAlign: 'center' }}
          visible={visible}
          footer={null}
          onCancel={() => setVisible(false)}
        >
          {visible && <img alt="preview" style={{ maxWidth: '100%' }} src={previewUrl} />}
        </Modal>
        <Pagination
          style={{ marginTop: '20px' }}
          pageSize={pagination.pageSize}
          current={pagination.currentPage}
          onChange={(page, pageSize) => {
            setPagination((draft) => {
              draft.currentPage = page;
              draft.pageSize = pageSize as number;
            });
          }}
          total={assets?.data?.[1] || pagination.total}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

if (__dev__) {
  Gallery.displayName = 'Gallery';
}

export default Gallery;
