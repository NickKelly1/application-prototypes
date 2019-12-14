import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';
import { classLogger } from '../../helpers/logger';

@Controller('/')
export class HomeController {
  private readonly logger = classLogger(this);

  constructor(
    private readonly appService: HomeService,
  ) { this.logger.dInfo('constructor'); }

  @Get()
  report() {
    this.logger.dInfo('report');
    return this.appService.report();
  }
}
