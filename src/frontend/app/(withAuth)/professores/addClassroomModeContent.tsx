// Componentes internos do projeto
import { addProfessorToClassroomError, addProfessorToClassroomSuccess } from "@/utils/toastMessages";
import Professors from "./page";

// Bibliotecas externas
import { useEffect, useState } from "react";
import styled from 'styled-components';
import { Checkbox, Button, message } from 'antd';
import { getSession } from "next-auth/react";

// Estilização
const CustomListStudent = styled.div`
  margin-bottom: 1rem !important;
`;

const DivStudent = styled.div`
	border-color: #1F5673;
	border-style: solid; 
	border-width: 1px;
	width: auto;
	max-height: 100vh;
    justify-content: space-between;
	display: flex;
	flex-direction: row;
	padding: 0.5rem 1rem 0.5rem 1rem;
	border-radius: 10px; 
    align-items: center;
`;

const LabelStudentName = styled.p`
  &:hover {
    cursor: pointer;
    color: #1F5673;
  }
`;

const CheckboxPresenca = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #1F5673; 
    border-color: #1F5673;
  }
`;

const Content = styled.div`
  max-height: 20rem;
  overflow: auto;
  padding-right: 12px;
  margin-top: 20px;
`

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  padding-top: 20px; 
`;

const ButtonPrimary = styled(Button)`
  background: #1F5673 !important;
  border-color: #1F5673 !important;
  color: #ffffff !important;

  &:hover, &:focus {
    background: #ffffff !important; 
    border-color: #16455b !important;
    color: #16455b !important;
  }
`;

const HoverButtonDelete = styled(Button)`
  &:hover, &:focus {
    background: #ffffff !important; 
    border-color: #16455b !important;
    color: #16455b !important;
  } 
`;

// Este componente "AddClassroomModeContent" é responsável por renderizar o conteúdo da página de adição de professores em turmas
export default function AddClassroomModeContent({ setAddClassroomMode, selectedProfessorId, data, getWorkshops, messageApi }: { setAddClassroomMode: any, selectedProfessorId: number | undefined, data: any, getWorkshops: any, messageApi: any }) {
    // Armazenamento de estados
    const [classrooms, setClassrooms] = useState<any>();
    const [addClassrooms, setAddClassrooms] = useState<any>([]);
    const [removeClassrooms, setRemoveClassrooms] = useState<any>([]);
    const [inClassrooms, setInClassrooms] = useState<any>([]);

    // Função para obter as turmas das oficinas de uma ONG
    useEffect(() => {
        const getClassrooms = async () => {
            const ongId = (await getSession())?.user.ongid;

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/classrooms/ong/${ongId}`);
                const classrooms = await response.json();
                setClassrooms(classrooms);
                if (!response.ok) {
                    throw new Error('Erro ao buscar turmas da ONG.');
                }
            }
            catch (error) {
                console.error(error);
            }
        }

        getClassrooms();

        setInClassrooms(data?.find((professor: any) => professor.id === selectedProfessorId).classroom?.map((classroom: any) => classroom.classroomid))
    }, [data, selectedProfessorId])

    // Função para alterar o estado das turmas selecionadas
    function handleChange(e: any, id: number) {
        const isChecked = e.target.checked;
        if (isChecked) {
            setAddClassrooms((prev: any) => [...prev, id].filter((id: number) => !inClassrooms.includes(id)));
            setRemoveClassrooms((prev: any) => prev.filter((classroomid: number) => classroomid != id));
        } else {
            setRemoveClassrooms((prev: any) => [...prev, id].filter((id: number) => inClassrooms.includes(id)));
            setAddClassrooms((prev: any) => prev.filter((classroomid: number) => classroomid != id));
        }
    }

    // Função para adicionar um professor em uma turma
    async function addProfessorInClassroom() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/classrooms/add-professor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ professorId: selectedProfessorId, addClassrooms: addClassrooms }),
        });

        return response;
    }

    // Função para remover um professor de uma turma
    async function removeProfessorInClassroom() {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_IP}/classrooms/remove-professor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ professorId: selectedProfessorId, removeClassrooms: removeClassrooms }),
        });

        return response;
    }

    // Função para salvar as alterações
    async function save() {
        var response1, response2;

        if (addClassrooms.length) {
            response1 = await addProfessorInClassroom();
        }
        if (removeClassrooms.length) {
            response2 = await removeProfessorInClassroom();
        }

        if (response1 && response2 && (response1.ok || response2.ok)) {
            addProfessorToClassroomSuccess(messageApi);
        } else {
            addProfessorToClassroomError(messageApi);
        }
        
        if (addClassrooms.length || removeClassrooms.length) {
            getWorkshops();
            setAddClassroomMode(false);
        }
    }

    // Renderização do conteúdo
    return (
        <>
            <Content>
                {classrooms?.map((classroom: any, index: number) => {
                    return (
                        <CustomListStudent key={index}>
                            <div>
                                <DivStudent>
                                    <LabelStudentName>{classroom.workshopname} - {classroom.name}</LabelStudentName>
                                    <CheckboxPresenca onChange={(e) => handleChange(e, classroom.id)} defaultChecked={inClassrooms?.includes(classroom.id) ? true : false}></CheckboxPresenca>
                                </DivStudent>
                            </div>
                        </CustomListStudent>
                    );
                })}
            </Content>
            <ActionsContainer>
                <ButtonPrimary onClick={save}>Salvar</ButtonPrimary>
                <HoverButtonDelete onClick={() => setAddClassroomMode(false)}>Cancelar</HoverButtonDelete>
            </ActionsContainer>
        </>
    )
}