import { useEffect } from 'react';
import { useImmer } from '@powerfulyang/hooks';
import { Subject } from 'rxjs';
import { RequestOptionsInit } from 'umi-request';
import request from '@/utils/request';

export const useRequest = <T = any, P = any>(
  url: string,
  options: {
    params?: Pick<RequestOptionsInit, 'params'> & P;
    data?: Pick<RequestOptionsInit, 'data'> & P;
    method?: string;
    initialVal?: T;
  } = {},
) => {
  const { params, data, method = 'GET', initialVal } = options;
  const [loading, setLoading] = useImmer(true);
  const [response, setResponse] = useImmer<T>(initialVal);
  useEffect(() => {
    setLoading(true);
    const subject = new Subject();
    subject.subscribe((res) => {
      setResponse(res as T);
      setLoading(false);
    });
    request(url, { params, data, method }).then((res) => {
      subject.next(res);
    });
    return () => {
      subject.unsubscribe();
    };
  }, [url, setLoading, method, params, data, setResponse]);
  return [loading, response] as const;
};
