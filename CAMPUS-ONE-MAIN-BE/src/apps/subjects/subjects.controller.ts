import { Controller, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async getSubjects(
    @Query('schoolYear') schoolYear?: string,
    @Query('term') term?: string,
  ) {
    try { return await this.subjectsService.getSubjects(schoolYear, term); }
    catch (e: any) { throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR); }
  }

  @Get('user/:userId')
  async getUserInfo(@Param('userId') userId: string) {
    try { return await this.subjectsService.getUserInfo(userId); }
    catch (e: any) { throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR); }
  }
}
