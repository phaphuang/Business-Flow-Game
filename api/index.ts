import { createRequire } from "module";

let app: any;

export default async function handler(req: any, res: any) {
  if (!app) {
    const require = createRequire(import.meta.url);
    const mod = require("../dist/index.cjs");
    app = mod.default || mod;
    if (mod.initApp) await mod.initApp();
  }
  return app(req, res);
}
