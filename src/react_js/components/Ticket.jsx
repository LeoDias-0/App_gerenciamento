import React from 'react'

// A princípio acho que a implementação através de parâmetros
// deve ser uma boa opção
export default (props) => 
    <div className="tickets_nao_selecionados rendered_by_react">
        <h4>{props.pessoa}</h4>
        <p>{props.placa}</p>
        <p>{props.material}</p>
        Rendered by React!
    </div>

