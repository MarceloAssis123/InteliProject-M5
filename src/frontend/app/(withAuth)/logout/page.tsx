// Define o ambiente de execução como cliente
'use client'

// Bibliotecas externas
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"

// Esta página "Logout" é responsável por realizar o logout do usuário
export default function Logout(){

    // Armazenamento da rota
    const router = useRouter()

    // Função de logout
    const logout = useCallback(async () =>{
        await signOut({
            redirect: false
        });
        router.replace('/login');
    }, [router])

    // Atualização do estado de logout
    useEffect(() =>{
        logout();
    }, [logout])

    return(
        <></>
    );
}