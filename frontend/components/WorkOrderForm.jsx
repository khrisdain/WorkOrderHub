import { useState } from 'react';
import InlineError from './InlineError.jsx';
import { DEPARTMENTS, PRIORITIES } from '../types/workorder.js';

const labelStyle = {
  display: 'block', fontSize: '12px', fontWeight: 600,
  color: 'var(--text-muted)', marginBottom: '6px',
  textTransform: 'uppercase', letterSpacing: '0.05em',
};

const inputStyle = {
  width: '100%', padding: '9px 12px', fontSize: '14px',
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: '6px', color: 'var(--text)', boxSizing: 'border-box',
};

export default function WorkOrderForm({ mode, initial, onSubmit, loading, error }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [department, setDepartment] = useState(initial?.department || '');
  const [priority, setPriority] = useState(initial?.priority || '');
  const [requesterName, setRequesterName] = useState(initial?.requesterName || '');
  const [assignee, setAssignee] = useState(initial?.assignee || '');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (mode === 'create') {
      if (!title.trim()) e.title = 'Title is required.';
      if (!description.trim()) e.description = 'Description is required.';
      if (!department) e.department = 'Department is required.';
      if (!priority) e.priority = 'Priority is required.';
      if (!requesterName.trim()) e.requesterName = 'Requester name is required.';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    if (mode === 'create') {
      await onSubmit({ title, description, department, priority, requesterName, assignee });
    } else {
      await onSubmit({ title, description, priority, assignee });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{
          background: 'var(--error-bg)', border: '1px solid var(--error-border)',
          borderRadius: '6px', padding: '10px 14px', marginBottom: '20px',
          fontSize: '13px', color: 'var(--error)',
        }}>{error}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} placeholder="Work order title" />
          <InlineError message={errors.title} />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            placeholder="Describe the work required" />
          <InlineError message={errors.description} />
        </div>

        {mode === 'create' && (
          <div>
            <label style={labelStyle}>Department</label>
            <select value={department} onChange={e => setDepartment(e.target.value)} style={inputStyle}>
              <option value="">Select department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <InlineError message={errors.department} />
          </div>
        )}

        <div>
          <label style={labelStyle}>Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value)} style={inputStyle}>
            <option value="">Select priority</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <InlineError message={errors.priority} />
        </div>

        {mode === 'create' && (
          <div>
            <label style={labelStyle}>Requester Name</label>
            <input value={requesterName} onChange={e => setRequesterName(e.target.value)} style={inputStyle} placeholder="Full name" />
            <InlineError message={errors.requesterName} />
          </div>
        )}

        <div>
          <label style={labelStyle}>Assignee <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
          <input value={assignee} onChange={e => setAssignee(e.target.value)} style={inputStyle} placeholder="Assign to..." />
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <button type="submit" disabled={loading} style={{
          padding: '10px 24px', fontSize: '14px', fontWeight: 600,
          background: loading ? 'var(--border)' : 'var(--accent)',
          color: '#fff', border: 'none', borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? 'Saving...' : mode === 'create' ? 'Create Work Order' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
