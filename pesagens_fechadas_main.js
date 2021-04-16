
botao_pesagens_fechadas = document.querySelector("#pesagens-fechadas")
div_conteudo_principal = document.querySelector("#conteudo_principal")
body_string = ''

// TODO: Entender promises \/
// fetch é um tipo de promise
fetch('menu1_pesagens_fechadas.html')
    .then(function(response) {
        return response.text()
    })
    .then(function(body) {
        body_string = body
    })

botao_pesagens_fechadas.addEventListener('click', () => {
    
    // Apague os elementos da página antiga, não é necessário, mas é para deixar mais claro
    div_conteudo_principal.innerHTML = ''
    div_conteudo_principal.innerHTML = body_string

    // Carregue os elementos da página de pesagens fechadas

    // TODO: Carregar a tag style

    // TODO: Carregar as funcionalidades (tag script do arquivo 'pesagens_fechadas_script.js' para o corrente arquivo)

    // TODO: Implementar um botão que redireciona para a balança no Menu
    
    // TODO: Discutir sobre implementação de um botão de "Voltar"

    // DONE: Trazer a div em HTML do "pesagens fechadas.html" de forma mais eficiente:
    /*
        Dentro do HTML criar essa div e buscar ela no .js em questão "pesagens_fechadas_main.js"
        Lembrar de fazer o carregamento do HTML antes de ser utilizado o clique do botão, para que não seja
        necessário o carregamento e leitura do html toda vez que apertar o botão
    */

})
