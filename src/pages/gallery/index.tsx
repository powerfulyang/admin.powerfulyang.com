import React, { useEffect, useState } from 'react';
import { Card, Modal, Pagination, Skeleton, Upload } from 'antd';
import request from '@/utils/request';
import { DomUtils, useMountedState } from '@powerfulyang/utils';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { UploadFile } from 'antd/es/upload/interface';
import './index.less';

const Gallery = () => {
  const [staticList, setStaticList] = useState(undefined);
  const [pagination, setPagination] = useState({ currentPage: 1, total: 1 });
  const isMounted = useMountedState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const isSupportWebp = DomUtils.isSupportWebp();
    request('/static', { params: { page: pagination.currentPage } }).then((res) => {
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
        if (res.data[1]) {
          setPagination({ ...pagination, total: res.data[1] });
        }
        setLoading(false);
      }
    });
  }, [pagination.currentPage]);
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
        {(!loading && (
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
