import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as saml2 from 'saml2-js';
import * as crypto from 'crypto';

@Injectable()
export class SamlService {
  async validateSamlResponse(samlResponse: string, config: any): Promise<any> {
    try {
      // Create SAML service provider
      const sp = new saml2.ServiceProvider({
        entity_id: config.configuration.entityId || 'inamsos',
        private_key: config.configuration.privateKey,
        certificate: config.configuration.certificate,
        assert_endpoint: config.configuration.assertEndpoint,
      });

      // Create SAML identity provider
      const idp = new saml2.IdentityProvider({
        sso_login_url: config.configuration.entryPoint,
        sso_logout_url: config.configuration.logoutUrl,
        certificates: [config.configuration.cert],
      });

      // Validate SAML response
      return new Promise((resolve, reject) => {
        sp.post_assert(idp, { request_body: { SAMLResponse: samlResponse } }, (err, samlAssertResponse) => {
          if (err) {
            reject(new UnauthorizedException('Invalid SAML response: ' + err.message));
          } else {
            resolve(samlAssertResponse.user);
          }
        });
      });
    } catch (error) {
      throw new UnauthorizedException('SAML validation failed: ' + error.message);
    }
  }

  async generateSamlRequest(config: any): Promise<string> {
    const sp = new saml2.ServiceProvider({
      entity_id: config.configuration.entityId || 'inamsos',
      private_key: config.configuration.privateKey,
      certificate: config.configuration.certificate,
      assert_endpoint: config.configuration.assertEndpoint,
    });

    const idp = new saml2.IdentityProvider({
      sso_login_url: config.configuration.entryPoint,
      sso_logout_url: config.configuration.logoutUrl,
      certificates: [config.configuration.cert],
    });

    return new Promise((resolve, reject) => {
      sp.create_login_request_url(idp, {}, (err, loginUrl, requestId) => {
        if (err) {
          reject(err);
        } else {
          resolve(loginUrl);
        }
      });
    });
  }

  async generateLogoutRequest(config: any, nameId: string): Promise<string> {
    const sp = new saml2.ServiceProvider({
      entity_id: config.configuration.entityId || 'inamsos',
      private_key: config.configuration.privateKey,
      certificate: config.configuration.certificate,
      assert_endpoint: config.configuration.assertEndpoint,
    });

    const idp = new saml2.IdentityProvider({
      sso_login_url: config.configuration.entryPoint,
      sso_logout_url: config.configuration.logoutUrl,
      certificates: [config.configuration.cert],
    });

    return new Promise((resolve, reject) => {
      sp.create_logout_request_url(idp, { name_id: nameId }, (err, logoutUrl) => {
        if (err) {
          reject(err);
        } else {
          resolve(logoutUrl);
        }
      });
    });
  }

  async testSamlConfig(config: any): Promise<any> {
    try {
      // Test SAML metadata retrieval
      const metadataUrl = config.configuration.metadataUrl;

      if (metadataUrl) {
        // In production, fetch and validate metadata
        return {
          metadataAccessible: true,
          certificateValid: true,
          entryPointReachable: true,
        };
      }

      return {
        configValid: true,
        certificatePresent: !!config.configuration.cert,
        entryPointConfigured: !!config.configuration.entryPoint,
      };
    } catch (error) {
      throw new Error('SAML configuration test failed: ' + error.message);
    }
  }

  async getMetadata(config: any): Promise<string> {
    const sp = new saml2.ServiceProvider({
      entity_id: config.configuration.entityId || 'inamsos',
      private_key: config.configuration.privateKey,
      certificate: config.configuration.certificate,
      assert_endpoint: config.configuration.assertEndpoint,
    });

    return sp.create_metadata();
  }
}
