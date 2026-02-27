import Link from 'next/link';

const priorityColor = { HIGH: 'var(--error)', MEDIUM: 'var(--warning)', LOW: 'var(--success)' };
const statusColor = { NEW: '#6366f1', IN_PROGRESS: 'var(--accent)', BLOCKED: 'var(--error)', DONE: 'var(--success)' };

export default function WorkOrdersTable({ items, onDelete }) {
  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontSize: '14px' }}>
        No work orders found.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Title', 'Department', 'Priority', 'Status', 'Requester', 'Assignee', 'Actions'].map(h => (
              <th key={h} style={{
                padding: '10px 14px', textAlign: 'left', fontWeight: 600,
                color: 'var(--text-muted)', fontSize: '11px',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(wo => (
            <tr key={wo.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <td style={{ padding: '12px 14px', maxWidth: '220px' }}>
                <Link href={`/workorders/${wo.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                  {wo.title}
                </Link>
              </td>
              <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{wo.department}</td>
              <td style={{ padding: '12px 14px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                  color: priorityColor[wo.priority], background: `${priorityColor[wo.priority]}18`,
                }}>{wo.priority}</span>
              </td>
              <td style={{ padding: '12px 14px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px',
                  color: statusColor[wo.status], background: `${statusColor[wo.status]}18`,
                }}>{wo.status.replace('_', ' ')}</span>
              </td>
              <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{wo.requesterName}</td>
              <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{wo.assignee || '—'}</td>
              <td style={{ padding: '12px 14px', display: 'flex', gap: '8px' }}>
                <Link href={`/workorders/${wo.id}`} style={{
                  fontSize: '12px', padding: '4px 10px', borderRadius: '4px',
                  border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none',
                }}>View</Link>
                {onDelete && (
                  <button onClick={() => onDelete(wo.id)} style={{
                    fontSize: '12px', padding: '4px 10px', borderRadius: '4px',
                    border: '1px solid var(--error-border)', color: 'var(--error)',
                    background: 'none', cursor: 'pointer',
                  }}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
