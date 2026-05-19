import { NextResponse } from 'next/server';

export const runtime = 'edge';

const COOKIE_NAME = 'forge_auth';
const MAX_AGE_DAYS = 30;

function bytesToB64url(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function constantTimeEqual(a, b) {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export async function POST(req) {
  const secret = process.env.AUTH_SECRET;
  const expectedPass = process.env.AUTH_PASSWORD;
  if (!secret || !expectedPass) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
  }

  let password = '';
  try {
    const body = await req.json();
    password = typeof body?.password === 'string' ? body.password : '';
  } catch {}

  if (!constantTimeEqual(password, expectedPass)) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  const expiry = Date.now() + MAX_AGE_DAYS * 86400_000;
  const expStr = String(expiry);
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(expStr));
  const token = `${expStr}.${bytesToB64url(new Uint8Array(sigBuf))}`;

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_DAYS * 86400,
  });
  return res;
}
