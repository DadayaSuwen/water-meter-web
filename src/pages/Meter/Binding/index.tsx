import {
  CheckOutlined,
  CloseOutlined,
  SafetyCertificateTwoTone,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Alert, Avatar, message, Popconfirm, Space } from 'antd';
import React, { useRef } from 'react';

type BindingRequest = {
  id: string;
  applicant: string;
  phone: string;
  idCard: string;
  meterNo: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  applyTime: string;
};

const BindingApproval: React.FC = () => {
  const actionRef = useRef<ActionType>();

  // 模拟请求
  const requestBindingList = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const mockData: BindingRequest[] = [
      {
        id: '1',
        applicant: '张三',
        phone: '13800138000',
        idCard: '440106********1234',
        meterNo: 'WM-2025001',
        address: '高新区科技园A栋101',
        status: 'pending',
        applyTime: '2026-03-12 10:30:00',
      },
      {
        id: '2',
        applicant: '李四',
        phone: '13912345678',
        idCard: '440106********5678',
        meterNo: 'WM-2025002',
        address: '高新区科技园A栋102',
        status: 'pending',
        applyTime: '2026-03-12 09:15:00',
      },
      {
        id: '3',
        applicant: '王五',
        phone: '13788889999',
        idCard: '440106********9012',
        meterNo: 'WM-2025003',
        address: '老城区幸福小区3栋201',
        status: 'approved',
        applyTime: '2026-03-11 14:20:00',
      },
      {
        id: '4',
        applicant: '赵六',
        phone: '15011112222',
        idCard: '440106********3456',
        meterNo: 'WM-2025088',
        address: '开发区创新路88号',
        status: 'rejected',
        applyTime: '2026-03-10 10:05:00',
      },
    ];
    return { data: mockData, success: true, total: 24 };
  };

  // 审批动作
  const handleApprove = (record: BindingRequest) => {
    message.success(
      `已通过【${record.applicant}】针对水表 ${record.meterNo} 的绑定申请`,
    );
    actionRef.current?.reload();
  };

  const handleReject = (record: BindingRequest) => {
    message.warning(`已驳回【${record.applicant}】的绑定申请`);
    actionRef.current?.reload();
  };

  const columns: ProColumns<BindingRequest>[] = [
    {
      title: '申请人',
      dataIndex: 'applicant',
      width: 100,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#87d068' }}>
            {record.applicant.charAt(0)}
          </Avatar>
          <span>{record.applicant}</span>
        </Space>
      ),
    },
    { title: '联系电话', dataIndex: 'phone', width: 120 },
    {
      title: '脱敏身份证',
      dataIndex: 'idCard',
      width: 160,
      hideInSearch: true,
      renderText: (val) => (
        <span style={{ fontFamily: 'monospace' }}>{val}</span>
      ),
    },
    { title: '申请绑定水表', dataIndex: 'meterNo', width: 150, copyable: true },
    {
      title: '实际安装地址',
      dataIndex: 'address',
      width: 200,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      width: 120,
      valueEnum: {
        pending: { text: '待审核', status: 'Processing' },
        approved: { text: '已通过', status: 'Success' },
        rejected: { text: '已驳回', status: 'Error' },
      },
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      valueType: 'dateTime',
      width: 160,
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (_, record) => {
        if (record.status !== 'pending')
          return <span style={{ color: '#bfbfbf' }}>已处理</span>;
        return [
          <Popconfirm
            key="pass"
            title="确认该用户的身份信息无误并同意绑定？"
            onConfirm={() => handleApprove(record)}
          >
            <a style={{ color: '#52c41a' }}>
              <CheckOutlined /> 通过
            </a>
          </Popconfirm>,
          <Popconfirm
            key="reject"
            title="确定要驳回该申请吗？"
            onConfirm={() => handleReject(record)}
          >
            <a style={{ color: '#ff4d4f' }}>
              <CloseOutlined /> 驳回
            </a>
          </Popconfirm>,
        ];
      },
    },
  ];

  return (
    <PageContainer>
      <Alert
        message="实名认证安全规范"
        description="审核绑定请求时，请务必核实申请人的身份证信息与系统预留户主信息是否一致，防止恶意篡改设备归属权。"
        type="info"
        showIcon
        icon={<SafetyCertificateTwoTone />}
        style={{ marginBottom: 16 }}
      />
      <ProTable<BindingRequest>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={requestBindingList}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10 }}
        headerTitle="住户水表绑定申请列表"
      />
    </PageContainer>
  );
};

export default BindingApproval;
