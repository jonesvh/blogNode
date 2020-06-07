const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuario')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const validaDadosUser = require('../control/validacaoUsuario')

router.get('/registro', (req, res) => {
    res.render('usuarios/registro')
})

router.post('/registro', (req, res) => {
    
    errors = validaDadosUser(req.body)

    if(errors.length > 0){
        res.render('usuarios/registro', {errors: errors})
    }else{
        Usuario.findOne({email: req.body.email}).lean().then((usuario) => {
            if(usuario){
                req.flash('errorMsg', 'Usuario já esta cadastrado')
                res.redirect('/usuario/registro')
            }else{
                const newUser = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha//,
                    //isAdmin: 1
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(newUser.senha, salt, (erro, hash) =>{
                        if(erro){
                            req.flash('errorMsg', 'Houve um erro durante o salvamento do usuario')
                            res.redirect('/')
                        }else{
                            newUser.senha = hash
                            newUser.save().then(() => {
                                req.flash('successMsg', 'Usuario criado com sucesso')
                                res.redirect('/')
                            }).catch((err) => {
                                req.flash('errorMsg', 'Houve um erro ao registrar o usuario')
                                res.redirect('/usuario/registro')
                            })
                        }
                    })
                })
            }
        }).catch((err) => {
            req.flash('errorMsg', 'Houve um erro interno')
            res.redirect('/')
        })
    }
})

router.get('/login', (req, res) => {
    res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {    
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/usuario/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('successMsg', 'Deslogado com sucesso')
    res.redirect('/')
})

module.exports = router