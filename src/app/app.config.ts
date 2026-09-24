import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { MeetingService } from './services/meeting.service';
import { IpService } from './services/ip.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), MeetingService, IpService]
};
