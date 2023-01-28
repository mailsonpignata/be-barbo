const app = require('express')()
const bodyParser = require('body-parser')

app.use(bodyParser.json({ type: 'application/json' }))

const usersController = require('../controllers/users');
app.use('/api/users', usersController);
