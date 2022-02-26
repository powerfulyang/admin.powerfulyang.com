import React from 'react';
import { Button, Form, Input, message, Modal, Row, Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { addBucket } from '../service';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  onOk: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, onOk } = props;
  /**
   * 添加节点
   */
  const handleAdd = async (values: any) => {
    const hide = message.loading('正在添加');
    await addBucket(values);
      hide();
      message.success('添加成功');
      onOk();
  };
  return (
    <Modal
      destroyOnClose
      title="新建bucket"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form
        labelCol={{ span: 7 }}
        onFinish={handleAdd}
        initialValues={{ bucketRegion: 'ap-shanghai' }}
      >
        <FormItem
          name="bucketName"
          label="bucketName"
          rules={[{ required: true, message: '请输入bucketName！' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="bucketRegion"
          label="bucketRegion"
          rules={[{ required: true, message: '请输入bucketRegion！' }]}
        >
          <Select
            placeholder="请输入"
            options={[
              {
                value: 'ap-shanghai',
              },
            ]}
          />
        </FormItem>
        <Row justify="end">
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateForm;
