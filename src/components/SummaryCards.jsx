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

  const CardRow = ({ label, value, type }) => {
    const isSudah = type === 'sudah';
    return (
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.5rem 1rem',
        marginBottom: '0.6rem',
        backgroundColor: isSudah ? 'transparent' : '#e2e8f0',
        border: isSudah ? '1px solid #15803d' : '1px solid transparent',
        borderRadius: '4px',
      }}>
        <span style={{
          fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase',
          color: isSudah ? '#15803d' : '#475569',
        }}>
          {label}
        </span>
        <strong style={{
          fontSize: '1.4rem', fontWeight: 800,
          color: isSudah ? '#15803d' : '#1e293b',
        }}>
          {value.toLocaleString('id-ID')}
        </strong>
      </div>
    );
  };

  const cardStyle = {
    backgroundColor: '#bce1ce',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      
      {/* INVENTORY Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#115e59', marginBottom: '0.3rem' }}>Group Material</div>
            <h3 style={{ color: '#064e3b', fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>LINE INVENTORY</h3>
          </div>
          <div style={{ background: '#fed7aa', color: '#9a3412', padding: '0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box size={20} strokeWidth={2.5} />
          </div>
        </div>
        <CardRow label="Sudah GR" value={stats.invSudahGRCount} type="sudah" />
        <CardRow label="Belum GR" value={stats.invBelumGRCount} type="belum" />
      </div>
      
      {/* EXPENSE Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#115e59', marginBottom: '0.3rem' }}>Group Material</div>
            <h3 style={{ color: '#064e3b', fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>LINE EXPENSE (OB)</h3>
          </div>
          <div style={{ background: '#e0f2fe', color: '#1e3a8a', padding: '0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={20} strokeWidth={2.5} />
          </div>
        </div>
        <CardRow label="Sudah GR" value={stats.expSudahGRCount} type="sudah" />
        <CardRow label="Belum GR" value={stats.expBelumGRCount} type="belum" />
      </div>

    </div>
  );
}

