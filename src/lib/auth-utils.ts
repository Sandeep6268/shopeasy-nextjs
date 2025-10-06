// lib/auth-utils.ts - NEW FILE
import { cookies } from 'next/headers';

export async function getTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value || null;
  } catch (error) {
    console.error('Error getting token from cookies:', error);
    return null;
  }
}

export async function verifyAdminAccess(): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const token = await getTokenFromCookies();
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }

    const { validateAuthToken } = await import('@/lib/auth');
    const payload = validateAuthToken(token);
    
    const User = (await import('@/models/User')).default;
    const user = await User.findById(payload.userId);
    
    if (!user || user.role !== 'admin') {
      return { success: false, error: 'Admin access required' };
    }

    return { success: true, user };
  } catch (error) {
    console.error('Admin access verification error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}