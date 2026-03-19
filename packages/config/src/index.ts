export const CONFIG = {
    PORT: process.env.PORT || 3003,
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET || "secret",
    DATABASE_URL: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres",
    AUTH_SECRET: {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "access_token_secret",
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret",
        ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "1h",
        REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
}

export default CONFIG;