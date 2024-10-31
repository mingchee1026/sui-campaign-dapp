import { Provider } from "@radix-ui/react-tooltip";

export type OpenIdProvider = "Google" | "Twitch" | "Facebook" | "Apple";

export interface OpenIdProviderObject {
  provider: OpenIdProvider;
  logo: string;
}

export interface LoginResponse {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  nbf: number;
  exp: number;
  iat: number;
  jti: string;
  nonce: string;
}

export interface UserKeyData {
  provider: OpenIdProvider;
  randomness: string;
  nonce: string;
  ephemeralPublicKey: string;
  ephemeralPrivateKey: string;
  maxEpoch: number;
}

export interface GetSaltRequest {
  jwt: string;
  subject: string;
}

export interface GetSaltResponse {
  subject: string;
  salt: string;
}

export interface ZKPRequest {
  zkpPayload: ZKPPayload;
  forceUpdate: boolean;
}
export interface ZKPPayload {
  jwt: string;
  extendedEphemeralPublicKey: string;
  jwtRandomness: string;
  maxEpoch: number;
  salt: string;
  keyClaimName: string;
}
