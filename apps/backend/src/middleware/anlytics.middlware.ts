// will be used for anlytics id track 

import type { Request, Response, NextFunction } from "express";

export const AnlyticsIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    next();
}