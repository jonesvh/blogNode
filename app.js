//carregando modulos
const express = require('express')
const handleBars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const admin = require('./routes/admin')
const usuarios = require('./routes/usuario')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Postagem')
require('./models/Categoria')
const Postagem = mongoose.model('postagem')
const Categoria = mongoose.model('categoria')
const passport = require('passport')
require('./config/auth')(passport)

const app = express()
//configuracoes
//session
app.use(session({
    secret: 'cursonode',
    resave: true,
    saveUninitialized: true
}))
//passport
app.use(passport.initialize())
app.use(passport.session())
//flash
app.use(flash())
//middleware
app.use((req, res, next) => {
    res.locals.successMsg = req.flash('successMsg')
    res.locals.errorMsg = req.flash('errorMsg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})
//port
const port = 3333
//bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//handlebars
app.engine('handlebars', handleBars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
//mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/blogApp').then(() => {
    console.log('Conexao com o mongo bem sucedida')
}).catch((err) => {
    console.log('Falha ao conectar no mongo' + err)
})
//public
app.use(express.static(path.join(__dirname, 'public')))

//rotas
app.get('/', (req, res) => {
    Postagem.find().populate('categoria').sort({data: 'desc'}).lean().then((postagens) => {
        res.render('index', {postagens : postagens})
    }).catch((err) => {
        req.flash('errorMsg', 'Houve um erro ao carregar os posts')
        res.redirect('/404')
    }) 
})

app.get('/postagem/:slug', (req, res) => {
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
        if(postagem){
            res.render('postagem/index', {postagem: postagem})
        }else{
            req.flash('errorMsg', 'Esta postagem nao existe')
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('errorMsg', 'Houve um erro interno')
        res.redirect('/')
    })
})

app.get('/categorias', (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render('categorias/index', {categorias: categorias})
    }).catch((err) => {
        req.flash('errorMsg', 'Houve um erro interno ao carregar as categorias')
        res.redirect('/')
    })
})

app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({slug : req.params.slug}).lean().then((categoria) => {
        if(categoria){
            Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
            }).catch((err) => {
                req.flash('errorMsg', 'Houve um erro ao listar os posts')
                res.redirect('/')
            })
        }else{
            req.flash('errorMsg', 'Esta categoria nao existe')
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('errorMsg', 'Houve um erro interno ao carregar a pagina desta categoria' + ' ' + err)
        res.redirect('/')
    })
})

app.get('/404', (req, res) => {
    res.send('Error 404')
})

app.use('/admin', admin)
app.use('/usuario', usuarios)

//outros
app.listen(port, () => {
    console.log(`Servidor inciado na porta ${port}`)
})