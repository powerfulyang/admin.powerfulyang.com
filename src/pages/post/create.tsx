import React from 'react';
import { Button, Card, Col, Input, message, Row } from 'antd';
import { MarkdownWrap } from '@powerfulyang/components';
import { useImmer } from '@powerfulyang/hooks';
import request from '@/utils/request';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const Create = () => {
  const [post, setPost] = useImmer('');
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
      },
    });
    if (res.status === 'ok') {
      message.success('创建成功!');
      setPost('');
    }
  };
  return (
    <PageHeaderWrapper>
      <Card>
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
          <Col style={{ border: '1px dashed #ccc' }} span={10} offset={2}>
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

export default Create;
