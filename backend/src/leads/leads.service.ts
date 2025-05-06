import { BadRequestException, forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLeadDto, CreateLeadFromLandingDto, UpdateLeadDto } from './dto/leads.dto';
import { Leads } from './schema/leads.model';
import { EngagementService } from '../engagements/engagements.service';
import { LeadCreatedEvent } from '../system-events/lead-created.event';
import { LEAD_EVENTS } from '../system-events/event-names';
import { AuthService } from '../auth/auth.service';
import { Services, UserRole } from '../auth/auth.enum';
import { LeadNotFoundException, LeadCreationException, LeadUpdateException } from './leads.exceptions';

@Injectable()
export class LeadsService {
    private readonly logger = new Logger(LeadsService.name);

    constructor(
        @InjectModel(Leads.name)
        private leadsModel: Model<Leads>,
        @Inject(forwardRef(() => EngagementService))
        private readonly _engagementService: EngagementService,
        private readonly eventEmitter: EventEmitter2,
        private readonly authService: AuthService
    ) {}

    async createLead(createLeadDto: CreateLeadDto) {
        try {
            const newLead = await this.leadsModel.create(createLeadDto);
            
            this.eventEmitter.emit(
                LEAD_EVENTS.LEAD_CREATED,
                new LeadCreatedEvent(newLead._id, createLeadDto.email, createLeadDto.fullname)
            );
            
            this.logger.log(`Lead creado exitosamente: ${newLead._id}`);
            return newLead;
        } catch (error) {
            this.logger.error(`Error al crear lead: ${error.message}`);
            throw new LeadCreationException(
                error.code === 11000 
                    ? 'El email ya existe en la base de datos' 
                    : 'Error al crear el lead'
            );
        }
    }

    async createFromLanding(dto: CreateLeadFromLandingDto) {
        try {
            const newLead = await this.createLead({
                ...dto, 
                origen: 'Sitio web', 
                status: 'Nuevo'
            });

            await this._engagementService.generateEngagementFormLanding({
                lead_id: newLead._id.toString(), 
                detail: dto.message 
            });

            this.logger.log(`Lead creado desde landing page: ${newLead._id}`);
            return { ok: true };
        } catch (error) {
            this.logger.error(`Error en createFromLanding: ${error.message}`);
            throw new LeadCreationException(
                'Error al procesar la solicitud desde el landing page'
            );
        }
    }

    async findAll(page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;
            const [leads, total] = await Promise.all([
                this.leadsModel.find()
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                this.leadsModel.countDocuments()
            ]);
            
            return {
                data: leads,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            this.logger.error(`Error al obtener leads: ${error.message}`);
            throw new BadRequestException('Error al obtener el listado de leads');
        }
    }

    async findById(id: string) {
        try {
            const lead = await this.leadsModel.findById(id).exec();
            if (!lead) {
                throw new LeadNotFoundException(id);
            }
            return lead;
        } catch (error) {
            this.logger.error(`Error al buscar lead ${id}: ${error.message}`);
            if (error instanceof LeadNotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al buscar el lead');
        }
    }

    async updateLead(id: string, updateLeadDto: UpdateLeadDto) {
        try {
            const leadUpdated = await this.leadsModel.findByIdAndUpdate(
                id, 
                updateLeadDto, 
                {new: true}
            ).exec();

            if (!leadUpdated) {
                throw new LeadNotFoundException(id);
            }

            if (updateLeadDto.status === 'Cliente') {
                try {
                    await this.authService.registerFromLead(
                        leadUpdated.fullname,
                        leadUpdated.email,
                        UserRole.USER,
                        leadUpdated.service as Services
                    );
                    this.logger.log(`Lead ${id} convertido a cliente exitosamente`);
                } catch (authError) {
                    this.logger.error(`Error al registrar cliente: ${authError.message}`);
                    throw new LeadUpdateException('Error al registrar el lead como cliente');
                }
            }

            return leadUpdated;
        } catch (error) {
            this.logger.error(`Error al actualizar lead ${id}: ${error.message}`);
            if (error instanceof LeadNotFoundException) {
                throw error;
            }
            throw new LeadUpdateException();
        }
    }

    async deleteLead(id: string) {
        try {
            const leadDeleted = await this.leadsModel.findByIdAndDelete(id);
            if (!leadDeleted) {
                throw new LeadNotFoundException(id);
            }
            
            this.logger.log(`Lead ${id} eliminado exitosamente`);
            return 'Se eliminó el Lead';
        } catch (error) {
            this.logger.error(`Error al eliminar lead ${id}: ${error.message}`);
            if (error instanceof LeadNotFoundException) {
                throw error;
            }
            throw new BadRequestException('Error al eliminar el lead');
        }
    }
}
