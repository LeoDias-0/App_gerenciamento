
click_botao_balanca = () => {
    // o método .children retorn um HTML Collection ao invés de um array
    // por isso utilizamos o spread operator aqui, transformando em um array
    // para usar o forEach
    [...document.getElementById('menu').children].forEach((botao) => {
        botao.classList.remove('active')
    })
    botao_balanca.className = 'active'
    
    div_conteudo_principal.innerHTML = ''
    div_conteudo_principal.innerHTML = body_string_balanca

    placa_cell = document.querySelector('#placa')

    pessoa_cell = document.querySelector('#pessoa')

    material_cell = document.querySelector('#material')

    peso_cell = document.querySelector('#peso')

    pesar_botao = document.querySelector('#pesar_botao')

    adc_placa_botao = document.querySelector('#adicionar_placa')

    adc_nome_botao = document.querySelector('#adicionar_nome')

    adc_material_botao = document.querySelector('#adicionar_material')

    carregar_tickets_para_pesagens_abertas()

    // O autocomplete está funcionando(?!) sem a necessidade de criar uma
    // função pra cada input
    autocomplete(document.getElementById("placa"), placas)

    autocomplete(document.getElementById("pessoa"), pessoas)

    autocomplete(document.getElementById("material"), materiais)

    // autocomplete_placa(document.getElementById("placa"))

    // autocomplete_pessoa(document.getElementById("pessoa"))

    // autocomplete_material(document.getElementById("material"))


    pesar_botao.addEventListener('click', () => {
        data_values = {
            placa: placa_cell.value,
            pessoa: pessoa_cell.value,
            material: material_cell.value,
            peso: peso_cell.value,
            id_pesagem: numero_de_pesagens
        }
        if (lidando_com_pesagem_aberta) {
            lidando_com_pesagem_aberta = false
            document.getElementById(id_pesagem_em_questao).parentElement.outerHTML = ''

            data_values.id_pesagem = id_pesagem_em_questao

            data_values = time_pesagem(data_values)

            pesagem_fechada_completa = fechar_pesagem(data_values)

            gravar_pesagem_fechamento(pesagem_fechada_completa)

            remover_pesagem_fechada_da_pasta_pesagens_abertas(id_pesagem_em_questao)
        } else {
            data_values = time_pesagem(data_values)

            gravar_pesagem(data_values)

            adicionar_ticket_pesagem(data_values)

            numero_de_pesagens++
            escrever_variaveis_do_sistema()
        }
        limpar_celulas()
    })


    adc_placa_botao.addEventListener('click', () => {
        modal_placa = document.querySelector('#modal_adicionar_placa')
        modal_placa_context = document.querySelector('#input_adicionar_placa')
        modal_placa_context.value = placa_cell.value
        modal_placa.style.display = 'block'
    })

    adc_nome_botao.addEventListener('click', () => {
        modal_nome = document.querySelector('#modal_adicionar_nome')
        modal_nome_context = document.querySelector('#input_adicionar_nome')
        modal_nome_context.value = pessoa_cell.value
        modal_nome.style.display = 'block'
    })

    adc_material_botao.addEventListener('click', () => {
        modal_material = document.querySelector('#modal_adicionar_material')
        modal_material_context = document.querySelector('#input_adicionar_material')
        modal_material_context.value = material_cell.value
        modal_material.style.display = 'block'
    })

}

botao_balanca.addEventListener('click', click_botao_balanca)