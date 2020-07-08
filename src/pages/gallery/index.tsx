import React, { useEffect, useState } from 'react';
import { Card, Modal, Upload } from 'antd';
import request from '@/utils/request';
import { DomUtils, useMountedState } from '@powerfulyang/utils';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { UploadFile } from 'antd/es/upload/interface';
import './index.less';

const Gallery = () => {
  const [staticList, setStaticList] = useState(undefined);
  const isMounted = useMountedState();
  useEffect(() => {
    const isSupportWebp = DomUtils.isSupportWebp();
    request('/static').then((res) => {
      if (isMounted()) {
        setStaticList(
          res.data[0].map((img: any) => {
            return {
              uid: img.staticId,
              url: `${img.bucket.bucketRegionUrl}/${
                (isSupportWebp && img.path.webp) || img.path.resize
              }`,
              status: 'uploaded',
              origin: `${img.bucket.bucketRegionUrl}/${img.path.origin}`,
              name: img.filename,
            };
          }),
        );
      }
    });
  }, []);
  const uploadUrl = REACT_APP_ENV
    ? 'http://localhost:3001/static'
    : 'https://api.powerfulyang.com/static';

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
        {staticList && (
          <Upload
            multiple
            action={uploadUrl}
            headers={{ authorization: localStorage.getItem('token') || '' }}
            listType="picture-card"
            defaultFileList={staticList}
            onPreview={(url) => {
              setVisible(true);
              setPreviewUrl((url as any).origin);
            }}
            onRemove={remove}
          >
            upload
          </Upload>
        )}
        <Modal visible={visible} footer={null} onCancel={() => setVisible(false)}>
          <img alt="preview" style={{ width: '100%' }} src={previewUrl} />
        </Modal>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Gallery;
