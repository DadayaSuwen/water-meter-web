import { request } from '@umijs/max';

/**
 * 用水统计 API 服务
 * 对应后端 /api/usage 接口
 */

// 用水统计数据
export interface UsageStatistics {
  totalMeters: number;
  totalUsage: number;
  currentMonthUsage: number;
  averageMonthlyUsage: number;
}

// 月度用水记录
export interface MonthlyUsage {
  period: string;
  amount: number;
  cost: number;
  meterCount?: number;
}

// 水表用水历史
export interface MeterUsage {
  period: string;
  amount: number;
  cost: number;
  createdAt: string;
}

/**
 * 获取用户用水统计
 * 对应后端 GET /api/usage/statistics
 */
export async function getUsageStatistics() {
  return request<{
    success: boolean;
    data: UsageStatistics;
  }>('/usage/statistics', {
    method: 'GET',
  });
}

/**
 * 获取用户月度用水记录
 * 对应后端 GET /api/usage/monthly
 */
export async function getMonthlyUsage(limit: number = 12) {
  return request<{
    success: boolean;
    data: MonthlyUsage[];
  }>('/usage/monthly', {
    method: 'GET',
    params: { limit },
  });
}

/**
 * 获取水表用水历史记录
 * 对应后端 GET /api/usage/meter/:meterId
 */
export async function getMeterUsageHistory(meterId: string, limit: number = 24) {
  return request<{
    success: boolean;
    data: MeterUsage[];
  }>(`/usage/meter/${meterId}`, {
    method: 'GET',
    params: { limit },
  });
}

/**
 * 计算水表平均用水量
 * 对应后端 GET /api/usage/average/:meterId
 */
export async function getMeterAverageUsage(meterId: string, months: number = 12) {
  return request<{
    success: boolean;
    data: {
      meterId: string;
      months: number;
      averageUsage: number;
    };
  }>(`/usage/average/${meterId}`, {
    method: 'GET',
    params: { months },
  });
}
