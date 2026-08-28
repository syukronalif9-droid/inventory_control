import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Truck } from 'lucide-react';

const COLORS_SHIPPING = ['var(--peach)', 'var(--mint)'];

export default function ShippingScoreCard({ data }) {
  const stats = useMemo(() => {
    let lateCount = 0;
    let ontimeCount = 0;

    data.forEach(item => {
      const status = item['Status Shipping'];
      if (status === 'Late') lateCount += 1;
      else if (status === 'Ontime') ontimeCount += 1;
    });

    return { lateCount, ontimeCount };
  }, [data]);

  const chartData = [
    { name: 'Late (>2 )', value: stats.lateCount },
    { name: 'Ontime (≤2 )', value: stats.ontimeCount }
  ];

  const totalScored = stats.lateCount + stats.ontimeCount;
  const latePercent = totalScored > 0 ? ((stats.lateCount / totalScored) * 100).toFixed(0) + '%' : '0%';
  const ontimePercent = totalScored > 0 ? ((stats.ontimeCount / totalScored) * 100).toFixed(0) + '%' : '0%';

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '2px solid var(--border)', paddingBottom: '1rem' }}>
        <div className="icon-container" style={{ background: 'var(--peach)', color: 'var(--text-dark)' }}>
          <Truck size={20} />
        </div>
        <div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tanggal Pengiriman TMR</h3>
        </div>
        <div style={{ marginLeft: 'auto', background: 'var(--bg-main)', border: '2px solid var(--border-strong)', padding: '0.25rem 0.6rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
          Total <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>{totalScored.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--peach)', padding: '0.65rem 0.85rem', border: '2px solid var(--peach)', boxShadow: '2px 2px 0 var(--border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-dark)', letterSpacing: '0.08em' }}>Late (&gt;2 )</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dark)' }}>{latePercent}</span>
            </div>
            <strong style={{ color: 'var(--text-dark)', fontSize: '1.5rem', fontWeight: 800 }}>{stats.lateCount.toLocaleString('id-ID')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--mint)', padding: '0.65rem 0.85rem', border: '2px solid var(--border-accent)', boxShadow: '2px 2px 0 var(--border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-dark)', letterSpacing: '0.08em' }}>Ontime (≤2 )</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--border-accent)' }}>{ontimePercent}</span>
            </div>
            <strong style={{ color: 'var(--border-accent)', fontSize: '1.5rem', fontWeight: 800 }}>{stats.ontimeCount.toLocaleString('id-ID')}</strong>
          </div>
        </div>

        {/* Donut Chart */}
        <div style={{ height: '160px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {totalScored > 0 ? (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={3}
                    stroke="var(--border)"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_SHIPPING[index % COLORS_SHIPPING.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--bg-card)', border: '2px solid var(--border)', borderRadius: 0, boxShadow: '3px 3px 0 var(--border)', fontFamily: 'Space Grotesk', fontWeight: 700 }}
                    itemStyle={{ color: 'var(--text-dark)' }}
                    formatter={(value) => {
                      const pct = totalScored > 0 ? (value / totalScored * 100).toFixed(0) : 0;
                      return [`${value} (${pct}%)`, ''];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>Total</span>
                <strong style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalScored.toLocaleString('id-ID')}</strong>
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Tidak ada data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


