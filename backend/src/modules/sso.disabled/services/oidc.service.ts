import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as oauth from 'openid-client';

@Injectable()
export class OidcService {
  async validateOidcToken(token: string, config: any): Promise<any> {
    try {
      // Discover OIDC provider configuration
      const issuerUrl = new URL(config.configuration.issuer);
      const discoveryResponse = await oauth.discovery(issuerUrl, config.configuration.clientId);

      // Fetch user info using access token
      const userinfo = await oauth.fetchUserInfo(
        discoveryResponse,
        token,
        config.configuration.clientId,
      );

      return userinfo;
    } catch (error) {
      throw new UnauthorizedException('OIDC token validation failed: ' + error.message);
    }
  }

  async getAuthorizationUrl(config: any): Promise<{ url: string; state: string; nonce: string }> {
    try {
      const issuerUrl = new URL(config.configuration.issuer);
      const discoveryResponse = await oauth.discovery(issuerUrl, config.configuration.clientId);

      const state = oauth.randomState();
      const nonce = oauth.randomNonce();
      const codeVerifier = oauth.randomPKCECodeVerifier();
      const codeChallenge = await oauth.calculatePKCECodeChallenge(codeVerifier);

      const authorizationUrl = oauth.buildAuthorizationUrl(discoveryResponse, {
        client_id: config.configuration.clientId,
        redirect_uri: config.configuration.redirectUri,
        scope: config.configuration.scope || 'openid email profile',
        state,
        nonce,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });

      return { url: authorizationUrl.href, state, nonce };
    } catch (error) {
      throw new Error('Failed to generate authorization URL: ' + error.message);
    }
  }

  async exchangeCodeForToken(code: string, config: any, redirectUri: string): Promise<any> {
    try {
      const issuerUrl = new URL(config.configuration.issuer);
      const discoveryResponse = await oauth.discovery(issuerUrl, config.configuration.clientId);

      // This is a simplified implementation - in production you'd need to store the code_verifier
      // from the authorization request and use it here
      const codeVerifier = oauth.randomPKCECodeVerifier(); // This should be retrieved from session/storage

      const tokens = await oauth.authorizationCodeGrant(
        discoveryResponse,
        new URLSearchParams({
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
        {
          client_id: config.configuration.clientId,
          client_secret: config.configuration.clientSecret,
        },
      );

      const userinfo = await oauth.fetchUserInfo(
        discoveryResponse,
        tokens.access_token,
        config.configuration.clientId,
      );

      return {
        tokens,
        userinfo,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to exchange code for token: ' + error.message);
    }
  }

  async refreshToken(refreshToken: string, config: any): Promise<any> {
    try {
      const issuerUrl = new URL(config.configuration.issuer);
      const discoveryResponse = await oauth.discovery(issuerUrl, config.configuration.clientId);

      const tokens = await oauth.refreshTokenGrant(discoveryResponse, refreshToken, {
        client_id: config.configuration.clientId,
        client_secret: config.configuration.clientSecret,
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Failed to refresh token: ' + error.message);
    }
  }

  async logout(token: string, config: any): Promise<string> {
    try {
      const issuerUrl = new URL(config.configuration.issuer);
      const discoveryResponse = await oauth.discovery(issuerUrl, config.configuration.clientId);

      const logoutUrl = oauth.buildEndSessionUrl(discoveryResponse, {
        client_id: config.configuration.clientId,
        id_token_hint: token,
        post_logout_redirect_uri: config.configuration.postLogoutRedirectUri,
      });

      return logoutUrl.href;
    } catch (error) {
      throw new Error('Failed to generate logout URL: ' + error.message);
    }
  }

  async testOidcConfig(config: any): Promise<any> {
    try {
      // Test OIDC discovery
      const issuerUrl = new URL(config.configuration.issuer);
      const discoveryResponse = await oauth.discovery(issuerUrl, config.configuration.clientId);

      return {
        discoverySuccessful: true,
        issuer: discoveryResponse.issuer,
        authorizationEndpoint: discoveryResponse.authorization_endpoint,
        tokenEndpoint: discoveryResponse.token_endpoint,
        userinfoEndpoint: discoveryResponse.userinfo_endpoint,
        jwksUri: discoveryResponse.jwks_uri,
      };
    } catch (error) {
      throw new Error('OIDC configuration test failed: ' + error.message);
    }
  }

  async introspectToken(token: string, config: any): Promise<any> {
    try {
      const issuerUrl = new URL(config.configuration.issuer);
      const discoveryResponse = await oauth.discovery(issuerUrl, config.configuration.clientId);

      const introspection = await oauth.tokenIntrospection(
        discoveryResponse,
        token,
        {
          client_id: config.configuration.clientId,
          client_secret: config.configuration.clientSecret,
        },
      );

      return introspection;
    } catch (error) {
      throw new Error('Token introspection failed: ' + error.message);
    }
  }
}
