function PopupMini ({ children }: { children: string }) {

    const Estatus = children.includes("error")

    return (

        <div className='popup'>

            <div className={`popupmini_inner ${ Estatus ? "Rojo" : "Verde" }`}>

                { children }

            </div>

        </div>

    );

}


export default PopupMini