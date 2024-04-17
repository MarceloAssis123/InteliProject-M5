// Define o ambiente de execução como cliente
'use client'

// Componentes internos do projeto
import ButtonForm from '../button/buttonForm';
import CustomFormRegister from './CustomFormRegister';

// Bibliotecas externas
import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Row, Col } from 'antd';
import { useSession } from 'next-auth/react';
import { registerProfessorError, registerProfessorSuccess, registerStudentError, registerStudentSuccess } from '@/utils/toastMessages';

// Variável para o componente Select do Ant Design
const { Option } = Select;

// Este é um componente de formulário para realizar cadastros de professores/alunos
export default function FormRegister({ entity, url, messageApi }: { entity: string, url: string, messageApi: any }) {
	const { data: session } = useSession()

	const [estados, setEstados] = useState<{ id: number, nome: string }[]>([]);
	const [cidades, setCidades] = useState<{ id: number, nome: string }[]>([]);
	const [estadoInput, setEstadoInput] = useState('');

	useEffect(() => {
		const fetchEstados = async () => {
			const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
			const estados = await response.json();
			estados.map((estados: { id: number, nome: string }) => estados.nome.trim())
			setEstados(estados);
		};

		fetchEstados();
	}, []);

	const handleStateChange = async (value: any) => {
		setEstadoInput(value);
		const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${value}/municipios`);
		const cidadesData = await response.json();
		cidadesData.map((cidade: any) => cidade.nome.trim())
		setCidades(cidadesData);
	};


	return (
		<CustomFormRegister name={`register${entity}`} onFinish={async (values: any) => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/${url}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(
						{
							...values,
							ongid: session?.user.ongid
						}
					),
				});

				if (!response.ok) {
					if (entity == 'professor') {
						registerProfessorError(messageApi);
					} else {
						registerStudentError(messageApi);
					}
					throw new Error(`Erro ao cadastrar ${entity}`);
				}
				if (entity == 'professor') {
					registerProfessorSuccess(messageApi);
				} else {
					registerStudentSuccess(messageApi);
				}
			} catch (error) {
				console.error(error);
			}
		}}
			layout={"vertical"}>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						name="name"
						label={"Nome Completo"}
						rules={[
							{
								required: true,
								message: `Por favor, insira o nome completo do ${entity}`
							}
						]}
					>
						<Input placeholder={`Insira o nome completo do(a) ${entity}(a)`} />
					</Form.Item>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="dateofbirth"
								label={"Data de Nascimento"}
								rules={[
									{
										required: true,
										message: `Por favor, insira a data de nascimento do(a) ${entity}(a)`
									}
								]}
							>
								<DatePicker format='DD/MM/YYYY' placeholder={`Insira a data de nascimento do(a) ${entity}(a)`} style={{ width: '100%' }} />
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item
								name="gender"
								label={"Gênero"}
								rules={[
									{
										required: true,
										message: `Por favor, selecione o gênero do(a) ${entity}(a)`
									}
								]}
							>
								<Select placeholder={`Selecione o gênero do(a) ${entity}(a)`}>
									<Option value="M">Masculino</Option>
									<Option value="F">Feminino</Option>
									<Option value="O">Outro</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="maritalstatus"
								label={"Estado Civil"}
								rules={[
									{
										required: true,
										message: `Por favor, selecione o estado civil do(a) ${entity}(a)`
									}
								]}
							>
								<Select placeholder={`Selecione o estado civil do(a) ${entity}(a)`}>
									<Option value="Solteiro(a)">Solteiro(a)</Option>
									<Option value="Casado(a)">Casado(a)</Option>
									<Option value="Divorciado(a)">Divorciado(a)</Option>
									<Option value="Viúvo(a)">Viúvo(a)</Option>
								</Select>
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item
								name="raceethnicity"
								label={"Raça/Etnia"}
								rules={[
									{
										required: true,
										message: `Por favor, selecione a raça/etnia do(a) ${entity}(a)`
									}
								]}
							>
								<Select placeholder={`Selecione a raça/etnia do(a) ${entity}(a)`}>
									<Option value='Branco(a)'>Branco(a)</Option>
									<Option value='Preto(a)'>Preto(a)</Option>
									<Option value='Pardo(a)'>Pardo(a)</Option>
									<Option value='Amarelo(a)'>Amarelo(a)</Option>
									<Option value='Indigena'>Indígena</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Form.Item
						name="address"
						label={"Endereço"}
						rules={[
							{
								required: true,
								message: `Por favor, insira o endereço do(a) ${entity}(a)`
							}
						]}
					>
						<Input placeholder={`Insira o endereço do(a) ${entity}(a)`} />
					</Form.Item>
				</Col>

				<Col span={12}>
					<Form.Item
						name="email"
						label={"E-mail"}
						rules={[
							{
								required: true,
								type: 'email',
								message: `Por favor, insira um e-mail válido do(a) ${entity}(a)`
							}
						]}
					>
						<Input placeholder={`Insira o e-mail do(a) ${entity}(a)`} />
					</Form.Item>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="rg"
								label={"RG"}
							>
								<Input placeholder={`Insira o RG do(a) ${entity}(a)`} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="cpf"
								label={"CPF"}
							>
								<Input placeholder={`Insira o CPF do(a) ${entity}(a)`} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="phonenumber"
								label={"Celular"}
								rules={[
									{
										required: true,
										message: `Por favor, insira o número de celular do(a) ${entity}(a)`
									}
								]}
							>
								<Input placeholder={`Insira o número de celular do(a) ${entity}(a)`} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="landline"
								label={"Telefone Fixo"}
							>
								<Input placeholder={`Insira o número de telefone fixo do(a) ${entity}(a)`} />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								name="state"
								label={"Estado"}
								rules={[
									{
										required: true,
										message: `Por favor, selecione o estado do(a) ${entity}(a)`
									}
								]}
							>
								<Select
									showSearch
									placeholder="Selecione o estado"
									optionFilterProp="children"
									onChange={handleStateChange}
									filterOption={(input, option: any) =>
										option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									}
								>
									{estados.map(estado => (
										<Option key={estado.id} value={estado.id}>{estado.nome}</Option>
									))}
								</Select>

							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								name="city"
								label={"Cidade"}
								rules={[
									{
										required: true,
										message: `Por favor, insira a cidade de localização do(a) ${entity}(a)`
									}
								]}
							>
								<Select
									showSearch
									placeholder="Selecione a cidade"
									optionFilterProp="children"
									disabled={!estadoInput}
									filterOption={(input, option: any) =>
										option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
									}
								>
									{cidades.map(cidade => (
										<Option key={cidade.id} value={cidade.nome}>{cidade.nome}</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
				</Col>
			</Row>
			<ButtonForm value={`Cadastrar ${entity}(a)`} />
		</CustomFormRegister>
	);
}
