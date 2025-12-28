export default function Home() {
  return (
    <main style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        🎲 Ludex
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
        AI-powered board game rulebook companion
      </p>
      
      <div style={{ 
        padding: '2rem', 
        background: '#f5f5f5', 
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Welcome!</h2>
        <p style={{ marginBottom: '1rem' }}>
          Your Ludex project is set up and ready to build.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          ✅ Google Sheets configured<br/>
          ✅ Environment variables set<br/>
          ✅ Vercel deployment ready
        </p>
        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
          Next steps: Start building your components and API routes!
        </p>
      </div>
    </main>
  );
}

