import React, { useEffect } from 'react'

import TicketCloseMiniButton from './TicketCloseMiniButton'
import * as utils from '../../js/modules/utils'

// A princípio acho que a implementação através de parâmetros,
// com a informação passando de Parent para Child, deve ser uma boa opção
export default (props) => {
    function execute_when_load() {
        /* Essa função será executada no useEffect, quando ele for carregado */
        
        let div_ticket = document.getElementById(`ticket_pesagem_${props.id_pesagem}`)

        function handleClick() {

            /* Faz a alteração do Id da pesagem que está (ou não) selecionada nas variáveis do sistema */
            let dict_variables = utils.carregar_variaveis_do_sistema()
            let dict_variables_ticket_id = dict_variables.selected_ticket_id

            let div_ticket = document.getElementById(`ticket_pesagem_${props.id_pesagem}`)
            let div_old_ticket = document.getElementById(`ticket_pesagem_${dict_variables_ticket_id}`)


            if (dict_variables_ticket_id == -1) {

                // Ninguém está selecionado
                div_ticket.classList.add('ticket_selecionado')

                dict_variables.selected_ticket_id = props.id_pesagem
            } else if (dict_variables_ticket_id != props.id_pesagem) {

                // Faz a troca de um selecionado para outro selecionado
                // Adiciona o novo como selecionado
                div_ticket.classList.add('ticket_selecionado')
                div_ticket.classList.remove('tickets_nao_selecionados')

                // Tira seleção do antigo
                div_old_ticket.classList.add('tickets_nao_selecionados')
                div_old_ticket.classList.remove('ticket_selecionado')

                dict_variables.selected_ticket_id = props.id_pesagem
            } else {

                // Tira a seleção do mesmo
                div_ticket.classList.add('tickets_nao_selecionados')
                div_ticket.classList.remove('ticket_selecionado')
                
                dict_variables.selected_ticket_id = -1
            }
            utils.escrever_variaveis_do_sistema(dict_variables)
        }

        div_ticket.addEventListener('click', handleClick)
    }

    useEffect(execute_when_load)  // Não está usando um parâmetro [props.source] no useEffect (pq?)

    return (
        // TODO: Adicionar um selector css próprio para identificar o ticket
        <div className="tickets_nao_selecionados" id={`ticket_pesagem_${props.id_pesagem}`}>
            <TicketCloseMiniButton id_pesagem={props.id_pesagem}/>
            <div className="ticket_mini_button ticket_mini_button_pin"></div>
            <div className="ticket_mini_button ticket_mini_button_minimize"></div>
            <h4>{props.pessoa}</h4>
            <p>{props.placa}</p>
            <p>{props.material}</p>
        </div>
    )
}
    

