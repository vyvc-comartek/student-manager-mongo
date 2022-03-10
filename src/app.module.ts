import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassModule } from './classes/classes.module';
import { ScoreModule } from './scores/scores.module';
import { StudentModule } from './students/students.module';
import { SubjectModule } from './subjects/subjects.module';

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

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      sortSchema: true,
      debug: true,
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
