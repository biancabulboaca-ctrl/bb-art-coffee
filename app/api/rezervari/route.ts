import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/rezervari — toate rezervările, cele mai noi primele
export async function GET() {
  const { data, error } = await db
    .from('rezervari')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH /api/rezervari — schimbă statusul unei rezervări
// Body: { id: number, status: 'confirmată' | 'anulat' | 'în așteptare' }
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ eroare: 'id și status sunt obligatorii' }, { status: 400 });
  }

  const statusuriPermise = ['în așteptare', 'confirmat', 'respins'];
  if (!statusuriPermise.includes(status)) {
    return NextResponse.json({ eroare: `Status invalid. Permise: ${statusuriPermise.join(', ')}` }, { status: 400 });
  }

  const { error } = await db
    .from('rezervari')
    .update({ status })
    .eq('id', id);

  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json({ succes: true, id, status });
}

// DELETE /api/rezervari — șterge o rezervare
// Body: { id: number }
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ eroare: 'id este obligatoriu' }, { status: 400 });
  }

  const { error } = await db
    .from('rezervari')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json({ succes: true, id });
}
