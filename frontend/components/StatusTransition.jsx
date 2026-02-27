import { useState } from 'react';
import { ALLOWED_TRANSITIONS } from '../types/workorder.js';

const statusColor = {
  NEW: '#6366f1', IN_PROGRESS: 'var(--accent)',
  BLOCKED: 'var(--error)', DONE: 'var(--success)',
};

export default function StatusTransition({ workOrder, onTransition, loading }) {
  const [selected, setSelected] = useState('');
  const allowed = ALLOWED_TRANSITIONS[workOrder.status] || [];

  if (allowed.length === 0) {
    return (
      <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '12px 0' }}>
        This work order is <strong>DONE</strong> — no further transitions available.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        Current:&nbsp;
        <span style={{ fontWeight: 700, color: statusColor[workOrder.status] }}>
          {workOrder.status.replace('_', ' ')}
        </span>
      </div>
      <span style={{ color: 'var(--border)', fontSize: '18px' }}>→</span>
      <select
        value={selected}
        onChange={e => setSelected(e.target.value)}
        style={{
          padding: '7px 12px', fontSize: '13px', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)',
        }}
      >
        <option value="">Select next status...</option>
        {allowed.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
      </select>
      <button
        disabled={!selected || loading}
        onClick={() => selected && onTransition(selected)}
        style={{
          padding: '7px 18px', fontSize: '13px', fontWeight: 600,
          background: selected ? 'var(--accent)' : 'var(--border)',
          color: '#fff', border: 'none', borderRadius: '6px',
          cursor: selected && !loading ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? 'Updating...' : 'Apply'}
      </button>
    </div>
  );
}
