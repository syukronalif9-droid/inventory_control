import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, X, Database } from 'lucide-react';

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  const strValue = String(value).trim();
  
  const dateRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
  const isoRegex = /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/;
  
  let day, month, year;
  const matchDate = strValue.match(dateRegex);
  if (matchDate) {
    day = parseInt(matchDate[1], 10);
    month = parseInt(matchDate[2], 10);
    year = parseInt(matchDate[3], 10);
    
    if (month > 12 && day <= 12) {
      let temp = day;
      day = month;
      month = temp;
    }
  } else {
    const matchIso = strValue.match(isoRegex);
    if (matchIso) {
      year = parseInt(matchIso[1], 10);
      month = parseInt(matchIso[2], 10);
      day = parseInt(matchIso[3], 10);
    }
  }

  if (day && month && year && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${day} ${months[month - 1]} ${year}`;
  }
  
  return strValue;
};

export default function DataTable({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);
  const [hoveredCol, setHoveredCol] = useState(null);
  const rowsPerPage = 50;

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    const exclude = ['id', 'JUMLAH GR', 'Belum GR'];
    return Object.keys(data[0]).filter(key => !exclude.includes(key));
  }, [data]);

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
          <Database size={24} style={{ color: '#10b981' }} />
          Data Records <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>({filteredData.length.toLocaleString('id-ID')} Line)</span>
        </h2>

        <div className="controls-bar">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Purchasing Document"
              style={{ paddingLeft: '2.5rem' }}
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
              {columns.map(col => (
                <th 
                  key={col} 
                  onClick={() => requestSort(col)} 
                  onMouseEnter={() => setHoveredCol(col)}
                  onMouseLeave={() => setHoveredCol(null)}
                  style={{ 
                    cursor: 'pointer', 
                    whiteSpace: 'nowrap', 
                    userSelect: 'none',
                    backgroundColor: hoveredCol === col ? 'var(--yellow)' : undefined
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{col} {renderSortIcon(col)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, idx) => (
                <tr key={idx}>
                  {columns.map(col => {
                    let content = formatValue(row[col]);
                    let cellStyle = { whiteSpace: 'nowrap', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' };
                    
                    if (col === 'TMR Number') {
                      cellStyle = { ...cellStyle, fontWeight: 600, color: 'var(--text-primary)' };
                    } else if (col === 'Purchasing Document') {
                      cellStyle = { ...cellStyle, fontFamily: 'monospace', color: 'var(--text-secondary)', textAlign: 'center' };
                    } else if (col === 'Status Keterangan GR') {
                      const status = String(row[col] || '').trim();
                      const isDone = status.toUpperCase() === 'SUDAH GR';
                      content = (
                        <span style={{
                          display: 'inline-block', padding: '0.28rem 0.6rem', borderRadius: '999px',
                          fontWeight: 700, background: isDone ? '#d1fae5' : '#fee2e2',
                          color: isDone ? '#166534' : '#991b1b', border: `1px solid ${isDone ? '#86efac' : '#fca5a5'}`,
                          textTransform: 'uppercase'
                        }}>
                          {status || '-'}
                        </span>
                      );
                    } else if (col === 'Storage Location' || col === 'Matl. Group') {
                      cellStyle = { ...cellStyle, color: '#000000', fontWeight: 500 };
                    } else {
                       cellStyle = { ...cellStyle, color: 'var(--text-secondary)' };
                    }

                    if (hoveredCol === col) {
                      cellStyle.backgroundColor = 'var(--yellow)';
                    }

                    return (
                      <td 
                        key={col} 
                        style={cellStyle} 
                        title={String(row[col] || '')}
                        onMouseEnter={() => setHoveredCol(col)}
                        onMouseLeave={() => setHoveredCol(null)}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
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
    </div>
  );
}

