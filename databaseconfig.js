const config = {

user :'sa',
password : 'admin',
server:'localhost',
database:'emp',
driver: 'msnodesqlv8',
options:{
    trustedConnection: true,
    enableArithAbort : true,
    instancename : 'SQLEXPRESS'
},
port : 1433

}

module.exports = config;