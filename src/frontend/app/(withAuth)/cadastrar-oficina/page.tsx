// Define o ambiente de execução como cliente
'use client'

// Componentes internos do projeto
import LoadingPassaro from '@/components/ui/loading/passaroLoading';
import IntialStructureForm from '@/components/ui/form/initialStructureForm';
import FormWorkshopRegister from '@/components/ui/form/FormWorkshopRegister';

// Bibliotecas externas
import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, message} from 'antd';

// Estilização
const BackButtonCustom = styled.div`
	padding-left: 2rem;
	padding-right: 3rem;
	padding-top: 2rem;
`;

const Page = styled.div`
	min-height: calc(100vh - 4rem);
`;

export default function CadastrarOficina() {
	// Utilização do hook de mensagem
	const [messageApi, contextHolder] = message.useMessage();

	// Armazenamento do estado de carregamento
	const [loading, setLoading] = useState(false);

	// Atualização do estado de carregamento 
	useEffect(() => {
		setLoading(true);
	}, [])
	if (loading) {
		return (
			<Page>
				{contextHolder}
				<BackButtonCustom>
					<Button type="text" icon={<ArrowLeftOutlined />} onClick={() => window.location.href = "/"}>
						Voltar
					</Button>
				</BackButtonCustom>
				<IntialStructureForm title='Preencha as informações abaixo para cadastrar uma nova oficina!'>
					<FormWorkshopRegister entity='oficina' url='workshops' messageApi={messageApi} />
				</IntialStructureForm>
			</Page>
		)
	} else {
		return (
			<LoadingPassaro />
		);
	}
}