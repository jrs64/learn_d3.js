import { request } from 'umi';

export interface BasicBarData {
  data: Array<{ name: string, value: number }>
}

export async function getBasicBarData() {
  return request<BasicBarData>('/api/basic-data');
}