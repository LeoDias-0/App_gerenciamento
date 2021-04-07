
botao_pesagens_fechadas = document.querySelector("#pesagens-fechadas")
div_conteudo_principal = document.querySelector("#conteudo_principal")


botao_pesagens_fechadas.addEventListener('click', () => {
    
    // Apague os elementos da página antiga, não é necessário, mas é para deixar mais claro
    div_conteudo_principal.innerHTML = ''

    // Carregue os elementos da página de pesagens fechadas

    // TODO: Carregar a tag style

    // TODO: Carregar as funcionalidades (tag script)

    // TODO: Implementar um botão que redireciona para a balança no Menu
    
    // TODO: Discutir sobre implementação de um botão de "Voltar"

    div_pagina_pesagens_fechadas = document.createElement('div')


    div_pagina_pesagens_fechadas.style.position = 'relative'

    // TODO: Trazer a div em HTML do "pesagens fechadas.html" de forma mais eficiente:
    /*
        Dentro do HTML criar essa div e buscar ela no .js em questão "pesagens_fechadas_main.js"
        Lembrar de fazer o carregamente do HTML antes de ser utilizado o clique do botão, para que não seja
        necessário o carregamento e leitura do html toda vez que apertar o botão
    */

    div_pagina_pesagens_fechadas.innerHTML = `
    <h1>Pesagens Fechadas</h1>
    <h2>Filtros</h2>

    <div style="position: absolute; left: 0%; right: 0%; height: 4.5cm; background-color: darkgray;">
        <div id="filtros" style="display: inline-block; position: absolute; top: 0cm;">
            <div id="periodo" style="margin: 0.2cm;">
                <span>Data Inicial:</span>
                <input id="data_inicial_cell" type="text" class="input-text">
                <span>Data Final:</span>
                <input id="data_final_cell" type="text" class="input-text">
            </div>
            <div id="informacoes-para-filtro" style="margin: 0.2cm;">
                <span>Placa:</span>
                <input id="placa_cell" type="text" class="input-text">
                <span>Pessoa:</span>
                <input id="pessoa_cell" type="text" class="input-text">
                <span>Material:</span>
                <input id="material_cell" type="text" class="input-text">
            </div>
            
        </div>
        <div id="carregar_btn" style="display: inline-block; height: 150px; width: 150px; margin: 0.2cm; background-color: chocolate; text-align: center; position: absolute; right: 1cm;">
            <h3>Carregar</h3>
        </div>
        
    </div>
    
    <div id="container_tabela" style="position: relative;">
        <table id="tabela"></table>
    </div>
    `

    div_conteudo_principal.appendChild(div_pagina_pesagens_fechadas)
})
