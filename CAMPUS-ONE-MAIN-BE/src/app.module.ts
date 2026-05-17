import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

// Auth & Institution (inline gateway modules)
import { AuthModule } from './auth/auth.module';
import { InstitutionModule } from './institution/institution.module';

// Academic gateway modules
import { EnrollmentModule } from './apps/enrollment/enrollment.module';
import { CoursesModule } from './apps/courses/courses.module';
import { DashboardModule } from './apps/dashboard/dashboard.module';
import { GradesModule } from './apps/grades/grades.module';
import { ProfileModule } from './apps/profile/profile.module';
import { SubjectsModule } from './apps/subjects/subjects.module';

// Microservice modules
import { AlumniModule } from '../apps/alumni/src/alumni.module';
import { ApplicationModule } from '../apps/application/src/application.module';

@Module({
  imports: [
    // Auth & Institution
    AuthModule,
    InstitutionModule,
    // Academic gateway
    EnrollmentModule,
    CoursesModule,
    DashboardModule,
    GradesModule,
    ProfileModule,
    SubjectsModule,
    // Microservices
    AlumniModule,
    ApplicationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
