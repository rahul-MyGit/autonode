export const CONFIG = {
    PORT: process.env.PORT || 3003,
    JWT_SECRET: process.env.JWT_SECRET || "secret",
    DATABASE_URL: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/postgres"
}

export default CONFIG;