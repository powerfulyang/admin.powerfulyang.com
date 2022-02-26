import {GithubFilled, GoogleCircleFilled} from '@ant-design/icons';
import { Alert, Checkbox, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, Dispatch } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/Login';

import styles from './style.less';
import { getPageQuery } from '@/utils/utils';

const { Tab, UserName, Password, Submit } = LoginForm;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [type, setType] = useState<string>('account');
  const [form] = Form.useForm();
  useEffect(() => {
    const password = localStorage.getItem('password');
    const email = localStorage.getItem('email');
    if (password && email) {
      form.setFieldsValue({
        password,
        email,
        autoLogin: true,
      });
    }
  }, [form]);

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };

  const { redirect } = getPageQuery();
  return (
    <div className={styles.main}>
      <LoginForm form={form} activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码登录">
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content="账户或密码错误（admin/ant.design）" />
          )}

          <UserName
            name="email"
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </Tab>
        <Form.Item name="autoLogin" valuePropName="checked">
          <Checkbox>记住密码</Checkbox>
        </Form.Item>
        <Submit loading={submitting}>登录</Submit>
        <div className={styles.other}>
          其他登录方式
          <a
            href={`${API_ENV}/user/google/auth?redirect=${encodeURI(
              (redirect as string) || window.location.origin,
            )}`}
          >
            <GoogleCircleFilled className={styles.icon} />

          </a>
          <a href={`${API_ENV}/user/github/auth?redirect=${encodeURI(
            (redirect as string) || window.location.origin,
          )}`}>
            <GithubFilled className={styles.icon} />
          </a>
        </div>
      </LoginForm>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
