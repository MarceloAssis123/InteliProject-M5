import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { EntityManager } from 'typeorm';

@Injectable()
export class AppService {

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }


  async appuserDataFilter(data: any): Promise<any[]> {
    const resultado = data.reduce((acc, usuario) => {
      // Inicializa o contador para o ongid, se ainda não existir
      if (!acc[usuario.ongid]) {
        acc[usuario.ongid] = { ongid: usuario.ongid, QTDLider: 0, QTDProfessor: 0 };
      }

      // Incrementa o contador baseado no papel
      if (usuario.role === 'Teacher') {
        acc[usuario.ongid].QTDProfessor += 1;
      } else if (usuario.role === 'Leader') {
        acc[usuario.ongid].QTDLider += 1;
      }

      return acc;
    }, {});

    // Convertendo o objeto resultante em um array de objetos
    const resultadoArray = Object.values(resultado);
    return resultadoArray
  }

  async categoryDataFilter(data: any): Promise<any[]> {
    const resultado = data.map(categoria => ({
      id: categoria.id,
      name: categoria.name
    }));
    return resultado
  }

  async classDataFilter(data: any): Promise<any[]> {
    const resultado = data.reduce((acc, aula) => {
      // Se o classroomid já existe no acumulador, incrementa a contagem
      if (acc[aula.classroomid]) {
        acc[aula.classroomid].Quantidade += 1;
      } else {
        // Se não, inicializa o contador para esse classroomid
        acc[aula.classroomid] = { classroomid: aula.classroomid, Quantidade: 1 };
      }
      return acc;
    }, {});

    // Converte o objeto acumulador em um array de valores
    const resultadoArray = Object.values(resultado);
    return resultadoArray
  }


  // Possibilidade de otmizar igual feito com student
  async classroomDataFilter(data: any): Promise<any[]> {
    const resultado = data.reduce((acc, turma) => {
      const workshop = acc[turma.workshopid] || {
        workshopid: turma.workshopid,
        classroomArrayId: [],
        QTDSegunda: 0,
        QTDTerca: 0,
        QTDQuarta: 0,
        QTDQuinta: 0,
        QTDSexta: 0,
        QTDSabado: 0,
        QTDDomingo: 0
      };

      // Adiciona o id da turma ao array de ids
      workshop.classroomArrayId.push(turma.id);

      // Incrementa a contagem do dia da semana apropriado
      switch (turma.day) {
        case 1: workshop.QTDDomingo++; break;
        case 2: workshop.QTDSegunda++; break;
        case 3: workshop.QTDTerca++; break;
        case 4: workshop.QTDQuarta++; break;
        case 5: workshop.QTDQuinta++; break;
        case 6: workshop.QTDSexta++; break;
        case 7: workshop.QTDSabado++; break;
      }

      // Atualiza o acumulador com os dados deste workshop
      acc[turma.workshopid] = workshop;

      return acc;
    }, {});

    // Converte o objeto acumulador em um array de valores
    const resultadoArray = Object.values(resultado);
    return resultadoArray
  }

  async ongDataFilter(data: any): Promise<any[]> {
    const resultado = data.map(ong => ({
      id: ong.id,
      name: ong.name
    }));
    return resultado
  }


  //Grande Quantidade de classID no BD, olhar isso dps
  async presenceDataFilter(data: any): Promise<any[]> {

    function presenceValidador(acc, object) {
      if (object.presence) {
        acc[object.classid].true += 1
        acc[object.classid].total += 1
      }
      if (object.presence == false) {
        acc[object.classid].total += 1
      }
    }

    const resultado = data.reduce((acc, presence) => {
      // Se a presence já existe no acumulador, chama a função
      if (acc[presence.classid]) {
        presenceValidador(acc, presence)
      } else {
        // Se não, inicializa o contador para essa presence
        acc[presence.classid] = { classid: presence.classid, true: 0, total: 0 };
        presenceValidador(acc, presence)
      }
      return acc;
    }, {});

    // Converte o objeto acumulador em um array de valores
    const resultadoArray = Object.values(resultado);
    return resultadoArray
  }

  async studentDataFilter(data: any): Promise<any[]> {
    const normalizeString = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ''); // Remove acentos e espaços
    };

    const resultado = data.reduce((acc, aluno) => {
      if (!acc[aluno.ongid]) {
        acc[aluno.ongid] = {
          ongid: aluno.ongid,
          Genero: {},
          EtniaRacial: {},
          Estado: {},
          Cidade: {}
        };
      }

      const ong = acc[aluno.ongid];

      // Gênero
      let generoValue = aluno.gender === 'M' ? 'Masculino' : aluno.gender === 'F' ? 'Feminino' : aluno.gender;
      ong.Genero[generoValue] = (ong.Genero[generoValue] || 0) + 1;

      // Etnia Racial
      const etniaValue = normalizeString(aluno.raceethnicity.replace(/\(A\)|\(O\)/gi, ''));
      ong.EtniaRacial[etniaValue] = (ong.EtniaRacial[etniaValue] || 0) + 1;

      // Estado
      const estadoValue = normalizeString(aluno.state);
      ong.Estado[estadoValue] = (ong.Estado[estadoValue] || 0) + 1;

      // Cidade
      const cidadeValue = normalizeString(aluno.city);
      ong.Cidade[cidadeValue] = (ong.Cidade[cidadeValue] || 0) + 1;

      return acc;
    }, {});

    // Converte o objeto acumulador em um array de valores
    const resultadoArray = Object.values(resultado);
    return resultadoArray
  }

  async studentClassroomDataFilter(data: any): Promise<any[]> {
    const resultado = data.reduce((acc, object) => {
      // Inicializa o contador para o ongid, se ainda não existir
      if (!acc[object.classroomid]) {
        acc[object.classroomid] = { classroomid: object.classroomid, QTDStudent: 1 };
        return acc
      }
      if (acc[object.classroomid]) {
        acc[object.classroomid].QTDStudent += 1
        return acc
      }
    }, {});

    // Convertendo o objeto resultante em um array de objetos
    const resultadoArray = Object.values(resultado);
    return resultadoArray
  }

  //Poucos Dados Não vale a pena refinar
  async teacherDataFilter(data: any): Promise<any[]> {
    const grouped = data.reduce((acc, obj) => {
      const key = `${obj.gender}|${obj.maritalstatus}|${obj.raceethnicity}|${obj.state}|${obj.city}`;
      if (!acc[key]) {
        acc[key] = {
          Genero: obj.gender,
          EstadoCivil: obj.maritalstatus,
          EtiniaRacial: obj.raceethnicity,
          Estado: obj.state,
          Cidade: obj.city,
          ArrayId: []
        };
      }
      acc[key].ArrayId.push(obj.id);
      return acc;
    }, {});

    const resultadoArray = Object.values(grouped);
    return resultadoArray
  }

  async teacherClassroomDataFilter(data: any): Promise<any[]> {
    const resultado = data.reduce((acc, object) => {
      // Inicializa o contador para o ongid, se ainda não existir
      if (!acc[object.teacherid]) {
        acc[object.teacherid] = { teacherid: object.teacherid, QTDClassroom: 1 };
        return acc
      }
      if (acc[object.teacherid]) {
        acc[object.teacherid].QTDClassroom += 1
        return acc
      }
    }, {});

    // Convertendo o objeto resultante em um array de objetos
    const resultadoArray = Object.values(resultado);
    return resultadoArray
  }

  async workshopDataFilter(data: any): Promise<any[]> {
    const result = data.reduce((acc, { ongid, categoryid, name }) => {
      // Ignore workshops with null ongid
      if (ongid === null) return acc;

      const key = `${ongid}-${categoryid}-${name}`;
      if (!acc[key]) {
        acc[key] = { ongid, categoryid, nome: name, QTD: 1 };
      } else {
        acc[key].QTD++;
      }

      return acc;
    }, {});

    const resultadoArray = Object.values(result);
    return resultadoArray
  }

  async getAllData(): Promise<any[]> {
    const cacheKey = 'allData';
    let allTablesData: any[] = await this.cacheManager.get(cacheKey);
    if (!allTablesData) {
      // Se não há dados em cache, executa a consulta
      const tables = ["appuser", "category", "class", "classroom", "ong", "presence", "student", "student_classroom", "teacher", "teacher_classroom", "workshop"]
      allTablesData = [];

      for (const table of tables) {
        let data = await this.entityManager.query(`SELECT * FROM "${table}"`);

        switch (table) {
          case 'appuser':
            data = await this.appuserDataFilter(data)
            break
          case "category":
            data = await this.categoryDataFilter(data)
            break
          case "class":
            data = await this.classDataFilter(data)
            break
          case "classroom":
            data = await this.classroomDataFilter(data)
            break
          case "ong":
            data = await this.ongDataFilter(data)
            break
          case "presence":
            data = await this.presenceDataFilter(data)
            break
          case "student":
            data = await this.studentDataFilter(data)
            break
          case "student_classroom":
            data = await this.studentClassroomDataFilter(data)
            break
          case "teacher":
            data = await this.teacherDataFilter(data)
            break
          case "teacher_classroom":
            data = await this.teacherClassroomDataFilter(data)
            break
          case "workshop":
            data = await this.workshopDataFilter(data)
            break
        }

        allTablesData.push({
          tableName: table,
          data: data,
        });
      }

      // Armazena os dados no cache
      await this.cacheManager.set(cacheKey, allTablesData, 600000); //Armazena em Cache por 10 minutos
    }

    return allTablesData;
  }
}
