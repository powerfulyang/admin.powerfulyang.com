import React from 'react';
import { Button, Form, Input, message, Modal } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { addBucket } from '../service';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel } = props;
  /**
   * 添加节点
   */
  const handleAdd = async (values: any) => {
    const hide = message.loading('正在添加');
    try {
      const res = await addBucket(values);
      if (res.status === 'ok') {
        hide();
        message.success('添加成功');
        onCancel();
      } else {
        hide();
        message.error('添加失败请重试！');
      }
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
    }
  };
  return (
    <Modal
      destroyOnClose
      title="新建bucket"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form labelCol={{ span: 5 }} onFinish={handleAdd}>
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
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="SecretId"
          label="SecretId"
          rules={[{ required: true, message: '请输入SecretId！' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="SecretKey"
          label="SecretKey"
          rules={[{ required: true, message: '请输入SecretKey！' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateForm;
