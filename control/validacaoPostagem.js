//validacao
function validaDados(dados) {
    console.log(dados)
    var errors = []
    if (!dados.titulo || typeof dados.titulo == undefined || dados.titulo == null) {
        errors.push({ texto: 'Titulo invalido' })
    }
    if (!dados.slug || typeof dados.slug == undefined || dados.slug == null) {
        errors.push({ texto: 'Slug invalido' })
    }
    if (!dados.descricao || typeof dados.descricao == undefined || dados.descricao == null) {
        errors.push({ texto: 'Descricao invalida' })
    }
    if (!dados.conteudo || typeof dados.conteudo == undefined || dados.conteudo == null) {
        errors.push({ texto: 'Conteudo invalido' })
    }
    if (!dados.categoria || typeof dados.categoria == undefined || dados.categoria == null) {
        errors.push({ texto: 'Categoria invalida' })
    }
    if (dados.titulo.length < 2) {
        errors.push({ texto: 'Titulo da postagem e muito pequeno' })
    }
    return errors
}
module.exports = validaDados