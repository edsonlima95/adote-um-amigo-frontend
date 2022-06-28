import { getCookie } from "cookies-next"
import { GetServerSideProps } from "next"
import { List } from "phosphor-react"
import Menu from "../components/Menu"
import Router from 'next/router'
import { useEffect } from "react"
import { api } from "../services/api"

type LayoutProps = {
    children: React.ReactNode
}

function Layout({ children }: LayoutProps) {

    const token = getCookie('pet.token')

    useEffect(() => {
        if (token) {
            checkToken()
        }else {
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

    return (
        <>
            <div className="h-screen w-2/12 fixed">
                <Menu />
            </div>

            <header className="bg-[#562c79] w-10/12 fixed top-0 h-16 flex items-center p-2 right-0 ml-auto">
                <List size={32} color="white" />
            </header>

            <main className="min-h-screen w-10/12 ml-auto bg-gray-50 pt-[80px] p-5">
                {children}
            </main>
        </>
    )

}


export default Layout