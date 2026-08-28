import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { PieChart as PieChartIcon, BarChart2 } from 'lucide-react';

const COLORS = {
  'Sudah GR': '#10b981', // success
  'Belum GR': '#f59e0b', // warning
  'default': '#3b82f6'
};

export default function DashboardCharts({ data }) {
  const pieData = useMemo(() => {
    let sudah = 0;
    let belum = 0;
    data.forEach(d => {
      if (d['Status Keterangan GR'] === 'Sudah GR') sudah++;
      if (d['Status Keterangan GR'] === 'Belum GR') belum++;
    });
    return [
      { name: 'Sudah GR', value: sudah },
      { name: 'Belum GR', value: belum }
    ].filter(item => item.value > 0);
  }, [data]);

  const barData = useMemo(() => {
    const monthCounts = {};
    data.forEach(d => {
      const dateStr = d['Shipping Date'] || d['GR Date TMR'] || '';
      if (dateStr && typeof dateStr === 'string') {
        const month = dateStr.substring(0, 7); // Get YYYY-MM
        if (month && month.length === 7 && month.includes('-')) {
          if (!monthCounts[month]) {
            monthCounts[month] = { sudah: 0, belum: 0 };
          }
          if (d['Status Keterangan GR'] === 'Sudah GR') {
            monthCounts[month].sudah++;
          } else if (d['Status Keterangan GR'] === 'Belum GR') {
            monthCounts[month].belum++;
          }
        }
      }
    });

    const result = Object.keys(monthCounts).sort().map(month => ({
      name: month,
      'Sudah GR': monthCounts[month].sudah,
      'Belum GR': monthCounts[month].belum,
    }));
    return result;
  }, [data]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(16px)', boxShadow: '0 8px 32px var(--blue-light)' }}>
          <p style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontWeight: 600 }}>{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <div key={index} style={{ color: entry.color || entry.payload.fill, display: 'flex', gap: '1.5rem', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span>{entry.name}:</span>
              <span style={{ fontWeight: 'bold' }}>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid-2" style={{ marginBottom: '3rem' }}>
      {/* Pie Chart */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          <PieChartIcon className="text-gradient" size={24} />
          Status GR Overview
        </h3>
        {pieData.length > 0 ? (
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.default} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ color: 'var(--text-secondary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            No data available
          </div>
        )}
      </div>

      {/* Bar Chart */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          <BarChart2 className="text-gradient" size={24} />
          Monthly GR Trend
        </h3>
        {barData.length > 0 ? (
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-secondary)" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="var(--text-secondary)" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--blue-light)' }} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ color: 'var(--text-secondary)' }}
                />
                <Bar dataKey="Sudah GR" stackId="a" fill={COLORS['Sudah GR']} />
                <Bar dataKey="Belum GR" stackId="a" fill={COLORS['Belum GR']} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            No data available for trend
          </div>
        )}
      </div>
    </div>
  );
}
