// Define o ambiente de execução como cliente
'use client'

// Bibliotecas externas
import { useEffect, useState } from 'react';
import { useUIState, useActions } from "ai/rsc";
import styled from 'styled-components';
import { AI } from '@/app/(withAuth)/action'
import SendMessageSVG from '@/public/svg/sendMessage';
import ChatDiv from '@/components/chat/chatDiv';
import ConectandoFalBirdSVG from '@/public/svg/conectandoFalBird';

// Estilização
const DivPrincipal = styled.div`
    height: calc(100vh - 4rem);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const DivHistoryMessage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 55%;
    flex-grow: 1;
    margin-top: 10px;
    overflow-y: auto;
    padding: 10px;
    background-color: #e7e7e7;
    border-radius: 5px;
    &::-webkit-scrollbar {
        width: 10px; /* Largura da barra de rolagem */
    }

    /* Personaliza o fundo da barra de rolagem */
    &::-webkit-scrollbar-track {
        background: #f1f1f1; /* Cor de fundo */
    }

    /* Personaliza o indicador de rolagem */
    &::-webkit-scrollbar-thumb {
        background: #888; /* Cor do indicador de rolagem */
    }

    /* Personaliza o estado de hover do indicador de rolagem */
    &::-webkit-scrollbar-thumb:hover {
        background: #777; /* Cor ao passar o mouse */
    }
`

const DivOverviewGPTFal = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    & > h1{
        font-weight: 600;
        font-size: 1.2em;
    }
`

const DivExplainingGPTFal = styled.div`
    width: 50%;
    text-align: center;
    line-height: 1.2;
    & > p{
        font-size: 0.9em;
    }
`

const FormMessage = styled.form`
    width: 55%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
`

const DivInputMessage = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 10px;
    position: relative;
`

const TextAreaMessage = styled.textarea`
    width: 100%;
    min-height: 3rem;
    height: 3rem;
    max-height: 10rem;
    resize: none;
    border-radius: 10px;
    padding: 10px;
    border: 2.5px solid black;
    font-size: 1rem;
    line-height: 1.5rem;
    padding-right: 45px;
    margin-top: -50px;
    &::-webkit-scrollbar {
        width: 8px; /* Largura da barra de rolagem */
    }

    /* Personaliza o fundo da barra de rolagem */
    &::-webkit-scrollbar-track {
        background: #f1f1f1; /* Cor de fundo */
    }

    /* Personaliza o indicador de rolagem */
    &::-webkit-scrollbar-thumb {
        background: #888; /* Cor do indicador de rolagem */
    }

    /* Personaliza o estado de hover do indicador de rolagem */
    &::-webkit-scrollbar-thumb:hover {
        background: #777; /* Cor ao passar o mouse */
    }
`

const ButtonMessage = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid black;
    cursor: pointer;
    margin-right: 10px;
    margin-top: -40px;

`
// Este componente é a página principal do GPT Falcões
export default function GFPage() {
    // Estados do componente
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useUIState<typeof AI>();
    const { submitUserMessage, loadUserData } = useActions<typeof AI>();

    // Função para carregar os dados do banco de dados
    const saveDBData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/all`);
        const responseArray = await response.json()
        console.log(responseArray)
        loadUserData(responseArray)
    }

    // Efeito para salvar os dados do banco de dados
    useEffect(() => {
        saveDBData()
    }, [])

    // Função para exibir as mensagens
    function MessagesDisplay(messages: any) {
        if (messages && messages.length > 0) {
            return (
                <>
                    {messages.map((message: any) => (
                        <div key={message.id}>
                            {message.display}
                        </div>
                    ))}
                </>
            );
        } else {
            return (
                <DivOverviewGPTFal>
                    <ConectandoFalBirdSVG />
                    <h1>GPT Falcões</h1>
                    <DivExplainingGPTFal>
                        <p>Faça perguntas sobre os dados das ONGs. Se nescessário peça para gerar um gráfico de barra ou de pizza</p>
                    </DivExplainingGPTFal>
                </DivOverviewGPTFal>
            );
        }
    }

    // Função para enviar a mensagem
    const handleSubmit = async () => {
        if (inputValue) {
            // Add user message to UI state
            setMessages((currentMessages: any) => [
                ...currentMessages,
                {
                    id: Date.now(),
                    display: <ChatDiv autor='Você' ui={<p>{inputValue}</p>} />
                }
            ]);

            setInputValue('');
            // Submit and get response message
            const responseMessage = await submitUserMessage(inputValue);
            setMessages((currentMessages: any) => [
                ...currentMessages,
                responseMessage,
            ]);

        }
    }

    // Função para ajustar a altura do textarea
    const inputHeight = (e: any) => {
        const minHeight = '3rem'; 

        e.target.style.height = minHeight;

        const requiredHeight = e.target.scrollHeight;

        const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const minHeightInPx = parseFloat(minHeight) * fontSize;

        e.target.style.height = `${Math.max(requiredHeight, minHeightInPx)}px`;
    };

    // Função para enviar a mensagem ao pressionar Enter
    const inputEnterSubmit = (e: any) => {

        if (e.key === 'Enter' && !e.shiftKey) { 
            e.preventDefault(); 
            handleSubmit(); 
        }
    }

    return (
        <DivPrincipal>
            <DivHistoryMessage>
                {
                    MessagesDisplay(messages)
                }
            </DivHistoryMessage>
            <FormMessage onSubmit={async (e) => {
                e.preventDefault()
                handleSubmit()
            }
            }>
                <DivInputMessage>
                    <TextAreaMessage
                        placeholder="Converse com os dados..."
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value)
                            inputHeight(e)
                        }}
                        onKeyDown={(e) => {
                            inputEnterSubmit(e)
                        }}
                    />
                    {
                        inputValue &&
                        <ButtonMessage disabled={!inputValue}>
                            <SendMessageSVG />
                        </ButtonMessage>
                    }
                </DivInputMessage>
            </FormMessage>
        </DivPrincipal>
    )
}