import app, { initApp } from "../server/index";

let initialized = false;

export default async function handler(req: any, res: any) {
  if (!initialized) {
    await initApp();
    initialized = true;
  }
  return app(req, res);
}
