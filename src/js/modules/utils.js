import React from 'react'
import ReactDOM from 'react-dom'

import Ticket from '../../react_js/components/Ticket'

import {div_conteudo_principal} from '../modules/global'

const fs = require('fs')

let lidando_com_pesagem_aberta = false

let id_pesagem_em_questao = null

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
    
    let path_pesagens_abertas = './dados/Pesagens Abertas/'

    let filename_pesagem = timed_dados_pesagem.pessoa + ' '
    filename_pesagem += timed_dados_pesagem.data_pesagem.string + ' id='
    filename_pesagem += timed_dados_pesagem.id_pesagem + '.json'

    let to_be_write = JSON.stringify(timed_dados_pesagem, null, '\t')

    fs.writeFile(path_pesagens_abertas + filename_pesagem, to_be_write, (err) => {
        if (err) throw err
    })
}

export function gravar_pesagem_fechamento(timed_dados_pesagem) {
    
    let path_pesagens_fechadas = './dados/Pesagens Fechadas/'
    // São necessárias apenas os dados de fechamento para o filename
    let dados_do_fechamento = timed_dados_pesagem.fechamento_da_pesagem

    let filename_pesagem = dados_do_fechamento.pessoa + ' '
    filename_pesagem += dados_do_fechamento.data_pesagem.string + ' id='
    filename_pesagem += dados_do_fechamento.id_pesagem + '.json'

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


export function close_all_autocomplete_items() {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items")
    for (var i = 0; i < x.length; i++) {
        x[i].parentNode.removeChild(x[i])
    }
}


//  Essa função está sendo chamada direto do html
//  mudar isso mais tarde
export function go_to_cell_on_enter(event, cell) {
    var key = event.keyCode || event.which
    if (key == 13) {
        cell.focus()
        cell.select()
        close_all_autocomplete_items()
    }
}


// Antiga função autocomplete
// foram criadas outras, uma pra cada slot
// Está desnecessariamente complicada
export function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value
        /*close any already open lists of autocompleted values*/
        closeAllLists()
        if (!val) { return false }
        currentFocus = -1
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>"
                b.innerHTML += arr[i].substr(val.length)
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>"
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists()
                })
                a.appendChild(b)
            }
        }
    })

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list")
        if (x) x = x.getElementsByTagName("div")
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++
            /*and make the current item more visible:*/
            addActive(x)
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--
            /*and and make the current item more visible:*/
            addActive(x)
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault()
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click()
            }
        }
    })

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false
        /*start by removing the "active" class on all items:*/
        removeActive(x)
        if (currentFocus >= x.length) currentFocus = 0
        if (currentFocus < 0) currentFocus = (x.length - 1)
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active")
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active")
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items")
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i])
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target)
    })
}


function autocomplete_placa(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value
        /*close any already open lists of autocompleted values*/
        closeAllLists()
        if (!val) { return false }
        currentFocus = -1
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < placas.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (placas[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + placas[i].substr(0, val.length) + "</strong>"
                b.innerHTML += placas[i].substr(val.length)
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + placas[i] + "'>"
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists()
                })
                a.appendChild(b)
            }
        }
    })

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list")
        if (x) x = x.getElementsByTagName("div")
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++
            /*and make the current item more visible:*/
            addActive(x)
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--
            /*and and make the current item more visible:*/
            addActive(x)
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault()
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click()
            }
        }
    })

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false
        /*start by removing the "active" class on all items:*/
        removeActive(x)
        if (currentFocus >= x.length) currentFocus = 0
        if (currentFocus < 0) currentFocus = (x.length - 1)
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active")
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active")
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items")
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i])
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target)
    })
}


function autocomplete_pessoa(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value
        /*close any already open lists of autocompleted values*/
        closeAllLists()
        if (!val) { return false }
        currentFocus = -1
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < pessoas.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (pessoas[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + pessoas[i].substr(0, val.length) + "</strong>"
                b.innerHTML += pessoas[i].substr(val.length)
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + pessoas[i] + "'>"
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists()
                })
                a.appendChild(b)
            }
        }
    })

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list")
        if (x) x = x.getElementsByTagName("div")
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++
            /*and make the current item more visible:*/
            addActive(x)
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--
            /*and and make the current item more visible:*/
            addActive(x)
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault()
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click()
            }
        }
    })

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false
        /*start by removing the "active" class on all items:*/
        removeActive(x)
        if (currentFocus >= x.length) currentFocus = 0
        if (currentFocus < 0) currentFocus = (x.length - 1)
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active")
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active")
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items")
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i])
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target)
    })
}


function autocomplete_material(inp) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value
        /*close any already open lists of autocompleted values*/
        closeAllLists()
        if (!val) { return false }
        currentFocus = -1
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < materiais.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (materiais[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + materiais[i].substr(0, val.length) + "</strong>"
                b.innerHTML += materiais[i].substr(val.length)
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + materiais[i] + "'>"
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists()
                })
                a.appendChild(b)
            }
        }
    })

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list")
        if (x) x = x.getElementsByTagName("div")
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++
            /*and make the current item more visible:*/
            addActive(x)
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--
            /*and and make the current item more visible:*/
            addActive(x)
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault()
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click()
            }
        }
    })

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false
        /*start by removing the "active" class on all items:*/
        removeActive(x)
        if (currentFocus >= x.length) currentFocus = 0
        if (currentFocus < 0) currentFocus = (x.length - 1)
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active")
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active")
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items")
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i])
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target)
    })
}


// Cria um elemento html que representa um ticket e adiciona no DOM
// Muito complicada também, dá pra refatorar(deixar mais modular, talvez criar um 'objeto' ticket)
export function adicionar_ticket_pesagem(args_value) {
    // A intermediate_div está aqui principalmente para deixar o reactDOM no
    // controle apenas de intermediate_div e não da div #tickets
    // dessa forma não quebrando a manipulações nessa div que o código antigo faz
    let intermediate_div = document.createElement('div')
    intermediate_div.setAttribute('style', 'padding-bottom: 0.3cm; padding-right: 0.3cm;')

    document.getElementById("tickets").appendChild(intermediate_div)

    ReactDOM.render(
        <Ticket
        id_pesagem={args_value.id_pesagem}
        placa={args_value.placa}
        pessoa={args_value.pessoa}
        material={args_value.material}
        />,
        intermediate_div
    )
    // Mudaremos aos poucos dessa forma (até que só precisa de um render do ReactDOM em index.js)
    // Esperamos que essa gambiarra não dure por muito tempo

    /*
    let div_tickets = document.getElementById("tickets")
    let b = document.createElement("DIV")

    b.setAttribute('id', args_value.id_pesagem)
    b.setAttribute('class', 'tickets_nao_selecionados')
    b.setAttribute("style", "position: relative; width: 130px; height: 200px; cursor: pointer;")

    b.addEventListener("click", function () {
        let esta_pesagem_ja_esta_selecionada = id_pesagem_em_questao == this.id

        if (lidando_com_pesagem_aberta && esta_pesagem_ja_esta_selecionada) {
            lidando_com_pesagem_aberta = false
            document.getElementById(id_pesagem_em_questao).setAttribute('class', 'tickets_nao_selecionados')
            limpar_celulas()
        } else {
            if (lidando_com_pesagem_aberta){
                document.getElementById(id_pesagem_em_questao).setAttribute('class', 'tickets_nao_selecionados')
            }

            lidando_com_pesagem_aberta = true
            id_pesagem_em_questao = this.id
    
            document.getElementById(id_pesagem_em_questao).setAttribute('class', 'ticket_selecionado')
    
            document.querySelector('#placa').value = args_value.placa
            document.querySelector('#pessoa').value = args_value.pessoa
            document.querySelector('#material').value = args_value.material
    
            document.querySelector('#peso').focus()
            document.querySelector('#peso').select()
        }

    })

    b.innerHTML = ''
    b.innerHTML += args_value.placa + '<br>'
    b.innerHTML += args_value.pessoa + '<br>'
    b.innerHTML += args_value.material + '<br>'
    b.innerHTML += args_value.peso + '<br>'

    let intermediate_div = document.createElement('div')

    intermediate_div.setAttribute('style', 'padding-bottom: 0.3cm; padding-right: 0.3cm;')

    intermediate_div.appendChild(b)
    if (div_tickets.childNodes.length == 0) {
        div_tickets.appendChild(intermediate_div)
    } else {
        div_tickets.insertBefore(intermediate_div, div_tickets.childNodes[0])
    }


    let close_btn = document.createElement('div')
    close_btn.classList.add('tickets_mini_buttons')
    close_btn.classList.add('ticket_close_button')

    close_btn.addEventListener('click', function ( e ) {
        e.stopPropagation()
        alert('Close button pressed!')
    })

    let pin_btn = document.createElement('div')
    pin_btn.classList.add('tickets_mini_buttons')
    pin_btn.classList.add('ticket_pin_button')


    pin_btn.addEventListener('click', function ( e ) {
        e.stopPropagation()
        alert('Pin button pressed!')
    })

    let finalize_btn = document.createElement('div')
    finalize_btn.classList.add('tickets_mini_buttons')
    finalize_btn.classList.add('ticket_finalize_button')

    finalize_btn.addEventListener('click', function ( e ) {
        e.stopPropagation()
        alert('Finalize button pressed!')
    })


    b.appendChild(close_btn)
    b.appendChild(pin_btn)
    b.appendChild(finalize_btn)
    
    */
}

//  Lê no sistema as pesagens que estão abertas e carrega um ticket para cada uma delas
export function carregar_tickets_para_pesagens_abertas() {
    fs.readdirSync('dados\\Pesagens Abertas').forEach((file) => {
        let raw_data_pesagem = fs.readFileSync('dados\\Pesagens Abertas\\' + file)

        let pesagem = JSON.parse(raw_data_pesagem)

        adicionar_ticket_pesagem(pesagem)
    })
}


export function limpar_celulas() {
    document.querySelector('#pessoa').value = ''
    document.querySelector('#material').value = ''
    document.querySelector('#placa').value = ''
    document.querySelector('#peso').value = ''
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