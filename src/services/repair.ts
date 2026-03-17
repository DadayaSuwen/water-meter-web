import { request } from '@umijs/max';

/**
 * 报修工单 API 服务
 * 对应后端 /api/repair 接口
 */

// 报修工单数据类型
export interface TicketListItem {
  id: string;
  ticketNo?: string;
  reporter?: string;
  phone?: string;
  address?: string;
  meterId?: string;
  meterSerialNumber?: string;
  description: string;
  images?: string[];
  priority?: 'high' | 'medium' | 'low';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
  remark?: string;
  assignee?: string;
  createTime: string;
}

// 报修统计
export interface RepairStatistics {
  total: number;
  pending: number;
  processing: number;
  completed: number;
}

/**
 * 获取用户的报修工单列表
 * 对应后端 GET /api/repair/tickets
 */
export async function getRepairTickets(status?: string) {
  return request<{
    success: boolean;
    data: TicketListItem[];
  }>('/repair/tickets', {
    method: 'GET',
    params: { status },
  });
}

/**
 * 获取所有报修工单 (管理员)
 * 对应后端 GET /api/repair/tickets/all
 */
export async function getAllRepairTickets(status?: string) {
  return request<{
    success: boolean;
    data: TicketListItem[];
  }>('/repair/tickets/all', {
    method: 'GET',
    params: { status },
  });
}

/**
 * 获取待处理的报修工单 (管理员)
 * 对应后端 GET /api/repair/tickets/pending
 */
export async function getPendingRepairTickets() {
  return request<{
    success: boolean;
    data: TicketListItem[];
  }>('/repair/tickets/pending', {
    method: 'GET',
  });
}

/**
 * 提交报修工单
 * 对应后端 POST /api/repair/ticket
 */
export async function createRepairTicket(data: {
  meterId: string;
  description: string;
  images?: string[];
}) {
  return request<{
    success: boolean;
    message: string;
    data: any;
  }>('/repair/ticket', {
    method: 'POST',
    data,
  });
}

/**
 * 更新工单状态 (管理员)
 * 对应后端 PUT /api/repair/ticket/:ticketId
 */
export async function updateRepairTicket(
  ticketId: string,
  data: {
    status: 'PROCESSING' | 'COMPLETED';
    remark?: string;
  }
) {
  return request<{
    success: boolean;
    message: string;
    data: any;
  }>(`/repair/ticket/${ticketId}`, {
    method: 'PUT',
    data,
  });
}

/**
 * 获取报修统计信息 (管理员)
 * 对应后端 GET /api/repair/statistics
 */
export async function getRepairStatistics() {
  return request<{
    success: boolean;
    data: RepairStatistics;
  }>('/repair/statistics', {
    method: 'GET',
  });
}
