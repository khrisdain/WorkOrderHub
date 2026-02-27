import Layout from '../components/Layout.jsx';

export default function App({ Component, pageProps }) {
  return (
    <>
      <style global jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --font-display: 'Syne', sans-serif;
          --font-body: 'DM Sans', sans-serif;
          --font-mono: 'DM Mono', monospace;

          --bg: #0f1117;
          --sidebar-bg: #0a0c10;
          --surface: #161b25;
          --border: #242b38;
          --border-subtle: #1a2030;

          --text: #e8eaf0;
          --text-secondary: #9aa3b5;
          --text-muted: #5c6880;

          --accent: #3b82f6;
          --accent-subtle: rgba(59, 130, 246, 0.08);

          --success: #22c55e;
          --warning: #f59e0b;
          --error: #ef4444;
          --error-bg: rgba(239, 68, 68, 0.06);
          --error-border: rgba(239, 68, 68, 0.2);
        }

        html, body {
          font-family: var(--font-body);
          background: var(--bg);
          color: var(--text);
          font-size: 14px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        input, select, textarea, button { font-family: var(--font-body); outline: none; }
        input:focus, select:focus, textarea:focus { border-color: var(--accent) !important; }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
      `}</style>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
