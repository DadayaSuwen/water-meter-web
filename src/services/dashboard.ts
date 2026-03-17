import { request } from '@umijs/max';
/**
 * Dashboard API 服务
 * 对接后端 /api/dashboard 接口
 */

// Dashboard 核心统计数据
export interface DashboardStats {
  networkPressure: number;
  dailySupply: number;
  alertCount: number;
  lossRate: number;
  totalMeters: number;
  onlineMeters: number;
  offlineMeters: number;
  errorMeters: number;
}

// 月度用水趋势数据项
export interface ConsumptionData {
  date: string;
  value: number;
}

// 用水性质占比数据项
export interface TypeData {
  type: string;
  value: number;
}

// 区域水压数据项
export interface PressureData {
  area: string;
  pressure: number;
}

// 水库状态
export interface ReservoirStatus {
  percent: number;
  capacity: number;
  current: number;
}

/**
 * 获取 Dashboard 核心统计数据
 * 对应后端 GET /api/dashboard/stats
 */
export async function getDashboardStats() {
  return request<{
    success: boolean;
    data: DashboardStats;
  }>('/dashboard/stats', {
    method: 'GET',
  });
}

/**
 * 获取月度用水趋势数据
 * 对应后端 GET /api/dashboard/consumption-trend
 */
export async function getConsumptionTrend(months: number = 6) {
  return request<{
    success: boolean;
    data: ConsumptionData[];
  }>('/dashboard/consumption-trend', {
    method: 'GET',
    params: { months },
  });
}

/**
 * 获取用水性质占比数据
 * 对应后端 GET /api/dashboard/water-type-distribution
 */
export async function getWaterTypeDistribution() {
  return request<{
    success: boolean;
    data: TypeData[];
  }>('/dashboard/water-type-distribution', {
    method: 'GET',
  });
}

/**
 * 获取各区域水压数据
 * 对应后端 GET /api/dashboard/area-pressure
 */
export async function getAreaPressure() {
  return request<{
    success: boolean;
    data: PressureData[];
  }>('/dashboard/area-pressure', {
    method: 'GET',
  });
}

/**
 * 获取水库蓄水状态
 * 对应后端 GET /api/dashboard/reservoir-status
 */
export async function getReservoirStatus() {
  return request<{
    success: boolean;
    data: ReservoirStatus;
  }>('/dashboard/reservoir-status', {
    method: 'GET',
  });
}
