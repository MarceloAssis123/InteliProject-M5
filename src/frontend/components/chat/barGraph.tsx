// Define o ambiente de execução como cliente
'use client'

// Bibliotecas externas
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styled from 'styled-components';

// Estilização
const BarGraphComponent = styled(Bar)`
    margin-top: 10px;
`;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Este componente é responsável por renderizar um gráfico de barras
export default function BarGraph({ description, graphData }: any) {
    return (
        <div>
            <p>{description}</p>
            <BarGraphComponent data={graphData} options={{ maintainAspectRatio: true }} />
        </div>
    )
}
