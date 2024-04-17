/**
 * Este arquivo contém os testes automatizados para realizar o registro de um novo professor no banco de dados. Sendo assim, há dois testes:
 * 1° teste: Deve-se enviar a requisição para registrar um novo professor e retornar o HTTPStatusCode 200
 * 2° teste: Deve retornar o HTTPStatusCode 400 e uma mensagem de erro ao tentar enviar uma novo professor sem nome
*/

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('TeacherController (/teachers)', () => {
    let app: INestApplication

    const newTeacher = {
        "name": "Nome Teste",
        "gender": "Masculino",
        "dateofbirth": "1980-09-24",
        "address": "Rua ABC",
        "maritalstatus": "Solteiro",
        "raceethnicity": "Branco",
        "city": "Sao Paulo",
        "state": "SP",
        "phonenumber": "85888888",
        "landline": "85888778",
        "email": "exemplo@hotmail.com",
        "rg": "114111111",
        "cpf": "22222522222"  
    }

    const newTeacherSemNome = {
        "gender": "Masculino",
        "dateofbirth": "1980-09-24",
        "address": "Rua ABC",
        "maritalstatus": "Solteiro",
        "raceethnicity": "Branco",
        "city": "Sao Paulo",
        "state": "SP",
        "phonenumber": "85888888",
        "landline": "85888778",
        "email": "exemplo@hotmail.com",
        "rg": "114111111",
        "cpf": "22222522222"  
    }


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
                .post('/teachers')
                .send(newTeacher)
                .expect(201)

            return testRegisterSuccess
        })
    })

    describe('Register', () => {
        it('(Erro) deve retornar 500(Bad Request) + Mensagem de erro', async () => {

            const testAuthError = await request(app.getHttpServer())
                .post('/teachers')
                .send(newTeacherSemNome)
                .expect(500)
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
