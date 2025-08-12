import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { id } = body
  
  const {error} = await supabase
    .from('admin')
    .update({last_login: new Date(), is_login: false})
    .eq('id', id)
    .single()
  
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

  const response = NextResponse.json({ success: true, message: 'Logged out successfully' })

  response.cookies.set('auth', '', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24
  })
  return response
}