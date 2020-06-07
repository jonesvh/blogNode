const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
require('../models/Postagem')
const Categoria = mongoose.model('categoria')
const Postagem = mongoose.model('postagem')
const validaDadosCategoria = require('../control/validacaoCategoria')
const validaDadosPostagem = require('../control/validacaoPostagem')
const {isAdmin} = require('../helpers/isAdmin')

router.get('/', isAdmin, (req, res) => {
    res.render('admin/index')
})

router.get('/posts', (req, res) => {
    res.send('Pagina De posts')
})

//categoria
router.get('/categorias', isAdmin, (req, res) => {
    Categoria.find().sort({ date: 'desc' }).lean().then((Categorias) => {
        //console.log(Categorias)
        res.render('admin/categorias', { categorias: Categorias })
    }).catch((err) => {
        req.flash('errorMsg', 'Houve um erro ao listar as categorias')
        res.redirect('/admin')
    })
})
router.get('/categorias/add', isAdmin, (req, res) => {
    res.render('admin/addCategoria')
})
router.post('/categorias/nova', isAdmin, (req, res) => {

    errors = validaDadosCategoria(req.body)

    if (errors.length > 0) {
        res.render("admin/addCategoria", { errors: errors })
    } else {
        const newCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(newCategoria).save().then(() => {
            //console.log('Categoria salva com sucesso')
            req.flash('successMsg', 'Categoria criada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            //console.log('Erro ao salvar a nova categoria' + err)
            req.flash('errorMsg', 'Houve um erro ao salvar categoria, tente novamente')
            res.redirect('/admin')
        })
    }
})

router.get('/categorias/edit/:id', isAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        // console.log(categoria)
        res.render('admin/editCategoria', { categoria })
    }).catch((err) => {
        req.flash('errorMsg', 'Essa categoria nao existe')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', isAdmin, (req, res) => {
    errors = validaDadosCategoria(req.body)
    if (errors.length > 0) {
        res.render("admin/categorias", { errors: errors })
    } else {
        Categoria.findOne({ _id: req.body.id }).then((categoria) => {
            categoria.nome = req.body.nome
            categoria.slug = req.body.slug
            categoria.save().then(() => {
                req.flash('successMsg', 'Categoria editada com sucesso')
                res.redirect('/admin/categorias')
            }).catch((err) => {
                req.flash('errorMsg', 'Houve um erro interno ao editar a categoria')
                res.redirect('/admin/categorias')
            })
        }).catch((err) => {
            req.flash('errorMsg', 'Houve um erro ao editar a categoria')
            res.redirect('/admin/categorias')
        })
    }
})

router.post('/categorias/deletar/:id', isAdmin, (req, res) => {
    Categoria.remove({ _id: req.body.id }).then(() => {
        req.flash('successMsg', 'Categoria deletada com sucesso')
        res.redirect('/admin/categorias')
    }).catch((err) => {
        req.flash("errorMsg", 'Houve um erro ao deletar a categoria')
        res.redirect('/admin/categorias')
    })
})

//POSTAGENS
router.get('/postagens', isAdmin, (req, res) => {
    Postagem.find().populate('categoria').sort({ data: "desc" }).lean().then((postagens) => {
        res.render('admin/postagens', { postagens: postagens })
    }).catch((err) => {
        req.flash('errorMsg', 'Erro ao carregar as postagens')
        res.redirect('/admin')
    })
})

router.get('/postagens/add', isAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render('admin/addPostagem', { categorias: categorias })
    }).catch((err) => {
        req.flash('errorMsg', 'Houve um erro ao carregar o formulario')
        res.redirect('/admin')
    })
})

router.post('/postagens/nova', isAdmin, (req, res) => {
    errors = validaDadosPostagem(req.body)
    if (errors.length > 0) {
        res.render("admin/postagens", { errors: errors })
    } else {
        const newPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            data: Date.now()
        }
        new Postagem(newPostagem).save().then(() => {
            req.flash('successMsg', 'Postagem cadastrada com sucesso')
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('errorMsg', 'Houve um erro ao registrar a postagem')
            res.redirect('/admin/postagens')
        })
    }
})

router.get('/postagens/edit/:id', isAdmin, (req, res) => {
    Postagem.findOne({ _id: req.params.id }).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render('admin/editPostagem', { postagem, categorias })
        })
    }).catch((err) => {
        req.flash('errorMsg', 'Falha ao carregar postagem')
        res.redirect('admin/postagens')
    })
})

router.post('/postagens/edit', isAdmin, (req, res) => {
    erros = validaDadosPostagem(req.body)
    if (erros.length > 0) {
        res.render("admin/postagens", { errors: errors })
    } else {
        Postagem.findOne({ _id: req.body.id }).then((postagem) => {
            postagem.titulo = req.body.titulo,
                postagem.slug = req.body.slug,
                postagem.descricao = req.body.descricao,
                postagem.conteudo = req.body.conteudo,
                postagem.categoria = req.body.categoria,
                postagem.data = Date.now()
            postagem.save().then(() => {
                req.flash('successMsg', 'Postagem editada com sucesso')
                res.redirect('/admin/postagens')
            }).catch((err) => {
                req.flash('errorMsg', 'Houve um erro interno ao editar a postagem')
                res.redirect('/admin/postagens')
            })
        }).catch((err) => {
            req.flash('errorMsg', 'Houve um erro ao editar a postagem'+ err)
            res.redirect('/admin/postagens')
        })
    }
})

router.post('/postagens/deletar/:id', isAdmin, (req, res) => {
    //Postagem.remove({_id : req.params.id}).then(() => {
    Postagem.remove({_id : req.body.id}).then(() => {
        req.flash('successMsg', 'Postagem excluida com sucesso')
        res.redirect('/admin/postagens')
    }).catch((err) => {
        req.flash('errorMsg', 'Houve um erro ao excluir a postagem')
        res.redirect('/admin/postagens')
    })
})

module.exports = router