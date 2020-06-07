const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

//model user
require('../models/Usuario')
const Usuario = mongoose.model('usuario')

module.exports = function(passport){
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'senha'
    }, (email, senha, done) => {
        Usuario.findOne({email: email}).then((usuario) => {
            if(!usuario){
                return done(null, false, {message: 'Essa conta nao existe'})
            }else{
                bcrypt.compare(senha, usuario.senha, (erro, match) => {
                    if(match){
                        return done(null, usuario)
                    }else{
                        return done(null, false, {message: 'senha incorreta'})
                    }
                })
            }
        }).catch((err) => {

        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })
}