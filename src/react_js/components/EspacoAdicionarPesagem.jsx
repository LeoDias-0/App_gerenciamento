import React from 'react'

import FormularioPesagem from './FormularioPesagem'
import PesarBotao from './PesarBotao'

export default (props) => {

    return (
        <>
        <FormularioPesagem/>

        <div id='local_para_botao_pesar' style={{position: 'relative'}}>
            <PesarBotao/>
        </div>
        </>
    )
}