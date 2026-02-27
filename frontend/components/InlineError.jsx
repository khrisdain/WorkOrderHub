export default function InlineError({ message }) {
  if (!message) return null;
  return (
    <span style={{ fontSize: '12px', color: 'var(--error)', marginTop: '4px', display: 'block' }}>
      {message}
    </span>
  );
}
