const {Sequelize} = require('sequelize');
const config = require('./config')
const sequelize = new Sequelize(config.development)

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Database connected sucessfuly')
    }
    catch(error){
        console.error('unable to connect to database', error)
    }
}

testConnection();
module.exports=sequelize