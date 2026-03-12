import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import {
  Badge,
  Button,
  Drawer,
  message,
  Popconfirm,
  Progress,
  Tag,
  Timeline,
} from 'antd';
import React, { useRef, useState } from 'react';

// 定义水表数据模型
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

const MeterList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  // ================= 状态管理：控制详情抽屉 =================
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<MeterListItem>();

  // ================= 1. 模拟后端接口请求 =================
  const requestMeterList = async (params: any, sort: any, filter: any) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockData: MeterListItem[] = [
      {
        id: '1',
        meterNo: 'WM-2025001',
        address: '高新区科技园A栋101',
        ownerName: '张三',
        type: 'NB-IoT智能表',
        status: 'online',
        valveStatus: 'open',
        battery: 85,
        lastReading: 125.4,
        updateTime: '2026-03-12 10:30:00',
      },
      {
        id: '2',
        meterNo: 'WM-2025002',
        address: '高新区科技园A栋102',
        ownerName: '李四',
        type: 'NB-IoT智能表',
        status: 'online',
        valveStatus: 'open',
        battery: 92,
        lastReading: 88.2,
        updateTime: '2026-03-12 11:15:00',
      },
      {
        id: '3',
        meterNo: 'WM-2025003',
        address: '老城区幸福小区3栋201',
        ownerName: '王五',
        type: 'LoRa远传表',
        status: 'offline',
        valveStatus: 'open',
        battery: 15,
        lastReading: 342.1,
        updateTime: '2026-03-10 08:20:00',
      },
      {
        id: '4',
        meterNo: 'WM-2025004',
        address: '城北区商业广场B座',
        ownerName: '万达物业',
        type: '超声波大表',
        status: 'error',
        valveStatus: 'error',
        battery: 60,
        lastReading: 1520.8,
        updateTime: '2026-03-12 09:05:00',
      },
      {
        id: '5',
        meterNo: 'WM-2025005',
        address: '开发区创新路88号',
        ownerName: '赵六',
        type: 'NB-IoT智能表',
        status: 'online',
        valveStatus: 'closed',
        battery: 45,
        lastReading: 45.0,
        updateTime: '2026-03-12 14:00:00',
      },
    ];

    return { data: mockData, success: true, total: 154 };
  };

  // ================= 2. 模拟操作动作 =================
  const handleReadMeter = (record: MeterListItem) => {
    message.loading({
      content: `正在向表 ${record.meterNo} 发送抄表指令...`,
      key: 'read',
    });
    setTimeout(() => {
      message.success({
        content: `水表 ${record.meterNo} 抄表成功！最新读数已更新。`,
        key: 'read',
      });
      actionRef.current?.reload();
    }, 1500);
  };

  const handleToggleValve = (record: MeterListItem) => {
    const action = record.valveStatus === 'open' ? '关阀' : '开阀';
    message.success(`已下发【${action}】指令到水表 ${record.meterNo}`);
  };

  // ================= 3. 定义表格列 =================
  const columns: ProColumns<MeterListItem>[] = [
    {
      title: '水表编号',
      dataIndex: 'meterNo',
      copyable: true,
      width: 120,
      fixed: 'left',
    },
    { title: '安装地址', dataIndex: 'address', ellipsis: true, width: 180 },
    { title: '所属用户', dataIndex: 'ownerName', width: 100 },
    {
      title: '设备类型',
      dataIndex: 'type',
      width: 120,
      filters: true,
      onFilter: true,
    },
    {
      title: '在线状态',
      dataIndex: 'status',
      width: 100,
      valueEnum: {
        online: { text: '设备在线', status: 'Success' },
        offline: { text: '离线掉线', status: 'Default' },
        error: { text: '硬件告警', status: 'Error' },
      },
    },
    {
      title: '阀门状态',
      dataIndex: 'valveStatus',
      width: 100,
      hideInSearch: true,
      render: (_, record) => {
        if (record.valveStatus === 'open') return <Tag color="blue">开启</Tag>;
        if (record.valveStatus === 'closed')
          return <Tag color="default">关闭</Tag>;
        return <Tag color="red">异常</Tag>;
      },
    },
    {
      title: '剩余电量',
      dataIndex: 'battery',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <Progress
          percent={record.battery}
          size="small"
          status={record.battery < 20 ? 'exception' : 'active'}
          strokeColor={record.battery < 20 ? '#ff4d4f' : '#52c41a'}
        />
      ),
    },
    {
      title: '最后读数(m³)',
      dataIndex: 'lastReading',
      width: 120,
      hideInSearch: true,
      render: (_, record) => (
        <span style={{ fontWeight: 'bold', color: '#1677ff' }}>
          {record.lastReading}
        </span>
      ),
    },
    {
      title: '最后通讯时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      width: 160,
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 200,
      render: (text, record, _, action) => [
        <a key="read" onClick={() => handleReadMeter(record)}>
          实时抄表
        </a>,
        <Popconfirm
          key="valve"
          title={`确定要${
            record.valveStatus === 'open' ? '关闭' : '开启'
          }该水表的阀门吗？`}
          onConfirm={() => handleToggleValve(record)}
        >
          <a
            style={{
              color: record.valveStatus === 'open' ? '#ff4d4f' : '#52c41a',
            }}
          >
            {record.valveStatus === 'open' ? '远程关阀' : '远程开阀'}
          </a>
        </Popconfirm>,
        // 👇 详情入口：点击打开抽屉
        <a
          key="detail"
          style={{ color: '#1677ff' }}
          onClick={() => {
            setCurrentRow(record);
            setDrawerVisible(true);
          }}
        >
          详情
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<MeterListItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={requestMeterList}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        search={{ labelWidth: 'auto', defaultCollapsed: false }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        dateFormatter="string"
        headerTitle="辖区智能水表清单"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary">
            录入新水表
          </Button>,
          <Button key="import" icon={<DownloadOutlined />}>
            导出数据
          </Button>,
        ]}
      />

      {/* ================= 核心组件：设备档案侧边抽屉 ================= */}
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
            设备档案 - {currentRow?.meterNo}
          </span>
        }
      >
        {currentRow && (
          <>
            <ProDescriptions<MeterListItem>
              column={2}
              title="📇 基础配置信息"
              request={async () => ({ data: currentRow })}
              params={{ id: currentRow?.meterNo }}
              columns={[
                { title: '户主姓名', dataIndex: 'ownerName' },
                { title: '设备类型', dataIndex: 'type' },
                { title: '安装地址', dataIndex: 'address', span: 2 },
                {
                  title: '当前电量',
                  dataIndex: 'battery',
                  render: (_, entity) => (
                    <Badge
                      status={entity.battery < 20 ? 'error' : 'success'}
                      text={`${entity.battery}%`}
                    />
                  ),
                },
                {
                  title: '阀门状态',
                  dataIndex: 'valveStatus',
                  valueEnum: {
                    open: { text: '开启', status: 'Processing' },
                    closed: { text: '关闭', status: 'Default' },
                    error: { text: '异常', status: 'Error' },
                  },
                },
              ]}
            />

            <div
              style={{
                margin: '32px 0 16px 0',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              📡 设备运行与通讯日志
            </div>

            {/* 基于状态的动态设备时间轴 */}
            <Timeline
              items={[
                {
                  color: 'green',
                  children: `【设备注册】设备完成首次入网鉴权，绑定至用户：${currentRow.ownerName}。`,
                },
                {
                  color:
                    currentRow.valveStatus === 'open'
                      ? 'blue'
                      : currentRow.valveStatus === 'closed'
                      ? 'gray'
                      : 'red',
                  children:
                    currentRow.valveStatus === 'open'
                      ? '【阀门操作】系统下发开阀指令，阀门已成功开启。'
                      : currentRow.valveStatus === 'closed'
                      ? '【阀门操作】系统下发关阀指令，阀门已关闭（可能涉及欠费停水）。'
                      : '【阀门异常】检测到阀门动作阻滞，请派单检修！',
                },
                {
                  color:
                    currentRow.status === 'online'
                      ? 'green'
                      : currentRow.status === 'offline'
                      ? 'gray'
                      : 'red',
                  children: (
                    <div>
                      <div>
                        {currentRow.status === 'online'
                          ? '【自动抄表】定时数据上报成功。'
                          : currentRow.status === 'offline'
                          ? '【通讯异常】设备心跳超时，已离线。'
                          : '【硬件告警】设备核心模块自检未通过！'}
                      </div>
                      <div
                        style={{
                          color: '#8c8c8c',
                          fontSize: '12px',
                          marginTop: 4,
                        }}
                      >
                        最后通讯时间：{currentRow.updateTime} | 读数：
                        {currentRow.lastReading} m³
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default MeterList;
