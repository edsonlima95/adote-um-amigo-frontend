import Link from "next/link"
import { PlusCircle, SignOut, UserPlus } from "phosphor-react"
import { useContext } from "react"
import { ModalContext } from "../../contexts/ModalContext"



function Menu() {

    const { openModal } = useContext(ModalContext)

    return (
        <nav className="bg-[#613387] h-full">
            <p className="mb-10 p-5 text-white"><span className="font-bold text-lg">Bem vindo </span> edson lima</p>
            <ul className="p-5">
                <li className="flex items-center"><PlusCircle size={25} color="white" /><a className="ml-2 cursor-pointer text-white font-semibold text-xl uppercase" onClick={() => openModal()}>Cadastrar</a></li>
                <li className="flex items-center  mt-4"><UserPlus size={25} color="white" /><a className="ml-2 cursor-pointer text-white font-semibold text-xl uppercase">Perfil</a></li>
                <li className="flex items-center  mt-4"><SignOut size={25} color="white" /><a className="ml-2 cursor-pointer text-white font-semibold text-xl uppercase">Sair</a></li>

            </ul>
        </nav>
    )

}

export default Menu