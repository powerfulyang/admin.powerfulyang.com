import React, { useState } from 'react';
import { Card, Modal, Pagination, Row, Skeleton } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import './index.less';
import { useRequest } from '@/hooks/useRequest';
import { getCosObjectThumbnailUrl, getCosObjectUrl } from '@/utils/cosUtils';
import { useImmer } from '@powerfulyang/hooks';
import { __dev__ } from '@powerfulyang/utils';

const Gallery = () => {
  const [pagination, setPagination] = useImmer({ currentPage: 1, total: 1, pageSize: 12 });
  const [loading, assets] = useRequest<any, typeof pagination>('/asset', { params: pagination });
  const [previewUrl, setPreviewUrl] = useState<string>();

  return (
    <PageHeaderWrapper title={false}>
      <Card>
        {(!loading && (
          <Row>
            {assets.data[0].map((img: any) => (
              <div
                key={img.id}
                style={{
                  backgroundImage: `url(${getCosObjectThumbnailUrl(img.objectUrl)})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  width: '282px',
                  height: '282px',
                  cursor: 'pointer',
                  margin: '1rem 1rem',
                }}
                onClick={() => {
                  setPreviewUrl(getCosObjectUrl(img.objectUrl));
                }}
              />
            ))}
          </Row>
        )) || <Skeleton />}
        <Modal
          bodyStyle={{ textAlign: 'center' }}
          visible={!!previewUrl}
          footer={null}
          onCancel={() => setPreviewUrl('')}
          width={700}
        >
          {!!previewUrl && (
            <img key={previewUrl} alt="preview" style={{ maxWidth: '100%' }} src={previewUrl} />
          )}
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
