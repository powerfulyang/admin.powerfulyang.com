import React, { useState } from 'react';
import { Card, Col, Pagination, Row, Skeleton } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import './index.scss';
import { useRequest } from '@/hooks/useRequest';
import { getCosObjectThumbnailUrl } from '@/utils/cosUtils';

const GalleryPHash = () => {
  const [pagination, setPagination] = useState({ currentPage: 1, total: 1 });
  const [loading1, { data: assets }] = useRequest<{ data: { id: number; objectUrl: string }[] }>(
    '/asset/all',
    {
      initialVal: {
        data: [{ objectUrl: '', id: 0 }],
      },
    },
  );
  const [loading2, { data: pHashDistance }] = useRequest<{ data: { [key: string]: number[][] } }>(
    '/asset/pHash/distance',
    {
      initialVal: {
        data: {
          1: [[1]],
        },
      },
    },
  );

  return (
    <PageHeaderWrapper>
      <Card>
        {((loading1 || loading2) && <Skeleton />) ||
          Object.entries(pHashDistance).map(([key, val]) => {
            const target = assets.find((item) => item.id === Number(key));
            const likeUrls = assets.filter((item) =>
              val
                .flat(Infinity)
                .map((value) => Number(value))
                .includes(item.id),
            );
            return (
              <Row key={key}>
                <Col>
                  {target?.id}
                  <img
                    style={{ width: '200px' }}
                    src={getCosObjectThumbnailUrl(target?.objectUrl!)}
                    alt=""
                  />
                </Col>
                {likeUrls.map((obj) => (
                  <Col key={obj.id}>
                    {obj.id}
                    <img
                      style={{ width: '200px' }}
                      src={getCosObjectThumbnailUrl(obj.objectUrl)}
                      alt=""
                    />
                  </Col>
                ))}
                <Col />
              </Row>
            );
          })}
        <Pagination
          style={{ marginTop: '1rem' }}
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
