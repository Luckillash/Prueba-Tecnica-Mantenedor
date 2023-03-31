import '../../App.scss'

interface IProps {

    Etiqueta: string,
    
    Tipo?: string, 
    
    SetState: React.Dispatch<React.SetStateAction<any>>, 
    
    State?: string | number

}

function Input ({ Etiqueta, Tipo, SetState, State }: IProps) {

	function FormatearRut(rut: string) {

        if (rut.length > 12) return rut.slice(0, 12)

        if (rut === undefined || rut === "" || rut === " ") return ""

        // Eliminar puntos y guión del RUT (si los tiene)
        rut = rut.replace(/[.-]/g, '');
      
        // Separar la parte numérica del dígito verificador
        const num = rut.slice(0, -1);

        const dv = rut.slice(-1).toUpperCase();
      
        // Formatear la parte numérica con puntos y guiones
        let formattedNum = num;

        for (let i = num.length - 3; i > 0; i -= 3) {

          formattedNum = formattedNum.slice(0, i) + '.' + formattedNum.slice(i);

        }

        if (rut.length === 1) formattedNum = formattedNum + dv

        else formattedNum = formattedNum + '-' + dv;

        return formattedNum;

    }

	function EditarTexto (event: any ) {

		let Contenido: string = event.target.value

		if (Tipo === "Rut") {

			Contenido = FormatearRut(Contenido)

		}

		SetState(Contenido)

	}

	return (

        <div>

            <form className="ContenedorInputTexto">

                <input 

				onChange={EditarTexto}

                value={State}

                className="Input"

                required={ true }  />

                <label className="Linea">

                    <span className="Etiqueta">
                        
                        { Etiqueta }
                        
                    </span>

                </label>

            </form>

        </div>

	)

}

export default Input
