import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsUser } from "./interfaces/authCredentials-user.interface";
import { RegisterUser } from "./interfaces/registerUser.interface";
import { DeleteUser } from "./interfaces/deleteUser.interface";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    /**
     * Registra um novo usuário com base nos dados fornecidos. Este método aceita um objeto `RegisterUser`
     * 
     * @param {RegisterUser} registerUserData - O objeto contendo os dados do usuário a ser registrado.
     * 
     * @returns {Promise<boolean>} Uma promessa que resolve para `true` se o usuário foi registrado com sucesso, ou
     */
    async registerUser(registerUserData: RegisterUser){
        const query = `INSERT INTO appuser (role, ongid, teacherid, email, password) VALUES ($1, $2, $3, $4, $5)`
        try{
            await this.usersRepository.query(query, [registerUserData.role, registerUserData.ongid, registerUserData.teacherid, registerUserData.email, registerUserData.password])
            return true
        }catch{
            return false
        }
    }

    /**
     * Autentica um usuário com base nas credenciais fornecidas e retorna suas credenciais de autenticação,
     * incluindo o papel (role) e o identificador do papel (roleID). Este método recebe um objeto
     * `AuthCredentialsUser` que contém o e-mail e a senha do usuário. Ele realiza uma busca no conjunto de
     * usuários cadastrados para encontrar um usuário que corresponda às credenciais fornecidas.
     * 
     * Se um usuário correspondente for encontrado, o método retorna um objeto `AuthCredentialsResponseUser`
     * contendo o papel e o identificador do papel do usuário. Caso contrário, a implementação pode variar,
     * possivelmente lançando um erro ou retornando um objeto vazio, dependendo das regras de negócio definidas.
     * 
     * @param {AuthCredentialsUser} authCredentialsUser - O objeto contendo as credenciais do usuário (e-mail e senha).
     * 
     * @returns {AuthCredentialsResponseUser} Um objeto contendo o `role` (papel do usuário) e `roleID` (identificador
     * do papel), que são utilizados para definir as permissões e o acesso do usuário no sistema.
    */
    async authCreditialsUser(authCredentialsUser: AuthCredentialsUser): Promise<User | false>{
        const query = `SELECT * FROM appuser WHERE email = $1 and password = $2`
        const result = await this.usersRepository.query(query, [authCredentialsUser.email, authCredentialsUser.password])
        if (Object.keys(result).length === 0){
            return false
        }
        return result[0]
    }

    /**
     * Deleta um usuário com base no email fornecido. Este método recebe um objeto `DeleteUser` contendo o email
     * do usuário a ser deletado. Os dados são passados para o `UserService` para realizar a deleção do usuário.
     * 
     * @param {DeleteUser} deleteUserData - O objeto contendo o email do usuário a ser deletado.
     * 
     * @returns {Promise<boolean>} Uma promessa que resolve para `true` se o usuário foi deletado com sucesso, ou
     */
    async deleteUser(deleteUserData: DeleteUser){
        const query = `DELETE FROM appuser WHERE email = $1;`
        const result = await this.usersRepository.query(query, [deleteUserData.email])
        return result
    }

}