/**
 * Este arquivo contém os testes automatizados para realizar o registro de um novo aluno no banco de dados. Sendo assim, há dois testes:
 * 1° teste: Deve-se enviar a requisição para registrar um novo aluno e retornar o HTTPStatusCode 201
 * 2° teste: Deve retornar o HTTPStatusCode 500 e uma mensagem de erro ao tentar enviar uma novo aluno sem nome
*/

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('StudentController (/students)', () => {
    let app: INestApplication

    const newStudent = {
        "name": "Nome Teste",
        "gender": "Masculino",
        "dateofbirth": "1997-03-10",
        "ongid": 1, 
        "rg": "114111111",
        "cpf": "22222522222",
        "maritalstatus": "Solteiro",
        "raceethnicity": "Branco",
        "address": "Rua ABC",
        "state": "SP",
        "city": "Sao Paulo",
        "phonenumber": "85888888",
        "landline": "85888778",
        "email": "exemplo@hotmail.com"
    }


    const newStudentSemNome = {
        "gender": "Masculino",
        "dateofbirth": "1997-03-10",
        "ongid": 1,
        "rg": "114111111",
        "cpf": "22222522222",
        "maritalstatus": "Solteiro",
        "raceethnicity": "Branco",
        "address": "Rua ABC",
        "state": "SP",
        "city": "Sao Paulo",
        "phonenumber": "85888888",
        "landline": "85888778",
        "email": "exemplo@hotmail.com"
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
                .post('/students')
                .send(newStudent)
                .expect(201)

            return testRegisterSuccess
        })
    })

    describe('Register', () => {
        it('(Erro) deve retornar 500(Bad Request) + Mensagem de erro', async () => {

            const testAuthError = await request(app.getHttpServer())
                .post('/students')
                .send(newStudentSemNome)
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
