import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import { BsFillXCircleFill, BsGenderFemale, BsGenderMale, BsPencil, BsPencilFill, BsPersonAdd, BsTrashFill } from "react-icons/bs";
import Input from './componentes/input/Input';
import Select from './componentes/selector/Selector';
import Spinner from './componentes/spinner/Spinner';
import Popup from './componentes/popUp/PopUp';
import PopupMini from './componentes/popUp/PopUpMini';

interface IPersona {

	nombre: string, 

	nombres: string
	
	apellidoMaterno: string, 
	
	apellidoPaterno: string, 
	
	run: string | number,

	sexoCodigo: number,

	regionCodigo: number | undefined,

	ciudadCodigo: number | undefined,

	comunaCodigo: number | undefined,

	id: string,

	direccion: string,

	fechaNacimiento: string,

	email: string,

	telefono: string,

	observaciones: string,

}

interface IRegion {

	nombreOficial: string

	codigo: number

}

interface ICiudad {

	nombre: string

	regionCodigo: number

	codigo: number

}

interface IComuna {

	nombre: string

	codigo: number

	ciudadCodigo: number

	regionCodigo: number

}

function App() {

	const [ Personas, SetPersonas ] = useState<IPersona[]>([])

	const [ Regiones, SetRegiones ] = useState<IRegion[]>([])

	const [ Ciudades, SetCiudades ] = useState([])

	const [ Comunas, SetComunas ] = useState<IComuna[]>([])

	const [ PersonaSeleccionada, SetPersonaSeleccionada ] = useState<IPersona>()

	const [ AgregarUsuario, SetAgregarUsuario ] = useState<boolean>(false)

	const [ Cargando, SetCargando ] = useState<boolean>(true)

	async function ObtenerPersonas () {

		const Fetch = await fetch("https://localhost:7190/MantenedorAPI/ObtenerPersonas")

		const Response = await Fetch.json()

		SetPersonas(Response)

	}

	async function ObtenerRegiones () {

		const Fetch = await fetch("https://localhost:7190/MantenedorAPI/ObtenerRegiones")

		const Response = await Fetch.json()

		SetRegiones(Response)


	}

	async function ObtenerCiudades () {

		const Fetch = await fetch("https://localhost:7190/MantenedorAPI/ObtenerCiudades")

		const Response = await Fetch.json()

		SetCiudades(Response)

	}

	async function ObtenerComunas () {

		const Fetch = await fetch("https://localhost:7190/MantenedorAPI/ObtenerComunas")

		const Response = await Fetch.json()

		SetComunas(Response)

	}

	function FormatearNombre (nombreCompleto: string) {

		let NombreDividido = nombreCompleto.split(", ")

		let Nombre = NombreDividido[1].toLowerCase()

		let Apellido = NombreDividido[0].toLowerCase()

		let NombreCompleto = Nombre.concat(" ", Apellido);

		let Palabras = NombreCompleto.split(" ")

		for (let i = 0; i < Palabras.length; i++) {

			let letraInicial = Palabras[i].charAt(0).toUpperCase()

			let restoPalabra = Palabras[i].slice(1).toLowerCase()

			Palabras[i] = letraInicial.concat(restoPalabra)

		}

		const NombreFormateado = Palabras.join(" ")

		return NombreFormateado

	}

	useEffect(() => {

		const Promesas = [
			
			ObtenerPersonas(),
			
			ObtenerRegiones(),

			ObtenerCiudades(),

			ObtenerComunas()
		
		]

		Promise.allSettled(Promesas).then(() => SetCargando(false))

	}, [])

	function MostrarAgregarUsuario () {

		SetAgregarUsuario(true)

		SetPersonaSeleccionada(undefined)

	}

	function MostrarPersonaSeleccionada (Persona: IPersona) {

		SetAgregarUsuario(false)

		SetPersonaSeleccionada(Persona)

	}

	return (

		<main className='Grid2C-1F Completa Gap Padding'>

			<section className='Grilla'>

				<button className='Boton' onClick={MostrarAgregarUsuario}> 
				
					<BsPersonAdd style={{ color: "white", fontSize: "2rem" }}/> Agregar 
					
				</button>

				<table>

				{ !Cargando && Personas.map((Persona, Index, Array) => {

					const { nombre, run, sexoCodigo, regionCodigo, ciudadCodigo, comunaCodigo, id } = Persona

					const NombreFormateado = FormatearNombre(nombre)

					const Region = Regiones.find(({ codigo }) => codigo === regionCodigo)

					const Comuna = Comunas.find((Comuna) => Comuna.regionCodigo === regionCodigo && Comuna.ciudadCodigo === ciudadCodigo && Comuna.codigo === comunaCodigo)

					const Seleccionado = PersonaSeleccionada && PersonaSeleccionada.id === id

					return (

						<tr key={Index} onClick={() => MostrarPersonaSeleccionada(Persona)} aria-selected={Seleccionado}>

							<td> { NombreFormateado } </td>

							<td> { run } </td>

							<td> { sexoCodigo === 1 ? <BsGenderMale style={{ color: "blue" }}/> : <BsGenderFemale style={{ color: "deeppink" }}/> } </td>

							<td style={{ whiteSpace: 'pre-wrap' }}> 
							
								{ Region && Comuna ? 
								
									<span>
										
										<i>{ Comuna.nombre }</i>
										
										{",\n"}
										
										<b style={{ fontWeight: 700}}>{ Region.nombreOficial }</b>
										
									</span> 
									
									: "No definido 😓"
									
								}  
							
							</td>

						</tr>
						
					)

				})}

				</table>

			</section>

			<Editor 
			
			PersonaSeleccionada={PersonaSeleccionada} 
			
			Regiones={Regiones} 
			
			Ciudades={Ciudades} 
			
			Comunas={Comunas} 
			
			AgregarUsuario={AgregarUsuario} 
			
			SetPersonas={SetPersonas}
			
			SetPersonaSeleccionada={SetPersonaSeleccionada} />

		</main>

	)

}

interface IProps {

	PersonaSeleccionada: IPersona | undefined,

	Regiones: IRegion[],

	Ciudades: ICiudad[],

	Comunas: IComuna[]

	AgregarUsuario: boolean

    SetPersonas: React.Dispatch<React.SetStateAction<IPersona[]>>,

    SetPersonaSeleccionada: React.Dispatch<React.SetStateAction<IPersona | undefined>>,


}

function Editor({ PersonaSeleccionada, Regiones, Ciudades, Comunas, AgregarUsuario, SetPersonas, SetPersonaSeleccionada }: IProps) {

	const [ Nombre, SetNombre ] = useState<string | undefined>(PersonaSeleccionada?.nombres)

	const [ ApellidoPaterno, SetApellidoPaterno ] = useState<string | undefined>("")

	const [ ApellidoMaterno, SetApellidoMaterno ] = useState<string | undefined>("")

	const [ Rut, SetRut ] = useState<string>("")

	const [ Sexo, SetSexo ] = useState<string>("")

	const [ Region, SetRegion ] = useState<string>("")

	const [ Ciudad, SetCiudad ] = useState<string>("")

	const [ Comuna, SetComuna ] = useState<string>("")

	const [ Email, SetEmail ] = useState<string>("")

	const [ Direccion, SetDireccion ] = useState<string>("")

	const [ Observaciones, SetObservaciones ] = useState<string>("")

	const [ Telefono, SetTelefono ] = useState<string>("")

	const [ MostrarPopUp, SetMostrarPopUp ] = useState<boolean>(false)

	const [ Alerta, SetAlerta ] = useState<string>("")

	useEffect(() => {

		const RegionFiltrada = Regiones.find(({ codigo }) => codigo === PersonaSeleccionada?.regionCodigo)

		const CiudadFiltrada = Ciudades.find((Ciudad) => Ciudad.regionCodigo === PersonaSeleccionada?.regionCodigo && Ciudad.codigo === PersonaSeleccionada?.ciudadCodigo )

		const ComunaFiltrada = Comunas.find((Comuna) => Comuna.regionCodigo === PersonaSeleccionada?.regionCodigo && Comuna.ciudadCodigo === PersonaSeleccionada?.ciudadCodigo && Comuna.codigo === PersonaSeleccionada?.comunaCodigo)
		
		const DefinirSexo = PersonaSeleccionada?.sexoCodigo ? (PersonaSeleccionada?.sexoCodigo === 1 ? "Masculino" : "Femenino") : ""

		SetNombre(PersonaSeleccionada?.nombres || "")

		SetApellidoPaterno(PersonaSeleccionada?.apellidoPaterno || "")

		SetApellidoMaterno(PersonaSeleccionada?.apellidoMaterno || "")

		SetRut(FormatearRut(PersonaSeleccionada?.run) || "")

		SetSexo(DefinirSexo)

		SetRegion(RegionFiltrada ? RegionFiltrada?.nombreOficial : "")

		SetCiudad(CiudadFiltrada ? CiudadFiltrada?.nombre : "")

		SetComuna(ComunaFiltrada ? ComunaFiltrada?.nombre : "")

		SetTelefono(PersonaSeleccionada?.telefono || "")

		SetEmail(PersonaSeleccionada?.email || "")

		SetDireccion(PersonaSeleccionada?.direccion || "")

		SetObservaciones(PersonaSeleccionada?.observaciones || "")

	}, [PersonaSeleccionada])

	useEffect(() => {

		if (Alerta !== "") {

			setTimeout(() => {

				SetAlerta("")

			}, 2000)
		}

	}, [Alerta])
	
	function uuidv4() {
		
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {

			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

			return v.toString(16);

		});

	}

	async function SubirUsuario () {

		const RutDividido = Rut.split("-")

		const RutCuerpo = Number(RutDividido[0].replace(/\./g, ""))

		const RegionCodigo = Regiones.find(({ nombreOficial }) => nombreOficial === Region)?.codigo

		const CiudadCodigo = Ciudades.find(({ nombre }) => nombre === Ciudad )?.codigo

		const ComunaCodigo = Comunas.find(({ nombre }) => nombre === Comuna)?.codigo
		
		const Opciones: RequestInit = {

			method: 'POST',

			headers: { 'Content-Type': 'application/json' },

			body: JSON.stringify({

				id: uuidv4(),

				// run: Rut,

				runCuerpo: RutCuerpo,

				runDigito: RutDividido[1],

				// nombre: Nombre + " " + ApellidoPaterno + " " + ApellidoMaterno,

				nombres: Nombre,

				apellidoPaterno: ApellidoPaterno,

				apellidoMaterno: ApellidoMaterno,

				email: Email,

				sexoCodigo: Sexo === "Masculino" ? 1 : 2,

				fechaNacimiento: "2023-03-17T17:33:28.125Z",
				
				regionCodigo: RegionCodigo,

				ciudadCodigo: CiudadCodigo,

				comunaCodigo: ComunaCodigo,

				direccion: Direccion,

				telefono: parseInt(Telefono),

				observaciones: Observaciones,

				comuna: {

					regionCodigo: 0,

					ciudadCodigo: 0,

					codigo: 0,

					nombre: "string",

					codigoPostal: 0,

					codigoLibroClaseElectronico: 0,

					ciudad: {

						regionCodigo: 0,

						codigo: 0,

						nombre: "string",

						regionCodigoNavigation: {

						codigo: 0,

						nombre: "string",

						nombreOficial: "string",

						codigoLibroClaseElectronico: 0

						}

					}

				},

				sexoCodigoNavigation: {

					codigo: 0,

					nombre: "string",

					letra: "string"

				}
			
			})
		}

		const Fetch = await fetch("https://localhost:7190/MantenedorAPI/Registrar", Opciones)

		if (Fetch.status === 200) { 

			const Respuesta = await Fetch.json()

			SetPersonas(Respuesta)
			
			SetAlerta("Agregado con éxito")

		}


		else SetAlerta("Oops, ocurrió un error...")

		SetMostrarPopUp(false)

		SetPersonaSeleccionada(undefined)

	}

	async function EliminarUsuario () {

		const Opciones: RequestInit = {

			method: 'POST',

			headers: { 'Content-Type': 'application/json' },

			body: JSON.stringify({ 

				Id: PersonaSeleccionada?.id

			})

		}

		const Fetch = await fetch("https://localhost:7190/MantenedorAPI/Eliminar", Opciones)

		if (Fetch.status === 200) { 

			const Respuesta = await Fetch.json()

			SetPersonas(Respuesta)
			
			SetAlerta("Eliminado con éxito")

		}


		else SetAlerta("Oops, ocurrió un error...")

		SetMostrarPopUp(false)

		SetPersonaSeleccionada(undefined)

	}

	async function EditarUsuario () {

		const RutDividido = Rut.split("-")

		const RutCuerpo = Number(RutDividido[0].replace(/\./g, ""))

		const RegionCodigo = Regiones.find(({ nombreOficial }) => nombreOficial === Region)?.codigo

		const CiudadCodigo = Ciudades.find(({ nombre }) => nombre === Ciudad )?.codigo

		const ComunaCodigo = Comunas.find(({ nombre }) => nombre === Comuna)?.codigo
		
		const Opciones: RequestInit = {

			method: 'POST',

			headers: { 'Content-Type': 'application/json' },

			body: JSON.stringify({

				id: PersonaSeleccionada?.id,

				// run: Rut,

				runCuerpo: RutCuerpo,

				runDigito: RutDividido[1],

				// nombre: Nombre + " " + ApellidoPaterno + " " + ApellidoMaterno,

				nombres: Nombre,

				apellidoPaterno: ApellidoPaterno,

				apellidoMaterno: ApellidoMaterno,

				email: Email,

				sexoCodigo: Sexo === "Masculino" ? 1 : 2,

				fechaNacimiento: "2023-03-17T17:33:28.125Z",
				
				regionCodigo: RegionCodigo,

				ciudadCodigo: CiudadCodigo,

				comunaCodigo: ComunaCodigo,

				direccion: Direccion,

				telefono: parseInt(Telefono),

				observaciones: Observaciones,

				comuna: {

					regionCodigo: 0,

					ciudadCodigo: 0,

					codigo: 0,

					nombre: "string",

					codigoPostal: 0,

					codigoLibroClaseElectronico: 0,

					ciudad: {

						regionCodigo: 0,

						codigo: 0,

						nombre: "string",

						regionCodigoNavigation: {

						codigo: 0,

						nombre: "string",

						nombreOficial: "string",

						codigoLibroClaseElectronico: 0

						}

					}

				},

				sexoCodigoNavigation: {

					codigo: 0,

					nombre: "string",

					letra: "string"

				}
			
			})
		}

		const Fetch = await fetch("https://localhost:7190/MantenedorAPI/Editar", Opciones)

		if (Fetch.status === 200) { 

			const Respuesta = await Fetch.json()

			SetPersonas(Respuesta)
			
			SetAlerta("Editado con éxito")

		}


		else SetAlerta("Oops, ocurrió un error...")

		SetMostrarPopUp(false)

		SetPersonaSeleccionada(undefined)

	}

	function FormatearRut(Rut: string | number | undefined) {

		let string
		
		if (Rut === undefined) return ""

		else {

			string = Rut?.toString()

		}

        if (string.length > 12) return string.slice(0, 12)

        if (string === undefined || string === "" || string === " ") return ""

        // Eliminar puntos y guión del RUT (si los tiene)
        string = string.replace(/[.-]/g, '');
      
        // Separar la parte numérica del dígito verificador
        const Numero = string.slice(0, -1);

        const DigitoVerificador = string.slice(-1).toUpperCase();
      
        // Formatear la parte numérica con puntos y guiones
        let NumeroFormateado = Numero;

        for (let i = Numero.length - 3; i > 0; i -= 3) {

			NumeroFormateado = NumeroFormateado.slice(0, i) + '.' + NumeroFormateado.slice(i);

        }

        if (string.length === 1) NumeroFormateado = NumeroFormateado + DigitoVerificador

        else NumeroFormateado = NumeroFormateado + '-' + DigitoVerificador;

        return NumeroFormateado;

    }

	const RegionesFiltradas = Regiones.map(({ nombreOficial }) => nombreOficial)

	const CiudadesFiltradas = Ciudades.map(({ nombre }) => nombre)

	const ComunasFiltradas = Comunas.map(({ nombre }) => nombre)

	return(

		<section className='Persona'>

			{ (!PersonaSeleccionada && !AgregarUsuario) && <Spinner /> }

			{ (PersonaSeleccionada || AgregarUsuario) && 

				<>

					<Input Etiqueta='Nombre/s' SetState={SetNombre} State={Nombre} />

					<Input Etiqueta='Apellido paterno' SetState={SetApellidoPaterno} State={ApellidoPaterno} />

					<Input Etiqueta='Apellido materno' SetState={SetApellidoMaterno} State={ApellidoMaterno} />

					<Input Etiqueta='Rut' Tipo='Rut' SetState={SetRut} State={Rut} />

					<Select Etiqueta='Sexo' SetState={SetSexo} State={Sexo} Opciones={["Masculino", "Femenino"]} />

					<Select Etiqueta='Región' SetState={SetRegion} State={Region} Opciones={RegionesFiltradas} />

					<Select Etiqueta='Ciudad' SetState={SetCiudad} State={Ciudad} Opciones={CiudadesFiltradas}/>

					<Select Etiqueta='Comuna' SetState={SetComuna} State={Comuna} Opciones={ComunasFiltradas}/>

					<Input Etiqueta='Direccion' SetState={SetDireccion} State={Direccion} />

					<Input Etiqueta='Email' SetState={SetEmail} State={Email} />

					<Input Etiqueta='Telefono' SetState={SetTelefono} State={Telefono} />

					<Input Etiqueta='Observaciones' SetState={SetObservaciones} State={Observaciones} />
				
				</>
			
			}

			<div className='ContenedorBotones'>

				{ AgregarUsuario && <button className='Verde SinBorde' onClick={SubirUsuario}> <BsPencilFill /> Agregar usuario </button> }

				{ (!AgregarUsuario && PersonaSeleccionada) && <button className='Verde SinBorde' onClick={EditarUsuario}> <BsPencilFill /> Editar usuario </button> }

				{ (!AgregarUsuario && PersonaSeleccionada) && <button className='Rojo SinBorde' onClick={() => SetMostrarPopUp(true)}> <BsTrashFill /> Eliminar</button> }

			</div>

			{ MostrarPopUp && 
			
				<Popup>

					<h1>¿Estás seguro que deseas eliminar este elemento?</h1>

					<div className='ContenedorBotones'>

						<button className='Verde SinBorde' onClick={EliminarUsuario}>Sí</button>

						<button className='Rojo SinBorde' onClick={() => SetMostrarPopUp(false)}>No</button>

					</div>
					
				</Popup>
			
			}

			{ Alerta !== "" &&
			
				<PopupMini>

					{ Alerta }

				</PopupMini>
			}
			
		</section>

	)

}




export default App
