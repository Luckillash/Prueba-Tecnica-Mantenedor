import '../../App.scss'

interface IPropsSelector {

    Opciones: string[],

    Etiqueta?: string,

    State: string,

    SetState: React.Dispatch<React.SetStateAction<any>>,

    Deshabilitar?: boolean

}

function Select ( { Opciones, Etiqueta, State, SetState, Deshabilitar } : IPropsSelector ) {

    return (

        <form className="ContenedorInputTexto">

            <select value={State} disabled={ Deshabilitar } className="Input" onChange={ (evento) => SetState && SetState(evento.target.value) }>

                { State === "" && <option value={State} selected disabled hidden /> }

                { Opciones.map(( Opcion, Index, Array ) => {

                    return (

                        <option key={Index} value={Opcion}> { Opcion } </option>

                    )

                })}

            </select>

            <label className="Linea">

                <span className="Etiqueta" style={{ 
                    
                    color: Deshabilitar ? "rgb(200, 200, 200)" : State === "" || State === null ? "black" : "#FF9D4F",

                    transform: State === "" || State === null ? "translateY(0%)" :  "translateY(-150%)",

                    fontSize: State === "" || State === null ? "" :  "14px"
                    
                }}>
                    
                    { Etiqueta }
                    
                </span>

            </label>

        </form>

    )

}

export default Select