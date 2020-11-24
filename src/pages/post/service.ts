import request from '@/utils/request';

export async function queryPosts() {
  const res = await request('/post');
  return { data: res.data, total: res.total };
}
