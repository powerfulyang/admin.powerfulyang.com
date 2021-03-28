import React, { useState } from 'react';
import { Button, Card, Modal, Pagination, Skeleton, Upload } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.scss';
import { useRequest } from '@/hooks/useRequest';
import { getCosObjectThumbnailUrl, getCosObjectUrl } from '@/utils/cosUtils';
import { useImmer } from '@powerfulyang/hooks';
import { __dev__ } from '@powerfulyang/utils';
import { UploadOutlined } from '@ant-design/icons';
import { prefix } from '@/utils/request';

const Gallery = () => {
  const [pagination, setPagination] = useImmer({ currentPage: 1, total: 1, pageSize: 24 });
  const [loading, assets] = useRequest<any, typeof pagination>('/asset', { params: pagination });
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  return (
    <PageContainer
      extra={[
        <Button key="upload" type="primary" onClick={() => setUploadModalVisible(true)}>
          upload images
        </Button>,
      ]}
    >
      <Card>
        {(!loading && (
          <div className="gallery-list">
            {assets.data[0].map((img: any) => (
              <div
                key={img.id}
                style={{
                  backgroundImage: `url(${getCosObjectThumbnailUrl(img.objectUrl)})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setPreviewUrl(getCosObjectUrl(img.objectUrl));
                }}
              />
            ))}
          </div>
        )) || <Skeleton />}
        <Modal
          bodyStyle={{ textAlign: 'center' }}
          visible={!!previewUrl}
          footer={null}
          onCancel={() => setPreviewUrl('')}
          width="75%"
        >
          {!!previewUrl && (
            <img key={previewUrl} alt="preview" style={{ maxWidth: '100%' }} src={previewUrl} />
          )}
        </Modal>
        <Modal
          visible={uploadModalVisible}
          title="上传图片"
          footer={null}
          onCancel={() => setUploadModalVisible(false)}
        >
          <Upload
            listType="picture-card"
            action={`${prefix}/asset`}
            accept={'image/*'}
            name="files"
            multiple
          >
            <UploadOutlined />
            upload
          </Upload>
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
          pageSizeOptions={[String(24 * 4), String(24 * 24), String(24 * 24 * 4)]}
        />
      </Card>
    </PageContainer>
  );
};

if (__dev__) {
  Gallery.displayName = 'Gallery';
}

export default Gallery;
