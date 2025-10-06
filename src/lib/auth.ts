// lib/auth.ts - REMOVE authOptions export
import { generateToken, verifyToken, JWTPayload } from './jwt';

export async function createAuthToken(user: {
  _id: any;
  email: string;
  name?: string;
}): Promise<string> {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
  };

  console.log('🔍 [AUTH] Creating token with payload:', payload);
  
  const token = generateToken(payload);
  console.log('🔍 [AUTH] Generated token type:', typeof token, 'length:', token.length);
  
  return token;
}

export function validateAuthToken(token: string): JWTPayload {
  console.log('🔍 [AUTH] Validating token, type:', typeof token, 'length:', token.length);
  return verifyToken(token);
}

export function setAuthCookie(token: string): string {
  // This will be used in API routes to set the HTTP-only cookie
  return `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800`; // 7 days
}

export function clearAuthCookie(): string {
  return 'token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0';
}

// REMOVE THIS - You don't need authOptions for your custom JWT system
// export const authOptions = {
//   // This is a placeholder to fix the import error
//   // In a real implementation, you would configure your auth options here
// };