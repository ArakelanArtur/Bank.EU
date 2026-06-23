import { Body, Controller, Post } from '@nestjs/common';
import { ContactRequestsService } from './contact-requests.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';

@Controller('contact-requests')
export class ContactRequestsController {
  constructor(private contactRequestsService: ContactRequestsService) {}

  @Post()
  async create(@Body() dto: CreateContactRequestDto) {
    return this.contactRequestsService.create(dto);
  }
}
