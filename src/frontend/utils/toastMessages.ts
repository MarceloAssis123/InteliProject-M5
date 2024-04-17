export const classroomSuccess = (messageApi: any) => {
    messageApi.open({
        type: 'success',
        content: 'Turma cadastrada com sucesso',
    });
};

export const classroomError = (messageApi: any) => {
    messageApi.open({
        type: 'error',
        content: 'Erro ao cadastrar a turma',
    });
};

export const presenceSuccess = (messageApi: any) => {
    messageApi.open({
        type: 'success',
        content: 'Registro de presenças salvo com sucesso',
    });
};

export const presenceError = (messageApi: any) => {
    messageApi.open({
        type: 'error',
        content: 'Erro ao registrar presenças',
    });
};

export const addStudentToClassroomSuccess = (messageApi: any) => {
    messageApi.open({
        type: 'success',
        content: 'Aluno(s) adicionado(s) com sucesso',
    });
};

export const addStudentToClassroomError = (messageApi: any) => {
    messageApi.open({
        type: 'error',
        content: 'Erro ao adicionar aluno(s)',
    });
};

export const editSuccess = (messageApi: any) => {
    messageApi.open({
        type: 'success',
        content: 'Informações salvas com sucesso',
    });
};

export const editError = (messageApi: any) => {
    messageApi.open({
        type: 'error',
        content: 'Erro ao salvar informações',
    });
};

export const addProfessorToClassroomSuccess = (messageApi: any) => {
    messageApi.open({
        type: 'success',
        content: 'Professor adicionado à(s) turma(s) salvas com sucesso',
    });
};

export const addProfessorToClassroomError = (messageApi: any) => {
    messageApi.open({
        type: 'error',
        content: 'Erro ao adicionar professor à(s) turma(s)',
    });
};

export const registerStudentSuccess = (messageApi: any) => {
    messageApi.open({
        type: 'success',
        content: 'Aluno(a) registrado com sucesso',
    });
};

export const registerStudentError = (messageApi: any) => {
    messageApi.open({
        type: 'error',
        content: 'Erro ao registrar aluno(a)',
    });
};

export const registerProfessorSuccess = (messageApi: any) => {
    messageApi.open({
        type: 'success',
        content: 'Professor(a) registrado com sucesso',
    });
};

export const registerProfessorError = (messageApi: any) => {
    messageApi.open({
        type: 'error',
        content: 'Erro ao registrar professor(a)',
    });
};

export const createWorkshopSuccess = (messageApi: any) => {
    messageApi.open({
        type: 'success',
        content: 'Oficina criada com sucesso',
    });
};

export const createWorkshopError = (messageApi: any) => {
    messageApi.open({
        type: 'error',
        content: 'Erro ao criar oficina',
    });
};

export const createCategorySuccess = (messageApi: any) => {
    messageApi.open({
        type: 'success',
        content: 'Categoria criada com sucesso',
    });
};

export const createCategoryError = (messageApi: any) => {
    messageApi.open({
        type: 'error',
        content: 'Erro ao criar categoria',
    });
};