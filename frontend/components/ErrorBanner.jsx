export default function ErrorBanner({ message, requestId, onClose }) {
  return (
    <div style={{
      background: 'var(--error-bg)', border: '1px solid var(--error-border)',
      borderRadius: '6px', padding: '12px 16px', marginBottom: '20px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px',
    }}>
      <div>
        <div style={{ color: 'var(--error)', fontWeight: 600, fontSize: '13px' }}>Error</div>
        <div style={{ color: 'var(--error)', fontSize: '13px', marginTop: '2px' }}>{message}</div>
        {requestId && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'monospace' }}>
            Request ID: {requestId}
          </div>
        )}
      </div>
      {onClose && (
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--error)', fontSize: '16px', padding: '0', lineHeight: 1,
        }}>×</button>
      )}
    </div>
  );
}
