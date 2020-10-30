import { useEffect } from 'react';
import { useImmer } from '@powerfulyang/hooks';
import request from '@/utils/request';
import { Subject } from 'rxjs';

export const useRequest = <T>(url: string, query: object = {}, body: object = {}) => {
  const [loading, setLoading] = useImmer(true);
  const [data, setData] = useImmer<T>();
  useEffect(() => {
    const subject = new Subject();
    subject.subscribe((res) => {
      setData(res as T);
      setLoading(false);
    });
    request(url).then((res) => {
      subject.next(res);
    });
    return () => {
      subject.unsubscribe();
    };
  }, [url, query, body, setData, setLoading]);
  return [loading, data] as const;
};
