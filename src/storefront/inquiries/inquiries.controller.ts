import { Body, Controller, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { InquiriesService } from './inquiries.service';
import {
  CreateInquiryDto,
  schema as CreateInquirySchema,
} from './dto/create-inquiry.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JoiValidationPipe } from '../../common/joi-validation.pipe';

@ApiTags('Contact')
@Controller('api/v1/contact')
export class InquiriesController {
  constructor(private readonly inquiresService: InquiriesService) {}

  @Post()
  @ApiOperation({ summary: 'Submit a contact form inquiry' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The inquiry has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Invalid input data.',
  })
  @UsePipes(new JoiValidationPipe(CreateInquirySchema))
  async createInquiry(
    @Body()
    createInquiryDto: CreateInquiryDto,
  ) {
    await this.inquiresService.createInquiry(createInquiryDto);

    return {
      status: 'success',
      message: 'Your message has been sent successfully',
    };
  }
}
