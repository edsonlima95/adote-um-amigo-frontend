import { removeCookies } from "cookies-next"
import Link from "next/link"
import { Files, ListPlus, PlusCircle, SignOut, UserPlus } from "phosphor-react"
import Router from 'next/router'

function Menu() {

    function logout(){
        removeCookies('pet.token')
        removeCookies('pet.user')
        Router.push("/auth")
    }

    return (
        <nav className="bg-[#613387] h-full">
            <p className="mb-10 p-5 text-white"><span className="font-bold text-lg">Bem vindo </span> edson lima</p>
            <ul className="p-5">
                <li className="flex items-center"><PlusCircle size={25} color="white" /><Link href="/pet"><a className="ml-2 cursor-pointer text-white font-semibold text-xl uppercase">Cadastrar</a></Link></li>
                <li className="flex items-center mt-4"><ListPlus size={25} color="white" /><Link href="/"><a className="ml-2 cursor-pointer text-white font-semibold text-xl uppercase">Listar</a></Link></li>
                <li className="flex items-center mt-4"><UserPlus size={25} color="white" /><Link href="/profile"><a className="ml-2 cursor-pointer text-white font-semibold text-xl uppercase">Perfil</a></Link></li>
                <li className="flex items-center mt-4"><SignOut size={25} color="white" /><a onClick={logout} className="ml-2 cursor-pointer text-white font-semibold text-xl uppercase">Sair</a></li>
            </ul>
        </nav>
    )

}

export default Menu