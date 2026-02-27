import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getWorkOrder, updateWorkOrder, changeStatus, deleteWorkOrder } from '../../services/api.js';
import WorkOrderForm from '../../components/WorkOrderForm.jsx';
import StatusTransition from '../../components/StatusTransition.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';

const statusColor = { NEW: '#6366f1', IN_PROGRESS: '#3b82f6', BLOCKED: '#ef4444', DONE: '#22c55e' };

function Field({ label, value }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '14px', color: value ? 'var(--text)' : 'var(--text-muted)' }}>{value || '—'}</div>
    </div>
  );
}

export default function WorkOrderDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [wo, setWo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    getWorkOrder(id).then(res => {
      if (res.ok) setWo(res.data);
      else { setError(res.error.message); setRequestId(res.requestId); }
      setLoading(false);
    });
  }, [id]);

  const handleUpdate = async (data) => {
    setUpdateLoading(true);
    setError(''); setSuccessMsg('');
    const res = await updateWorkOrder(wo.id, data);
    if (res.ok) { setWo(res.data); setSuccessMsg('Work order updated.'); }
    else { setError(res.error.message); setRequestId(res.requestId); }
    setUpdateLoading(false);
  };

  const handleStatusChange = async (status) => {
    setStatusLoading(true);
    setError(''); setSuccessMsg('');
    const res = await changeStatus(wo.id, status);
    if (res.ok) { setWo(res.data); setSuccessMsg(`Status updated to ${status}.`); }
    else { setError(res.error.message); setRequestId(res.requestId); }
    setStatusLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Permanently delete this work order?')) return;
    const res = await deleteWorkOrder(wo.id);
    if (res.ok) router.push('/workorders');
    else { setError(res.error.message); setRequestId(res.requestId); }
  };

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: '48px', textAlign: 'center' }}>Loading...</div>;
  if (!wo) return <div style={{ color: 'var(--text-muted)', padding: '48px', textAlign: 'center' }}>Work order not found.</div>;

  return (
    <div style={{ maxWidth: '780px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Link href="/workorders" style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>← Work Orders</Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ fontSize: '13px', color: 'var(--text)' }}>{wo.title}</span>
      </div>

      {error && <ErrorBanner message={error} requestId={requestId} onClose={() => setError('')} />}
      {successMsg && (
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '6px', padding: '10px 16px', marginBottom: '20px', fontSize: '13px', color: 'var(--success)' }}>
          {successMsg}
        </div>
      )}

      {/* Info */}
      <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>{wo.title}</h1>
          <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', color: statusColor[wo.status], background: `${statusColor[wo.status]}18` }}>
            {wo.status.replace('_', ' ')}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }}>
          <Field label="Department" value={wo.department} />
          <Field label="Priority" value={wo.priority} />
          <Field label="Requester" value={wo.requesterName} />
          <Field label="Assignee" value={wo.assignee} />
          <Field label="Created" value={new Date(wo.createdAt).toLocaleString()} />
          <Field label="Updated" value={new Date(wo.updatedAt).toLocaleString()} />
        </div>
        <Field label="Description" value={wo.description} />
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '8px' }}>ID: {wo.id}</div>
      </section>

      {/* Status transition */}
      <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px 24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '14px' }}>Status Transition</h2>
        <StatusTransition workOrder={wo} onTransition={handleStatusChange} loading={statusLoading} />
      </section>

      {/* Edit */}
      <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '20px' }}>Edit Details</h2>
        <WorkOrderForm mode="edit" initial={wo} onSubmit={handleUpdate} loading={updateLoading} />
      </section>

      {/* Delete */}
      <section style={{ background: 'var(--surface)', border: '1px solid var(--error-border)', borderRadius: '8px', padding: '20px 24px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--error)', marginBottom: '10px' }}>Danger Zone</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>Permanently delete this work order. This action cannot be undone.</p>
        <button onClick={handleDelete} style={{
          padding: '8px 18px', fontSize: '13px', fontWeight: 600,
          background: 'var(--error)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer',
        }}>Delete Work Order</button>
      </section>
    </div>
  );
}
