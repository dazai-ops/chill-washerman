import { supabase } from "@/app/utils/supabaseClient"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const body = await req.json()
  const { username, password } = body

  const { data, error } = await supabase
    .from('admin')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !data) {
    return NextResponse.json({ success:false, error: 'Invalid credentials' }, { status: 401 })
  }

  const passwordMatch = await bcrypt.compare(password, data.password_hash)

  if (error || !passwordMatch) {
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
  }

  const user = {
    id: data.id,
    nama: data.nama,
    username: data.username,
    role: data.role
  }
  const response = NextResponse.json({ 
    user,
    success: true
  })

  response.cookies.set('auth', 'true', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24
  })

  return response
}