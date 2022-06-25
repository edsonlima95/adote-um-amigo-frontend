import ShowErrorMessage from "../../components/Message"
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from "react-hook-form";
import Layout from "../Layout";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { CloudArrowUp } from "phosphor-react";
import {  useRouter } from 'next/router'
import { Breadcrumb } from "../../components/Breadcrumb";

type FormDataProps = {
    id?: number,
    name: string,
    description: string,
    email: string,
    contact: string,
    city: string,
    state: string,
    cover: string,
    category_id: string,
    user_id: number,
}

function Create() {

    const router = useRouter()
    const arr = router.query.params

    const petId = arr?.[0]

    const [showImage, setShowImage] = useState("")
    const [Image, setImage] = useState()

    //Validações dos campos
    const schema = yup.object({
        name: yup.string().required("Nome é obrigatório"),
        description: yup.string().required("Descrição é obrigatório"),
        email: yup.string().email("O email não tem um formato válido").required("Email é obrigatório"),
        contact: yup.string().required("Contato é obrigatório"),
        city: yup.string().required("Cidade é obrigatório"),
        state: yup.string().required("Estado é obrigatório")
    })

    const { register, handleSubmit, setError, setValue, reset, control, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(schema)
    })


    useEffect(() => {
        
        if(petId){

             api.get(`/pets/${petId}/edit`).then(response => {

                const {pet} = response.data

                setValue('id',pet.id)
                setValue('name',pet.name)
                setValue('description',pet.description)
                setValue('email',pet.email)
                setValue('contact',pet.contact)
                setValue('city',pet.city)
                setValue('state',pet.state)
                setValue('category_id',pet.category_id)
                setValue('user_id',pet.user_id)

             }).catch((error) => {})

        }

    },[])


    async function onSubmit(data: FormDataProps) {


        const dataForm = new FormData()

        dataForm.append('category_id', data.category_id);
        dataForm.append('user_id', 2);
        dataForm.append('name', data.name);
        dataForm.append('cover', Image);
        dataForm.append('description', data.description);
        dataForm.append('email', data.email);
        dataForm.append('contact', data.contact);
        dataForm.append('city', data.city);
        dataForm.append('state', data.state);

        if (data.id) {
            dataForm.append('id', data.id);
            update(dataForm, data.id)
        } else {
            create(dataForm)
        }

    }

    async function create(data: FormData) {

        try {

            const response = await api.post('/pets', data)

            toast.success(response.data.message)
            resetFields()

        } catch (err: any) {

            const { errors } = err.response.data

            if (err.response.data.message) {
                setError('cover', { message: err.response.data.message })
            }
            if (errors) {

                for (const error of errors) {

                    if (error.type === 'extname') {
                        toast.error('Formato inválido, selecione um formato válido: PNG JPG JPEG')
                    } else if (error.type === 'size') {
                        toast.error('Arquivo maior que permitido, envie um arquivo menor que 1MB')
                    }
                }
            }

        }

    }

    async function update(data: FormData, id: number) {

        try {

            const response = await api.put(`/pets/${id}`, data)

            toast.success(response.data.message)
            resetFields()
            router.push('/')

        } catch (err: any) {

            const { errors } = err.response.data

            if (err.response.data.message) {
                setError('cover', { message: err.response.data.message })
            }
            if (errors) {

                for (const error of errors) {

                    if (error.type === 'extname') {
                        toast.error('Formato inválido, selecione um formato válido: PNG JPG JPEG')
                    } else if (error.type === 'size') {
                        toast.error('Arquivo maior que permitido, envie um arquivo menor que 1MB')
                    }
                }
            }

        }

    }

    function handleChange(event:any) {

        setImage(event.target.files[0])
        if(event.target.files[0]){
            setShowImage(URL.createObjectURL(event.target.files[0]))
        }
    }

    function resetFields() {
        reset({
            id: undefined,
            name: '',
            description: '',
            cover: '',
            email: '',
            contact: '',
            city: '',
            state: '',
            category_id: '',
        })
    }
    return (
        <Layout>
            <Breadcrumb title="Listar" currentTitle="Pets" link="/"/>
            <div className="shadow bg-white p-5 rounded-sm">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-3">

                        <div className="flex flex-col w-7/12">
                            <label htmlFor="name" className="text-gray-700 font-bold mb-3">Nome</label>
                            <input type="text" className="border rounded h-12 px-3 focus:outline-none" {...register('name')} placeholder="Digite o nome" />
                            <ShowErrorMessage error={errors.name?.message} />
                        </div>

                        <div className="flex flex-col w-5/12 ">
                            <div className="flex items-center justify-center">

                            <label htmlFor="cover" className="font-bold mb-3 bg-[#613387] p-5 w-24 rounded text-white flex flex-col items-center">
                                <CloudArrowUp size={32} />
                                Imagem
                            </label>
                            {showImage ? (<img src={showImage} alt="" className="w-[90px] h-[90px] rounded-full ml-10" />) : (<></>)}
                            </div>
                            <Controller
                                control={control}
                                name="cover"
                                render={({ field }) => (
                                    <input type="file" {...field}  onChange={handleChange} id="cover" className="border rounded h-12 px-3 focus:outline-none hidden" />
                                )}
                            />
                            <ShowErrorMessage error={errors.cover?.message} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-gray-700 font-bold my-3">Descrição</label>
                        <textarea className="border rounded h-24 px-3 focus:outline-none" {...register('description')} placeholder="Digite o nome"></textarea>
                        <ShowErrorMessage error={errors.description?.message} />
                    </div>
                    <div className="flex gap-3">

                        <div className="flex flex-col w-7/12">
                            <label htmlFor="name" className="text-gray-700 font-bold my-3">E-mail</label>
                            <input type="text" className="border rounded h-12 px-3 focus:outline-none" {...register('email')} placeholder="Digite o nome" />
                            <ShowErrorMessage error={errors.email?.message} />
                        </div>
                        <div className="flex flex-col w-5/12">
                            <label htmlFor="name" className="text-gray-700 font-bold my-3">Contato</label>
                            <input type="text" className="border rounded h-12 px-3 focus:outline-none" {...register('contact')} placeholder="Digite o nome" />
                            <ShowErrorMessage error={errors.contact?.message} />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex flex-col w-6/12">
                            <label htmlFor="name" className="text-gray-700 font-bold my-3">Cidade</label>
                            <input type="text" className="border rounded h-12 px-3 focus:outline-none" {...register('city')} placeholder="Digite o nome" />
                            <ShowErrorMessage error={errors.city?.message} />
                        </div>
                        <div className="flex flex-col w-6/12">
                            <label htmlFor="name" className="text-gray-700 font-bold my-3">Estado</label>
                            <input type="text" className="border rounded h-12 px-3 focus:outline-none" {...register('state')} placeholder="Digite o nome" />
                            <ShowErrorMessage error={errors.state?.message} />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-gray-700 font-bold my-3">Categoria</label>
                        <select {...register('category_id')} className="border rounded h-12 px-3 focus:outline-none" >
                            <option value={1}>1</option>
                        </select>
                        <ShowErrorMessage error={errors.category_id?.message} />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="text-white text-2xl bg-[#613387] font-bold h-16 rounded-lg px-16 justify-center items-center mt-8">Cadastrar</button>
                    </div>

                </form>
            </div>
        </Layout>

    )

}

export default Create