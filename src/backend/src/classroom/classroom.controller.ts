import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { WorkshopService } from '../workshop/workshop.service';
import { ClassroomService } from './classroom.service';
import { ClassDTO } from '../class/class.dto';
import { ClassroomDTO } from './classroom.dto';
import { flatMap } from 'lodash';

@Controller('/classrooms')
export class ClassroomController {
	constructor(private readonly workshopService: WorkshopService, private readonly classroomService: ClassroomService) {}

  /**
   * Registra uma nova turma com os dados fornecidos. Este método recebe os dados de uma turma
   * através do corpo da requisição e utiliza o `ClassroomService` para registrar a turma no sistema.
   * Os dados da turma são fornecidos como um objeto `ClassroomDTO`, que inclui todas as informações
   * necessárias para o cadastro de uma nova turma.
   * 
   * Este endpoint é acessado através de uma solicitação POST para '/classrooms', e o corpo da requisição
   * deve conter os dados da turma conforme definido pelo `ClassroomDTO`.
   * 
   * @param {ClassroomDTO} dataClassroom - O objeto contendo os dados da novfa turma a ser registrada.
   * 
   * @returns {Promise<classroom>} Uma promessa que resolve para a entidade `classroom` da turma
   * recém-registrada. Esta entidade inclui todos os dados da turma, incluindo um identificador único gerado
   * pelo sistema.
  */
	@Post()
	async registerClassroom(@Body() dataClassroom: ClassroomDTO) {
		return await this.classroomService.register(dataClassroom.idWorkshop, dataClassroom.name, dataClassroom.day, dataClassroom.startTime, dataClassroom.endTime );
	}

	/**
	 * Adiciona um aluno a uma turma. Este método recebe os IDs do aluno e da turma e utiliza o `WorkshopService`
	 * para adicionar o aluno à turma correspondente. O método retorna uma mensagem de sucesso após a conclusão.
	 * 
	 * @param {Object} body - O objeto contendo os IDs do aluno e da turma
	 * 
	 * @returns {Object} Um objeto contendo uma mensagem de sucesso indicando que o aluno foi adicionado à turma.
	 */
	@Post('/add-student')
	async addStudentToClassroom(@Body() body: { studentId: number; classroomId: number }) {
		await this.workshopService.addStudentToClassroom(body.studentId, body.classroomId);
		return { message: 'Aluno adicionado à turma com sucesso.' };
	}

	/**
	 * Lista todas as turmas relacionadas a uma ONG específica. Este método recebe o ID da ONG e utiliza o
	 * `ClassroomService` para recuperar todas as turmas associadas a essa ONG. O método retorna uma lista de turmas.
	 * 
	 * @param {string} id - O ID da ONG
	 * 
	 * @returns {Promise<ClassroomEntity[]>} Uma promessa que resolve para uma lista de entidades `ClassroomEntity`
	 */
	@Get('/ong/:id')
	async getClassroomsByOngId(@Param('id') id: string) {
		const classrooms = await this.classroomService.getClassroomsByOngId(Number(id));
		return classrooms;
	}

	/**
	 * Adiciona um professor a uma turma. Este método recebe os IDs do professor e das turmas e utiliza o `ClassroomService`
	 * para adicionar o professor às turmas correspondentes. O método retorna uma mensagem de sucesso após a conclusão.
	 * 
	 * @param {Object} body - O objeto contendo os IDs do professor e das turmas
	 * 
	 * @returns {Object} Um objeto contendo uma mensagem de sucesso indicando que o professor foi adicionado às turmas.
	 */
	@Post('/add-professor')
	async addProfessorToClassroom(@Body() body: { professorId: number, addClassrooms: number[] }) {
		await this.classroomService.addProfessorToClassroom(body.professorId, body.addClassrooms);
		return { message: 'Professor adicionado às turmas com sucesso.' };
	}

	/**
	 * Remove um professor de uma turma. Este método recebe os IDs do professor e das turmas e utiliza o `ClassroomService`
	 * para remover o professor das turmas correspondentes. O método retorna uma mensagem de sucesso após a conclusão.
	 * 
	 * @param {Object} body - O objeto contendo os IDs do professor e das turmas
	 * 
	 * @returns {Object} Um objeto contendo uma mensagem de sucesso indicando que o professor foi removido das turmas.
	 */
	@Post('/remove-professor')
	async removeProfessorToClassroom(@Body() body: { professorId: number, removeClassrooms: number[] }) {
		await this.classroomService.removeProfessorToClassroom(body.professorId, body.removeClassrooms);
		return { message: 'Professor removido das turmas com sucesso.' };
	}

	/**
	 * Registra uma nova aula para uma turma específica. Este método recebe o ID da turma e os dados da aula
	 * através do corpo da requisição e utiliza o `ClassroomService` para registrar a aula no sistema. Os dados
	 * da aula são fornecidos como um objeto `ClassDTO`, que inclui todas as informações necessárias para o cadastro
	 * de uma nova aula.
	 * 
	 * @param {number} classroomid - O ID da turma para a qual a aula será registrada
	 * 
	 * @param {ClassDTO} dataClass - O objeto contendo os dados da nova aula a ser registrada
	 * 
	 * @returns {Promise<Object>} Uma promessa que resolve para um objeto contendo o ID da nova aula registrada e
	 */
	@Post('/:id/class')
	async registerClass(@Param ('id') classroomid: number, @Body() dataClass: ClassDTO){
		const dataPresence = dataClass.presence;
		const newClass = await this.classroomService.registerClass(dataClass.datetime, classroomid);
		const classId = newClass[0].id;

		const presenceResult = await this.registerPresence(classId, dataPresence);

		const flattenedPresenceResult = flatMap(presenceResult);

		return {newClass: classId, presenceResult: flattenedPresenceResult };
	}

	/**
	 * Registra a presença de um aluno em uma aula específica. Este método recebe o ID da turma, o ID da aula e os dados
	 * de presença através do corpo da requisição e utiliza o `ClassroomService` para registrar a presença no sistema.
	 * 
	 * @param {number} classroomid - O ID da turma para a qual a presença será registrada
	 * 
	 * @param {number} classid - O ID da aula para a qual a presença será registrada
	 * 
	 * @param {Object[]} presence - Um array de objetos contendo os IDs dos alunos e a presença de cada aluno na aula
	 * 
	 * @returns {Promise<Object[]>} Uma promessa que resolve para um array de objetos contendo o ID do aluno e o resultado
	 */
	async registerPresence(classId: number, presence: { studentid: number, presence: boolean }[]) {
		const results = [];
	
		for (const data of presence) {
			const result = await this.classroomService.registerPresence(classId, data.studentid, data.presence);
			results.push(result);
		}
	
		return results;
	}
}
