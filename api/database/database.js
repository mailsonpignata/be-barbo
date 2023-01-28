const knex = require('knex')(require('./index'))
exports.knex = knex

const ServicesUser = require('../services/users')

setTimeout(() => {
  ServicesUser.getUsers().then(result => {
    if (!result || !result.users || (result.users && !result.users.length)) {
      console.log('MySQL is running now!');
    }
  })
}, 1500)
