import { List } from "phosphor-react"
import Menu from "../components/Menu"

type LayoutProps = {
    children: React.ReactNode
}

function Layout({ children }: LayoutProps) {

    return (
        <>
            <div className="h-screen w-2/12 fixed">
                <Menu />
            </div>

            <header className="bg-[#562c79] w-10/12 fixed top-0 h-16 flex items-center p-2 right-0 ml-auto">
                <List size={32} color="white"/>
            </header>

            <main className="min-h-screen w-10/12 ml-auto bg-gray-50 pt-[80px] p-5">
                {children}
            </main>
        </>
    )

}

export default Layout