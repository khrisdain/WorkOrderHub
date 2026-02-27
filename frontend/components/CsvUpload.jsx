import { useRef, useState } from 'react';

export function UploadResult({ result, requestId }) {
  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {[
          { label: 'Total Rows', value: result.totalRows, color: 'var(--text)' },
          { label: 'Accepted', value: result.accepted, color: 'var(--success)' },
          { label: 'Rejected', value: result.rejected, color: result.rejected > 0 ? 'var(--error)' : 'var(--text-muted)' },
        ].map(stat => (
          <div key={stat.label} style={{
            padding: '16px 24px', background: 'var(--surface)',
            border: '1px solid var(--border)', borderRadius: '8px', minWidth: '120px',
          }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: '16px' }}>
        Upload ID: {result.uploadId} · Strategy: {result.strategy} · Request ID: {requestId}
      </div>

      {result.errors.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px', color: 'var(--error)' }}>
            Row Errors ({result.errors.length})
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Row', 'Field', 'Reason'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.errors.map((err, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--error-bg)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600 }}>{err.row}</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: 'var(--error)' }}>{err.field}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{err.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function CsvUpload({ onUpload, loading }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) { setFileName(file.name); onUpload(file); }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{
        border: '2px dashed var(--border)', borderRadius: '10px',
        padding: '40px', textAlign: 'center', cursor: 'pointer',
        background: 'var(--surface)',
      }}
    >
      <input ref={inputRef} type="file" accept=".csv" onChange={handleChange} style={{ display: 'none' }} />
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>⇑</div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
        {loading ? 'Uploading...' : fileName || 'Click to select a CSV file'}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Max size: 2MB · .csv files only</div>
    </div>
  );
}
