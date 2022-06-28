import ShowErrorMessage from "../../components/Message"
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Layout from "../Layout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { getCookie } from "cookies-next";

type FormDataProps = {
    id: number,
    name: string,
    email: string,
    password?: string,
    cover?: string
}

function Profile() {

    //Mostra o preview da imagem que será enviada
    const [showImage, setShowImage] = useState("")

    //Recebe a imagem para ser enviada do formulario
    const [Image, setImage] = useState()

    //Recebe a imagem do usuario logado caso exista
    const [cover, setCover] = useState<string | undefined>()

    //Validações dos campos
    const schema = yup.object({
        name: yup.string().required("Nome é obrigatório"),
        email: yup.string().email("O email não tem um formato válido").required("Email é obrigatório"),
    })

    const { register, handleSubmit, setError, setValue, getValues, control, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(schema)
    })


    useEffect(() => {

         profile()

    }, [])

    async function profile() {
        try {
            const userPet = JSON.parse(getCookie('pet.user') as string)

            const response = await api.get(`/profile/${userPet.id}`)
           
            const { user } = response.data

            setValue('id', user.id)
            setValue('name', user.name)
            setValue('email', user.email)
            setValue('password', user.password)

            setCover(user.cover)

        } catch (error) {

        }
    }

    async function onSubmit(data: FormDataProps) {


        const dataForm = new FormData()

        dataForm.append('id', data.id);
        dataForm.append('name', data.name);
        dataForm.append('cover', Image);
        dataForm.append('email', data.email);

        if (data.password) {
            dataForm.append('password', data.password);
        }

        update(dataForm)


    }

    async function update(data: FormData) {

        try {

            const response = await api.put(`/profile/update`, data)

            toast.success(response.data.message)

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

    function handleChange(event: any) {

        setImage(event.target.files[0])
        if (event.target.files[0]) {
            setShowImage(URL.createObjectURL(event.target.files[0]))
        }
    }

    return (
        <Layout>
            <Breadcrumb title="Atualizar" currentTitle="Perfil" link="/profile" />
            <div className="shadow bg-white p-5 rounded-sm">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex gap-3">

                        <div className="flex flex-col w-7/12">
                            <label htmlFor="name" className="text-gray-700 font-bold mb-3">Nome</label>
                            <input type="text" className="border rounded h-12 px-3 focus:outline-none" {...register('name')} placeholder="Digite o nome" />
                            <ShowErrorMessage error={errors.name?.message} />
                        </div>

                        <div className="flex flex-col w-5/12 ">
                            <div className="flex flex-col  items-center justify-center">

                                {cover && !showImage ? (<img src={`${process.env.NEXT_PUBLIC_API_URL}/profile/cover/${cover}`} className="w-[90px] h-[90px] rounded-full" alt="" />) : (<></>)}

                                {showImage ? (<img src={showImage} alt="" className="w-[90px] h-[90px] rounded-full" />)
                                    : (!cover ? <img src="/images/user.jpg" alt="" className="w-[90px] h-[90px] rounded-full" /> : (<></>))}
                                <label htmlFor="cover" className="mt-5 text-[#613387] font-semibold">Alterar foto</label>

                            </div>
                            <Controller
                                control={control}
                                name="cover"
                                render={({ field }) => (
                                    <input type="file" {...field} onChange={handleChange} id="cover" className="border rounded h-12 px-3 focus:outline-none hidden" />
                                )}
                            />
                            <ShowErrorMessage error={errors.cover?.message} />
                        </div>
                    </div>

                    <div className="flex gap-3">

                        <div className="flex flex-col w-7/12">
                            <label htmlFor="name" className="text-gray-700 font-bold my-3">E-mail</label>
                            <input type="text" className="border rounded h-12 px-3 focus:outline-none" {...register('email')} placeholder="Digite o email" />
                            <ShowErrorMessage error={errors.email?.message} />
                        </div>
                        <div className="flex flex-col w-5/12">
                            <label htmlFor="password" className="text-gray-700 font-bold my-3">Senha</label>
                            <input type="password" className="border rounded h-12 px-3 focus:outline-none" {...register('password')} placeholder="Digite a senha" />
                            <ShowErrorMessage error={errors.password?.message} />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button type="submit" className="text-white text-2xl bg-[#613387] font-bold h-16 rounded-lg px-16 justify-center items-center mt-8">Atualizar</button>
                    </div>

                </form>
            </div>
        </Layout>
    )

}

export default Profile