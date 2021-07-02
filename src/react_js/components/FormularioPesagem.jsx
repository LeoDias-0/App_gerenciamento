import React, { useEffect, useState, useContext } from 'react'
import BotaoAdicionarInfo from './BotaoAdicionarInfo'

import MiniFormAutoComplete from './MiniFormAutoComplete'
import ContextBalanca from './ContextBalanca'


export default (props) => {

    const [placa, setPlaca] = useState('')
    const [pessoa, setPessoa] = useState('')
    const [material, setMaterial] = useState('')
    const [peso, setPeso] = useState('')

    let {infoFormulario, setInfoFormulario} = useContext(ContextBalanca)

    useEffect(() => {
        setInfoFormulario({
            'Placa': placa,
            'Pessoa': pessoa,
            'Material': material,
            'Peso': peso
        })
    }, [placa, pessoa, material, peso])

    useEffect(() => {
        setPlaca(infoFormulario['Placa']),
        setPessoa(infoFormulario['Pessoa']),
        setMaterial(infoFormulario['Material']),
        setPeso(infoFormulario['Peso'])
        console.log(infoFormulario)
    }, [infoFormulario])

    let onChangePlaca = e => {
        setPlaca(e.target.value)

        // Dentro desse bloco o valor de 'placa' 
        // tem um delay de 1 caracter
        // Tem a ver com algo que a comunidade chama de 'closure hell'.
        // setTimeout( () => console.log(placa), 100)
    }

    return (
        <form autoComplete="off">
        <table style={{margin: '0 auto'}}>
            <tbody>
                <tr>
                    <td className="label_form">
                        <label>Placa:</label>
                    </td>
                    <td>
                        <div className="autocomplete">
                            <input
                                className="input_form" type="text"
                                value={placa}
                                onChange={onChangePlaca}
                            />
                        </div>
                    </td>
                    <BotaoAdicionarInfo id='placa' />
                </tr>
                <tr>
                    <td className="label_form">
                        <label>Pessoa:</label>
                    </td>
                    <td>
                        <div className="autocomplete">
                            <input
                                className="input_form" type="text"
                                value={pessoa}
                                onChange={e => setPessoa(e.target.value)}
                            />
                        </div>
                    </td>
                    <BotaoAdicionarInfo id='nome' />
                </tr>
                <tr>
                    <td className="label_form">
                        <label>Material:</label>
                    </td>
                    <td>
                        <div className="autocomplete">
                            <input
                                className="input_form" type="text"
                                value={material}
                                onChange={e => setMaterial(e.target.value)}
                            />
                        </div>
                    </td>
                    <BotaoAdicionarInfo id='nome' />
                </tr>
                <tr>
                    <td className="label_form">
                        <label>Peso:</label>
                    </td>
                    <td>
                        <div className="autocomplete">
                            <input
                                className="input_form" type="text"
                                value={peso}
                                onChange={e => setPeso(e.target.value)}
                            />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </form>
    )
}

