import React, { useContext } from 'react'
import ContextBalanca from './ContextBalanca'

export default (props) => {
    let {infoFormulario, setInfoFormulario} = useContext(ContextBalanca)

    const useLocalHook = () => {
        let localInfo = infoFormulario[props.text]

        const setLocalInfo = (e) => {
            let aux = infoFormulario
            aux[props.text] = e.target.value
            setInfoFormulario(aux)
        }
      
        return [localInfo, setLocalInfo]
    }

    const [localVar, setLocalVar] = useLocalHook()

    return (
        <>
            <td className="label_form">
                <label>{props.text + ':'}</label>
            </td>
            <td>
                <div className="autocomplete">
                    <input
                        id={props.id}
                        className="input_form" type="text"
                        name={props.text}
                        value={localVar}
                        onChange={e => setLocalVar(e.target.value)}
                    />
                </div>
            </td>
        </>
    )
}