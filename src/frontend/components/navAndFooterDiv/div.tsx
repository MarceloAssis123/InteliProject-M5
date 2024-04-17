// Bibliotecas externas
import styled from 'styled-components';

// Estilização
const DivPrincipal = styled.div`
    min-height: calc(100vh - 4rem);
`

// Este componente é responsável por renderizar uma div com o tamanho mínimo da tela
export default function NavAndFooterDiv({ children }: { children?: any }) {
    return (
        <DivPrincipal>
            {children}
        </DivPrincipal>
    )
}