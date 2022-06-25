import Link from "next/link"
import { NotePencil, Trash } from "phosphor-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Alert } from "../../components/Alert"
import { Breadcrumb } from "../../components/Breadcrumb"
import { api } from "../../services/api"
import Layout from "../Layout"


type CategoryProps = {
    id?: number,
    title: string,
    description: string
}


function CategoryList() {

    const [categories, setCategories] = useState<CategoryProps[]>()


    useEffect(() => {
        getCategories()
    }, [])

    async function getCategories() {

        try {
            const response = await api.get(`/categories?user_id=${2}`)

            setCategories(response.data.categories)
            
        } catch (error) {

        }

    }

    async function destroy(id: number) {
        
        try {
            const response = await api.delete(`/categories/${id}`)

            toast.success("Categoria deleteda com sucesso")
            setCategories(response.data.categories)
        } catch (error) {
            
        }

    }

    return (
        <Layout>

            <Breadcrumb title="Cadastrar" currentTitle="Categorias" link="/category/create" />
            {categories && categories?.length > 0 ? (
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
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories?.map(category => (
                                <tr key={category.id} className="bg-white border-b border-gray-300 p-5">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                        {category.id}
                                    </th>
                                    <td className="px-6 py-4">
                                        {category.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        {category.description}
                                    </td>

                                    <td className="flex gap-4 px-6 py-4">
                                        <Link href={`/category/create/${category.id}`}><a className="font-medium bg-blue-500 rounded-full text-white p-2" ><NotePencil size={24} /></a></Link>
                                        <button className="font-medium bg-red-500 rounded-full text-white p-2" onClick={() => destroy(category.id as number)}><Trash size={24} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <Alert title="Importante" message="Você ainda não tem nenhuma categoria cadastrada"/>
            )}


        </Layout>
    )

}

export default CategoryList