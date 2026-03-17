import { Area, Column, Liquid, Pie } from '@ant-design/plots';
import {
  PageContainer,
  ProCard,
  StatisticCard,
} from '@ant-design/pro-components';
import { Badge, Progress, Space, Tag } from 'antd';
// 👇 核心修复：移除了不存在的 DropTwoTone，使用官方标准的 CloudTwoTone 和安全的内置图标
import {
  AlertTwoTone,
  CloudTwoTone,
  DashboardTwoTone,
  FundTwoTone,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import {
  getDashboardStats,
  getConsumptionTrend,
  getWaterTypeDistribution,
  getAreaPressure,
  getReservoirStatus,
} from '@/services/dashboard';

const { Statistic } = StatisticCard;

const Dashboard: React.FC = () => {
  // 状态管理
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    networkPressure: 0,
    dailySupply: 0,
    alertCount: 0,
    lossRate: 0,
    totalMeters: 0,
    onlineMeters: 0,
  });
  const [consumptionData, setConsumptionData] = useState<any[]>([]);
  const [typeData, setTypeData] = useState<any[]>([]);
  const [pressureData, setPressureData] = useState<any[]>([]);
  const [reservoirPercent, setReservoirPercent] = useState(0.72);

  // 加载数据
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 并行请求所有数据
      const [statsRes, consumptionRes, typeRes, pressureRes, reservoirRes] = await Promise.all([
        getDashboardStats(),
        getConsumptionTrend(6),
        getWaterTypeDistribution(),
        getAreaPressure(),
        getReservoirStatus(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (consumptionRes.success) {
        setConsumptionData(consumptionRes.data);
      }
      if (typeRes.success) {
        setTypeData(typeRes.data);
      }
      if (pressureRes.success) {
        setPressureData(pressureRes.data);
      }
      if (reservoirRes.success) {
        setReservoirPercent(reservoirRes.data.percent);
      }
    } catch (error) {
      console.error('加载Dashboard数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="智慧水务指挥中心"
      subTitle="全时段数字化监控与能耗分析 (实时渲染版)"
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {/* ================= 第一排：增强型核心指标卡 ================= */}
        <ProCard gutter={16} ghost>
          <ProCard colSpan={6} bordered hoverable>
            <StatisticCard
              statistic={{
                title: '当前全网压力',
                value: stats.networkPressure || 0.36,
                suffix: 'Mpa',
                icon: (
                  <DashboardTwoTone
                    twoToneColor="#1677ff"
                    style={{ fontSize: 24 }}
                  />
                ),
                description: (
                  <Statistic
                    title="管网状态"
                    value="健康运行"
                    valueStyle={{ color: '#52c41a', fontSize: 12 }}
                  />
                ),
              }}
              chart={
                <div
                  style={{
                    height: 46,
                    display: 'flex',
                    alignItems: 'flex-end',
                  }}
                >
                  <Badge status="processing" text={`在线 ${stats.onlineMeters || 0}/${stats.totalMeters || 0}`} />
                </div>
              }
            />
          </ProCard>

          <ProCard colSpan={6} bordered hoverable>
            <StatisticCard
              statistic={{
                title: '今日累计供水',
                value: stats.dailySupply || 0,
                suffix: 'm³',
                // 👇 核心修复：使用了安全的 CloudTwoTone 图标
                icon: (
                  <CloudTwoTone
                    twoToneColor="#52c41a"
                    style={{ fontSize: 24 }}
                  />
                ),
                description: (
                  <Statistic
                    title="环比昨日"
                    value="8.5%"
                    trend="up"
                    valueStyle={{ fontSize: 12 }}
                  />
                ),
              }}
              chart={
                <div
                  style={{
                    height: 46,
                    display: 'flex',
                    alignItems: 'flex-end',
                  }}
                >
                  <Progress
                    percent={68}
                    strokeColor="#52c41a"
                    showInfo={false}
                  />
                </div>
              }
            />
          </ProCard>

          <ProCard colSpan={6} bordered hoverable>
            <StatisticCard
              statistic={{
                title: '异常告警总数',
                value: stats.alertCount || 0,
                suffix: '处',
                valueStyle: { color: '#ff4d4f', fontWeight: 'bold' },
                icon: (
                  <AlertTwoTone
                    twoToneColor="#ff4d4f"
                    style={{ fontSize: 24 }}
                  />
                ),
                description: (
                  <Tag color="error" style={{ marginTop: 4 }}>
                    需委派工单
                  </Tag>
                ),
              }}
              chart={
                <div style={{ padding: '12px 0' }}>
                  <Progress
                    percent={15}
                    strokeColor="#ff4d4f"
                    showInfo={false}
                    status="active"
                  />
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 8 }}>
                    未处理率预警线
                  </div>
                </div>
              }
            />
          </ProCard>

          <ProCard colSpan={6} bordered hoverable>
            <StatisticCard
              statistic={{
                title: '管网产销差 (漏损率)',
                value: stats.lossRate || 0,
                suffix: '%',
                icon: (
                  <FundTwoTone
                    twoToneColor="#722ed1"
                    style={{ fontSize: 24 }}
                  />
                ),
                description: (
                  <Statistic
                    title="优于行业均值"
                    value="2.1%"
                    trend="down"
                    valueStyle={{ fontSize: 12 }}
                  />
                ),
              }}
              chart={
                <div style={{ padding: '12px 0' }}>
                  <Progress
                    percent={87.6}
                    strokeColor="#722ed1"
                    showInfo={false}
                  />
                  <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 8 }}>
                    有效供水转化率
                  </div>
                </div>
              }
            />
          </ProCard>
        </ProCard>

        {/* ================= 第二排：趋势与水波图 ================= */}
        <ProCard gutter={16} ghost>
          <ProCard
            colSpan={16}
            title="年度供水总量趋势分析"
            headerBordered
            bordered
            hoverable
          >
            <div style={{ height: 350 }}>
              <Area
                data={consumptionData.length > 0 ? consumptionData : []}
                xField="date"
                yField="value"
                style={{
                  fill: 'linear-gradient(-90deg, white 0%, #1677ff 100%)',
                  fillOpacity: 0.6,
                }}
                axis={{ y: { title: '用水量 (m³)' } }}
              />
            </div>
          </ProCard>

          <ProCard
            colSpan={8}
            title="核心一号水库蓄水状态"
            headerBordered
            bordered
            hoverable
          >
            <div
              style={{
                height: 350,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Liquid
                percent={reservoirPercent}
                style={{
                  shape: 'circle',
                  outlineBorder: 4,
                  outlineDistance: 8,
                  waveLength: 128,
                }}
              />
            </div>
          </ProCard>
        </ProCard>

        {/* ================= 第三排：多维构成与对比 ================= */}
        <ProCard gutter={16} ghost>
          <ProCard
            colSpan={8}
            title="当月用水性质构成"
            headerBordered
            bordered
            hoverable
          >
            <div style={{ height: 320 }}>
              <Pie
                data={typeData.length > 0 ? typeData : []}
                angleField="value"
                colorField="type"
                radius={0.8}
                innerRadius={0.65}
                label={{
                  text: 'type',
                  position: 'outside',
                }}
                legend={{ position: 'bottom' }}
                annotations={[
                  {
                    type: 'text',
                    style: {
                      text: '用水构成',
                      x: '50%',
                      y: '50%',
                      textAlign: 'center',
                      fontSize: 16,
                      fill: '#8c8c8c',
                    },
                  },
                ]}
              />
            </div>
          </ProCard>

          <ProCard
            colSpan={16}
            title="各主控区管网水压横向对比"
            headerBordered
            bordered
            hoverable
          >
            <div style={{ height: 320 }}>
              <Column
                data={pressureData.length > 0 ? pressureData : []}
                xField="area"
                yField="pressure"
                color="#5cdbd3"
                label={{
                  text: (d: any) => `${d.pressure}`,
                  style: { fill: '#fff', dy: 15 },
                }}
                style={{
                  radiusTopLeft: 8,
                  radiusTopRight: 8,
                  maxWidth: 48,
                }}
                axis={{ y: { title: '压力值 (Mpa)' } }}
              />
            </div>
          </ProCard>
        </ProCard>
      </Space>
    </PageContainer>
  );
};

export default Dashboard;
