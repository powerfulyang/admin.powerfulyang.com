import React, { useEffect, useState } from 'react';
import { Card, message, Pagination, Row, Skeleton } from 'antd';
import request from '@/utils/request';
import { DomUtils, useEffectOnce, useMountedState } from '@powerfulyang/utils';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import './index.less';
import { getSimilarPhoto } from '@/utils/utils';

const getImgUrl = (img: { bucket: { bucketRegionUrl: any }; path: { webp: any; resize: any } }) => {
  const isSupportWebp = DomUtils.isSupportWebp();
  return `${img.bucket.bucketRegionUrl}/${(isSupportWebp && img.path.webp) || img.path.resize}`;
};

const GalleryPHash = () => {
  const [staticList, setStaticList] = useState<any[] | undefined>(undefined);
  const [allStatic, setAllStatic] = useState<any[] | undefined>(undefined);
  const isMounted = useMountedState();
  useEffectOnce(() => {
    request('/static').then((res) => {
      if (isMounted()) {
        setAllStatic(res.data[0]);
      }
    });
  });
  const [pagination, setPagination] = useState({ currentPage: 1, total: 1 });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    if (allStatic) {
      request('/static', { params: { page: pagination.currentPage } }).then((res) => {
        if (isMounted()) {
          setStaticList(
            res.data[0].map((img: any) => {
              return {
                uid: img.staticId,
                url: getImgUrl(img),
                status: 'uploaded',
                origin: `${img.bucket.bucketRegionUrl}/${img.path.origin}`,
                name: img.filename,
                pHash: img.pHash,
              };
            }),
          );
          if (res.data[1]) {
            setPagination({ ...pagination, total: res.data[1] });
          }
          setLoading(false);
        }
      });
    }
  }, [pagination.currentPage, allStatic]);

  const remove = async (id: number) => {
    const res = await request('/static', {
      method: 'DELETE',
      data: { id },
    });
    if (res?.status === 'ok') {
      message.info('删除成功');
    }
  };

  return (
    <PageHeaderWrapper>
      <Card>
        {(!loading &&
          staticList?.map((item) => {
            return (
              <Row key={item.uid}>
                <img
                  onClick={() => remove(item.uid)}
                  style={{ width: '10%', objectFit: 'contain' }}
                  src={item.url}
                  alt=""
                />
                {getSimilarPhoto(item, allStatic as any).map((x) => {
                  return (
                    <img
                      key={x.staticId}
                      style={{ width: '10%', objectFit: 'contain' }}
                      src={getImgUrl(x as any)}
                      alt=""
                      onClick={() => remove(x.staticId)}
                    />
                  );
                })}
              </Row>
            );
          })) || <Skeleton />}
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
