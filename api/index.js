let app;

export default async function handler(req, res) {
  if (!app) {
    const mod = await import('../dist/index.cjs');
    app = mod.default || mod;
    // Wait for routes to be registered
    const { initApp } = mod;
    if (initApp) await initApp();
  }
  return app(req, res);
}
