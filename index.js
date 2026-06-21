import express from 'express';
import bootstrap from './src/app.controller.js';
import { PORT } from './config/config.service.js';

const app = express();

// تهيئة التطبيق الأساسية لجميع المسارات والمكونات
await bootstrap(app, express);

// بدء تشغيل الخادم للاستماع على المنفذ المحدد
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});