import React, { useState } from 'react'

import TicketCloseMiniButton from './TicketCloseMiniButton'

// A princípio acho que a implementação através de parâmetros,
// com a informação passando de Parent para Child, deve ser uma boa opção
export default (props) => {

    let classes_of_ticket = () => {
        if(props.this_ticket_is_selected) return ["ticket_selecionado rendered_by_react"]
        else return ["tickets_nao_selecionados rendered_by_react"]
    }

    return (
        // TODO: Adicionar um selector css próprio para identificar o ticket
        <div onClick={props.select_or_unselect_ticket} className={classes_of_ticket()}>
            <TicketCloseMiniButton remove_ticket={props.remove_ticket}/>
            <div className="ticket_mini_button ticket_mini_button_pin"></div>
            <div className="ticket_mini_button ticket_mini_button_minimize"></div>
            <br />
            <h4>{props.dados['Pessoa']}</h4>
            <p>{props.dados['Placa']}</p>
            <p>{props.dados['Material']}</p>
            <p>{props.dados['Peso']}</p>
        </div>
    )
}
    

