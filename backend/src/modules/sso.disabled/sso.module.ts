import { Module } from '@nestjs/common';
import { SsoController } from './sso.controller';
import { SsoService } from './sso.service';
import { SamlService } from './services/saml.service';
import { OidcService } from './services/oidc.service';

@Module({
  controllers: [SsoController],
  providers: [SsoService, SamlService, OidcService],
  exports: [SsoService, SamlService, OidcService],
})
export class SsoModule {}
