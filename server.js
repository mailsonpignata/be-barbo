const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const https = require('https').Server(app)
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

require('dotenv-flow').config({ default_node_env: 'development' })

const port = process.env.PORT
const debug = false

if (debug) {
    console.log('host -> ', process.env.DB_HOST)
    console.log('user-> ', process.env.DB_USER)
    console.log('pwd -> ', process.env.DB_PASSWORD)
    console.log('db -> ', process.env.DB_DATABASE)
}

require('./api/config/passport')
const db = require('./api/database')

let whitelist = ['http://localhost:3000', 'http://localhost:81']
let corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(helmet())
app.use(compression())
app.use(morgan('dev'))
app.use(cors())

const sessionIO = {}
io.on('connection', (socket) => {
    const { user_id } = socket.handshake.query
    sessionIO[user_id] = socket.id
    console.log('Socket ON!!!!!!', sessionIO)
    socket.emit('session_io', socket.id)
})

app.use(bodyParser.json({ type: 'application/json' }))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    
    req.io = io
    req.sessionIO = sessionIO
    
    next()
})

//******************************************** ROUTES
const Controller = require('./api/controllers')

app.use('/api/users', Controller.usersController)
app.use('/api/enterprise', Controller.enterpriseController)
app.use('/api/blog', Controller.blogController)
app.use('/api/upload', Controller.uploadController)

//******************************************** ROUTES

let s = http.listen(port, () => {
    console.log(`🚀  Server ready at http://localhost:${port}`)
})
s.setTimeout(300000)
