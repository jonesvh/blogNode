//validacao
function validaDados(dados) {
    var errors = []
    if (!dados.nome || typeof dados.nome == undefined || dados.nome == null) {
        errors.push({ texto: 'Nome invalido' })
    }
    if (!dados.slug || typeof dados.slug == undefined || dados.slug == null) {
        errors.push({ texto: 'Slug invalido' })
    }
    if (dados.nome.length < 2) {
        errors.push({ texto: 'Nome da categoria e muito pequeno' })
    }
    return errors
}
module.exports = validaDados