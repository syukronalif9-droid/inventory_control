import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Database, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';

export default function DataTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const rowsPerPage = 50;

  const filteredData = useMemo(() => {
    let result = data;
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => {
        return (
          (item['TMR Number'] || '').toLowerCase().includes(lowerSearch) ||
          (item['Purchasing Document'] || '').toLowerCase().includes(lowerSearch) ||
          (item['Material'] || '').toLowerCase().includes(lowerSearch) ||
          (item['Short Text'] || '').toLowerCase().includes(lowerSearch)
        );
      });
    }

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const totalItemCount = useMemo(() => {
    return filteredData.reduce((sum, row) => sum + (parseFloat(row['Item']) || 0), 0);
  }, [filteredData]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const renderSortIcon = (columnKey) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ArrowUp size={14} style={{ color: 'var(--brand-blue)' }} />;
    }
    return <ArrowDown size={14} style={{ color: 'var(--brand-blue)' }} />;
  };

  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
          <Database className="text-gradient" />
          Data Records <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>({totalItemCount.toLocaleString('id-ID')} Total Item)</span>
        </h2>

        <div className="controls-bar">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search TMR, Pur.Doc, Material..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('TMR Number')} style={{ cursor: 'pointer', minWidth: '110px', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>TMR Number {renderSortIcon('TMR Number')}</div>
              </th>
              <th onClick={() => requestSort('Purchasing Document')} style={{ cursor: 'pointer', minWidth: '110px', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Pur. Doc {renderSortIcon('Purchasing Document')}</div>
              </th>
              <th onClick={() => requestSort('GR Date TMR')} style={{ cursor: 'pointer', minWidth: '110px', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>GR Date {renderSortIcon('GR Date TMR')}</div>
              </th>
              <th onClick={() => requestSort('Short Text')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Material Deskripsi {renderSortIcon('Short Text')}</div>
              </th>
              <th onClick={() => requestSort('Quantity TMR')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Qty TMR {renderSortIcon('Quantity TMR')}</div>
              </th>
              <th onClick={() => requestSort('Waktu Pengerjaan')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Waktu Ship (Hari) {renderSortIcon('Waktu Pengerjaan')}</div>
              </th>
              <th onClick={() => requestSort('Status Shipping')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Status Shipping {renderSortIcon('Status Shipping')}</div>
              </th>
              <th onClick={() => requestSort('Waktu GR 101')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Waktu GR 101 (Hari) {renderSortIcon('Waktu GR 101')}</div>
              </th>
              <th onClick={() => requestSort('Status GR 101')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Status GR 101 {renderSortIcon('Status GR 101')}</div>
              </th>
              <th onClick={() => requestSort('JUMLAH GR')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Jumlah GR {renderSortIcon('JUMLAH GR')}</div>
              </th>
              <th onClick={() => requestSort('Belum GR')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Belum GR {renderSortIcon('Belum GR')}</div>
              </th>
              <th onClick={() => requestSort('Material Document')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Mat. Doc {renderSortIcon('Material Document')}</div>
              </th>
              <th onClick={() => requestSort('Status Keterangan GR')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Status GR {renderSortIcon('Status Keterangan GR')}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, idx) => (
                <tr key={idx} onClick={() => setSelectedRow(row)} style={{ cursor: 'pointer' }}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row['TMR Number'] || '-'}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{row['Purchasing Document'] || '-'}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{row['GR Date TMR'] || '-'}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--brand-blue)', fontWeight: 500 }} title={row['Short Text']}>
                    {row['Short Text'] || '-'}
                  </td>
                  <td style={{ fontWeight: 600 }}>{row['Quantity TMR']}</td>
                  <td style={{ fontWeight: 600, textAlign: 'center' }}>{row['Waktu Pengerjaan'] !== null ? row['Waktu Pengerjaan'] : '-'}</td>
                  <td>
                    {row['Status Shipping'] !== '-' ? (
                      <span className={`badge ${row['Status Shipping'] === 'Ontime' ? 'success' : 'danger'}`}>
                        {row['Status Shipping']}
                      </span>
                    ) : '-'}
                  </td>
                  <td style={{ fontWeight: 600, textAlign: 'center' }}>{row['Waktu GR 101'] !== null ? row['Waktu GR 101'] : '-'}</td>
                  <td>
                    {row['Status GR 101'] !== '-' ? (
                      <span className={`badge ${row['Status GR 101'] === 'Ontime' ? 'success' : 'danger'}`}>
                        {row['Status GR 101']}
                      </span>
                    ) : '-'}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--status-success)' }}>{row['JUMLAH GR']}</td>
                  <td style={{ fontWeight: 600, color: 'var(--status-warning)' }}>{row['Belum GR']}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{row['Material Document'] || '-'}</td>
                  <td>
                    <span className={`badge ${row['Status Keterangan GR'] === 'SUDAH GR' ? 'success' : 'warning'}`}>
                      {row['Status Keterangan GR']}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <Search size={48} style={{ opacity: 0.2 }} />
                    <p>No records found matching your filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-outline"
            style={{ padding: '0.5rem' }}
          >
            <ChevronLeft size={20} />
          </button>
          
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Page <strong style={{ color: 'var(--text-primary)' }}>{currentPage}</strong> of {totalPages}
          </span>
          
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-outline"
            style={{ padding: '0.5rem' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {selectedRow && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'var(--blue-light)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000, padding: '1rem', backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-card" style={{
            width: '100%', maxWidth: '800px', maxHeight: '90vh',
            overflowY: 'auto', position: 'relative',
            background: 'var(--bg-card)', border: '1px solid var(--border-light)',
            boxShadow: '0 25px 50px -12px var(--blue-light)'
          }}>
            <button 
              onClick={() => setSelectedRow(null)}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'transparent', border: 'none', color: 'var(--text-secondary)',
                cursor: 'pointer', padding: '0.5rem', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <X size={24} />
            </button>

            <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
              Detail TMR: <span className="text-gradient">{selectedRow['TMR Number'] || 'N/A'}</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {Object.entries(selectedRow).map(([key, value]) => {
                if (key === 'id') return null; // skip internal id
                return (
                  <div key={key} style={{
                    background: 'var(--bg-dark)', padding: '1rem', borderRadius: '8px',
                    border: '1px solid var(--border-light)'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                      {key}
                    </div>
                    <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500, wordBreak: 'break-word' }}>
                      {value !== null && value !== '' && value !== undefined ? value : '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

