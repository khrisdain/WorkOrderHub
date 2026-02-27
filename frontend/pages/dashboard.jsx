import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listWorkOrders } from '../services/api.js';
import ErrorBanner from '../components/ErrorBanner.jsx';

const STATUSES = ['NEW', 'IN_PROGRESS', 'BLOCKED', 'DONE'];
const statusColor = { NEW: '#6366f1', IN_PROGRESS: '#3b82f6', BLOCKED: '#ef4444', DONE: '#22c55e' };
const priorityDot = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#22c55e' };

export default function Dashboard() {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState('');

  useEffect(() => {
    listWorkOrders({ limit: 100 }).then(res => {
      if (res.ok) setWorkOrders(res.data.items);
      else { setError(res.error.message); setRequestId(res.requestId); }
      setLoading(false);
    });
  }, []);

  const byStatus = (s) => workOrders.filter(wo => wo.status === s);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>Dashboard</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Visual management board</p>
        </div>
        <Link href="/workorders/create" style={{
          padding: '9px 20px', background: 'var(--accent)', color: '#fff',
          borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600,
        }}>+ New Order</Link>
      </div>

      {error && <ErrorBanner message={error} requestId={requestId} onClose={() => setError('')} />}

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {STATUSES.map(s => (
          <div key={s} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '16px 20px',
            borderTop: `3px solid ${statusColor[s]}`,
          }}>
            <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-display)', color: statusColor[s] }}>
              {loading ? '—' : byStatus(s).length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {s.replace('_', ' ')}
            </div>
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {STATUSES.map(s => (
          <div key={s} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: statusColor[s], textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.replace('_', ' ')}
              </span>
              <span style={{
                fontSize: '11px', background: `${statusColor[s]}20`, color: statusColor[s],
                padding: '2px 7px', borderRadius: '10px', fontWeight: 600,
              }}>{byStatus(s).length}</span>
            </div>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '120px' }}>
              {loading ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '12px', textAlign: 'center' }}>Loading...</div>
              ) : byStatus(s).length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '12px', textAlign: 'center' }}>Empty</div>
              ) : byStatus(s).map(wo => (
                <Link key={wo.id} href={`/workorders/${wo.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--bg)', border: '1px solid var(--border-subtle)',
                    borderRadius: '6px', padding: '10px 12px', cursor: 'pointer',
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', marginBottom: '6px' }}>{wo.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{wo.department}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: priorityDot[wo.priority], display: 'inline-block' }} />
                        {wo.priority}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
