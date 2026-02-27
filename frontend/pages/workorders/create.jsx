import { useState } from 'react';
import { useRouter } from 'next/router';
import { createWorkOrder } from '../../services/api.js';
import WorkOrderForm from '../../components/WorkOrderForm.jsx';

export default function CreateWorkOrder() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');
    const res = await createWorkOrder(data);
    if (res.ok) {
      router.push(`/workorders/${res.data.id}`);
    } else {
      setError(`[${res.requestId}] ${res.error.message}`);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>New Work Order</h1>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '28px' }}>
        Fill in all required fields. The work order will enter the queue with status NEW.
      </p>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '28px' }}>
        <WorkOrderForm mode="create" onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  );
}
