import { extend } from 'umi-request';
import { notification } from 'antd';

/**
 * 异常处理程序
 */
const errorHandler = async (error: { response: Response }): Promise<Response> => {
  const { response } = error;

  if (response && response.status) {
    const errorText = response.statusText;
    const { status, url } = response;
    try {
      const res = await response.json();
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: res.message || errorText,
      });
    } catch (e) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include',
});

// request拦截器, 改变url 或 options.
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token');
  let newUrl = `https://api.powerfulyang.com/api${url}`;
  if (REACT_APP_ENV) {
    newUrl = `/api${url}`;
  }
  if (token) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: token,
    };
    return {
      url: newUrl,
      options: { ...options, headers },
    };
  }
  return {
    url: newUrl,
    options: { ...options },
  };
});

// response拦截器, 处理response
request.interceptors.response.use((response) => {
  const token = response.headers.get('authorization');
  if (token) {
    localStorage.setItem('token', token);
  }
  return response;
});

export default request;
