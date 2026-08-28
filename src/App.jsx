import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Calendar, X, UploadCloud, DownloadCloud, Trash2 } from 'lucide-react';
import { read, utils, writeFile } from 'xlsx';
import { supabase } from './supabaseClient';

import SummaryCards from './components/SummaryCards';
import ShippingScoreCard from './components/ShippingScoreCard';
import GRScoreCard from './components/GRScoreCard';
import DataTable from './components/DataTable';
import { calculateWorkDays } from './utils/dateUtils';

function formatToDDMMYYYY(val) {
  if (!val || val === 'null' || val === '-') return '-';
  
  // if it's an excel serial date
  if (!isNaN(val) && !isNaN(parseFloat(val))) {
      const serial = parseFloat(val);
      const dateObj = new Date(Math.round((serial - 25569) * 86400 * 1000));
      dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());
      const d = String(dateObj.getDate()).padStart(2, '0');
      const m = String(dateObj.getMonth() + 1).padStart(2, '0');
      const y = dateObj.getFullYear();
      return `${d}/${m}/${y}`;
  }
  
  let dateObj;
  const strVal = String(val).trim().split(' ')[0]; // remove time if any
  const parts = strVal.split(/[/.-]/);
  
  if (parts.length === 3) {
      if (parts[0].length === 4) {
          // YYYY-MM-DD
          dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      } else {
          // DD-MM-YYYY or MM-DD-YYYY or M/D/YY
          let day = parseInt(parts[0], 10);
          let month = parseInt(parts[1], 10);
          let year = parseInt(parts[2], 10);
          
          if (month > 12) {
             let temp = month; month = day; day = temp;
          }
          
          if (year < 100) {
              year += 2000;
          }
          
          dateObj = new Date(year, month - 1, day);
      }
  } else {
      dateObj = new Date(val);
  }

  if (isNaN(dateObj?.getTime())) return val;
  
  const d = String(dateObj.getDate()).padStart(2, '0');
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const y = dateObj.getFullYear();
  return `${d}/${m}/${y}`;
}

const CustomDateInput = ({ value, onChange, title }) => {
  const getDisplayValue = () => {
    if (!value) return 'DD/MM/YYYY';
    const [y, m, d] = value.split('-');
    let displayY = parseInt(y, 10);
    if (displayY < 100) displayY += 2000;
    return `${d}/${m}/${displayY}`;
  };

  return (
    <div style={{ position: 'relative', minWidth: '140px', height: '36px', display: 'flex', alignItems: 'center', background: 'var(--bg-inset)', border: '2px solid #000', boxShadow: '2px 2px 0 #000' }}>
      <div style={{ position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: value ? 'var(--text-primary)' : 'var(--text-secondary)', pointerEvents: 'none', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', fontFamily: 'Space Grotesk, sans-serif' }}>
        {getDisplayValue()}
      </div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.target.showPicker && e.target.showPicker()}
        title={title}
        style={{ 
          position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', 
          opacity: 0, cursor: 'pointer', appearance: 'none', border: 'none'
        }}
      />
    </div>
  );
};


function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [matlGroupFilter, setMatlGroupFilter] = useState('');
  const [statusGrFilter, setStatusGrFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');

  useEffect(() => {
    const fetchFromSupabase = async () => {
      try {
        let allData = [];
        let from = 0;
        const step = 1000;
        
        // Fetch data in chunks to bypass 1000 row limit
        while (true) {
          const { data: chunk, error } = await supabase
            .from('inventory_records')
            .select('*')
            .range(from, from + step - 1);
            
          if (error) throw error;
          if (!chunk || chunk.length === 0) break;
          
          allData = [...allData, ...chunk];
          if (chunk.length < step) break;
          from += step;
        }
        
        // Map database columns back to original keys needed by components and export
        const mappedData = allData.map(row => {
          const qty = parseFloat(row.quantity_tmr) || 0;
          const md = row.material_document;
          const isBelumGr = !md || md === 'null' || md === '0' || md === '';
          
          const mappedRow = {
            'TMR Number': row.tmr_number,
            'Status TMR': (!row.status_tmr || row.status_tmr === 'null') ? '-' : row.status_tmr,
            'Destination': row.destination_1,
            'Shipping Date': formatToDDMMYYYY(row.shipping_date),
            'GR Date TMR': formatToDDMMYYYY(row.gr_date_tmr),
            'Purchasing Document': row.purchasing_document,
            'Item': row.item,
            'Material': row.material,
            'Short Text': row.short_text,
            'Quantity TMR': qty,
            'Material Document': row.material_document,
            'Material Doc. Year': row.material_doc__year,
            'Material Doc.Item': row.material_doc_item,
            'Storage Location': row.storage_location,
            'Movement Type': row.movement_type,
            'QTY GR': parseFloat(row.qty_gr) || 0,
            'Posting Date': formatToDDMMYYYY(row.posting_date),
            'Entry Date': formatToDDMMYYYY(row.entry_date),
            'Matl.Group': row.material_type,
            'JUMLAH GR': isBelumGr ? 0 : qty,
            'Belum GR': isBelumGr ? qty : 0,
            
            // These 3 are kept just so the DataTable filters/renders don't break
            'Status Keterangan GR': row.status_keterangan_gr,
            'Destination.1': row.destination_1,
            'Matl. Group': row.material_type
          };
          
          // Calculate work days and status for Shipping
          const workDays = calculateWorkDays(mappedRow['Shipping Date'], mappedRow['GR Date TMR'], []);
          mappedRow['Waktu Pengerjaan'] = workDays;
          
          if (workDays === null) {
              mappedRow['Status Shipping'] = '-';
          } else {
              mappedRow['Status Shipping'] = workDays > 2 ? 'Late' : 'Ontime';
          }
          
          // Calculate work days and status for GR 101
          const workDaysGR = calculateWorkDays(mappedRow['GR Date TMR'], mappedRow['Entry Date'], []);
          mappedRow['Waktu GR 101'] = workDaysGR;
          
          if (workDaysGR === null) {
              mappedRow['Status GR 101'] = '-';
          } else {
              mappedRow['Status GR 101'] = workDaysGR > 2 ? 'Late' : 'Ontime';
          }
          
          return mappedRow;
        });
        
        setData(mappedData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchFromSupabase();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const arrayBuffer = evt.target.result;
        const wb = read(arrayBuffer, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        const rawDataArray = utils.sheet_to_json(ws, { header: 1 });
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(20, rawDataArray.length); i++) {
          if (rawDataArray[i] && rawDataArray[i].includes('TMR Number')) {
            headerRowIndex = i;
            break;
          }
        }
        
        const dataJson = utils.sheet_to_json(ws, { raw: false, range: headerRowIndex });
        
        if (dataJson.length === 0) {
          alert('File Excel kosong atau tidak bisa dibaca!');
          setLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        if (!('TMR Number' in dataJson[0])) {
          alert('Format Excel salah! Tidak ditemukan kolom: TMR Number');
          setLoading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          return;
        }

        // Map keys to Supabase format (ONLY ALLOWED KEYS to prevent insert crash)
        const allowedKeys = [
          'id', 'tmr_number', 'purchasing_document', 'item', 'status_tmr', 'qty_colly', 'storage_location', 'material', 'short_text', 'base_unit_of_measure', 'quantity_tmr', 'qty_gr', 'variance', 'material_document', 'status_keterangan_gr', 'no__colly', 'total_qty_colly', 'shipping_date', 'expedition_code', 'expedition_name', 'vihicle_type', 'vehicle_name', 'driver', 'vihicle_number', 'capacity', 'destination', 'destination_1', 'driver_phone', 'material_type', 'gr_date_tmr', '0', 'shipment_number', 'rl_no_', 'storage_location_1', 'qty_rl', 'order_unit', 'created_on', 'created_by', 'supplier', 'name_1', 'purchasing_group', 'location_gr', 'recipient', 'distribution_date', '0_1', 'material_doc__year', 'material_doc_item', 'movement_type', 'debit_credit_ind_', 'posting_date', 'entry_date', 'time_of_entry', 'user_name'
        ];
        
        const cleanedData = dataJson.map(row => {
          const cleanedRow = {};
          for (const key in row) {
             const cleanKey = key.replace(/ /g, '_').replace(/\./g, '_').replace(/\//g, '_').toLowerCase();
             if (allowedKeys.includes(cleanKey)) {
                 cleanedRow[cleanKey] = String(row[key]);
             }
             // Fallback for destination
             if (cleanKey === 'destination' && !row['Destination.1']) {
                 cleanedRow['destination_1'] = String(row[key]);
             }
             // Ignored matl_group from Excel, will compute below
             // Parsing Quantity metrics (take number before comma or dot)
             if (['quantity_tmr', 'qty_gr', 'variance'].includes(cleanKey)) {
                 let rawQty = String(row[key] || '0');
                 // Remove .00 or ,00 at the end of the string if it exists
                 rawQty = rawQty.replace(/[,.]00$/, '');
                 // Remove all remaining commas and dots (thousands separators)
                 rawQty = rawQty.replace(/[,.]/g, '');
                 cleanedRow[cleanKey] = rawQty.trim();
             }
          }
          
          // AUTO-CALCULATE 'Status Keterangan GR'
          if (row['Material Document']) {
              cleanedRow['status_keterangan_gr'] = 'SUDAH GR';
          } else {
              cleanedRow['status_keterangan_gr'] = 'BELUM GR';
          }
          
          // AUTO-CALCULATE 'Matl. Group' (material_type)
          const matStr = row['Material'] ? String(row['Material']).trim() : '';
          if (!matStr) {
              cleanedRow['material_type'] = 'Expense (OB)';
          } else if (matStr.charAt(0).toUpperCase() === 'E') {
              cleanedRow['material_type'] = 'Expense (OB)';
          } else {
              cleanedRow['material_type'] = 'Inventory';
          }
          
          return cleanedRow;
        });

        // 1. Append data (no deletion of previous data)
        const chunkSize = 500;
        for (let i = 0; i < cleanedData.length; i += chunkSize) {
          const chunk = cleanedData.slice(i, i + chunkSize);
          const { error: insertError } = await supabase.from('inventory_records').insert(chunk);
          if (insertError) {
             console.error('Insert error chunk', i, insertError);
             alert('Error menyimpan data: ' + insertError.message);
             setLoading(false);
             return; // abort
          }
        }

        // 2. Row limit enforcement (max 300,000 rows)
        try {
          const { count } = await supabase.from('inventory_records').select('*', { count: 'exact', head: true });
          if (count > 300000) {
            const limitDelete = count - 300000;
            const { data: oldest } = await supabase.from('inventory_records').select('id').order('id', { ascending: true }).limit(limitDelete);
            if (oldest && oldest.length > 0) {
              const idsToDelete = oldest.map(r => r.id);
              // delete in batches if many
              const delChunk = 1000;
              for (let j = 0; j < idsToDelete.length; j += delChunk) {
                  await supabase.from('inventory_records').delete().in('id', idsToDelete.slice(j, j + delChunk));
              }
            }
          }
        } catch(e) {
          console.error('Failed to enforce row limit', e);
        }
        
        alert('Sukses! Data Excel berhasil diunggah dan disimpan ke Database Supabase.');
        // Reload to fetch the newly uploaded data
        window.location.reload();

      } catch (err) {
        console.error(err);
        alert('Gagal mengunggah file. ' + err.message);
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.onerror = () => {
      alert('Gagal membaca file');
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsArrayBuffer(file);
  };


  const handleResetData = async () => {
    if (!window.confirm("AWAS: Apakah Anda yakin ingin menghapus SELURUH data dari database? Tindakan ini tidak bisa dibatalkan!")) {
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.from('inventory_records').delete().neq('id', -1);
      if (error) throw error;
      
      alert("Seluruh data berhasil dihapus!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data: " + err.message);
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!data.length) return [];
    
    return data.filter(item => {
      let valid = true;
      
      // Filter Date Range
      if (startDate || endDate) {
        const dStr = item['Shipping Date'] || ''; 
        if (!dStr || dStr === '-') {
            valid = false;
        } else {
            // dStr is guaranteed to be DD/MM/YYYY because of formatToDDMMYYYY
            const parts = dStr.split('/');
            if (parts.length === 3) {
                const itemDateObj = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
                
                if (startDate) {
                    const sParts = startDate.split('-');
                    let y = parseInt(sParts[0], 10);
                    if (y < 100) y += 2000;
                    const startObj = new Date(y, parseInt(sParts[1], 10) - 1, parseInt(sParts[2], 10));
                    if (itemDateObj < startObj) valid = false;
                }
                if (endDate) {
                    const eParts = endDate.split('-');
                    let y = parseInt(eParts[0], 10);
                    if (y < 100) y += 2000;
                    const endObj = new Date(y, parseInt(eParts[1], 10) - 1, parseInt(eParts[2], 10));
                    // End date should be at the end of the day to include all times on that day
                    endObj.setHours(23, 59, 59, 999);
                    if (itemDateObj > endObj) valid = false;
                }
            } else {
                valid = false; // Fallback if format is completely unrecognized
            }
        }
      }
      
      // Filter Status TMR
      if (statusFilter && item['Status TMR'] !== statusFilter) {
        valid = false;
      }
      
      // Filter Status GR
      if (statusGrFilter && item['Status Keterangan GR'] !== statusGrFilter) {
        valid = false;
      }
      
      // Filter Matl. Group
      if (matlGroupFilter) {
         const matl = item['Matl. Group'] || '';
         if (!matl.toLowerCase().includes(matlGroupFilter.toLowerCase())) {
             valid = false;
         }
      }

      // Filter Destination
      if (destinationFilter && item['Destination'] !== destinationFilter) {
        valid = false;
      }

      return valid;
    });
  }, [data, startDate, endDate, statusFilter, matlGroupFilter, statusGrFilter, destinationFilter]);
  
  // Unique Options for Status TMR
  const statusOptions = useMemo(() => {
     const statuses = data.map(d => d['Status TMR']).filter(val => val && val !== '-');
     return [...new Set(statuses)];
  }, [data]);

  // Unique Options for Destination
  const destinationOptions = useMemo(() => {
     const dests = data.map(d => d['Destination']).filter(val => val && val !== '-' && val !== 'null' && val !== 'undefined');
     return [...new Set(dests)].sort();
  }, [data]);


  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loader-container" style={{ color: 'var(--danger)' }}>
        <h2>Error Loading Data</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h1 className="app-title" style={{ marginBottom: 0 }}>TMR Monitoring Dashboard</h1>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', border: '2px solid #222', padding: '0.3rem 0.75rem', boxShadow: '2px 2px 0 #000' }}>
            Live Data
          </div>
        </div>
        
        <div className="controls-bar" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          {/* Filters (Left Side) */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', flex: 1, alignItems: 'center' }}>
            {/* Date Range Filter */}
            <div className="input-group date-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <CustomDateInput
                value={startDate}
                onChange={setStartDate}
                title="Start Shipping Date"
              />
              <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>—</span>
              <CustomDateInput
                value={endDate}
                onChange={setEndDate}
                title="End Shipping Date"
              />
            </div>

            {/* Status GR Filter */}
            <select 
              value={statusGrFilter} 
              onChange={e => setStatusGrFilter(e.target.value)}
              className="input-group"
            >
              <option value="">Status GR</option>
              <option value="SUDAH GR">Sudah GR</option>
              <option value="BELUM GR">Belum GR</option>
            </select>

            {/* Status TMR Filter */}
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="input-group"
            >
              <option value="">Status TMR</option>
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            {/* Matl Group Filter */}
            <select 
              value={matlGroupFilter} 
              onChange={e => setMatlGroupFilter(e.target.value)}
              className="input-group"
            >
              <option value="">Grup Mati</option>
              <option value="Inventory">Inventory</option>
              <option value="Expense">Expense (OB)</option>
            </select>

            {/* Destination Filter */}
            <select 
              value={destinationFilter} 
              onChange={e => setDestinationFilter(e.target.value)}
              className="input-group"
              style={{ maxWidth: '200px' }}
            >
              <option value="">Tujuan</option>
              {destinationOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            {(startDate || endDate || statusFilter || matlGroupFilter || statusGrFilter || destinationFilter) && (
              <button 
                onClick={() => { setStartDate(''); setEndDate(''); setStatusFilter(''); setMatlGroupFilter(''); setStatusGrFilter(''); setDestinationFilter(''); }}
                className="icon-button danger"
                title="Hapus Filter"
                style={{ padding: '0.4rem' }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Action Buttons (Right Side) */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              style={{ display: 'none' }} 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button 
              className="btn btn-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={16} />
              <span>Unggah Data</span>
            </button>

            <button 
              className="btn btn-reset"
              onClick={handleResetData}
              title="Hapus Semua Data"
            >
              <Trash2 size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <SummaryCards data={filteredData} />
        
        {/* Baris bawah untuk Score Card lainnya */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <ShippingScoreCard data={filteredData} />
          <GRScoreCard data={filteredData} />
        </div>

        <DataTable data={filteredData} />
      </main>
    </div>
  );
}

export default App;
