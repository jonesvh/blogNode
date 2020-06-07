module.exports = {
    isAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.isAdmin == 1){
            return next()
        }else{
            req.flash('errorMsg', 'Voce não tem acesso necesarrio para entrar aqui')
            res.redirect('/')
        }
    }
}