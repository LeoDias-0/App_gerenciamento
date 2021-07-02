import React, { useState, useContext, useEffect } from 'react'

import ContextBalanca from './ContextBalanca'

import Ticket from './Ticket'

export default (props) => {

    // let [tickets, setTickets] = useState(props.tickets_para_carregar)

    let {tickets, setTickets, selectedTicket, setSelectedTicket} = useContext(ContextBalanca)
    
    // let [selectedTicket, setSelectedTicket] = props.about_select_ticket

    let remove_ticket = (ticket_id) => {
        return () => {
            let tickets_com_a_exclusão_feita = tickets.filter(value => value.id_pesagem != ticket_id)
            setTickets(tickets_com_a_exclusão_feita)
        }
    }

    let select_or_unselect_ticket = (ticket_id) => {
        return () => {
            if (selectedTicket == ticket_id) setSelectedTicket(-1)
            else setSelectedTicket(ticket_id)

        }
    }

    let renderPesagem = (args_value) => {
        return (
            <div className='intermediate_div_tickes' key={args_value.id_pesagem}>
                <Ticket
                    id_pesagem={args_value.id_pesagem}
                    dados={args_value}
                    remove_ticket={remove_ticket(args_value.id_pesagem)}
                    select_or_unselect_ticket={select_or_unselect_ticket(args_value.id_pesagem)}
                    this_ticket_is_selected={selectedTicket == args_value.id_pesagem}
                />
            </div>
        )
    }

    return (
        <div id='tickets' style={{backgroundColor: '#000000'}}>
            {
                tickets.map(renderPesagem)
            }
        </div>
    )
}