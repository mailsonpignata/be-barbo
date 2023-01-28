const passport = require('passport')
const LocalStrategy = require('passport-local')
const Services = require('../../services/users')
const Service = require('../../services/users')
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt')
const {compare} = require('../../utils')
const secret = process.env.SECRET_KEY;

passport.use(new LocalStrategy({
  usernameField: 'usuario',
  passwordField: 'password'
}, async (usuario, password, done) => {
  let user = await Services.getUserByUser(usuario).catch(done)
  if (!user || !compare(password, user[0].password)) {
    return done(null, false, { error: 'Usuário ou senha inválido' })
  }
  
  return done(null, { ...user[0] })
}))

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: secret
}

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    // console.log('payload.sub', payload.roles);
    let user = await Service.getRolesUserById(payload.sub).catch(err => done(err, false))
    if (!user) {
      return done(null, false)
    }
    if (Array.isArray(user)) {
      user = user[0]
    }
    
    done(null, user)
  } catch (error) {
    return done(null, false)
  }
}))

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

