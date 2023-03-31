import { useRef } from "react"
import '../../App.scss'

interface IProps {

    Etiqueta?: string | undefined,

    Requerido?: boolean | undefined

    SetState?: React.Dispatch<React.SetStateAction<Date | undefined>>

}

function DatePicker ( { Etiqueta, Requerido, SetState } : IProps )  {

    const SelectorRef = useRef<HTMLInputElement>(null)

    return (

        <form className="ContenedorInputTexto" >

            <input 

            ref={SelectorRef}

            className="Input"

            type="text" 

            onFocus={(e) => { 
                
                e.target.type = "date" 
            
                SelectorRef.current!.focus()

            }}

            onBlur={(e) => (e.target.type = "text")}

            required={ Requerido } 

            onChange={ (event) => SetState && SetState( new Date(event.target.value) ) } />
 
            <label className="Linea">

                <span className="Etiqueta">
                    
                    { Etiqueta }
                    
                </span>

            </label>

        </form>

    )

}

export default DatePicker