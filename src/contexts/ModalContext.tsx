import { createContext, useState } from "react";


type ModalProviderProps = {
    children: React.ReactNode
}

type ModalContextProps = {

    isModalOpen: boolean,
    closeModal: () => void
    openModal: (id?: number) => void

}


export const ModalContext = createContext({} as ModalContextProps)


export function ModalProvider({ children }: ModalProviderProps) {

    const [isModalOpen, setIsModalOpen] = useState(false)

    async function openModal() {
        setIsModalOpen(true)
    }
    function closeModal() {
        setIsModalOpen(false)
    }

    return (
        <ModalContext.Provider value={{ isModalOpen, closeModal, openModal }}>
            {children}
        </ModalContext.Provider>
    )

}