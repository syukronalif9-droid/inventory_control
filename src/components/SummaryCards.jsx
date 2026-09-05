import React, { useMemo } from 'react';
import { Box, DollarSign } from 'lucide-react';

export default function SummaryCards({ data }) {
  const stats = useMemo(() => {
    let invSudahGRCount = 0;
    let invBelumGRCount = 0;
    let expSudahGRCount = 0;
    let expBelumGRCount = 0;

    data.forEach(item => {
      const status = String(item['Status Keterangan GR'] || '').trim().toUpperCase();
      const matlGroup = String(item['Matl. Group'] || '').trim().toLowerCase();
      const isExpense = matlGroup.includes('expence') || matlGroup.includes('expense');
      const isInventory = matlGroup.includes('invent');

      if (isExpense) {
        if (status === 'SUDAH GR') {
            expSudahGRCount += 1;
        } else if (status === 'BELUM GR') {
            expBelumGRCount += 1;
        }
      } else if (isInventory) {
        if (status === 'SUDAH GR') {
            invSudahGRCount += 1;
        } else if (status === 'BELUM GR') {
            invBelumGRCount += 1;
        }
      }
    });

    return { invSudahGRCount, invBelumGRCount, expSudahGRCount, expBelumGRCount };
  }, [data]);

  const CardRow = ({ label, value, isGold }) => (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: isGold ? 'var(--mint)' : 'var(--blue-light)',
      padding: '0.75rem 1rem',
      border: isGold ? '2px solid var(--border-accent)' : '2px solid var(--blue-light)',
      boxShadow: '3px 3px 0 var(--border)',
      marginBottom: '0.6rem',
    }}>
      <span style={{
        fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: isGold ? 'var(--border-accent)' : 'var(--text-dark)',
      }}>
        {label}
      </span>
      <strong style={{
        fontSize: '2rem', fontWeight: 800, lineHeight: 1,
        color: isGold ? 'var(--border-accent)' : 'var(--text-dark)',
        textShadow: '2px 2px 0 var(--border)',
      }}>
        {value.toLocaleString('id-ID')}
      </strong>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      
      {/* INVENTORY Card */}
      <div className="glass-card" style={{ background: '#B8E0D2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Material Group</div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>LINE INVENTORY</h3>
          </div>
          <div className="icon-container" style={{ background: 'var(--yellow)', color: 'var(--text-dark)' }}>
            <Box size={24} strokeWidth={2.5} />
          </div>
        </div>
        <CardRow label="Sudah GR" value={stats.invSudahGRCount} isGold={true} />
        <CardRow label="Belum GR" value={stats.invBelumGRCount} isGold={false} />
      </div>
      
      {/* EXPENSE Card */}
      <div className="glass-card" style={{ background: '#B8E0D2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Material Group</div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.3rem', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>LINE EXPENSE (OB)</h3>
          </div>
          <div className="icon-container" style={{ background: 'var(--blue-light)', color: 'var(--text-dark)' }}>
            <DollarSign size={24} strokeWidth={2.5} />
          </div>
        </div>
        <CardRow label="Sudah GR" value={stats.expSudahGRCount} isGold={true} />
        <CardRow label="Belum GR" value={stats.expBelumGRCount} isGold={false} />
      </div>

    </div>
  );
}

