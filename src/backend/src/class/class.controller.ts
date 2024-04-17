// Importa os decoradores do pacote @nestjs/common, serviço de aula e DTO de aula
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassDTO } from './class.dto';
import { PresenceEntity } from 'src/presence/presence.entity'; // Certifique-se de importar a entidade de presença

@Controller('class')
export class ClassController {
    constructor(private readonly classService: ClassService) {}
}
