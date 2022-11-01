import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  defaultRoute(): string {
    return 'Unauthorized!';
  }
}
