import express, { urlencoded} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AnlyticsIdMiddleware } from "./middleware/anlytics.middlware";
import v1Routes from "./routes";
import { errorHandlerMiddleware } from "./middleware/error.middleware";
import  CONFIG from "@n8n/config";

const app = express();
app.use(cors());


app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(AnlyticsIdMiddleware);


app.get("/", (req,res) => {
    res.send("Hello World");
});

app.use("/api/v1" , v1Routes)

app.use(errorHandlerMiddleware);


app.listen(CONFIG.PORT, () => {
    console.log(`Server is running on port ${CONFIG.PORT}`);
})