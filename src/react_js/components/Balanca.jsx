import React, {useEffect, useState} from 'react'

import { ProviderBalanca } from './ContextBalanca'
import EspacoAdicionarPesagem from './EspacoAdicionarPesagem'
import EspacoTickets from './EspacoTickets'

export default (props) => {

    let styles_adicionar_pesagem = {
        left: '0%',
        right: '63%',
        display: 'inline-block',
        top: '0%',
        bottom: '0%',
        position: 'absolute'
    }

    let styles_local_tickets = {
        left: '41%',
        right:'0%',
        top: '0%',
        bottom: '0%',
        position: 'absolute',
        float: 'right',
        overflow: 'auto'
    }

    const [infoFormulario, setInfoFormulario] = useState({
        'Placa': '',
        'Pessoa': '',
        'Material': '',
        'Peso': ''
    })

    const [selectedTicket, setSelectedTicket] = useState(-1)

    const [tickets, setTickets] = useState(props.tickets_pesagens_abertas)

    let remove_ticket = (ticket_id) => {
        let tickets_com_a_exclusao_feita = tickets.filter(ticket => ticket.id_pesagem != ticket_id)

        setTickets(tickets_com_a_exclusao_feita)
    }

    useEffect(() => {
        console.log("ativação")
        if (selectedTicket <= -1) {
            setInfoFormulario({
            'Placa': '',
            'Pessoa': '',
            'Material': '',
            'Peso': ''
            })
            setSelectedTicket(-1)  // TODO: Ver se tem algum jeito menos redundante de resolver
    }
    }, [selectedTicket])

    let info_to_provide = {
        infoFormulario: infoFormulario,
        setInfoFormulario: setInfoFormulario,
        selectedTicket: selectedTicket,
        setSelectedTicket: setSelectedTicket,
        tickets: tickets,
        setTickets: setTickets,
        remove_ticket: remove_ticket
    }

    return (
        <>
        <ProviderBalanca value={info_to_provide}>
        <div id='local_para_adicionar_pesagem' style={styles_adicionar_pesagem}>

            <EspacoAdicionarPesagem/>

        </div>

        {/* <!-- Espaço dos tickets --> */}
        {/* <!-- Deixamos "móvel" o espaço dos tickets através de 'overflow: auto;' --> */}
        <div id="local_para_tickets" style={styles_local_tickets}>
            <EspacoTickets/>
        </div>

        </ProviderBalanca>
        </>
    )
}