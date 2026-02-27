import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { listWorkOrders, deleteWorkOrder } from '../../services/api.js';
import WorkOrdersTable from '../../components/WorkOrdersTable.jsx';
import FilterBar from '../../components/FilterBar.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';

export default function WorkOrdersIndex() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState('');
  const [query, setQuery] = useState({ page: 1, limit: 10 });

  const load = useCallback(async (q) => {
    setLoading(true);
    const res = await listWorkOrders(q);
    if (res.ok) { setItems(res.data.items); setTotal(res.data.total); setError(''); }
    else { setError(res.error.message); setRequestId(res.requestId); }
    setLoading(false);
  }, []);

  useEffect(() => { load(query); }, [query, load]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this work order?')) return;
    const res = await deleteWorkOrder(id);
    if (res.ok) load(query);
    else { setError(res.error.message); setRequestId(res.requestId); }
  };

  const totalPages = Math.ceil(total / (query.limit || 10));
  const page = query.page || 1;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>Work Orders</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{total} total</p>
        </div>
        <Link href="/workorders/create" style={{
          padding: '9px 20px', background: 'var(--accent)', color: '#fff',
          borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600,
        }}>+ New Order</Link>
      </div>

      {error && <ErrorBanner message={error} requestId={requestId} onClose={() => setError('')} />}
      <FilterBar query={query} onChange={setQuery} />

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
        {loading
          ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          : <WorkOrdersTable items={items} onDelete={handleDelete} />
        }
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
          <button disabled={page <= 1} onClick={() => setQuery(q => ({ ...q, page: q.page - 1 }))}
            style={{ padding: '6px 14px', fontSize: '13px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}>
            ← Prev
          </button>
          <span style={{ padding: '6px 14px', fontSize: '13px', color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setQuery(q => ({ ...q, page: q.page + 1 }))}
            style={{ padding: '6px 14px', fontSize: '13px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text)', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
