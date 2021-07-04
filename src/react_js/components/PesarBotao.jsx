import React, { useContext, useEffect, useState } from 'react'

import ContextBalanca from './ContextBalanca'

import * as utils from '../../js/modules/utils'


export default (props) => {
    let {
        infoFormulario,
        setInfoFormulario,
        selectedTicket,
        setSelectedTicket,
        tickets,
        setTickets,
        remove_ticket
    } = useContext(ContextBalanca)

    let abrir_pesagem = (id_pesagem) => {
        
        let dados_da_abertura_de_pesagem = infoFormulario

        dados_da_abertura_de_pesagem['id_pesagem'] = id_pesagem

        let dados_abertura_timed = utils.time_pesagem(dados_da_abertura_de_pesagem)
        
        utils.gravar_pesagem(dados_abertura_timed)

        setTickets([dados_da_abertura_de_pesagem, ...tickets])

        setSelectedTicket(-2)  /* TODO: ver se há um jeito menos redundante de fazer isso,
        basicamente estamos mudando o valor do ticket para quando iniciar a pesagem,
        obrigar que o campo do formulário seja limpo.
        Talvez criar um estado para isso */

        // TODO
        // Verificar se os dados estão corretos
        // Colocar o Tempo
        // Gerar Id
        // Gerar ticket
        // Gravar no banco de dados
        // Limpar formulário
    }

    let fechar_pesagem = (id_pesagem) => {
        
        let dados_fechamento_pesagem = infoFormulario
        
        dados_fechamento_pesagem['id_pesagem'] = id_pesagem
        
        let dados_fechamento_timed = utils.time_pesagem(dados_fechamento_pesagem)
        
        // Pega os dados da pesagem pronta para fechar
        let pesagem_completa = utils.fechar_pesagem(dados_fechamento_timed)

        utils.gravar_pesagem_fechamento(pesagem_completa)

        utils.remover_pesagem_fechada_da_pasta_pesagens_abertas(id_pesagem)

        remove_ticket(id_pesagem)

        setSelectedTicket(-1)
    }
    
    let handle_pesar_botao_click = () => {
        if (selectedTicket == -1) {
            // TODO: criar uma forma mais eficiente de criar id
            let gerated_id = String(Math.floor(Math.random() * 10000))
            abrir_pesagem(gerated_id)
        } else fechar_pesagem(selectedTicket)
    }

    let text_button = selectedTicket == -1 ? 'Abrir Pesagem': 'Fechar Pesagem'

    return (
        <div style={{backgroundColor: 'darkcyan', position: 'absolute', marginTop: '5%', left: '50%', transform: 'translate(-50%, 0%)'}}>
            <button id="pesar_botao" onClick={handle_pesar_botao_click}>{text_button}</button>
        </div>
    )
}