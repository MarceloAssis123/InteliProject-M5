// Bibliotecas externas
import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";
import ChatDiv from "@/components/chat/chatDiv";
import PieGraph from "@/components/chat/pieGraph";
import BarGraph from "@/components/chat/barGraph";
import { marked } from 'marked';

// Criação da instância da API do OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// An example of a spinner component. You can also import your own components,
// or 3rd party component libraries.
function Spinner() {
    return <div>Loading...</div>;
}

// Função que retorna as informações do gráfico
function getGraphInfo(labels: string[], datasets: { label: string, data: number[], backgroundColor: string[], borderColor: string[] }) {
    return {
        labels: labels,
        datasets: [
            {
                label: datasets.label,
                data: datasets.data,
                backgroundColor: datasets.backgroundColor,
                borderColor: datasets.borderColor,
                borderWidth: 1,
            },
        ],
    }
}

// Função que carrega os dados do usuário
async function loadUserData(userData: any) {
    'use server';

    const aiState = getMutableAIState<typeof AI>();

    aiState.done([
        ...aiState.get(),
        {
            role: 'user',
            content: `Aqui estão os dados das ONGs: ${JSON.stringify(userData)}`
        }
    ])

}

// Função que envia a mensagem do usuário
async function submitUserMessage(userInput: string) {
    'use server';

    const aiState = getMutableAIState<typeof AI>();

    aiState.update([
        ...aiState.get(),
        {
            role: 'user',
            content: userInput,
        },
    ]);

    const ui: any = render({
        model: 'gpt-3.5-turbo',
        provider: openai,
        messages: [
            {
                role: 'system',
                content: `\
You are a NGO data analysis conversation bot and you can help users analyze NGO data, step by step.
You and the user can discuss NGO data analysis.

If the user requests a pie graph, call \`get_pie_graph\` to show the pie graph.
If the user requests a bar graph, call \`get_bar_graph\` to show the bar graph.
If the user wants to add, remove, modify something in the data, or complete another impossible task, respond that you are a just analysis bot and cannot do that.

Besides that, you can also chat with users and do some calculations if needed.`
            },
            ...aiState.get()
        ],
        // `text` is called when an AI returns a text response (as opposed to a tool call).
        // Its content is streamed from the LLM, so this function will be called
        // multiple times with `content` being incremental.
        text: ({ content, done }) => {
            // When it's the final content, mark the state as done and ready for the client to access.
            if (done) {
                aiState.done([
                    ...aiState.get(),
                    {
                        role: "assistant",
                        content
                    }
                ]);
            }
            const contentHtml = marked.parse(content)
            return <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        },
        tools: {
            get_pie_graph: {
                description: 'Plot of a pie graph',
                parameters: z.object({
                    description: z.string().describe('A brief description of the graph'),
                    labels: z.array(z.string()).describe('Array with the name of the graph variables'),
                    data: z.array(z.number()).describe('Array with the numbers of labels data, ordered'),
                    label: z.string().describe('What the data means'),
                    backgroundColor: z.array(z.string()).describe('Array with the RGBA background color of each name of the graph variables, use colors that correspond to the name of the graph variables in an orderly fashion, and use good backgroud colors for the pie chart.'),
                    borderColor: z.array(z.string()).describe('Array with the RGBA border color of each labels, use colors stronger than the background')
                }).required(),
                render: async function* ({ description, labels, data, label, backgroundColor, borderColor }) {
                    yield <Spinner />

                    const pieGraphInfo = await getGraphInfo(labels, { data, label, backgroundColor, borderColor })

                    const contentSave = {
                        description,
                        pieGraphInfo
                    }

                    aiState.done([
                        ...aiState.get(),
                        {
                            role: 'function',
                            name: 'get_pie_graph',
                            content: JSON.stringify(contentSave)
                        }
                    ])

                    return <PieGraph description={description} graphData={pieGraphInfo} />
                }
            },
            get_bar_graph: {
                description: 'Plot of a bar graph',
                parameters: z.object({
                    description: z.string().describe('A brief description of the graph'),
                    labels: z.array(z.string()).describe('Array with the name of the graph variables'),
                    data: z.array(z.number()).describe('Array with the numbers of labels data, ordered'),
                    label: z.string().describe('What the data means'),
                    backgroundColor: z.array(z.string()).describe('Array with the RGBA background color of each name of the graph variables, use colors that correspond to the name of the graph variables in an orderly fashion, and use good backgroud colors for the pie chart.'),
                    borderColor: z.array(z.string()).describe('Array with the RGBA border color of each labels, use colors stronger than the background color, order this array in the same way as the backgroud color array')
                }).required(),
                render: async function* ({ description, labels, data, label, backgroundColor, borderColor }) {
                    yield <Spinner />

                    const barGraphInfo = await getGraphInfo(labels, { data, label, backgroundColor, borderColor })

                    const contentSave = {
                        description,
                        barGraphInfo
                    }

                    aiState.done([
                        ...aiState.get(),
                        {
                            role: 'function',
                            name: 'get_bar_graph',
                            content: JSON.stringify(contentSave)
                        }
                    ])

                    return <BarGraph description={description} graphData={barGraphInfo} />
                }
            }
        }
    })

    return {
        id: Date.now(),
        display: <ChatDiv autor="GPT Falcões" ui={ui} />
    };
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: {
    role: 'user' | 'assistant' | 'system' | 'function';
    content: string;
    id?: string;
    name?: string;
}[] = [];

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: {
    id: number;
    display: React.ReactNode;
}[] = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI: any = createAI({
    actions: {
        loadUserData,
        submitUserMessage
    },
    // Each state can be any shape of object, but for chat applications
    // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
    initialUIState,
    initialAIState
});