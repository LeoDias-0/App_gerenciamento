import React from 'react'
import ReactDOM from 'react-dom'

import fs from 'fs'

import Balanca from '../../react_js/components/Balanca'


let numero_de_pesagens = 1

let placas = []

let pessoas = []

let materiais = []

let dados_cadastros = {}


//  O------------------------O
//  | Declarações de funções |
//  O------------------------O



export function carregar_variaveis_do_sistema() {
    let raw_data = fs.readFileSync('variables\\variaveis.json')
    numero_de_pesagens = JSON.parse(raw_data).numero_de_pesagens
}


export function escrever_variaveis_do_sistema() {
    let data = {}
    data.numero_de_pesagens = numero_de_pesagens
    fs.writeFileSync('variables\\variaveis.json', JSON.stringify(data))
}


export function ler_dados_gravados() {
    let cadastro_PATH = 'dados\\Cadastros\\'

    pessoas = fs.readFileSync(cadastro_PATH + 'Clientes\\nomes.txt', 'utf-8').split('\n').filter(Boolean)

    placas = fs.readFileSync(cadastro_PATH + 'Placas\\placas.txt', 'utf-8').split('\n').filter(Boolean)

    materiais = fs.readFileSync(cadastro_PATH + 'Materiais\\materiais.txt', 'utf-8').split('\n').filter(Boolean)

    return {pessoas, placas, materiais}
}


export function time_pesagem(dados_pesagem) {
    let dt = new Date()

    let dia = String(dt.getDate())
    let mes = String(dt.getMonth() + 1)
    let ano = String(dt.getFullYear())
    let hora = String(dt.getHours())
    let minuto = String(dt.getMinutes())
    let segundo = String(dt.getSeconds())

    dados_pesagem.data_pesagem = {
        dia: dia,
        mes: mes,
        ano: ano,
        hora: hora,
        minuto: minuto,
        segundo: segundo
    }
    

    let string_date = dia + '-' + mes + '-' + ano
    let string_time = hora + 'h' + minuto + 'min' + segundo + 's'

    dados_pesagem.data_pesagem.string = string_date + ' ' + string_time

    return dados_pesagem
}


export function gravar_pesagem(timed_dados_pesagem) {
    // Função atualizada para gravar (tirar esse comentário quando nos sentirmos seguros para tanto)
    
    let path_pesagens_abertas = './dados/Pesagens Abertas/'

    let filename_pesagem = timed_dados_pesagem['Pessoa'] + ' '
    filename_pesagem += timed_dados_pesagem['data_pesagem']['string'] + ' id='
    filename_pesagem += timed_dados_pesagem['id_pesagem'] + '.json'

    let to_be_write = JSON.stringify(timed_dados_pesagem, null, '\t')

    fs.writeFile(path_pesagens_abertas + filename_pesagem, to_be_write, (err) => {
        if (err) throw err
    })
}

export function gravar_pesagem_fechamento(timed_dados_pesagem) {
    
    let path_pesagens_fechadas = './dados/Pesagens Fechadas/'
    // São necessárias apenas os dados de fechamento para o filename
    let dados_do_fechamento = timed_dados_pesagem.fechamento_da_pesagem

    let filename_pesagem = dados_do_fechamento['Pessoa'] + ' '
    filename_pesagem += dados_do_fechamento['data_pesagem']['string'] + ' id='
    filename_pesagem += dados_do_fechamento['id_pesagem'] + '.json'

    let to_be_write = JSON.stringify(timed_dados_pesagem, null, '\t')

    fs.writeFile(path_pesagens_fechadas + filename_pesagem, to_be_write, (err) => {
        if (err) throw err
    })
}

export function remover_pesagem_fechada_da_pasta_pesagens_abertas(id_pesagem_a_ser_excluida) {
    let pesagens_abertas_folder = 'dados\\Pesagens Abertas\\'
    let pesagem_path = ''
    fs.readdirSync(pesagens_abertas_folder).forEach( (file) => {
        if (file.includes('id=' + String(id_pesagem_a_ser_excluida))) pesagem_path = file
    })
    fs.unlinkSync(pesagens_abertas_folder + pesagem_path)
}

export function get_pesagem_aberta_by_id(id_pesagem_aberta) {
    let pesagens_abertas_folder = 'dados\\Pesagens Abertas\\'

    let pesagem_path = ''
    fs.readdirSync(pesagens_abertas_folder).forEach( (file) => {
        if (file.includes('id=' + String(id_pesagem_aberta))) pesagem_path = file
    })

    let raw_data = fs.readFileSync(pesagens_abertas_folder + pesagem_path)
    let abertura_da_pesagem = JSON.parse(raw_data)

    return abertura_da_pesagem
}

export function fechar_pesagem(timed_dados_pesagem) {
    let id_da_pesagem_a_se_fechar = timed_dados_pesagem.id_pesagem

    let abertura_da_pesagem = get_pesagem_aberta_by_id(id_da_pesagem_a_se_fechar)

    let pesagem_completa = {
        abertura_da_pesagem: abertura_da_pesagem,
        fechamento_da_pesagem: timed_dados_pesagem
    }

    return pesagem_completa
}


export function carregar_balanca() {

    let tickets_pesagens_abertas = []

    fs.readdirSync('dados\\Pesagens Abertas').forEach((file) => {
        let raw_data_pesagem = fs.readFileSync('dados\\Pesagens Abertas\\' + file)
        let pesagem = JSON.parse(raw_data_pesagem)
        tickets_pesagens_abertas.push(pesagem)
    })

    ReactDOM.render(
        <Balanca tickets_pesagens_abertas={tickets_pesagens_abertas}/>,
        document.querySelector("#conteudo_principal")
    )
}


//  x------------------------------x
//  | Funções relacionadas ao menu |
//  x------------------------------x

// TODO: Completar isso aqui hein
// Pelo visto não é muito viável colocar um fetch dentro de um função
export function load_tab(tab_to_load) {
    // Dessa forma está retornando uma Promise
    // por isso ainda precisamos de um 'then'
    return fetch(tab_to_load).then(
        response => response.text()
    )
}


//  x----------------------------------------------------x
//  | Funções relacionadas a página de pesagens fechadas |
//  x----------------------------------------------------x


export let carregar_pesagens = (filtros) => {

    // filtro do tipo de pesagem
    // decidir o path correto
    let path_pasta = 'dados\\' + filtros.tipo_da_pesagem
    
    // percorrer pesagens
    fs.readdirSync(path_pasta).forEach((file) => {

        let raw_data_pesagem = fs.readFileSync(path_pasta + '\\' + file)

        let pesagem = JSON.parse(raw_data_pesagem)

        // filtrar pesagens
        let deve_ser_exibido = pesagem_satisfaz_filtros(pesagem, filtros)

        if (deve_ser_exibido) {
            // selecionar dados da pesagem e colocar em uma linha
            let linha = pesagem_para_linha(filtros.tipo_da_pesagem, pesagem)

            // create html from linha
            let html_linha = create_html_from_linha(linha)

            let div_destino = document.getElementById('tabela')

            // show data
            div_destino.appendChild(html_linha) 
        }

    })
}

export let pesagem_satisfaz_filtros = (pesagem, filtros) => {
    let pesagem_modificada
    if (filtros.tipo_da_pesagem == 'Pesagens Fechadas') {
        pesagem_modificada = pesagem.fechamento_da_pesagem
    } else {
        pesagem_modificada = pesagem
    }
    
    let keys_a_serem_avaliadas = ['pessoa', 'placa', 'material', 'id_pesagem']

    let satisfaz_todas_as_keys = true

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

export let pesagem_para_linha = (tipo, pesagem) => {

    // Tentativa de usar o design pattern strategy

    // Nome gigantesco, mudar depois
    let funcoes_que_retornam_as_informacoes_dependendo_do_tipo_da_pesagem = {
        "Pesagens Fechadas": (pesagem) => {
            let abertura = pesagem.abertura_da_pesagem
            let fechamento = pesagem.fechamento_da_pesagem
            let arr = [
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
            let arr = [
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

export let create_html_from_linha = (linha) => {
    let t_row = document.createElement('tr')
    t_row.classList.add('linha-da-tabela-de-busca')

    linha.forEach((item) => {
        let t_cell = document.createElement('td')
        t_cell.classList.add('celula')
        
        let span_in_cell = document.createElement('span')
        span_in_cell.innerText = String(item)

        t_cell.appendChild(span_in_cell)

        t_row.appendChild(t_cell)
    })

    let click_na_linha = (id_pesagem) => {
        alert(`A linha da pesagem ${id_pesagem} foi clicada!`)
    }

    t_row.addEventListener('click', () => click_na_linha(linha[0]))

    return t_row
}

export let get_filtro = () => {
    
    // get strings from cells
    let placa_value = document.querySelector('input#placa_cell').value
    let pessoa_value = document.querySelector('input#pessoa_cell').value
    let material_value = document.querySelector('input#material_cell').value

    // sanitize strings

    let filtro = {
        tipo_da_pesagem: 'Pesagens Fechadas',
        placa: placa_value,
        pessoa: pessoa_value,
        material: material_value
    }

    return filtro
}