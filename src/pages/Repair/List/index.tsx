import {
  CheckCircleOutlined,
  PlusOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import {
  Avatar,
  Button,
  Drawer,
  message,
  Popconfirm,
  Space,
  Tag,
  Timeline,
} from 'antd';
import React, { useRef, useState } from 'react';
import { 
  getAllRepairTickets, 
  updateRepairTicket, 
  TicketListItem 
} from '@/services/repair';

const TicketList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  // ================= 状态管理：控制详情抽屉 =================
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<TicketListItem>();

  // ================= 1. 调用后端 API 获取工单列表 =================
  const requestTicketList = async (params: any, sort: any, filter: any) => {
    try {
      const response = await getAllRepairTickets(params.status);
      
      if (response.success) {
        // 转换后端数据格式为前端格式
        const data = (response.data || []).map((item: any) => ({
          id: item.id,
          ticketNo: `REP-${item.id.slice(-8)}`,
          reporter: item.user?.username || '未知用户',
          phone: item.user?.phone || '-',
          address: item.meter?.location || '-',
          issueType: item.description?.slice(0, 20) || '报修',
          priority: 'medium' as const,
          status: item.status?.toLowerCase() || 'pending',
          assignee: item.handledBy || '-',
          createTime: item.createdAt || new Date().toISOString(),
        }));
        
        return { data, success: true, total: data.length };
      } else {
        message.error(response.message || '获取工单列表失败');
        return { data: [], success: false, total: 0 };
      }
    } catch (error) {
      console.error('获取工单列表失败:', error);
      message.error('获取工单列表失败，请稍后重试');
      return { data: [], success: false, total: 0 };
    }
  };

  // ================= 2. 模拟操作动作 =================
  const handleDispatch = (record: TicketListItem) => {
    message.loading({
      content: `正在为工单 ${record.ticketNo} 智能匹配维修人员...`,
      key: 'dispatch',
    });
    setTimeout(() => {
      message.success({
        content: `派单成功！已将工单下发至维修组。`,
        key: 'dispatch',
      });
      actionRef.current?.reload();
    }, 1500);
  };

  const handleResolve = (record: TicketListItem) => {
    message.success(`工单 ${record.ticketNo} 已标记为处理完成`);
    actionRef.current?.reload();
  };

  // ================= 3. 定义表格列 =================
  const columns: ProColumns<TicketListItem>[] = [
    {
      title: '工单编号',
      dataIndex: 'ticketNo',
      copyable: true,
      width: 150,
      fixed: 'left',
      renderText: (val) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{val}</span>
      ),
    },
    {
      title: '工单状态',
      dataIndex: 'status',
      width: 120,
      valueEnum: {
        pending: { text: '待派单', status: 'Error' },
        processing: { text: '处理中', status: 'Processing' },
        resolved: { text: '已解决', status: 'Success' },
        closed: { text: '已归档', status: 'Default' },
      },
    },
    {
      title: '紧急程度',
      dataIndex: 'priority',
      width: 100,
      valueEnum: {
        high: { text: '紧急', status: 'Error' },
        medium: { text: '一般', status: 'Warning' },
        low: { text: '暂缓', status: 'Default' },
      },
      render: (_, record) => {
        if (record.priority === 'high') return <Tag color="error">紧急</Tag>;
        if (record.priority === 'medium')
          return <Tag color="warning">一般</Tag>;
        return <Tag color="default">暂缓</Tag>;
      },
    },
    {
      title: '故障类型',
      dataIndex: 'issueType',
      width: 120,
      filters: true,
      onFilter: true,
    },
    { title: '报修人', dataIndex: 'reporter', width: 100, hideInSearch: true },
    { title: '联系电话', dataIndex: 'phone', width: 120 },
    {
      title: '报修地址',
      dataIndex: 'address',
      ellipsis: true,
      width: 200,
      hideInSearch: true,
    },
    {
      title: '处理人',
      dataIndex: 'assignee',
      width: 120,
      hideInSearch: true,
      render: (_, record) =>
        record.assignee ? (
          <Space>
            <Avatar size="small" style={{ backgroundColor: '#1677ff' }}>
              {record.assignee.charAt(0)}
            </Avatar>
            <span>{record.assignee}</span>
          </Space>
        ) : (
          <span style={{ color: '#bfbfbf' }}>暂未分配</span>
        ),
    },
    {
      title: '报修时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 160,
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 180,
      render: (text, record, _, action) => [
        record.status === 'pending' && (
          <a key="dispatch" onClick={() => handleDispatch(record)}>
            <Space>
              <UserSwitchOutlined /> 派单
            </Space>
          </a>
        ),
        record.status === 'processing' && (
          <Popconfirm
            key="resolve"
            title="确认该工单已修复完成？"
            onConfirm={() => handleResolve(record)}
          >
            <a style={{ color: '#52c41a' }}>
              <Space>
                <CheckCircleOutlined /> 结单
              </Space>
            </a>
          </Popconfirm>
        ),
        // 👇 核心交互：点击打开抽屉并注入当前行数据
        <a
          key="detail"
          style={{ color: '#1677ff' }}
          onClick={() => {
            setCurrentRow(record);
            setDrawerVisible(true);
          }}
        >
          查看详情
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TicketListItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={requestTicketList}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        dateFormatter="string"
        headerTitle="报修工单台账"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary">
            人工建单
          </Button>,
        ]}
      />

      {/* ================= 核心组件：侧边详情抽屉 ================= */}
      <Drawer
        width={600}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setCurrentRow(undefined);
        }}
        closable={false}
        title={
          <span style={{ fontWeight: 'bold' }}>
            工单详情 - {currentRow?.ticketNo}
          </span>
        }
      >
        {currentRow?.ticketNo && (
          <>
            <ProDescriptions<TicketListItem>
              column={2}
              title="📍 基础报修信息"
              request={async () => ({ data: currentRow })}
              params={{ id: currentRow?.ticketNo }}
              columns={[
                { title: '报修人', dataIndex: 'reporter' },
                { title: '联系电话', dataIndex: 'phone' },
                { title: '故障类型', dataIndex: 'issueType' },
                {
                  title: '报修时间',
                  dataIndex: 'createTime',
                  valueType: 'dateTime',
                },
                { title: '详细地址', dataIndex: 'address', span: 2 },
              ]}
            />

            <div
              style={{
                margin: '32px 0 16px 0',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              ⏱ 处理进度追踪
            </div>

            {/* 动态时间轴，根据工单状态点亮不同的进度 */}
            <Timeline
              items={[
                {
                  color: 'green',
                  children: `【系统收单】用户通过小程序提交了工单报修 (${currentRow.createTime})`,
                },
                {
                  color: currentRow.status === 'pending' ? 'gray' : 'green',
                  children:
                    currentRow.status === 'pending'
                      ? '【等待派单】系统正在智能调度附近维修人员...'
                      : `【已派单】已委派给维修工程师：${
                          currentRow.assignee || '系统自动指派'
                        }`,
                },
                {
                  color:
                    currentRow.status === 'resolved' ||
                    currentRow.status === 'closed'
                      ? 'green'
                      : currentRow.status === 'processing'
                      ? 'blue'
                      : 'gray',
                  children:
                    currentRow.status === 'resolved' ||
                    currentRow.status === 'closed'
                      ? '【处理完成】维修人员已修复故障并上传现场照片。'
                      : '【现场处理】工程师正在现场抢修中...',
                },
                {
                  color: currentRow.status === 'closed' ? 'green' : 'gray',
                  children:
                    currentRow.status === 'closed'
                      ? '【工单归档】已完成客服回访，工单正式闭环。'
                      : '【工单归档】等待最终确认闭环。',
                },
              ]}
            />
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TicketList;
