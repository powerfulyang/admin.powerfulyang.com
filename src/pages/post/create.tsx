import React from 'react';
import { Col, Input, Row } from 'antd';
import { MarkdownWrap } from '@powerfulyang/components';
import { useImmer } from '@powerfulyang/hooks';

const Create = () => {
  const [post, setPost] = useImmer('');
  return (
    <>
      <Row>
        <Col span={10} offset={1}>
          <Input.TextArea
            style={{ height: '100%' }}
            onChange={(e) => {
              setPost(e.target.value);
            }}
          />
        </Col>
        <Col span={10} offset={2}>
          <MarkdownWrap source={post} />
        </Col>
      </Row>
    </>
  );
};

export default Create;
