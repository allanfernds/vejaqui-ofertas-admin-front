export type SystemRole = "USER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  systemRole: SystemRole;
  createdAt: string;
  updatedAt: string;
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  termsAccepted: true;
  termsVersion: string;
  privacyPolicyAccepted: true;
  privacyPolicyVersion: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

export interface AuthPort {
  signUp(input: SignUpInput): Promise<AuthSession>;
  signIn(input: SignInInput): Promise<AuthSession>;
  signOut(): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  getAccessToken(): Promise<string | null>;
}
