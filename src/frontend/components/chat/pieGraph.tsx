// Define o ambiente de execução como cliente
'use client'

// Bibliotecas externas
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import styled from 'styled-components'

// Estilização
const PieGraphComponent = styled(Doughnut)`
    margin-top: 10px;
`;

ChartJS.register(ArcElement, Tooltip, Legend);

// Este componente é responsável por renderizar um gráfico de pizza
export default function PieGraph({ description, graphData }: any) {
    return (
        <div>
            <p>{description}</p>
            <PieGraphComponent data={graphData} />
        </div>
    )
}