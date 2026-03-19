import express, { urlencoded} from "express";
import { ENV } from "./config/env";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AnlyticsIdMiddleware } from "./middleware/anlytics.middlware";
import v1Routes from "./routes";
import { errorHandlerMiddleware } from "./middleware/error.middleware";

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


app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
})