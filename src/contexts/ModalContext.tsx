import { createContext, useState } from "react";


type ModalProviderProps = {
    children: React.ReactNode
}

type ModalContextProps = {

    isModalOpen: boolean,
    handleCloseModal: () => void
    handleOpenModal: () => void

}


export const ModalContext = createContext({} as ModalContextProps)


export function ModalProvider({ children }: ModalProviderProps) {

    const [isModalOpen, setIsModalOpen] = useState(false)



    function handleOpenModal() {
        setIsModalOpen(true)
    }
    function handleCloseModal() {
        
        setIsModalOpen(false)
    }

    return (
        <ModalContext.Provider value={{ isModalOpen, handleCloseModal, handleOpenModal }}>
            {children}
        </ModalContext.Provider>
    )

}