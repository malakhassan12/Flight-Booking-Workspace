import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { JwtModule } from '@nestjs/jwt';

// For DI => Dependency injection

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('JWT_ACCESS_SECRET =', config.get('JWT_ACCESS_SECRET'));

        return {
          secret: config.get('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
  ],
  providers: [AuthGuard, RolesGuard],
  exports: [AuthGuard, RolesGuard, JwtModule],
})
export class SecurityModule {}
