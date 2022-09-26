export default () => ({
  db: {
    DB_USERNAME: process.env.DB_USERNAME || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_DATABASE: process.env.DB_DATABASE || '',
    DB_HOST: process.env.DB_HOST || '',
    DB_PORT: process.env.DB_PORT || '',
  },
  dbLocal: {
    DB_USERNAME_LOCAL: process.env.DB_USERNAME_LOCAL || '',
    DB_PASSWORD_LOCAL: process.env.DB_PASSWORD_LOCAL || '',
    DB_DATABASE_LOCAL: process.env.DB_DATABASE_LOCAL || '',
    DB_HOST_LOCAL: process.env.DB_HOST_LOCAL || '',
    DB_PORT_LOCAL: process.env.DB_PORT_LOCAL || '',
  },
  kafka: {
    clientId: process.env.CLIENT_ID || 'spec',
    broker: process.env.BROKER || 'localhost:9092',
    groupId: process.env.GROUP_ID || 'spec-kafka'
  },
  port: process.env.PORT || 3000,
});
