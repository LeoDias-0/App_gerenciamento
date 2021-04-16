
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


carregar_pesagens = (filtros) => {

    // filtro do tipo de pesagem
    // decidir o path correto
    path_pasta = 'dados\\' + filtros.tipo_da_pesagem
    
    // percorrer pesagens
    fs.readdirSync(path_pasta).forEach((file) => {

        raw_data_pesagem = fs.readFileSync(path_pasta + '\\' + file)

        pesagem = JSON.parse(raw_data_pesagem)

        // filtrar pesagens
        deve_ser_exibido = pesagem_satisfaz_filtros(pesagem, filtros)

        if (deve_ser_exibido) {
            // selecionar dados da pesagem e colocar em uma linha
            linha = pesagem_para_linha(filtros.tipo_da_pesagem, pesagem)

            // create html from linha
            html_linha = create_html_from_linha(linha)

            div_destino = document.getElementById('tabela')

            // show data
            div_destino.appendChild(html_linha) 
        }

    })
}

pesagem_satisfaz_filtros = (pesagem, filtros) => {

    if (filtros.tipo_da_pesagem == 'Pesagens Fechadas') {
        pesagem_modificada = pesagem.fechamento_da_pesagem
    } else {
        pesagem_modificada = pesagem
    }
    
    keys_a_serem_avaliadas = ['pessoa', 'placa', 'material', 'id_pesagem']

    satisfaz_todas_as_keys = true

    // TODO:
        // Aprimorar métrica para distanciar as palavras
        // tornar não case sensitive
        // tornar não space sensitive
    
    keys_a_serem_avaliadas.forEach( (item) => {
        if (filtros.hasOwnProperty(item)) {
            if (filtros[item] != "") {
                if (filtros[item] != pesagem_modificada[item]) {
                    satisfaz_todas_as_keys = false
                }
            }
        } 
    })
    
    // checar condição de data

    // checar outras condições
    return satisfaz_todas_as_keys
}

pesagem_para_linha = (tipo, pesagem) => {

    // Tentativa de usar o design pattern strategy

    // Nome gigantesco, mudar depois
    funcoes_que_retornam_as_informacoes_dependendo_do_tipo_da_pesagem = {
        "Pesagens Fechadas": (pesagem) => {
            abertura = pesagem.abertura_da_pesagem
            fechamento = pesagem.fechamento_da_pesagem
            arr = [
                fechamento.id_pesagem,
                fechamento.pessoa,
                fechamento.placa,
                fechamento.material,
                abertura.data_pesagem.string,
                fechamento.data_pesagem.string
            ]
            return arr
        },
        "Pesagens Abertas": (pesagem) => {
            arr = [
                pesagem.id_pesagem,
                pesagem.pessoa,
                pesagem.placa,
                pesagem.material,
                pesagem.data_pesagem.string
            ]
            return arr
        },
        "pesagem_em_lancamento": null
    }

    return funcoes_que_retornam_as_informacoes_dependendo_do_tipo_da_pesagem[tipo](pesagem)
}

create_html_from_linha = (linha) => {
    t_row = document.createElement('tr')
    t_row.classList.add('linha-da-tabela-de-busca')

    linha.forEach((item) => {
        t_cell = document.createElement('td')
        t_cell.classList.add('celula')
        
        span_in_cell = document.createElement('span')
        span_in_cell.innerText = String(item)

        t_cell.appendChild(span_in_cell)

        t_row.appendChild(t_cell)
    })

    click_na_linha = (id_pesagem) => {
        alert(`A linha da pesagem ${id_pesagem} foi clicada!`)
    }

    t_row.addEventListener('click', () => click_na_linha(linha[0]))

    return t_row
}

get_filtro = () => {
    
    // get strings from cells
    data_inicial_value = document.querySelector('input#data_inicial_cell').value
    data_final_value = document.querySelector('input#data_final_cell').value
    placa_value = document.querySelector('input#placa_cell').value
    pessoa_value = document.querySelector('input#pessoa_cell').value
    material_value = document.querySelector('input#material_cell').value

    // sanitize strings

    filtro = {
        tipo_da_pesagem: 'Pesagens Fechadas',
        placa: placa_value,
        pessoa: pessoa_value,
        material: material_value
    }

    return filtro
}
    

botao_pesagens_fechadas.addEventListener('click', () => {
    
    // Apague os elementos da página antiga, não é necessário, mas é para deixar mais claro
    div_conteudo_principal.innerHTML = ''
    div_conteudo_principal.innerHTML = body_string

    ja_existem_dados_carregados = false
    document.querySelector('#carregar_btn').addEventListener('click', () => {

        filtro = get_filtro()

        if (ja_existem_dados_carregados) {
            document.querySelector('table#tabela').innerHTML = ''
        }
        ja_existem_dados_carregados = true
        
        carregar_pesagens(filtro)
    })

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
