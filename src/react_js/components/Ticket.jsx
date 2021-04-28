import React from 'react'

import TicketCloseMiniButton from './TicketCloseMiniButton'

// A princípio acho que a implementação através de parâmetros,
// com a informação passando de Parent para Child, deve ser uma boa opção
export default (props) => {

    return (
        // TODO: Adicionar um selector css próprio para identificar o ticket
        <div className="tickets_nao_selecionados rendered_by_react" id={`ticket_pesagem_${props.id_pesagem}`}>
            <TicketCloseMiniButton id_pesagem={props.id_pesagem}/>
            <div className="ticket_mini_button ticket_mini_button_pin"></div>
            <div className="ticket_mini_button ticket_mini_button_minimize"></div>
            <h4>{props.pessoa}</h4>
            <p>{props.placa}</p>
            <p>{props.material}</p>
            Rendered by React!
        </div>
    )
}
    

