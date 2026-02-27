import Link from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '▦' },
  { href: '/workorders', label: 'Work Orders', icon: '☰' },
  { href: '/workorders/create', label: 'New Order', icon: '+' },
  { href: '/bulk-upload', label: 'Bulk Upload', icon: '⇑' },
  { href: '/help', label: 'Help', icon: '?' },
];

export default function Layout({ children }) {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <aside style={{
        width: '220px', background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--border)', display: 'flex',
        flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.5px' }}>
            WorkOrderHub
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            TPS Operations
          </div>
        </div>

        <nav style={{ padding: '12px 0', flex: 1 }}>
          {navItems.map((item) => {
            const active = router.pathname === item.href || router.pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 20px', fontSize: '13px',
                fontWeight: active ? 600 : 400,
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                background: active ? 'var(--accent-subtle)' : 'transparent',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                textDecoration: 'none', transition: 'all 0.15s',
              }}>
                <span style={{ fontSize: '14px', width: '16px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)' }}>
          v1.0.0 · In-Memory Store
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{
          height: '56px', borderBottom: '1px solid var(--border)',
          background: 'var(--surface)', display: 'flex',
          alignItems: 'center', padding: '0 28px', flexShrink: 0,
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            {navItems.find(n => router.pathname.startsWith(n.href))?.label || 'WorkOrderHub'}
          </span>
        </header>

        <main style={{ flex: 1, overflow: 'auto', padding: '28px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
