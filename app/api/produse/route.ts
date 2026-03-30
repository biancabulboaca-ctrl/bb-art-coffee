import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await db
    .from('produse')
    .select('*, categorii(id, nume)')
    .order('ordine');
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { categorie_id, nume, descriere, pret } = await req.json();
  const { data: max } = await db.from('produse').select('ordine').order('ordine', { ascending: false }).limit(1);
  const ordine = max && max.length > 0 ? max[0].ordine + 1 : 1;
  const { data, error } = await db
    .from('produse')
    .insert([{ categorie_id, nume, descriere, pret, ordine, disponibil: true }])
    .select().single();
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, ...updates } = await req.json();
  const { error } = await db.from('produse').update(updates).eq('id', id);
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json({ succes: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { error } = await db.from('produse').delete().eq('id', id);
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json({ succes: true });
}
