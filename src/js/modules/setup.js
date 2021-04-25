
import * as Global from './global'
import {div_conteudo_principal, click_botao_balanca, click_botao_pesagens_fechadas} from './menu_actions'
import * as utils from './utils'


export default function setup() {
    let body_string_balanca, body_string_pesagens_fechadas

    utils.carregar_variaveis_do_sistema()

    utils.ler_dados_gravados()

    utils.load_tab('./src/html/menu0_balanca.html')
        .then(text => body_string_balanca = text)

    utils.load_tab('./src/html/menu1_pesagens_fechadas.html')
        .then(text => body_string_pesagens_fechadas = text)

    Global.botao_balanca.addEventListener('click', () => {
        click_botao_balanca(body_string_balanca)
    })

    Global.botao_pesagens_fechadas.addEventListener('click', () => {
        click_botao_pesagens_fechadas(body_string_pesagens_fechadas)
    })
}
