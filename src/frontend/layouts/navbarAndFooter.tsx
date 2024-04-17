// Define o ambiente de execução como cliente
'use client'

// Componentes internos do projeto
import Navbar from "@/components/navbar/navbar";
import NavAndFooterDiv from "@/components/navAndFooterDiv/div";
import Footer from "@/components/footer/footer";

// Este layout contém dois componentes principais: o cabeçalho (header) e o rodapé (footer).
export default function NavbarAndFooter({ children }: { children?: any }) {
    return (
        <>
            <Navbar />
            <NavAndFooterDiv>
                {children}
            </NavAndFooterDiv>
            <Footer />
        </>
    )
}