import { ALLOWED_TRANSITIONS, STATUSES } from '../types/workorder.js';

const statusColor = { NEW: '#6366f1', IN_PROGRESS: '#3b82f6', BLOCKED: '#ef4444', DONE: '#22c55e' };
const statusDesc = {
  NEW: 'Work order submitted and awaiting action.',
  IN_PROGRESS: 'Work is actively being carried out.',
  BLOCKED: 'Work stopped due to an impediment.',
  DONE: 'Work completed. No further transitions allowed.',
};

export default function Help() {
  return (
    <div style={{ maxWidth: '720px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>Help</h1>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '32px' }}>Reference guide for WorkOrderHub.</p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Status Lifecycle</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {STATUSES.map(s => (
            <div key={s} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderLeft: `3px solid ${statusColor[s]}`, borderRadius: '6px', padding: '14px 18px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: statusColor[s], fontSize: '13px' }}>{s.replace('_', ' ')}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  → {ALLOWED_TRANSITIONS[s].length > 0 ? ALLOWED_TRANSITIONS[s].join(', ') : 'No transitions'}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{statusDesc[s]}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>CSV Template</h2>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px 24px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '14px 16px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            title,description,department,priority,requesterName,assignee<br />
            Replace pump,Pump #4 leaking,FACILITIES,HIGH,Bob Jones,Alice Smith<br />
            Patch server,Apply security patches,IT,MEDIUM,Carol Lee,
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Column', 'Required', 'Allowed Values'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['title', 'Yes', 'Any string'],
                ['description', 'Yes', 'Any string'],
                ['department', 'Yes', 'FACILITIES, IT, SECURITY, HR'],
                ['priority', 'Yes', 'LOW, MEDIUM, HIGH'],
                ['requesterName', 'Yes', 'Any string'],
                ['assignee', 'No', 'Any string (leave blank if unassigned)'],
              ].map(([col, req, vals]) => (
                <tr key={col} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: 'var(--accent)' }}>{col}</td>
                  <td style={{ padding: '8px 12px', color: req === 'Yes' ? 'var(--error)' : 'var(--text-muted)' }}>{req}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{vals}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', fontFamily: 'var(--font-display)' }}>Authentication</h2>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          All API requests require an <code style={{ fontFamily: 'monospace', color: 'var(--accent)', background: 'var(--accent-subtle)', padding: '1px 6px', borderRadius: '3px' }}>x-api-key</code> header
          matching the value in your backend <code style={{ fontFamily: 'monospace', color: 'var(--text)' }}>.env</code>.
          The frontend reads this from <code style={{ fontFamily: 'monospace', color: 'var(--text)' }}>NEXT_PUBLIC_API_KEY</code> in <code style={{ fontFamily: 'monospace', color: 'var(--text)' }}>.env.local</code>.
        </div>
      </section>
    </div>
  );
}
