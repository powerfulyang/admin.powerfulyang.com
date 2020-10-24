import request from '@/utils/request';

export async function queryBucket() {
  const res = await request('/bucket');
  return { data: res.data[0], total: res.data[1] };
}

export async function addBucket(values: any) {
  return request('/bucket', {
    method: 'POST',
    data: values,
  });
}
