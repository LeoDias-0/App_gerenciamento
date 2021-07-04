import React, { useEffect, useContext } from 'react'

import ContextBalanca from './ContextBalanca'


export default () => {
    let {
        selectedTicket,
        remove_ticket
    } = useContext(ContextBalanca)


    let handleClick = e => {
        e.stopPropagation()
        remove_ticket(selectedTicket)
    }

    return (
        
        <div  onClick={handleClick} className="ticket_mini_button ticket_mini_button_close">
        </div>
    )
}