import React, { useEffect } from 'react'


export default (props) => {
    /*
    let handleClick = () => {
        console.log(`Clicou no botão de fechar ticket! da pesagem ${props.id_pesagem}!`)
        let intermediate_ticket_div = document.querySelector(`#ticket_pesagem_${props.id_pesagem}`).parentNode
        // TODO: Decidir as funções desse botão
        // O certo, para eliminar o 'intermediate_ticket_div' é
        ReactDOM.unmountComponentAtNode(intermediate_ticket_div)
        intermediate_ticket_div.parentNode.removeChild(intermediate_ticket_div)
        // ao invés de apenas
        // intermediate_ticket_div.parentNode.removeChild(intermediate_ticket_div)
    }

    useEffect(() => {
        // Adicionar listener
        document.querySelector(`#pesagem_${props.id_pesagem}`).addEventListener('click', handleClick);
    
        // Remover listener
        return () => {
            // Removendo através do ReactDOM.unmountComponentAtNode não é necessário
            // remover o listener manualmente usando
            // document.querySelector(`#pesagem_${props.id_pesagem}`).removeEventListener('click', handleClick);
        }

      }, []) // Essa lista vazia tem explicação
    */
    
    return (
        <div onClick={props.remove_ticket} className="ticket_mini_button ticket_mini_button_close">
        </div>
    )
}