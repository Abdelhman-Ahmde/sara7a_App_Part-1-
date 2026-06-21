import connectDB from './DB/connection.js';
import { connectRedis } from './DB/redis.connection.js';
import { authRouter, userRouter } from './Modules/index.js';
import { GlobalErrorHandler, NotFoundException } from './Utils/response/error.response.js';
import { successResponse } from './Utils/response/succes.response.js';
import cors from 'cors';


const bootstrap = async (app, express,) => {
    // تهيئة السيرفر لاستقبال البيانات بصيغة JSON
    app.use(express.json(), cors());
    // تشغيل الاتصال مع واجهة قاعدة البيانات فوراً
    await connectDB();
    await connectRedis();
    // الصفحة الرئيسية للتأكد من حالة الخادم (Health Check)
    app.get('/', (req, res) => {
        return successResponse({ res, statusCode: 201, message: "Welcome to Sar7a API" });
    });
    // تسجيل المقاطع الحيوية (Modules) في مسارات محددة
    app.use("/uploads", express.static("./src/uploads"));
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    // التقاط أي مسار غير موجود (404 Not Found) للرد عليه بشكل محترم
    app.all('/*dummy', (req, res) => {
        throw NotFoundException({ message: 'Not Found Handler!!' });
    })
    // تفعيل مصيدة الأخطاء العامة كأخر طبقة واقية
    app.use(GlobalErrorHandler);
}
export default bootstrap;
