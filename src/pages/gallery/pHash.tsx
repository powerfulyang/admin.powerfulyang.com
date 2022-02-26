import { useEffect } from 'react';
import { Card, Col, message, Modal, Pagination, Row, Skeleton } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import './index.scss';
import { useImmer } from '@powerfulyang/hooks';
import { useRequest } from '@/hooks/useRequest';
import { getCosObjectThumbnailUrl } from '@/utils/cosUtils';
import request from '@/utils/request';

const GalleryPHash = () => {
  const [pagination, setPagination] = useImmer({ currentPage: 1, total: 1 });
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

  useEffect(() => {
    setPagination((draft) => {
      draft.total = Object.keys(pHashDistance).length;
    });
  }, [pHashDistance, setPagination]);

  const removeSimilarImage = async (id: number) => {
    Modal.confirm({
      title: '确认删除图片?',
      async onOk() {
         await request('/asset', {
          method: 'DELETE',
          data: {
            id,
          },
        });
          message.success('删除成功！');
      },
    });
  };

  return (
    <PageHeaderWrapper>
      <Card>
        {((loading1 || loading2) && <Skeleton />) ||
          Object.entries(pHashDistance)
            .slice(20 * (pagination.currentPage - 1), 20 * pagination.currentPage)
            .map(([key, val]) => {
              const target = assets.find((item) => item.id === Number(key));
              const likeUrls = assets.filter((item) =>
                val
                  .flat(Infinity)
                  .map((value) => Number(value))
                  .includes(item.id),
              );
              return (
                <Row key={key}>
                  <Col onClick={() => removeSimilarImage(target?.id!)}>
                    {target?.id}
                    <img
                      style={{ width: '300px' }}
                      className="cursor-pointer"
                      src={getCosObjectThumbnailUrl(target?.objectUrl!)}
                      alt=""
                    />
                  </Col>
                  {likeUrls.map((obj) => (
                    <Col key={obj.id} onClick={() => removeSimilarImage(obj.id)}>
                      {obj.id}
                      <img
                        style={{ width: '300px' }}
                        className="cursor-pointer"
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
            setPagination((draft) => {
              draft.currentPage = page;
            });
          }}
          total={pagination.total}
          pageSizeOptions={['20']}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default GalleryPHash;
