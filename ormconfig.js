const dev = {
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    cache:{
        type: "redis",
        duration: 10000,
        options: {
            host: "localhost",
            port: 6379
        }
    },
    entities: [
        "src/entities/**/*.ts"
    ],
    migrations: [
        "src/migration/**/*.ts"
    ],
    cli: {
        entitiesDir: "src/entities",
        migrationsDir: "src/migration"
    }
};

const production = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    cache:{
        type: "redis",
        options: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
    },
    entities: [
        "dist/entities/**/*.ts"
    ],
    migrations: [
        "dist/migration/**/*.ts"
    ],
    cli: {
        entitiesDir: "dist/entities",
        migrationsDir: "dist/migration"
    }
};

let config;

if (process.env.NODE_ENV === "PRODUCTION"){
    config = production;
}else{
    config = dev;
}

module.exports = config;