import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  ToolTwoTone,
} from '@ant-design/icons';
import { Bar, Column, Pie } from '@ant-design/plots';
import {
  PageContainer,
  ProCard,
  StatisticCard,
} from '@ant-design/pro-components';
import { Space, Typography } from 'antd';
import React from 'react';

const { Statistic, Divider } = StatisticCard;
const { Title } = Typography;

const RepairStats: React.FC = () => {
  // 模拟数据：近 7 天每日工单量
  const dailyTickets = [
    { date: '03-06', count: 12, type: '新增报修' },
    { date: '03-06', count: 10, type: '已解决' },
    { date: '03-07', count: 15, type: '新增报修' },
    { date: '03-07', count: 13, type: '已解决' },
    { date: '03-08', count: 8, type: '新增报修' },
    { date: '03-08', count: 12, type: '已解决' },
    { date: '03-09', count: 20, type: '新增报修' },
    { date: '03-09', count: 15, type: '已解决' },
    { date: '03-10', count: 18, type: '新增报修' },
    { date: '03-10', count: 18, type: '已解决' },
    { date: '03-11', count: 14, type: '新增报修' },
    { date: '03-11', count: 16, type: '已解决' },
    { date: '03-12', count: 9, type: '新增报修' },
    { date: '03-12', count: 5, type: '已解决' },
  ];

  // 模拟数据：故障类型占比
  const issueTypes = [
    { type: '管道破裂/漏水', value: 45 },
    { type: '水表无显/掉线', value: 25 },
    { type: '阀门卡阻', value: 15 },
    { type: '水压不足', value: 10 },
    { type: '其他异常', value: 5 },
  ];

  // 模拟数据：工程师绩效排行
  const engineerStats = [
    { name: '王师傅 (A组)', completed: 42, rating: 4.8 },
    { name: '刘师傅 (B组)', completed: 38, rating: 4.9 },
    { name: '张工程师 (机动)', completed: 35, rating: 4.7 },
    { name: '李师傅 (A组)', completed: 28, rating: 4.5 },
  ];

  return (
    <PageContainer
      title="运维工单与绩效统计"
      subTitle="监控维修响应时效与团队工作负载"
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {/* ================= 第一排：运维核心指标 ================= */}
        <ProCard gutter={16} ghost>
          <ProCard colSpan={8} bordered hoverable>
            <StatisticCard
              statistic={{
                title: '本月累计工单',
                value: 284,
                suffix: '单',
                icon: (
                  <ToolTwoTone
                    twoToneColor="#1677ff"
                    style={{ fontSize: 24 }}
                  />
                ),
              }}
              footer={
                <Space>
                  <Statistic
                    title="环比上月"
                    value="12%"
                    trend="down"
                    layout="horizontal"
                  />
                  <Divider />
                  <Statistic
                    title="未结案积压"
                    value="15"
                    valueStyle={{ color: '#ff4d4f' }}
                    layout="horizontal"
                  />
                </Space>
              }
            />
          </ProCard>

          <ProCard colSpan={8} bordered hoverable>
            <StatisticCard
              statistic={{
                title: '综合结单率',
                value: 94.7,
                suffix: '%',
                icon: (
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ fontSize: 24 }}
                  />
                ),
              }}
              footer={
                <Space>
                  <Statistic
                    title="首次修复率"
                    value="89%"
                    valueStyle={{ color: '#52c41a' }}
                    layout="horizontal"
                  />
                  <Divider />
                  <Statistic
                    title="返修告警"
                    value="3单"
                    valueStyle={{ color: '#faad14' }}
                    layout="horizontal"
                  />
                </Space>
              }
            />
          </ProCard>

          <ProCard colSpan={8} bordered hoverable>
            <StatisticCard
              statistic={{
                title: '平均响应时效',
                value: 1.2,
                suffix: '小时',
                icon: (
                  <ClockCircleTwoTone
                    twoToneColor="#722ed1"
                    style={{ fontSize: 24 }}
                  />
                ),
              }}
              footer={
                <Space>
                  <Statistic
                    title="达标率"
                    value="98%"
                    trend="up"
                    layout="horizontal"
                  />
                  <Divider />
                  <Statistic
                    title="客户满意度"
                    value="4.8/5"
                    layout="horizontal"
                  />
                </Space>
              }
            />
          </ProCard>
        </ProCard>

        {/* ================= 第二排：趋势与构成 ================= */}
        <ProCard gutter={16} ghost>
          <ProCard
            colSpan={14}
            title="近7日工单进出水趋势 (新增 vs 解决)"
            headerBordered
            bordered
            hoverable
          >
            <div style={{ height: 320 }}>
              <Column
                data={dailyTickets}
                isGroup={true}
                xField="date"
                yField="count"
                colorField="type"
                color={['#ff4d4f', '#52c41a']}
                label={{
                  position: 'top',
                  style: { fill: '#8c8c8c', opacity: 0.8 },
                }}
                style={{
                  radiusTopLeft: 4,
                  radiusTopRight: 4,
                }}
                legend={{ position: 'top-left' }}
              />
            </div>
          </ProCard>

          <ProCard
            colSpan={10}
            title="工单故障类型高频分布"
            headerBordered
            bordered
            hoverable
          >
            <div style={{ height: 320 }}>
              <Pie
                data={issueTypes}
                angleField="value"
                colorField="type"
                radius={0.8}
                innerRadius={0.6}
                label={{ text: 'type', position: 'outside' }}
                legend={{ position: 'bottom' }}
                annotations={[
                  {
                    type: 'text',
                    style: {
                      text: '故障占比',
                      x: '50%',
                      y: '50%',
                      textAlign: 'center',
                      fontSize: 16,
                    },
                  },
                ]}
              />
            </div>
          </ProCard>
        </ProCard>

        {/* ================= 第三排：人员绩效考核 ================= */}
        <ProCard
          title="维修工程师当月完单量排行"
          headerBordered
          bordered
          hoverable
        >
          <div style={{ height: 280 }}>
            <Bar
              data={engineerStats}
              xField="completed"
              yField="name"
              color="#1677ff"
              label={{
                text: (d: any) => `${d.completed} 单 (好评: ${d.rating}★)`,
                position: 'right',
                style: { fill: '#8c8c8c', dx: 5 },
              }}
              axis={{ x: { title: '结案总数' } }}
              sort={{ reverse: true }}
            />
          </div>
        </ProCard>
      </Space>
    </PageContainer>
  );
};

export default RepairStats;
