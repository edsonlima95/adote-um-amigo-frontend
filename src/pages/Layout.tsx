import { getCookie } from "cookies-next"
import { GetServerSideProps } from "next"
import { List } from "phosphor-react"
import Menu from "../components/Menu"
import Router from 'next/router'
import { useEffect, useState } from "react"
import { api } from "../services/api"

type LayoutProps = {
    children: React.ReactNode
}

function Layout({ children }: LayoutProps) {

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const token = getCookie('pet.token')

    useEffect(() => {
        if (token) {
            checkToken()
        } else {
            Router.push("/auth")
        }
    }, [])

    async function checkToken() {
        try {
            await api.get("/check-token")
        } catch (error) {

            Router.push("/auth")
        }
    }

    function menuToggle(){
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <>
            <div className={`h-screen -left-[300px] duration-1000 lg:left-0 lg:duration-700 lg:w-2/12 fixed ${isMenuOpen ? 'left-0 duration-700 z-10' : '-left-[300px] duration-1000 z-10'}`}>
                <Menu />
            </div>

            <header className="bg-[#562c79] lg:w-10/12 lg:duration-700 w-full duration-1000 fixed top-0 h-16 flex items-center p-2 right-0 ml-auto">
                <div className="lg:hidden w-full mr-5 flex justify-end">
                    <List size={32} color="white" onClick={menuToggle} />
                </div>
            </header>

            <main className="min-h-screen lg:w-10/12 lg:duration-700 w-full duration-1000 ml-auto bg-gray-50 pt-[80px] p-5">
                {children}
            </main>
        </>
    )

}


export default Layout