// Importa o decorador Injectable de @nestjs/common, DTO de autenticação de usuário e serviço de usuário
import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { AuthCredentialsUserDto } from "./dto/authCredentials-user.dto";
import { UserService } from "./user.service";
import { RegisterUserDto } from "./dto/registerUser.dto";
import { DeleteUserDto } from "./dto/deleteUser.dto";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    /**
     * Registra um novo usuário com base nos dados fornecidos. Este método aceita um objeto `RegisterUserDto`
     * contendo as informações necessárias para o cadastro de um usuário, incluindo nome, email, senha, entre outros.
     * 
     * @params {RegisterUserDto} registerUserDto - O objeto contendo os dados do usuário a ser registrado.
     * 
     * @returns {Promise<any>} Uma promessa que resolve para os dados do usuário recém-registrado.
     */
    @Post()
    async registerUser(@Body() registerUserDto: RegisterUserDto){
       const result = await this.userService.registerUser(registerUserDto)
       if (!result){
        throw new BadRequestException('Falha ao criar usuário')
       }
       return result
    }    

    /**
     * Autentica um usuário com base nas credenciais fornecidas. Este método recebe um objeto `AuthCredentialsUserDto`
     * pelo corpo da requisição, que contém as informações necessárias para a autenticação do usuário, como nome de usuário
     * e senha. Os dados são passados para o `UserService` para realizar a autenticação.
     * 
     * Este endpoint é acessado através de uma solicitação POST para '/user/auth'. Se as credenciais forem válidas,
     * o método retorna os dados relevantes do usuário autenticado, que podem incluir tokens de acesso, informações do perfil
     * do usuário, ou qualquer outro dado definido pelo `UserService` como parte do processo de autenticação.
     * 
     * @param {AuthCredentialsUserDto} authCredentialsUSerDto - O objeto contendo as credenciais do usuário a serem autenticadas.
     * 
     * @returns {Promise<any>} Uma promessa que resolve para os dados do usuário autenticado ou informações relacionadas
     * à sessão de autenticação. O tipo de retorno exato depende da implementação específica do `UserService`.
    */
    @Post('auth')
    async authCreditialsUser(@Body() authCredentialsUSerDto: AuthCredentialsUserDto) {
        const result = await this.userService.authCreditialsUser(authCredentialsUSerDto)
        if (!result){
            throw new BadRequestException('Email ou senha incorretos')
        }
        return result
    }

    /**
     * Deleta um usuário com base no email fornecido. Este método recebe um objeto `DeleteUserDto` contendo o email
     * do usuário a ser deletado. Os dados são passados para o `UserService` para realizar a deleção do usuário.
     * 
     * @param {DeleteUserDto} deleteUserDto - O objeto contendo o email do usuário a ser deletado.
     * 
     * @returns {Promise<boolean>} Uma promessa que resolve para `true` se o usuário foi deletado com sucesso, ou
     */
    @Post('delete')
    async deleteUser(@Body() deleteUserDto: DeleteUserDto){
        const result = await this.userService.deleteUser(deleteUserDto)
        if(!result){
            throw new BadRequestException('Nenhum usuário possui esse email')
        }
        return true
    }
}
