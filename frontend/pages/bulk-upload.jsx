import { useState } from 'react';
import { bulkUploadCsv } from '../services/api.js';
import CsvUpload, { UploadResult } from '../components/CsvUpload.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';

export default function BulkUploadPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState('');
  const [result, setResult] = useState(null);
  const [resultRequestId, setResultRequestId] = useState('');

  const handleUpload = async (file) => {
    setLoading(true);
    setError('');
    setResult(null);
    const res = await bulkUploadCsv(file);
    if (res.ok) { setResult(res.data); setResultRequestId(res.requestId); }
    else { setError(res.error.message); setRequestId(res.requestId); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '720px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>Bulk Upload</h1>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '28px' }}>
        Upload a CSV to create multiple work orders at once. Invalid rows are rejected individually.
      </p>

      {error && <ErrorBanner message={error} requestId={requestId} onClose={() => setError('')} />}

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px 24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '14px' }}>CSV Format</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '14px 16px', color: 'var(--text-secondary)' }}>
          title,description,department,priority,requesterName,assignee<br />
          Fix HVAC unit,Unit 3B not cooling,FACILITIES,HIGH,John Smith,Jane Doe<br />
          Reset VPN access,User locked out,IT,MEDIUM,Alice Brown,
        </div>
        <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span><strong style={{ color: 'var(--text-secondary)' }}>department:</strong> FACILITIES · IT · SECURITY · HR</span>
          <span><strong style={{ color: 'var(--text-secondary)' }}>priority:</strong> LOW · MEDIUM · HIGH</span>
          <span><strong style={{ color: 'var(--text-secondary)' }}>assignee:</strong> optional · max size: 2MB</span>
        </div>
      </div>

      <CsvUpload onUpload={handleUpload} loading={loading} />
      {result && <UploadResult result={result} requestId={resultRequestId} />}
    </div>
  );
}
