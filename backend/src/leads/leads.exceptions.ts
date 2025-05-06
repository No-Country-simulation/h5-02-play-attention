import { NotFoundException, BadRequestException } from "@nestjs/common";


export class LeadNotFoundException extends NotFoundException {
    constructor(id: string) {
        super(`No se halló un lead con id: ${id}`);
    }
}

export class LeadCreationException extends BadRequestException {
    constructor(message: string = 'Error al crear el lead') {
        super(message);
    }
}

export class LeadUpdateException extends BadRequestException {
    constructor(message: string = 'Error al actualizar el lead') {
        super(message);
    }
}