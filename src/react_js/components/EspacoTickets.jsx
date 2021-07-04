import React, { useState, useContext, useEffect } from 'react'

import ContextBalanca from './ContextBalanca'

import Ticket from './Ticket'

export default (props) => {

    // let [tickets, setTickets] = useState(props.tickets_para_carregar)

    let {
        tickets,
        setTickets,
        selectedTicket,
        setSelectedTicket,
        infoFormulario,
        setInfoFormulario
    } = useContext(ContextBalanca)
    
    // let [selectedTicket, setSelectedTicket] = props.about_select_ticket


    let select_or_unselect_ticket = (ticket_id) => {
        return () => {
            if (selectedTicket == ticket_id) setSelectedTicket(-1)
            else {
                setSelectedTicket(ticket_id)
                let ticket = tickets.find(ticket => ticket.id_pesagem == ticket_id)
                let keys = ["Placa", "Pessoa", "Material"]
                let infos = keys.map(key => ticket[key])

                let new_info = {}
                keys.forEach((value, index) => new_info[value] = infos[index])
                
                setInfoFormulario({...new_info, 'Peso':''})
            }
        }
    }

    let renderPesagem = (args_value) => {
        return (
            <div className='intermediate_div_tickes' key={args_value.id_pesagem}>
                <Ticket
                    id_pesagem={args_value.id_pesagem}
                    dados={args_value}
                    select_or_unselect_ticket={select_or_unselect_ticket(args_value.id_pesagem)}
                    this_ticket_is_selected={selectedTicket == args_value.id_pesagem}
                />
            </div>
        )
    }

    // useEffect(() => console.log(selectedTicket), [selectedTicket])

    return (
        <div id='tickets' style={{backgroundColor: '#000000'}}>
            {
                tickets.map(renderPesagem)
            }
        </div>
    )
}