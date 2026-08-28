import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Truck } from 'lucide-react';

const COLORS_SHIPPING = ['#FF4444', '#F5C842']; // Red=Late, Gold=Ontime

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
    { name: 'Terlambat (>2 jam)', value: stats.lateCount },
    { name: 'Tepat Waktu (≤2 jam)', value: stats.ontimeCount }
  ];

  const totalScored = stats.lateCount + stats.ontimeCount;
  const latePercent = totalScored > 0 ? ((stats.lateCount / totalScored) * 100).toFixed(0) + '%' : '0%';
  const ontimePercent = totalScored > 0 ? ((stats.ontimeCount / totalScored) * 100).toFixed(0) + '%' : '0%';

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '2px solid #000', paddingBottom: '1rem' }}>
        <div className="icon-container" style={{ background: 'rgba(255, 68, 68, 0.12)', color: '#FF4444' }}>
          <Truck size={20} />
        </div>
        <div>
          <div style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-secondary)' }}>Grafik Ketepatan</div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tanggal Pengiriman TMR</h3>
        </div>
        <div style={{ marginLeft: 'auto', background: '#1A1A1A', border: '2px solid #333', padding: '0.25rem 0.6rem', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
          Total <span style={{ color: 'var(--gold)', fontSize: '1rem' }}>{totalScored.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,68,68,0.08)', padding: '0.65rem 0.85rem', border: '2px solid #FF4444', boxShadow: '2px 2px 0 #000' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#FF4444', letterSpacing: '0.08em' }}>Terlambat (&gt;2 jam)</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FF6666' }}>{latePercent}</span>
            </div>
            <strong style={{ color: '#FF4444', fontSize: '1.5rem', fontWeight: 800 }}>{stats.lateCount.toLocaleString('id-ID')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(245,200,66,0.07)', padding: '0.65rem 0.85rem', border: '2px solid #F5C842', boxShadow: '2px 2px 0 #000' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#F5C842', letterSpacing: '0.08em' }}>Tepat Waktu (≤2 jam)</span>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#C9A520' }}>{ontimePercent}</span>
            </div>
            <strong style={{ color: '#F5C842', fontSize: '1.5rem', fontWeight: 800 }}>{stats.ontimeCount.toLocaleString('id-ID')}</strong>
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
                    stroke="#000"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_SHIPPING[index % COLORS_SHIPPING.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#111', border: '2px solid #000', borderRadius: 0, boxShadow: '3px 3px 0 #000', fontFamily: 'Space Grotesk', fontWeight: 700 }}
                    itemStyle={{ color: '#F0F0F0' }}
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


