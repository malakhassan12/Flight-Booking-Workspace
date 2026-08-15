import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { JwtModule } from '@nestjs/jwt';

// For DI => Dependency injection
import { VaultModule, VaultService } from '@flight-booking-workspace/vault';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    VaultModule,
    // JwtModule.registerAsync({
    //   global: true,
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     console.log('JWT_ACCESS_SECRET =', config.get('JWT_ACCESS_SECRET'));

    //     return {
    //       secret: config.get('JWT_ACCESS_SECRET'),
    //       signOptions: {
    //         expiresIn: '1d',
    //       },
    //     };
    //   },
    // }),

    JwtModule.registerAsync({
      global: true,
      imports: [VaultModule],
      inject: [VaultService],

      useFactory: async (vaultService: VaultService) => {
        const secrets = await vaultService.getSecret('auth-service');

        console.log(
          'JWT_ACCESS_SECRET =',
          secrets?.JWT_ACCESS_SECRET,
        );

        return {
          secret: secrets?.JWT_ACCESS_SECRET,

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
