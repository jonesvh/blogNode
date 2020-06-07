function validaUser(dados) {
    let errors = []

    if (!dados.nome || typeof dados.nome == undefined || dados.nome == null) {
        errors.push({ texto: 'Nome invalido' })
    }

    if (!dados.email || typeof dados.email == undefined || dados.email == null) {
        errors.push({ texto: 'Email invalido' })
    }

    if (!dados.senha || typeof dados.senha == undefined || dados.senha == null) {
        errors.push({ texto: 'Senha invalido' })
    }

    if (dados.senha.length > 4) {
        errors.push({ texto: 'Senha muito curta' })
    }

    if (dados.senha != dados.senha2) {
        errors.push({ texto: 'As senhas são diferentes, tente novamente' })
    }
}

module.exports = validaUser