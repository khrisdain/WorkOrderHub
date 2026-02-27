import { DEPARTMENTS, PRIORITIES, STATUSES } from '../types/workorder.js';

const selectStyle = {
  padding: '7px 10px', fontSize: '13px', background: 'var(--surface)',
  border: '1px solid var(--border)', borderRadius: '6px',
  color: 'var(--text)', cursor: 'pointer',
};

export default function FilterBar({ query, onChange }) {
  const set = (key, value) => onChange({ ...query, [key]: value || undefined, page: 1 });

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
      <input
        placeholder="Search title..."
        value={query.q || ''}
        onChange={e => set('q', e.target.value)}
        style={{ ...selectStyle, width: '180px' }}
      />
      <select value={query.status || ''} onChange={e => set('status', e.target.value)} style={selectStyle}>
        <option value="">All Statuses</option>
        {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
      </select>
      <select value={query.department || ''} onChange={e => set('department', e.target.value)} style={selectStyle}>
        <option value="">All Departments</option>
        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <select value={query.priority || ''} onChange={e => set('priority', e.target.value)} style={selectStyle}>
        <option value="">All Priorities</option>
        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
      <input
        placeholder="Assignee..."
        value={query.assignee || ''}
        onChange={e => set('assignee', e.target.value)}
        style={{ ...selectStyle, width: '140px' }}
      />
      <button
        onClick={() => onChange({ page: 1, limit: 10 })}
        style={{
          padding: '7px 14px', fontSize: '13px', background: 'none',
          border: '1px solid var(--border)', borderRadius: '6px',
          color: 'var(--text-muted)', cursor: 'pointer',
        }}
      >Clear</button>
    </div>
  );
}
