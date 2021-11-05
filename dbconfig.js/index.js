const { Sequelize } = require('sequelize');

const init =async()=>{
    try{
        const sequelize = new Sequelize('hapi_', 'username', 'password', {
            host: 'localhost',
            dialect: 'mssql' 
          });
    }
    catch{
console.log('error')
    }
}