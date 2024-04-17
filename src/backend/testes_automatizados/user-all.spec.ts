/**
 * Este arquivo contém os testes automatizados do Usuário. Sendo assim, há quatro testes:
 * 1° teste(Cadastro do Usuário): Deve-se enviar uma novo usuário e retornar o HTTPStatusCode 201
 * 2° teste(Autenticação do Usuário): Deve-se enviar o email e Senha do usuário criado anteriormente e retornar o HTTPStatusCode 201 junto com o dados do usuário
 * 3° teste(Remover o Usuário): Deve-se enviar o email do usuário criado anteriormente e retornar o HTTPStatusCode 201
 * 4° teste(Erro de Autenticação do Usuário): Deve retornar o HTTPStatusCode 400 e uma mensagem de erro ao tentar enviar o email e senha do usuário removido anteriormente
*/

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('UserController (/user)', () => {
    let app: INestApplication

    const newUser = { 'role': 'Leader', 'ongid': 1, 'teacherid': null, "email": 'testUser@gmail.com', "password": 'teste' }
    const newUserCredentials = { 'email': newUser.email, 'password': newUser.password }

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('Register', () => {
        it('(Sucesso) deve retornar o código 201', async () => {

            const testRegisterSuccess = await request(app.getHttpServer())
                .post('/user')
                .send(newUser)
                .expect(201)

            return testRegisterSuccess
        })
    })

    describe('Auth', () => {
        it('(Sucesso) deve retornar o HTTPStatusCode 201 e o usuário', async () => {

            const testAuthSuccess = await request(app.getHttpServer())
                .post('/user/auth')
                .send(newUserCredentials)
                .expect(201)
                .then((response) => {
                    expect(response.body).toEqual(expect.objectContaining({ id: expect.any(Number), ...newUser }))
                })
            return testAuthSuccess
        });
    });

    describe('Delete', () => {
        it('(Sucesso) deve retornar o código 201', async () => {
            const newUserCredentialsEmail = {"email": newUserCredentials.email}

            const testDeleteSuccess = await request(app.getHttpServer())
                .post('/user/delete')
                .send(newUserCredentialsEmail)
                .expect(201)
            return testDeleteSuccess
        })
    })

    describe('Auth', () => {
        it('(Erro) deve retornar o HTTPStatusCode 400 e uma mensagem de erro', async () => {

            const testAuthError = await request(app.getHttpServer())
                .post('/user/auth')
                .send(newUserCredentials)
                .expect(400)
                .then((response) => {
                    expect(response.body).toHaveProperty('message', 'Email ou senha incorretos')
                })
            return testAuthError
        });
    });


    afterAll(async () => {
        await app.close();
    });
});
