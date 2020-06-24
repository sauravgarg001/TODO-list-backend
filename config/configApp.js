let appConfig = {
    port: 3000,
    allowedCorsOrigin: 'http://localhost:4200',
    environment: 'dev',
    db: {
        url: 'mongodb://127.0.0.1:27017/TODOListDB'
    },
    redis: {
        url: 'redis://redis-14099.c10.us-east-1-2.ec2.cloud.redislabs.com:14099',
        password: '1zWl8PLEdFyS9NWr1YdRaNCMyW1iGd7P'
    },
    authToken: {
        secretKey: 'TODOList'
    },
    saltRounds: 10,
    apiVersion: '/api/v1'
}

module.exports = appConfig;