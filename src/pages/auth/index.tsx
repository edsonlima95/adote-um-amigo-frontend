import ShowErrorMessage from "../../components/Message"
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from "react-hook-form";
import { useState } from "react";
import { api } from "../../services/api";
import Router from 'next/router';
import { toast } from "react-toastify";
import { getCookie, setCookies } from "cookies-next";
import { GetServerSideProps } from "next";

type FormDataProps = {
    name?: string,
    email: string,
    password: string
}

function Auth() {

    const [isLogin, setIsLogin] = useState(true)

    

    //Validações dos campos
    const schema = yup.object({
        name: !isLogin ? yup.string().required("Nome é obrigatório") : yup.string().nullable(),
        email: yup.string().email("Email deve ter um formato válido").required("Email é obrigatório"),
        password: yup.string().min(4, "A senha deve conter no minimo 4 caracteres").required("Senha é obrigatório"),
    })

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(schema)
    })

    function resetFields() {
        reset({
            name: '',
            email: '',
            password: ''
        })
    }

    function changeLoginMethod() {
        setIsLogin(!isLogin)
        resetFields()
    }

    async function onSubmit(data: FormDataProps) {
        if (isLogin) {
            try {

                const response = await api.post("/auth/login", data)

                const { user, token } = response.data

                setCookies('pet.token', token, {
                    maxAge: 60 * 60 * 24 * 30, // 30 dias
                    path: '/'
                })

                setCookies('pet.user', JSON.stringify(user), {
                    maxAge: 60 * 60 * 24 * 30, // 30 dias
                    path: '/'
                })

                api.defaults.headers['Authorization'] = `Bearer ${token}`;

                Router.push("/")

            } catch (err: any) {
                toast.error(err.response.data.error)
            }
        } else {
            try {

                const response = await api.post("/auth/signin", data)
                toast.success(response.data.message)

            } catch (err: any) {
                toast.error(err.response.data.error)
            }
        }
    }

    return (

        <div className="flex">
            <div className="w-4/12 min-h-screen bg-[#613387] flex flex-col items-center justify-center">
                <img src="/images/login2.svg" alt="" className="w-52" />
                <span className="text-white mt-5 text-sm text-center">Faça login na nossa plataforma ou <br /> cadastre-se, e faça um amiguinho <br /> feliz com um novo lar.</span>
            </div>
            <div className="flex justify-center items-center w-8/12">

                <form onSubmit={handleSubmit(onSubmit)} className="w-5/12 bg-white p-5 shadow rounded-sm">
                    {!isLogin ? (
                        <div className="flex flex-col">
                            <label htmlFor="name" className="text-gray-700 font-bold mb-3">Nome</label>
                            <input type="text" className="border rounded h-12 px-3 focus:outline-none" {...register('name')} placeholder="Digite o nome" />
                            <ShowErrorMessage error={errors.name?.message} />
                        </div>
                    ) : (<></>)}

                    <div className="flex flex-col mt-5">
                        <label htmlFor="email" className="text-gray-700 font-bold mb-3">Email</label>
                        <input type="text" className="border rounded h-12 px-3 focus:outline-none" {...register('email')} placeholder="Digite seu email" />
                        <ShowErrorMessage error={errors.email?.message} />
                    </div>

                    <div className="flex flex-col mt-5">
                        <label htmlFor="password" className="text-gray-700 font-bold mb-3">Senha</label>
                        <input type="password" className="border rounded h-12 px-3 focus:outline-none" {...register('password')} placeholder="Digite a senha" />
                        <ShowErrorMessage error={errors.password?.message} />
                    </div>

                    {isLogin ? (<button type="button" onClick={changeLoginMethod} className="mt-5 text-[#613387] font-bold">Cadastre-se</button>) : (<button type="button" onClick={changeLoginMethod} className="mt-5 text-[#613387] font-bold">Voltar</button>)}

                    <div className="flex justify-center">
                        <button type="submit" className="w-full text-white text-xl bg-[#613387] font-bold h-12 rounded-lg px-16 justify-center items-center mt-8">{isLogin ? 'Cadastrar' : 'Entrar'}</button>
                    </div>

                </form>

            </div>
        </div>

    )

}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const token = getCookie("pet.token", ctx)

    if (token) {
        return {
            redirect:{
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: {}, // will be passed to the page component as props
    }
}

export default Auth