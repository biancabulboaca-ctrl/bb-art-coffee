import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await db
    .from('galerii')
    .select('*, tablouri(count)')
    .order('ordine');
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data: max } = await db.from('galerii').select('ordine').order('ordine', { ascending: false }).limit(1);
  const ordine = max && max.length > 0 ? max[0].ordine + 1 : 1;
  const { data, error } = await db.from('galerii').insert([{ ...body, ordine }]).select().single();
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  if (updates.activa === true) {
    await db.from('galerii').update({ activa: false }).neq('id', id);
  }
  const { error } = await db.from('galerii').update(updates).eq('id', id);
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json({ succes: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await db.from('galerii').delete().eq('id', id);
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json({ succes: true });
}
