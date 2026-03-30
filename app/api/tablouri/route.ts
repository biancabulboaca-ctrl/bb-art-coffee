import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const galerieId = searchParams.get('galerie_id');
  let query = db.from('tablouri').select('*').order('ordine');
  if (galerieId) query = query.eq('galerie_id', galerieId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data: max } = await db.from('tablouri').select('ordine').order('ordine', { ascending: false }).limit(1);
  const ordine = max && max.length > 0 ? max[0].ordine + 1 : 1;
  const { data, error } = await db.from('tablouri').insert([{ ...body, ordine }]).select().single();
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  const { error } = await db.from('tablouri').update(updates).eq('id', id);
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json({ succes: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await db.from('tablouri').delete().eq('id', id);
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json({ succes: true });
}
