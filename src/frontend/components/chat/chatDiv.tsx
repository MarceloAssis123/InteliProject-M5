// Define o ambiente de execução como cliente
'use client'

// Bibliotecas externas
import styled from 'styled-components';

// Estilização
const DivChat = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    max-width: 100%;
    height: auto;
    padding-bottom: 35px;
    & h1{
        font-size: 1.2rem;
        font-weight: 600;
    }
`
const DivResponseContent = styled.div`
    display: flex;
    flex-direction: column;
    line-height: 1.7;
    & strong{
        font-weight: bold;
    }
`
// Este componente é responsável por renderizar um chat
export default function ChatDiv({ autor, ui }: { autor: string, ui: any }) {
    return (
        <DivChat>
            <h1>{autor}</h1>
            <DivResponseContent>
                {ui}
            </DivResponseContent>
        </DivChat>
    )
}