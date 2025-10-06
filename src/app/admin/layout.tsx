import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { validateAuthToken } from '@/lib/auth';
import User from '@/models/User';

async function checkAdminAccess() {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie');
    
    if (!cookieHeader) {
      redirect('/auth/signin');
    }
    
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    
    const token = cookies.token;
    if (!token) {
      redirect('/auth/signin');
    }

    await dbConnect();
    const payload = validateAuthToken(token);
    const user = await User.findById(payload.userId);

    if (!user || user.role !== 'admin') {
      redirect('/');
    }

    return { user };
  } catch (error) {
    redirect('/auth/signin');
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkAdminAccess();

  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}