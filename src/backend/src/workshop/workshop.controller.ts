// Importa decoradores e entidade de ONG    
import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { WorkshopService } from './workshop.service';


@Controller('workshops')
export class WorkshopController {
    
    constructor(private workshopService: WorkshopService){}

    /**
     * Lista todos os workshops disponíveis com detalhes das suas turmas, incluindo o nome do workshop, a categoria,
     * informações sobre as turmas (horários, professores, quantidade de alunos) e a ONG responsável. Este método
     * não recebe parâmetros e retorna uma lista achatada de todas as turmas de cada workshop, formatada com informações
     * relevantes para facilitar a visualização e o gerenciamento.
     * 
     * @returns {Promise<Array>} Uma promessa que resolve para uma lista contendo as turmas de todos os workshops,
     * com detalhes formatados de cada turma.
    */
    @Get()
    async listAll(){
        const workshops = await this.workshopService.listAll();
        return workshops;
    }
    
    /**
     * Encontra uma turma específica pelo seu ID, retornando detalhes do workshop ao qual pertence a turma, informações
     * sobre a turma (como horários e professor), e uma lista dos alunos com seus respectivos nomes e IDs. Este método
     * aceita o ID da turma como parâmetro.
     * 
     * @param {number} id - O ID da turma a ser encontrada.
     * 
     * @returns {Promise<Object>} Uma promessa que resolve para um objeto contendo informações detalhadas da turma
     * especificada, incluindo detalhes do workshop associado.
    */
    @Get('classroom/:id')
    async findById(@Param('id') id: string){
        const workshopClass = await this.workshopService.findById(Number(id));
        return workshopClass;
    }

    /**
     * Lista todos os estudantes associados a uma turma específica. Este método aceita o ID da turma como parâmetro e
     * retorna uma lista contendo todos os estudantes matriculados na turma.
     * 
     * @param {string} idClass - O ID da turma desejada.
     * 
     * @returns {Promise<Array>} Uma promessa que resolve para uma lista contendo todos os estudantes matriculados na
     * turma especificada.
    */
    @Get('/classroom/:idClass/students')
    async listStudentsByClassroom(@Param('idClass') idClass: string) {
        const students = await this.workshopService.listStudentsByClassroom(Number(idClass));
        return students;
    }

    /**
     * Lista todos os estudantes associados a uma ONG específica. Este método aceita o ID da ONG como parâmetro e
     * retorna uma lista contendo todos os estudantes associados à ONG.
     * 
     * @param {string} idOng - O ID da ONG desejada.
     * 
     * @returns {Promise<Array>} Uma promessa que resolve para uma lista contendo todos os estudantes associados à
     * ONG especificada.
    */
    @Get('/:idOng/students')
    async getAllStudentsByOngId(@Param('idOng') idOng: string){
        const students = await this.workshopService.listAllStudentsByOngId(Number(idOng));
        return students;
    }

    /**
     * Lista as frequência de acordo com uma oficina específica. Este método aceita o ID da oficina como parâmetro e 
     * retorna uma lista contendo todas as presenças das turmas associadas a oficina.
     * 
     * @param {string} idWorkshop - O ID da oficina desejada.
     * 
     * @returns {Promise<Array>} Uma promessa que resolve para uma lista contendo todas as presenças das turmas associadas a oficina.
     */
    @Get('/:idWorkshop/presences')
    async listPresencesByClassroom(@Param('idWorkshop') idWorkshop: string) {
        const presences = await this.workshopService.listAllClassroomsPresenceByWorkshop(Number(idWorkshop));
        return presences;
    }

    /**
     * Lista todas as turmas associadas a uma oficina específica. Este método aceita o ID da oficina como parâmetro e
     * retorna uma lista contendo todas as turmas associadas à oficina.
     * 
     * @param {string} idWorkshop - O ID da oficina desejada.
     * 
     * @returns {Promise<Array>} Uma promessa que resolve para uma lista contendo todas as turmas associadas à oficina.
     */
    @Get('/:idWorkshop/classrooms')
    async listClassroomsByWorkshop(@Param('idWorkshop') idWorkshop: string) {
        const classrooms = await this.workshopService.listAllClassroomsByWorkshop(Number(idWorkshop));
        return classrooms;
    }
    
    /**
     * Lista todas as oficinas de uma ONG específica. Este método aceita o ID da ONG como parâmetro e
     * retorna uma lista contendo todas as oficinas associadas à ONG.
     * 
     * @param {string} idOng - O ID da ONG desejada.
     * 
     * @returns {Promise<Array>} Uma promessa que resolve para uma lista contendo todas as oficinas associadas à ONG.
     */
    @Get('/ong/:idOng/student')
    async getStudentsCountByWorkshop(@Param('idOng') idOng: string){
        const qty = await this.workshopService.getStudentsCountByWorkshop(Number(idOng));
        return qty;
    }

    /**
     * Registra uma nova oficina com os dados fornecidos. Este método aceita um objeto `WorkshopDTO`
     * contendo todas as informações necessárias para o cadastro de uma oficina, como nome, descrição,
     * 
     * @param {Object} workshopData - O objeto contendo os dados da oficina a ser registrada.
     * 
     * @returns {Promise<Workshop>} Uma promessa que resolve para a entidade `Workshop` da oficina
     */
    @Post()
    async createWorkshop(@Body() workshopData: any){
        const { name, ongId, categoryId, description } = workshopData;
        const workshop = await this.workshopService.createWorkshop(name, ongId, categoryId, description);
        return workshop;
    }

    /**
     * Lista todas as oficinas de uma ONG específica. Este método aceita o ID da ONG como parâmetro e
     * retorna uma lista contendo todas as oficinas associadas à ONG.
     * 
     * @param {string} idOng - O ID da ONG desejada.
     * 
     * @returns {Promise<Array>} Uma promessa que resolve para uma lista contendo todas as oficinas associadas à ONG.
     */
    @Get('/:id')
    async getWorkshopById(@Param('id') id: string){
        const workshop = await this.workshopService.listWorkshopById(Number(id));
        return workshop;
    }

    /**
     * Lista todas as oficinas de uma ONG específica. Este método aceita o ID da ONG como parâmetro e
     * retorna uma lista contendo todas as oficinas associadas à ONG.
     * 
     * @param {string} idOng - O ID da ONG desejada.
     * 
     * @returns {Promise<Array>} Uma promessa que resolve para uma lista contendo todas as oficinas associadas à ONG.
     */
    @Get('/ongid/:id')
    async getWorkshopByOngId(@Param('id') id: number){
        return this.workshopService.listByIdOng(id)
    } 
}
