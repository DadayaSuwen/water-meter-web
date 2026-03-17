import { request } from '@umijs/max';

/**
 * 水表管理 API 服务
 * 对接后端 /api/meter 接口
 */

// 水表数据类型 - 与后端返回匹配
export interface MeterListItem {
  id: string;
  meterNo: string;
  address: string;
  ownerName: string;
  type: string;
  status: 'online' | 'offline' | 'error';
  valveStatus: 'open' | 'closed' | 'error';
  battery: number;
  lastReading: number;
  updateTime: string;
}

/**
 * 获取水表列表 (前端格式) - 管理员 Dashboard 用
 * 对应后端 GET /api/meter/list
 */
export async function getMeterList(params?: any) {
  return request<{
    message: string;
    success: boolean;
    data: MeterListItem[];
    total: number;
  }>('/meter/list', {
    method: 'GET',
    params,
  });
}

/**
 * 获取所有水表列表 (原始格式)
 * 对应后端 GET /api/meter/all
 */
export async function getAllMeters(status?: string) {
  return request<{
    success: boolean;
    data: any[];
  }>('/meter/all', {
    method: 'GET',
    params: { status },
  });
}

/**
 * 获取水表详情
 * 对应后端 GET /api/meter/:meterId
 */
export async function getMeterDetail(meterId: string) {
  return request<{
    success: boolean;
    data: any;
  }>(`/meter/${meterId}`, {
    method: 'GET',
  });
}

/**
 * 创建水表 (管理员)
 * 对应后端 POST /api/meter/create
 */
export async function createMeter(data: {
  serialNumber: string;
  location: string;
  initialReading?: number;
  meterType?: string;
  valveStatus?: string;
  batteryLevel?: number;
}) {
  return request<{
    success: boolean;
    message: string;
    data: any;
  }>('/meter/create', {
    method: 'POST',
    data,
  });
}

/**
 * 更新水表信息 (管理员)
 * 对应后端 PUT /api/meter/:meterId/update
 */
export async function updateMeter(meterId: string, data: any) {
  return request<{
    success: boolean;
    message: string;
    data: any;
  }>(`/meter/${meterId}/update`, {
    method: 'PUT',
    data,
  });
}

/**
 * 删除水表 (管理员)
 * 对应后端 DELETE /api/meter/:meterId
 */
export async function deleteMeter(meterId: string) {
  return request<{
    success: boolean;
    message: string;
  }>(`/meter/${meterId}`, {
    method: 'DELETE',
  });
}

/**
 * 获取待审核的绑定列表 (管理员)
 * 对应后端 GET /api/meter/bindings/pending
 */
export async function getPendingBindings() {
  return request<{
    success: boolean;
    data: any[];
  }>('/meter/bindings/pending', {
    method: 'GET',
  });
}

/**
 * 审核绑定申请 (管理员)
 * 对应后端 PUT /api/meter/binding/review
 */
export async function reviewBinding(data: {
  bindingId: string;
  status: 'APPROVED' | 'REJECTED';
  remark?: string;
}) {
  return request<{
    success: boolean;
    message: string;
    data: any;
  }>('/meter/binding/review', {
    method: 'PUT',
    data,
  });
}

/**
 * 实时抄表指令
 * 注意：后端需要实现此接口
 */
export async function remoteReadMeter(meterId: string) {
  return request<{
    success: boolean;
    message: string;
    data?: { lastReading: number };
  }>(`/meter/${meterId}/read`, {
    method: 'POST',
  });
}

/**
 * 远程开关阀指令
 * 注意：后端需要实现此接口
 */
export async function remoteToggleValve(
  meterId: string,
  action: 'open' | 'close',
) {
  return request<{
    success: boolean;
    message: string;
  }>(`/meter/${meterId}/valve`, {
    method: 'POST',
    data: { action },
  });
}
