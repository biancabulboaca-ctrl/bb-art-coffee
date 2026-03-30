import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await db
    .from('categorii')
    .select('*, produse(count)')
    .order('ordine');
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { nume } = await req.json();
  const { data: max } = await db.from('categorii').select('ordine').order('ordine', { ascending: false }).limit(1);
  const ordine = max && max.length > 0 ? max[0].ordine + 1 : 1;
  const { data, error } = await db.from('categorii').insert([{ nume, ordine }]).select().single();
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const { id, nume, ordine } = await req.json();
  const updates: Record<string, unknown> = {};
  if (nume !== undefined) updates.nume = nume;
  if (ordine !== undefined) updates.ordine = ordine;
  const { error } = await db.from('categorii').update(updates).eq('id', id);
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json({ succes: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const { data: produse } = await db.from('produse').select('id').eq('categorie_id', id).limit(1);
  if (produse && produse.length > 0)
    return NextResponse.json({ eroare: 'Categoria are produse asociate.' }, { status: 409 });
  const { error } = await db.from('categorii').delete().eq('id', id);
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json({ succes: true });
}
