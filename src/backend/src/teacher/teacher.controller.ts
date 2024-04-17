// Importa o decorador do pacote @nestjs/common, serviço de professor, DTO de professor e entidade de professor
import { Controller, Get, Post, Body, Param, Patch } from "@nestjs/common";
import { TeacherService } from "./teacher.service";
import { TeacherDTO } from "./teacher.dto";
import { teacher } from "./teacher.entity";
import { TeacherCreateDTO } from "./teacherCreate.dto";

@Controller('/teachers')
export class TeacherController {

  constructor(private teacherRepository: TeacherService) {}

  /**
   * Registra um novo professor com os dados fornecidos. Este método aceita um objeto `TeacherDTO`
   * contendo todas as informações necessárias para o cadastro de um professor, como nome, qualificações,
   * áreas de especialização, entre outros. Os dados são recebidos através do corpo da requisição.
   * 
   * Este endpoint é acessado por meio de uma solicitação POST para '/teachers'. O `TeacherRepository`
   * é utilizado para efetuar o registro do professor no sistema. Após o registro, o objeto `TeacherEntity`
   * do professor recém-registrado é retornado, incluindo um identificador único gerado para o professor.
   * 
   * @param {TeacherCreateDTO} professor Um objeto `TeacherCreateDTO` contendo todas as informações
   * 
   * @returns {Promise<TeacherEntity>} Uma promessa que resolve para a entidade `TeacherEntity` do professor
   * recém-registrado, incluindo seu identificador único e todas as informações fornecidas durante o registro.
  */
  @Post()
  async registerTeacher(@Body() professor: TeacherCreateDTO) {
    return this.teacherRepository.register(professor.name, professor.gender, professor.dateofbirth, professor.address, professor.maritalstatus, professor.raceethnicity, professor.city, professor.state, professor.phonenumber, professor.landline, professor.email, professor.rg, professor.cpf);
  }

  /**
   * Lista todos os professores relacionados a uma ONG específica. Este método recebe o ID da ONG e utiliza o
   * `TeacherRepository` para recuperar todos os professores associados a essa ONG. O método retorna uma lista de professores.
   * 
   * @param {string} ongId - O ID da ONG
   * 
   * @returns {Promise<teacher[]>} Uma promessa que resolve para uma lista de entidades `teacher`
   */
  @Get('/ong/:ongId')
  async listAll(@Param('ongId') ongID: number) {
    return this.teacherRepository.listAll(ongID);
  }

  /**
   * Atualiza os dados de um professor existente. Este método recebe os dados de um professor a ser atualizado
   * 
   * @param {string} id - O identificador único do professor a ser atualizado. 
   * @param {Object} professor - O objeto contendo os dados atualizados do professor.
   *  
   * @returns {Promise<teacher>} Uma promessa que resolve para a entidade `teacher` do professor.
   */
  @Patch('/:id')
  async updateProfessor(@Param('id') id: string, @Body() professor: any) {
    return await this.teacherRepository.updateProfessor(Number(id), professor.name, professor.gender, professor.dateofbirth, professor.address, professor.maritalstatus, professor.raceethnicity, professor.city, professor.state, professor.phonenumber, professor.landline, professor.email, professor.rg, professor.cpf );
  }

  /**
   * Lista todas as oficinas de um professor específico. Este método recebe o ID do professor como parâmetro e retorna um array contendo todas as oficinas associadas a esse professor.
   * 
   * @param {number} teacherId - O ID do professor cujas oficinas devem ser listadas.
   * 
   * @returns {Promise<Workshop[]>} Uma promessa que resolve para um array de objetos, onde cada objeto contém os dados de uma oficina associada ao professor.
   */
  @Get('/:teacherId/workshops')
  async listWorkshops(@Param('teacherId') teacherID: number) {
    return this.teacherRepository.listWorkshops(teacherID);
  }

}
