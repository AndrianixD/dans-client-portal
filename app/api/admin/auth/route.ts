import { NextRequest, NextResponse } from 'next/server';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'dansauto2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Rocket2025!';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Validar credenciais
    if (username.trim() === ADMIN_USERNAME && password.trim() === ADMIN_PASSWORD) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
      });
    }

    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error in admin auth:', error);
    return NextResponse.json(
      { error: 'Error authenticating' },
      { status: 500 }
    );
  }
}

