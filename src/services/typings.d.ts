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
}
