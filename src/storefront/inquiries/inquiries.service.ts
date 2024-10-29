import { Injectable } from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  async createInquiry(createInquiryDto: CreateInquiryDto) {
    const { first_name, last_name, email, phone, message } = createInquiryDto;

    return this.prisma.inquiries.create({
      data: {
        name: `${first_name} ${last_name}`,
        email,
        phone,
        message,
      },
    });
  }
}
