import { useRouter } from "next/router"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import ShowErrorMessage from "../../../components/Message"
import { api } from "../../../services/api"
import Layout from "../../Layout"
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Breadcrumb } from "../../../components/Breadcrumb"
import { getCookie } from "cookies-next"

type FormDataProps = {
    id?: number,
    title: string,
    description: string,
    user_id: number,
}


function Category() {

    const router = useRouter()
    const arr = router.query.params

    const categoryId = arr?.[0]

    //Validações dos campos
    const schema = yup.object({
        title: yup.string().required("Nome é obrigatório"),
        description: yup.string().required("Descrição é obrigatório"),
    })

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(schema)
    })


    useEffect(() => {

        try {
            const user = JSON.parse(getCookie('pet.user') as string)
            setValue('user_id', user.id)

        } catch (error) {}

        if (categoryId) {
            
            api.get(`/categories/${categoryId}/edit`).then(response => {

                const { category } = response.data

                setValue('id', category.id)
                setValue('title', category.title)
                setValue('description', category.description)
                setValue('user_id', category.user_id)

            }).catch((err) => { 
                console.log(err.response.data.message)
            })

        }

    }, [])


    async function onSubmit(data: FormDataProps) {


        const dataForm = new FormData()

        dataForm.append('title', data.title);
        dataForm.append('description', data.description);
        dataForm.append('user_id', data.user_id);

        if (data.id) {
            dataForm.append('id', data.id);
            update(dataForm, data.id)
        } else {
            create(dataForm)
        }

    }

    async function create(data: FormData) {

        try {

            const response = await api.post('/categories', data)

            toast.success(response.data.message)
            resetFields()

        } catch (err: any) { }

    }

    async function update(data: FormData, id: number) {

        try {

            const response = await api.put(`/categories/${id}`, data)

            toast.success(response.data.message)
            resetFields()
            router.push('/category')

        } catch (err: any) {

        }

    }


    function resetFields() {
        reset({
            id: undefined,
            title: '',
            description: '',
        })
    }

    return (
        <Layout>
            <Breadcrumb title="Categorias" currentTitle="Categoria" link="/category" />
            <div className="shadow bg-white p-5 rounded-sm">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-3">

                        <div className="flex flex-col w-7/12">
                            <label htmlFor="name" className="text-gray-700 font-bold mb-3">Nome</label>
                            <input type="text" className="border rounded h-12 px-3 focus:outline-none" {...register('title')} placeholder="Digite o nome" />
                            <ShowErrorMessage error={errors.title?.message} />
                        </div>
                        <div className="flex flex-col w-7/12">
                            <label htmlFor="name" className="text-gray-700 font-bold mb-3">Nome</label>
                            <input type="text" className="border rounded h-12 px-3 focus:outline-none" {...register('description')} placeholder="Digite a descrição" />
                            <ShowErrorMessage error={errors.description?.message} />
                        </div>


                    </div>

                    <div className="flex justify-center">
                        <button type="submit" className="text-white text-2xl bg-[#613387] font-bold h-16 rounded-lg px-16 justify-center items-center mt-8">{categoryId ? 'Atualizar' : 'Cadastrar'}</button>
                    </div>

                </form>
            </div>
        </Layout>
    )

}

export default Category