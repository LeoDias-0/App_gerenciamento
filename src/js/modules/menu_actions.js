import * as utils from './utils'
import {div_conteudo_principal, botao_balanca, botao_pesagens_fechadas} from './global'

import ReactDOM from 'react-dom'


export let click_botao_balanca = (body_string_balanca) => {
    // o método .children retorn um HTML Collection ao invés de um array
    // por isso utilizamos o spread operator aqui, transformando em um array
    // para usar o forEach
    [...document.getElementById('menu').children].forEach((botao) => {
        botao.classList.remove('active')
    })
    botao_balanca.className = 'active'
    
    div_conteudo_principal.innerHTML = ''
    // div_conteudo_principal.innerHTML = body_string_balanca

    let {placas, pessoas, materiais} = utils.ler_dados_gravados()

    let numero_de_pesagens = 1

    utils.carregar_balanca()

    // utils.autocomplete(document.getElementById("placa"), placas)

    // utils.autocomplete(document.getElementById("pessoa"), pessoas)

    // utils.autocomplete(document.getElementById("material"), materiais)

    let placa_cell = document.querySelector('#placa')
    let pessoa_cell = document.querySelector('#pessoa')
    let material_cell = document.querySelector('#material')
    let peso_cell = document.querySelector('#peso')
    let pesar_botao = document.querySelector('#pesar_botao')
    let adc_placa_botao = document.querySelector('#adicionar_placa')
    let adc_nome_botao = document.querySelector('#adicionar_nome')
    let adc_material_botao = document.querySelector('#adicionar_material')

    /*
    pesar_botao.addEventListener('click', () => {
        let data_values = {
            placa: placa_cell.value,
            pessoa: pessoa_cell.value,
            material: material_cell.value,
            peso: peso_cell.value,
            //id_pesagem: utils.numero_de_pesagens
            id_pesagem: Math.floor(Math.random() * 10000)
        }

        let id_pesagem_em_questao = null
        
        let all_in_tickets = document.querySelector('#tickets')
        let selected_tickets = [...all_in_tickets.querySelectorAll('.ticket_selecionado')]

        let lidando_com_pesagem_aberta = selected_tickets.length > 0
        if (lidando_com_pesagem_aberta) id_pesagem_em_questao = selected_tickets[0].id

        if (lidando_com_pesagem_aberta) {
            lidando_com_pesagem_aberta = false
            document.getElementById(id_pesagem_em_questao).parentElement.outerHTML = ''

            data_values.id_pesagem = id_pesagem_em_questao

            data_values = utils.time_pesagem(data_values)

            let pesagem_fechada_completa = utils.fechar_pesagem(data_values)

            utils.gravar_pesagem_fechamento(pesagem_fechada_completa)

            utils.remover_pesagem_fechada_da_pasta_pesagens_abertas(id_pesagem_em_questao)
        } else {
            data_values = utils.time_pesagem(data_values)

            utils.gravar_pesagem(data_values)

            utils.adicionar_ticket_pesagem(data_values)

            numero_de_pesagens++
            utils.escrever_variaveis_do_sistema()
        }
        utils.limpar_celulas()
    })
    */

    /*
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
    */

}


export let click_botao_pesagens_fechadas = (body_string_pesagens_fechadas) => {
    
    [...document.getElementById('menu').children].forEach((botao) => {
        botao.classList.remove('active')
    })
    botao_pesagens_fechadas.className = 'active'
    // Apague os elementos da página antiga, não é necessário, mas é para deixar mais claro
    div_conteudo_principal.innerHTML = ''
    div_conteudo_principal.innerHTML = body_string_pesagens_fechadas

    // TODO: Adicionar o autocomplete nos campos de busca

    let ja_existem_dados_carregados = false
    document.querySelector('#carregar_btn').addEventListener('click', () => {

        let filtro = utils.get_filtro()

        if (ja_existem_dados_carregados) {
            document.querySelector('table#tabela').innerHTML = ''
        }
        ja_existem_dados_carregados = true
        
        utils.carregar_pesagens(filtro)
    })

}