import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
	@Get()
	defaultRoute(): any {
		return {
			appName: 'ShareYourStream-BackEnd',
			version: '0.0.1',
		};
	}
}
