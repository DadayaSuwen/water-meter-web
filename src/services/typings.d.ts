declare namespace API {
  interface LoginParams {
    username: string;
    password: string;
  }
  interface UserInfo {
    data: {
      user: API.CurrentUser;
    };
  }
  /** 用户角色 */
  type Role = 'RESIDENT' | 'ADMIN'; //

  /** 水表状态 */
  type MeterStatus = 'NORMAL' | 'FAULTY'; //

  /** 绑定状态 */
  type BindingStatus = 'PENDING' | 'APPROVED' | 'REJECTED'; //

  /** 工单状态 */
  type TicketStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED'; //

  /** 基础用户信息 */
  type CurrentUser = {
    id: string;
    username: string;
    phone?: string;
    avatar?: string;
    role: Role;
    openid: string;
  };

  /** 水表模型 */
  type Meter = {
    id: string;
    serialNumber: string;
    location: string;
    status: MeterStatus;
    lastReading: number;
    createdAt: string;
  };

  /** 水表列表项 (前端格式) */
  type MeterListItem = {
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
  };

  /** 工单列表项 */
  type TicketListItem = {
    id: string;
    ticketNo?: string;
    reporter?: string;
    phone?: string;
    address?: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED';
    remark?: string;
    assignee?: string;
    createTime: string;
  };

  /** 用水统计 */
  type UsageStatistics = {
    totalMeters: number;
    totalUsage: number;
    currentMonthUsage: number;
    averageMonthlyUsage: number;
  };

  /** Dashboard 统计 */
  type DashboardStats = {
    networkPressure: number;
    dailySupply: number;
    alertCount: number;
    lossRate: number;
    totalMeters: number;
    onlineMeters: number;
    offlineMeters: number;
    errorMeters: number;
  };
}
