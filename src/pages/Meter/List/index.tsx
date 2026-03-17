import {
  getMeterList,
  MeterListItem,
  remoteReadMeter,
  remoteToggleValve,
} from '@/services/meter';
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

const MeterList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  // ================= 状态管理：控制详情抽屉 =================
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<MeterListItem>();

  // ================= 1. 调用后端 API 获取水表列表 =================
  const requestMeterList = async (params: any, sort: any, filter: any) => {
    try {
      const response = await getMeterList(params);

      if (response.success) {
        return {
          data: response.data || [],
          success: true,
          total: response.total || 0,
        };
      } else {
        message.error(response.message || '获取水表列表失败');
        return { data: [], success: false, total: 0 };
      }
    } catch (error) {
      console.error('获取水表列表失败:', error);
      message.error('获取水表列表失败，请稍后重试');
      return { data: [], success: false, total: 0 };
    }
  };

  // ================= 2. 实际操作动作 =================
  const handleReadMeter = async (record: MeterListItem) => {
    message.loading({
      content: `正在向表 ${record.meterNo} 发送抄表指令...`,
      key: 'read',
    });

    try {
      const response = await remoteReadMeter(record.id);

      if (response.success) {
        message.success({
          content: `水表 ${record.meterNo} 抄表成功！最新读数已更新。`,
          key: 'read',
        });
        actionRef.current?.reload();
      } else {
        message.error({
          content: response.message || '抄表失败',
          key: 'read',
        });
      }
    } catch (error) {
      message.error({
        content: '抄表请求失败，请稍后重试',
        key: 'read',
      });
    }
  };

  const handleToggleValve = async (record: MeterListItem) => {
    const action = record.valveStatus === 'open' ? '关阀' : '开阀';

    try {
      const toggleAction = record.valveStatus === 'open' ? 'close' : 'open';
      const response = await remoteToggleValve(record.id, toggleAction);

      if (response.success) {
        message.success(`已下发【${action}】指令到水表 ${record.meterNo}`);
        actionRef.current?.reload();
      } else {
        message.error(response.message || '操作失败');
      }
    } catch (error) {
      message.error('操作失败，请稍后重试');
    }
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
