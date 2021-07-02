import React, { useContext } from 'react'

import ContextBalanca from './ContextBalanca'

import * as utils from '../../js/modules/utils'


export default (props) => {
    let {
        infoFormulario,
        setInfoFormulario,
        selectedTicket,
        tickets,
        setTickets
    } = useContext(ContextBalanca)

    let abrir_pesagem = () => {
        // Verificar se os dados estão corretos
        let dados_da_abertura_de_pesagem = infoFormulario
        // Colocar o Tempo
        // Gerar Id

        dados_da_abertura_de_pesagem['id_pesagem'] = Math.floor(Math.random() * 10000)

        let dados_abertura_timed = utils.time_pesagem(dados_da_abertura_de_pesagem)
        
        utils.nova_gravar_pesagem(dados_abertura_timed)

        setTickets([dados_da_abertura_de_pesagem, ...tickets])

        setInfoFormulario({
            'Placa': '',
            'Pessoa': '',
            'Material': '',
            'Peso': '',
        })

        // Gerar ticket
        // Gravar no banco de dados
        // Limpar formulário
    }
    
    let handle_pesar_botao_click = () => {
        if (selectedTicket == -1) abrir_pesagem()
        else console.log('Fechar pesagem ' + selectedTicket)
    }

    return (
        <div style={{backgroundColor: 'darkcyan', position: 'absolute', marginTop: '5%', left: '50%', transform: 'translate(-50%, 0%)'}}>
            <button id="pesar_botao" onClick={handle_pesar_botao_click}>Pesar</button>
        </div>
    )
}