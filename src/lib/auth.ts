import { cookies } from 'next/headers';
import { Admin } from '@/models/admin.model';
import { connectDB } from './db';

export async function checkAuth() {
  try {
    const adminId = (await cookies()).get('adminId')?.value;

    if (!adminId) {
      return null;
    }

    await connectDB();
    const admin = await Admin.findById(adminId).select('-password');
    
    return admin;
  } catch (error) {
    console.error('Auth check error:', error);
    return null;
  }
}
export async function logout() {
  (await cookies()).delete('adminId');
}
