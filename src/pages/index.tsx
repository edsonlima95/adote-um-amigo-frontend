import { useEffect, useState } from "react"
import Layout from "./Layout"
import { api } from "../services/api"
import { toast } from "react-toastify"
import dayjs from 'dayjs'
import { NotePencil, Trash } from "phosphor-react"



type PetProps = {
  id?: number,
  name: string,
  cover: string,
  description: string,
  created_at: string,
}

function Home() {

  const [pets, setPets] = useState<PetProps[]>()

  useEffect(() => {
    
    getPets()

  }, [])


  async function getPets() {

    const response = await api.get(`/pets?user_id=${1}`)

    setPets(response.data.pets)

  }

  async function destroy(id: number) {

    try {

      const response = await api.delete(`/pets/${id}`);

      toast.success(response.data.message)
      setPets(response.data.pets)

    } catch (err: any) {
      console.log(err.response.data.error)
    }

  }

  return (
    <>
    
      <Layout>
        {pets && pets?.length > 0 ? (
          <div className="shadow rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left text-gray-500 overflow-hidden">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Imagem
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nome
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Descrição
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {pets?.map(pet => (
                  <tr key={pet.id} className="bg-white border-b border-gray-300 p-5">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      <img src={`${process.env.NEXT_PUBLIC_API_URL}/pet-image/${pet.cover}`} alt="" className="w-10 h-10 rounded-full" />

                    </th>
                    <td className="px-6 py-4">
                      {pet.name}
                    </td>
                    <td className="px-6 py-4">
                      {pet.description}
                    </td>
                    <td className="px-6 py-4">
                      {dayjs(pet.created_at).format('DD/MM/YYYY')}
                    </td>
                    <td className="flex gap-4 px-6 py-4">
                      <button className="font-medium bg-blue-500 rounded-full text-white p-2" ><NotePencil size={24} /></button>
                      <button className="font-medium bg-red-500 rounded-full text-white p-2" onClick={() => destroy(pet.id as number)}><Trash size={24} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 mb-4 text-sm text-center text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-200 dark:text-blue-800" role="alert">
            <span className="font-medium">Importante!</span> Você ainda não tem nenhum bixinho cadastrado
          </div>
        )}

      </Layout>

    </>
  )
}

export default Home
