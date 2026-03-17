import {
  DashboardTwoTone,
  FireTwoTone,
  TrophyTwoTone,
} from '@ant-design/icons';
import { Bar, Column, Pie } from '@ant-design/plots';
import {
  PageContainer,
  ProCard,
  StatisticCard,
} from '@ant-design/pro-components';
import { DatePicker, message, Select, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUsageStatistics, getMonthlyUsage } from '@/services/usage';

const { RangePicker } = DatePicker;
const { Statistic, Divider } = StatisticCard;
const { Title } = Typography;

const UsageStats: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  // 状态管理 - API 数据
  const [stats, setStats] = useState<any>({
    totalMeters: 0,
    totalUsage: 0,
    currentMonthUsage: 0,
    averageMonthlyUsage: 0,
  });
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  // 加载数据
  useEffect(() => {
    loadUsageData();
  }, []);

  const loadUsageData = async () => {
    setLoading(true);
    try {
      const [statsRes, monthlyRes] = await Promise.all([
        getUsageStatistics(),
        getMonthlyUsage(12),
      ]);

      if (statsRes.success) {
        setStats(statsRes.data);
      }
      if (monthlyRes.success) {
        // 转换数据格式
        const formatted = monthlyRes.data.map((item: any) => ({
          date: item.period?.slice(5) || '',
          value: item.amount || 0,
        }));
        setMonthlyData(formatted);
      }
    } catch (error) {
      console.error('加载用水数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 模拟切换维度时的加载效果
  const handleFilterChange = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('数据已重新聚合');
    }, 600);
  };

  // ================= 数据：每日用水趋势 (带时间轴) =================
  // 如果 API 有数据则使用，否则用模拟数据
  const trendData = monthlyData.length > 0 ? monthlyData : [
    { date: '02-11', value: 1250 },
    { date: '02-12', value: 1320 },
    { date: '02-13', value: 1450 },
    { date: '02-14', value: 1580 },
    { date: '02-15', value: 1620 },
    { date: '02-16', value: 1300 },
    { date: '02-17', value: 1280 },
    { date: '02-18', value: 1400 },
    { date: '02-19', value: 1550 },
    { date: '02-20', value: 1600 },
    { date: '02-21', value: 1650 },
    { date: '02-22', value: 1720 },
    { date: '02-23', value: 1800 },
    { date: '02-24', value: 1450 },
    { date: '02-25', value: 1380 },
    { date: '02-26', value: 1500 },
    { date: '02-27', value: 1620 },
    { date: '02-28', value: 1700 },
    { date: '03-01', value: 1850 },
    { date: '03-02', value: 1900 },
    { date: '03-03', value: 1950 },
    { date: '03-04', value: 2100 },
    { date: '03-05', value: 1800 },
    { date: '03-06', value: 1750 },
    { date: '03-07', value: 1680 },
    { date: '03-08', value: 1820 },
    { date: '03-09', value: 1900 },
    { date: '03-10', value: 2050 },
    { date: '03-11', value: 2150 },
    { date: '03-12', value: 1120 }, // 截至今日 14:00
  ];

  // ================= 2. 模拟数据：区域用水占比 =================
  const regionData = [
    { region: '高新区', value: 35.2 },
    { region: '老城区', value: 22.5 },
    { region: '开发区', value: 18.3 },
    { region: '城北区', value: 14.0 },
    { region: '生态城', value: 10.0 },
  ];

  // ================= 3. 模拟数据：用水大户 Top 5 =================
  const topUsersData = [
    { name: '高新科技园A区', usage: 4520, type: '商业' },
    { name: '万达商业广场', usage: 3850, type: '商业' },
    { name: '市第一人民医院', usage: 3200, type: '市政' },
    { name: '创新路数据中心', usage: 2840, type: '工业' },
    { name: '幸福小区(总表)', usage: 2100, type: '居民' },
  ];

  return (
    <PageContainer
      title="全局用水数据透视"
      subTitle="数据截止至：2026-03-12 14:49:06"
      extra={[
        <Space key="filters" size="middle">
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={handleFilterChange}
            options={[
              { value: 'all', label: '全辖区' },
              { value: 'gaoxin', label: '高新区' },
              { value: 'laocheng', label: '老城区' },
            ]}
          />
          <RangePicker onChange={handleFilterChange} />
        </Space>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {/* ================= 第一排：核心聚合指标 ================= */}
        <ProCard gutter={16} ghost loading={loading}>
          <ProCard colSpan={8} bordered hoverable>
            <StatisticCard
              statistic={{
                title: '周期内总用水量 (m³)',
                value: 48520.5,
                icon: (
                  <DashboardTwoTone
                    twoToneColor="#1677ff"
                    style={{ fontSize: 24 }}
                  />
                ),
              }}
              footer={
                <Space>
                  <Statistic
                    title="日均用水量"
                    value="1,617.3"
                    suffix="m³"
                    layout="horizontal"
                  />
                  <Divider />
                  <Statistic
                    title="同比去年"
                    value="4.2%"
                    trend="up"
                    layout="horizontal"
                  />
                </Space>
              }
            />
          </ProCard>

          <ProCard colSpan={8} bordered hoverable>
            <StatisticCard
              statistic={{
                title: '最高峰值日 (03-11)',
                value: 2150,
                suffix: 'm³',
                valueStyle: { color: '#cf1322' },
                icon: (
                  <FireTwoTone
                    twoToneColor="#cf1322"
                    style={{ fontSize: 24 }}
                  />
                ),
              }}
              footer={
                <Space>
                  <Statistic
                    title="峰值压力"
                    value="0.42"
                    suffix="Mpa"
                    layout="horizontal"
                  />
                  <Divider />
                  <Statistic
                    title="预警状态"
                    value="无过载"
                    valueStyle={{ color: '#52c41a' }}
                    layout="horizontal"
                  />
                </Space>
              }
            />
          </ProCard>

          <ProCard colSpan={8} bordered hoverable>
            <StatisticCard
              statistic={{
                title: '产销差预估回收成本',
                value: 32450.0,
                prefix: '¥',
                icon: (
                  <TrophyTwoTone
                    twoToneColor="#faad14"
                    style={{ fontSize: 24 }}
                  />
                ),
              }}
              footer={
                <Space>
                  <Statistic
                    title="挽回漏损"
                    value="8,540"
                    suffix="m³"
                    layout="horizontal"
                  />
                  <Divider />
                  <Statistic
                    title="挽回率"
                    value="92%"
                    valueStyle={{ color: '#52c41a' }}
                    layout="horizontal"
                  />
                </Space>
              }
            />
          </ProCard>
        </ProCard>

        {/* ================= 第二排：带缩放的主趋势图 ================= */}
        <ProCard
          title="近30天管网供水量波动趋势"
          headerBordered
          bordered
          hoverable
          loading={loading}
        >
          <div style={{ height: 350 }}>
            <Column
              data={trendData}
              xField="date"
              yField="value"
              color="#1677ff"
              // 开启底部时间轴缩放滑块，极具高级感
              slider={{
                x: {
                  values: [0.3, 1], // 默认选中后 70% 的数据
                },
              }}
              label={{
                text: (d: any) => `${d.value}`,
                style: { fill: '#fff', dy: 15, opacity: 0.6 },
              }}
              style={{
                radiusTopLeft: 4,
                radiusTopRight: 4,
              }}
              axis={{ y: { title: '每日供水量 (m³)' } }}
            />
          </div>
        </ProCard>

        {/* ================= 第三排：区域占比与排行榜 ================= */}
        <ProCard gutter={16} ghost loading={loading}>
          <ProCard
            colSpan={10}
            title="各主控区用水量占比"
            headerBordered
            bordered
            hoverable
          >
            <div style={{ height: 300 }}>
              <Pie
                data={regionData}
                angleField="value"
                colorField="region"
                radius={0.8}
                innerRadius={0.5}
                label={{
                  text: 'region',
                  position: 'outside',
                }}
                legend={{ position: 'bottom' }}
                tooltip={{
                  formatter: (datum: { region: any; value: any }) => ({
                    name: datum.region,
                    value: `${datum.value}%`,
                  }),
                }}
              />
            </div>
          </ProCard>

          <ProCard
            colSpan={14}
            title="用水大户监控排行 (Top 5)"
            headerBordered
            bordered
            hoverable
          >
            <div style={{ height: 300 }}>
              <Bar
                data={topUsersData}
                // 在 v2.x 条形图中，xField 是数值，yField 是分类
                xField="usage"
                yField="name"
                colorField="type"
                legend={{ position: 'top-right' }}
                label={{
                  text: (d: any) => `${d.usage} m³`,
                  position: 'right',
                  style: { fill: '#8c8c8c', dx: 5 },
                }}
                axis={{ x: { title: '累计用水量 (m³)' }, y: { title: '' } }}
                // 从大到小排序显示
                sort={{
                  reverse: true,
                }}
              />
            </div>
          </ProCard>
        </ProCard>
      </Space>
    </PageContainer>
  );
};

export default UsageStats;
