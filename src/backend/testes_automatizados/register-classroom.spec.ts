/**
 * Este arquivo contém os testes automatizados para realizar o registro de uma nova turma no banco de dados. Sendo assim, há dois testes:
 * 1° teste: Deve-se enviar uma nova turma e retornar o HTTPStatusCode 201
 * 2° teste: Deve retornar o HTTPStatusCode 400 e uma mensagem de erro ao tentar enviar uma nova turma sem nome
*/

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('ClassroomController (/classrooms)', () => {
    let app: INestApplication

    const newClassroom = { "idWorkshop": 1, "name": "Teste Cadastro", "day": 3, "startTime": "08:00:00", "endTime": "10:00:00" }
    const newClassroomSemNome = { "idWorkshop": 1, "day": 3, "startTime": "08:00:00", "endTime": "10:00:00" }
    

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
                .post('/classrooms')
                .send(newClassroom)
                .expect(201)

            return testRegisterSuccess
        })
    })

    describe('Register', () => {
        it('(Erro) deve retornar 400(Bad Request) + Mensagem de erro', async () => {

            const testAuthError = await request(app.getHttpServer())
                .post('/classrooms')
                .send(newClassroomSemNome)
                .expect(400)
                .then((response) => {
                    expect(response.body).toHaveProperty('message', expect.any(String))
                })
            return testAuthError
        });
    });


    afterAll(async () => {
        await app.close();
    });
});
