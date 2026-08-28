import React, { useMemo } from 'react';
import { Box, DollarSign } from 'lucide-react';

export default function SummaryCards({ data }) {
  const stats = useMemo(() => {
    let invSudahGRCount = 0;
    let invBelumGRCount = 0;
    let expSudahGRCount = 0;
    let expBelumGRCount = 0;

    data.forEach(item => {
      const status = item['Status Keterangan GR'];
      const matlGroup = (item['Matl. Group'] || '').toLowerCase();

      if (matlGroup.includes('expence') || matlGroup.includes('expense')) {
        if (status === 'SUDAH GR') {
            expSudahGRCount += 1;
        } else {
            expBelumGRCount += 1;
        }
      } else {
        if (status === 'SUDAH GR') {
            invSudahGRCount += 1;
        } else {
            invBelumGRCount += 1;
        }
      }
    });

    return { invSudahGRCount, invBelumGRCount, expSudahGRCount, expBelumGRCount };
  }, [data]);

  const CardRow = ({ label, value, isGold }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: isGold ? 'rgba(245, 200, 66, 0.07)' : 'rgba(91, 45, 142, 0.12)',
      padding: '0.75rem 1rem',
      border: isGold ? '2px solid #F5C842' : '2px solid #5B2D8E',
      boxShadow: isGold ? '3px 3px 0 #000' : '3px 3px 0 #000',
      marginBottom: '0.6rem',
    }}>
      <span style={{
        fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: isGold ? '#F5C842' : '#7A40B5',
      }}>
        {label}
      </span>
      <strong style={{
        fontSize: '2rem', fontWeight: 800, lineHeight: 1,
        color: isGold ? '#F5C842' : '#7A40B5',
        textShadow: isGold ? '2px 2px 0 rgba(0,0,0,0.6)' : '2px 2px 0 rgba(0,0,0,0.6)',
      }}>
        {value.toLocaleString('id-ID')}
      </strong>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      
      {/* INVENTARIS Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Material Group</div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>INVENTARIS</h3>
          </div>
          <div className="icon-container" style={{ background: 'rgba(245, 200, 66, 0.1)', color: '#F5C842' }}>
            <Box size={24} strokeWidth={2.5} />
          </div>
        </div>
        <CardRow label="Sudah GR" value={stats.invSudahGRCount} isGold={true} />
        <CardRow label="Belum GR" value={stats.invBelumGRCount} isGold={false} />
      </div>
      
      {/* EXPENSE Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Material Group</div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>EXPENSE (OB)</h3>
          </div>
          <div className="icon-container" style={{ background: 'rgba(91, 45, 142, 0.15)', color: '#7A40B5' }}>
            <DollarSign size={24} strokeWidth={2.5} />
          </div>
        </div>
        <CardRow label="Sudah GR" value={stats.expSudahGRCount} isGold={true} />
        <CardRow label="Belum GR" value={stats.expBelumGRCount} isGold={false} />
      </div>

    </div>
  );
}

