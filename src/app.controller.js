import connectDB from './DB/connection.js';
import {authRouter , userRouter} from './Modules/index.js';
import { GlobalErrorHandler, NotFoundException } from './Utils/response/error.response.js';
import { successResponse } from './Utils/response/succes.response.js';


const bootstrap = async (app,express) => {
    app.use(express.json());
    await connectDB();
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.get('/', (req, res) => {
       return successResponse({res,statusCode :201 , message : "Welcome to Sar7a API" });
    });
    app.all('/*dummy', (req, res)=>{
        throw NotFoundException({message: 'Not Found Handler!!'});
    })
    app.use(GlobalErrorHandler);
} 
export default bootstrap;