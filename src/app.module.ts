import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { ApolloDriver } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Class } from './classes/class.entity';
import { ClassModule } from './classes/classes.module';
import { ClassesService } from './classes/classes.service';
import { createLoader } from './modules/entities.loader';
import { Score } from './scores/score.entity';
import { ScoreModule } from './scores/scores.module';
import { ScoresService } from './scores/scores.service';
import { SearchStudentResult } from './students/dto';
import { Student } from './students/student.entity';
import { StudentModule } from './students/students.module';
import { StudentsService } from './students/students.service';
import { Subject } from './subjects/subject.entity';
import { SubjectModule } from './subjects/subjects.module';
import { SubjectsService } from './subjects/subjects.service';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        ssl: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }),
    }),

    BullModule.forRootAsync({
      useFactory: async () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ClassModule, ScoreModule, StudentModule, SubjectModule],
      inject: [ClassesService, ScoresService, StudentsService, SubjectsService],

      useFactory: (
        classesService: ClassesService,
        scoresService: ScoresService,
        studentsService: StudentsService,
        subjectsService: SubjectsService,
      ) => ({
        debug: true,
        sortSchema: true,
        installSubscriptionHandlers: true,
        autoSchemaFile: 'schema.gql',

        context: {
          studentsLoaderByClass: createLoader<SearchStudentResult>(
            studentsService,
            'class',
          ),
          subjectsLoaderById: createLoader<Subject>(subjectsService),
          studentsLoaderById: createLoader<Student>(studentsService),
          classesLoaderById: createLoader<Class>(classesService),
          scoresLoaderByStudent: createLoader<Score>(scoresService, 'student'),
        },
      }),
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          service: 'gmail',
          requireTLS: true,
          secure: true,
          auth: {
            type: 'OAuth2',
            user: configService.get<string>('MAIL_USER'),
            clientId: configService.get<string>('MAIL_CLIENT_ID'),
            clientSecret: configService.get<string>('MAIL_CLIENT_SECRET'),
            refreshToken: configService.get<string>('MAIL_REFRESH_TOKEN'),
          },
        } as TransportType,

        template: {
          dir: './email-template',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),

    ClassModule,
    ScoreModule,
    StudentModule,
    SubjectModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
