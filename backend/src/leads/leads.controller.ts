import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto } from './dto/leads.dto';

@Controller('/api/leads')
export class LeadsController {

    constructor(private readonly leadsService: LeadsService) {}

    @Post()
    create(@Body() createLeadDto: CreateLeadDto) {
        return this.leadsService.createLead(createLeadDto);
    }

    @Get()
    findAll() {
        return this.leadsService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.leadsService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
        return this.leadsService.updateLead(id, updateLeadDto);
    }

    @Delete(':id')
    erase(@Param('id') id: string) {
        return this.leadsService.deleteLead(id);
    }

}
