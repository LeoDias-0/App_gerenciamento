
// eai tiago

//  O----------------------------------------O
//  | renderer.js é executado pelo navegador |
//  O----------------------------------------O

//  'renderer.js' é um script em 'index.html' que é executado pelo navegador
//  do electron, ou seja é um código que roda no client side.
//  Em teoria não é legal deixar os códigos importantes ser executado no lado do cliente
//  mas o Electron dá essa liberdade.

//  O-----------------------------O
//  | Importando módulos externos |
//  O-----------------------------O

var pyshell = require('python-shell') // importando o pacote pra rodar comandos Python

const fs = require('fs') // importando o pacote filesystem (escrever/ler arquivos)
//  Aqui tá a mágica, em uma aplicação web normal a página html não pode escrever/ler arquivos no seu computador
//  por uma questão de segurança. Aqui o electron permite isso pois o servidor é o próprio computador.
//  Caso não fosse o cliente (página html) deveria mandar uma requisição para o servidor (Node) para que o Node
//  faça esse tipo de operação no servidor.


//  O-------------------------------------------O
//  | Declarando constantes e variáveis globais |
//  O-------------------------------------------O

let input = document.querySelector('#input')

let result = document.querySelector('#result')

let btn = document.querySelector('#btn')

let lidando_com_pesagem_aberta = false

let id_pesagem_em_questao = null

let placa_cell = document.querySelector('#placa')

let pessoa_cell = document.querySelector('#pessoa')

let material_cell = document.querySelector('#material')

let peso_cell = document.querySelector('#peso')

let pesar_botao = document.querySelector('#pesar_botao')

let adc_placa_botao = document.querySelector('#adicionar_placa')

let adc_nome_botao = document.querySelector('#adicionar_nome')

let adc_material_botao = document.querySelector('#adicionar_material')

let numero_de_pesagens = 1

let placas = []

let pessoas = []

let materiais = []

let dados_cadastros = {}

//  O------------------------O
//  | Declarações de funções |
//  O------------------------O



function carregar_variaveis_do_sistema() {
    raw_data = fs.readFileSync('variables\\variaveis.json')
    numero_de_pesagens = JSON.parse(raw_data).numero_de_pesagens
}


function escrever_variaveis_do_sistema() {
    data = {}
    data.numero_de_pesagens = numero_de_pesagens
    fs.writeFileSync('variables\\variaveis.json', JSON.stringify(data))
}


function ler_dados_gravados() {
    cadastro_PATH = 'dados\\Cadastros\\'

    pessoas = fs.readFileSync(cadastro_PATH + 'Clientes\\nomes.txt', 'utf-8').split('\n').filter(Boolean)

    placas = fs.readFileSync(cadastro_PATH + 'Placas\\placas.txt', 'utf-8').split('\n').filter(Boolean)

    materiais = fs.readFileSync(cadastro_PATH + 'Materiais\\materiais.txt', 'utf-8').split('\n').filter(Boolean)
}

// Essa function vai para o cemitério
function ler_dados_gravados_py() {
    options = {
        mode: 'json',
    }

    pyshell.run('ler_dados_gravados.py', options, function (err, results) {
        if (err) throw err

        dados_cadastros = results[0]

        pessoas = dados_cadastros[0]
        placas = dados_cadastros[1]
        materiais = dados_cadastros[2]
    })
}


function time_pesagem(dados_pesagem) {
    dt = new Date()

    dia = String(dt.getDate())
    mes = String(dt.getMonth() + 1)
    ano = String(dt.getFullYear())
    hora = String(dt.getHours())
    minuto = String(dt.getMinutes())
    segundo = String(dt.getSeconds())

    dados_pesagem.data_pesagem = {
        dia: dia,
        mes: mes,
        ano: ano,
        hora: hora,
        minuto: minuto,
        segundo: segundo
    }
    

    string_date = dia + '-' + mes + '-' + ano
    string_time = hora + 'h' + minuto + 'min' + segundo + 's'

    dados_pesagem.data_pesagem.string = string_date + ' ' + string_time

    return dados_pesagem
}

function gravar_pesagem(timed_dados_pesagem) {
    
    path_pesagens_abertas = './dados/Pesagens Abertas/'

    filename_pesagem = timed_dados_pesagem.pessoa + ' '
    filename_pesagem += timed_dados_pesagem.data_pesagem.string + ' id='
    filename_pesagem += timed_dados_pesagem.id_pesagem + '.json'

    to_be_write = JSON.stringify(timed_dados_pesagem, null, '\t')

    fs.writeFile(path_pesagens_abertas + filename_pesagem, to_be_write, (err) => {
        if (err) throw err
    })
}

function gravar_pesagem_fechamento(timed_dados_pesagem) {
    
    path_pesagens_fechadas = './dados/Pesagens Fechadas/'
    // São necessárias apenas os dados de fechamento para o filename
    dados_do_fechamento = timed_dados_pesagem.fechamento_da_pesagem

    filename_pesagem = dados_do_fechamento.pessoa + ' '
    filename_pesagem += dados_do_fechamento.data_pesagem.string + ' id='
    filename_pesagem += dados_do_fechamento.id_pesagem + '.json'

    to_be_write = JSON.stringify(timed_dados_pesagem, null, '\t')

    fs.writeFile(path_pesagens_fechadas + filename_pesagem, to_be_write, (err) => {
        if (err) throw err
    })
}

function remover_pesagem_fechada_da_pasta_pesagens_abertas(id_pesagem_a_ser_excluida) {
    pesagens_abertas_folder = 'dados\\Pesagens Abertas\\'
    pesagem_path = ''
    fs.readdirSync(pesagens_abertas_folder).forEach( (file) => {
        if (file.includes('id=' + String(id_pesagem_a_ser_excluida))) pesagem_path = file
    })
    fs.unlinkSync(pesagens_abertas_folder + pesagem_path)
}


function fechar_pesagem_py(args_value, id_pesagem) {
    temp = id_pesagem.toString()
    args_value = args_value.concat([temp])

    options = {
        mode: 'text',
        args: args_value
    }

    pyshell.run('fechar_pesagem.py', options, function (err, results) {
        if (err) throw err
        // alert(results)

    }
    )
}

function get_pesagem_aberta_by_id(id_pesagem_aberta) {
    pesagens_abertas_folder = 'dados\\Pesagens Abertas\\'

    pesagem_path = ''
    fs.readdirSync(pesagens_abertas_folder).forEach( (file) => {
        if (file.includes('id=' + String(id_pesagem_aberta))) pesagem_path = file
    })

    raw_data = fs.readFileSync(pesagens_abertas_folder + pesagem_path)
    abertura_da_pesagem = JSON.parse(raw_data)

    return abertura_da_pesagem
}

function fechar_pesagem(timed_dados_pesagem) {
    id_da_pesagem_a_se_fechar = timed_dados_pesagem.id_pesagem

    abertura_da_pesagem = get_pesagem_aberta_by_id(id_da_pesagem_a_se_fechar)

    pesagem_completa = {
        abertura_da_pesagem: abertura_da_pesagem,
        fechamento_da_pesagem: timed_dados_pesagem
    }

    return pesagem_completa
}


function close_all_autocomplete_items() {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items")
    for (var i = 0; i < x.length; i++) {
        x[i].parentNode.removeChild(x[i])
    }
}


//  Essa função está sendo chamada direto do html
//  mudar isso mais tarde
function go_to_cell_on_enter(event, cell) {
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
function autocomplete(inp, arr) {
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
function adicionar_ticket_pesagem(args_value) {
    div_tickets = document.getElementById("tickets")
    b = document.createElement("DIV")

    b.setAttribute('id', args_value.id_pesagem)
    b.setAttribute('class', 'tickets_nao_selecionados')
    b.setAttribute("style", "position: relative; width: 130px; height: 200px; cursor: pointer;")

    b.addEventListener("click", function () {
        esta_pesagem_ja_esta_selecionada = id_pesagem_em_questao == this.id

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
    
            placa_cell.value = args_value.placa
            pessoa_cell.value = args_value.pessoa
            material_cell.value = args_value.material
    
            peso_cell.focus()
            peso_cell.select()
        }

    })

    b.innerHTML = ''
    b.innerHTML += args_value.placa + '<br>'
    b.innerHTML += args_value.pessoa + '<br>'
    b.innerHTML += args_value.material + '<br>'
    b.innerHTML += args_value.peso + '<br>'

    intermediate_div = document.createElement('div')

    intermediate_div.setAttribute('style', 'padding-bottom: 0.3cm; padding-right: 0.3cm;')

    intermediate_div.appendChild(b)
    if (div_tickets.childNodes.length == 0) {
        div_tickets.appendChild(intermediate_div)
    } else {
        div_tickets.insertBefore(intermediate_div, div_tickets.childNodes[0])
    }


    close_btn = document.createElement('div')
    close_btn.classList.add('tickets_mini_buttons')
    close_btn.classList.add('ticket_close_button')

    close_btn.addEventListener('click', function ( e ) {
        e.stopPropagation()
        alert('Close button pressed!')
    })

    pin_btn = document.createElement('div')
    pin_btn.classList.add('tickets_mini_buttons')
    pin_btn.classList.add('ticket_pin_button')


    pin_btn.addEventListener('click', function ( e ) {
        e.stopPropagation()
        alert('Pin button pressed!')
    })

    finalize_btn = document.createElement('div')
    finalize_btn.classList.add('tickets_mini_buttons')
    finalize_btn.classList.add('ticket_finalize_button')

    finalize_btn.addEventListener('click', function ( e ) {
        e.stopPropagation()
        alert('Finalize button pressed!')
    })


    b.appendChild(close_btn)
    b.appendChild(pin_btn)
    b.appendChild(finalize_btn)

}


// Antiga função que adiciona o ticket
function adicionar_ticket_pesagem_antiga2(args_value) {
    div_tickets = document.getElementById("tickets")
    b = document.createElement("DIV")

    b.setAttribute('id', numero_de_pesagens.toString())
    b.setAttribute('class', 'tickets_nao_selecionados')
    b.setAttribute("style", "width: 130px; height: 200px; cursor: pointer;")

    b.addEventListener("click", function () {
        esta_pesagem_ja_esta_selecionada = id_pesagem_em_questao == this.id

        if (lidando_com_pesagem_aberta && esta_pesagem_ja_esta_selecionada) {
            lidando_com_pesagem_aberta = false
            document.getElementById(id_pesagem_em_questao).setAttribute('class', 'tickets_nao_selecionados')
            console.log('pesagem aberta e selecionada')
        } else {
            if (lidando_com_pesagem_aberta){
                document.getElementById(id_pesagem_em_questao).setAttribute('class', 'tickets_nao_selecionados')
            }

            lidando_com_pesagem_aberta = true
            id_pesagem_em_questao = this.id
    
            document.getElementById(id_pesagem_em_questao).setAttribute('class', 'ticket_selecionado')
    
            placa_cell.value = args_value[0]
            pessoa_cell.value = args_value[1]
            material_cell.value = args_value[2]
    
            peso_cell.focus()
            peso_cell.select()
        }

    })

    b.innerHTML = ''
    for (let i = 0; i < 4; i++) {
        b.innerHTML += args_value[i]
        b.innerHTML += '<br>'
    }

    intermediate_div = document.createElement('div')

    intermediate_div.setAttribute('style', 'padding-bottom: 0.3cm; padding-right: 0.3cm;')

    intermediate_div.appendChild(b)
    if (div_tickets.childNodes.length == 0) {
        div_tickets.appendChild(intermediate_div)
    } else {
        div_tickets.insertBefore(intermediate_div, div_tickets.childNodes[0])
    }

}

// Antiga função que adiciona o ticket
function adicionar_ticket_pesagem_antiga(args_value) {
    div_tickets = document.getElementById("tickets")
    b = document.createElement("DIV")

    b.setAttribute('id', numero_de_pesagens.toString())
    b.setAttribute('class', 'tickets_nao_selecionados')
    b.setAttribute("style", "width: 130px; height: 200px; cursor: pointer;")

    b.addEventListener("click", function () {
        if (lidando_com_pesagem_aberta) {
            document.getElementById(id_pesagem_em_questao).setAttribute('class', 'tickets_nao_selecionados')
        }

        lidando_com_pesagem_aberta = true
        id_pesagem_em_questao = this.id

        document.getElementById(id_pesagem_em_questao).setAttribute('class', 'ticket_selecionado')


        placa_cell.value = args_value[0]
        pessoa_cell.value = args_value[1]
        material_cell.value = args_value[2]

        peso_cell.focus()
        peso_cell.select()
    })

    b.innerHTML = ''
    for (let i = 0; i < 4; i++) {
        b.innerHTML += args_value[i]
        b.innerHTML += '<br>'
    }
    if (div_tickets.childNodes.length == 0) {
        div_tickets.appendChild(b)
    } else {
        div_tickets.insertBefore(b, div_tickets.childNodes[0])
    }

}

//  Lê no sistema as pesagens que estão abertas e carrega um ticket para cada uma delas
function carregar_tickets_para_pesagens_abertas() {
    fs.readdirSync('dados\\Pesagens Abertas').forEach((file) => {
        raw_data_pesagem = fs.readFileSync('dados\\Pesagens Abertas\\' + file)

        pesagem = JSON.parse(raw_data_pesagem)

        adicionar_ticket_pesagem(pesagem)
    })
}


function limpar_celulas() {
    placa_cell.value = ''
    pessoa_cell.value = ''
    material_cell.value = ''
    peso_cell.value = ''
}



//  O-------------------------------------O
//  | A partir daqui o código é executado |
//  O-------------------------------------O


carregar_variaveis_do_sistema()

ler_dados_gravados()

carregar_tickets_para_pesagens_abertas()

autocomplete_placa(document.getElementById("placa"))

autocomplete_pessoa(document.getElementById("pessoa"))

autocomplete_material(document.getElementById("material"))


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