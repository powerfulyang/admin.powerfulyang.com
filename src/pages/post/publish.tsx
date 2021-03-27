import React from 'react';
import { Button, Card, Col, Input, message, Row, Tag } from 'antd';
import { MarkdownWrap } from '@powerfulyang/components';
import { useImmer, usePageQuery, useRequest } from '@powerfulyang/hooks';
import request from '@/utils/request';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history } from 'umi';
import './publish.less';

const Publish = () => {
  const [post, setPost] = useImmer('');
  const [tags, setTags] = useImmer<Set<string>>(new Set());
  const id = usePageQuery('id');
  useRequest({
    url: `/post/${id}`,
    resTransform: async (res) => {
      const { data } = await res.json();
      setPost(data.content);
      setTags(new Set(data.tags || []));
    },
    runCase: !!id,
  });
  const postBlog = async () => {
    if (!post || post.split('\n').filter((x) => x).length < 2 || !post.startsWith('# ')) {
      message.error('内容不能为空!');
      return;
    }
    const res = await request('/post', {
      method: 'POST',
      data: {
        content: post,
        title: post.split('\n')[0].replace('#', '').trim(),
        id,
        tags: Array.from(tags),
      },
    });
    if (res.status === 'ok') {
      message.success('提交成功!');
      history.push({
        query: {
          id: res.data.id,
        },
      });
    }
  };
  return (
    <PageHeaderWrapper>
      <Card>
        <Row justify="center" style={{ marginBottom: '1rem' }}>
          {Array.from(tags).map((tag) => (
            <Tag
              closable
              onClose={() => {
                setTags((draft) => {
                  draft.delete(tag);
                });
              }}
              key={tag}
            >
              {tag}
            </Tag>
          ))}
          <Input
            onPressEnter={(e) => {
              const tag = e.currentTarget.value;
              setTags((draft) => {
                draft.add(tag);
              });
            }}
            className="tag-input"
            size="small"
          />
        </Row>
        <Row style={{ minHeight: '41rem' }}>
          <Col span={10} offset={1}>
            <Input.TextArea
              style={{ height: '100%' }}
              onChange={(e) => {
                setPost(e.target.value);
              }}
              value={post}
            />
          </Col>
          <Col style={{ border: '1px dashed #ccc', padding: '0 2rem' }} span={10} offset={2}>
            <MarkdownWrap source={post} />
          </Col>
        </Row>
        <Row justify="center" style={{ marginTop: '1rem' }}>
          <Button type="primary" onClick={postBlog}>
            post blog
          </Button>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Publish;
