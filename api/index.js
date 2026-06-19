import appModule from '../backend/dist/app.js';

const app = appModule.default ?? appModule;

export default function handler(req, res) {
  return app(req, res);
}
