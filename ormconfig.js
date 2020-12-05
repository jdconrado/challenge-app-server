const dev = {
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
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
    synchronize: false,
    logging: false,
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