import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { trimiteNotificareAdmin, trimiteConfirmareClient } from '@/lib/email';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const CAPACITATE_MAX = 12;

// GET /api/rezervari — toate rezervările, cele mai noi primele
export async function GET() {
  const { data, error } = await db
    .from('rezervari')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/rezervari — salvează rezervare nouă + trimite email admin
export async function POST(req: NextRequest) {
  const date = await req.json();
  const { nume, email, telefon, numar_persoane, data, ora } = date;

  if (!nume || !email || !telefon || !numar_persoane || !data || !ora) {
    return NextResponse.json({ eroare: 'Toate câmpurile sunt obligatorii.' }, { status: 400 });
  }

  // Verifică capacitate
  const { data: existente, error: errVerif } = await db
    .from('rezervari')
    .select('numar_persoane')
    .eq('data', data)
    .neq('status', 'respins');

  if (errVerif) return NextResponse.json({ eroare: errVerif.message }, { status: 500 });

  const ocupate = existente.reduce((sum: number, r: { numar_persoane: number }) => sum + r.numar_persoane, 0);
  if (ocupate + numar_persoane > CAPACITATE_MAX) {
    const disponibile = CAPACITATE_MAX - ocupate;
    return NextResponse.json({
      eroare: disponibile <= 0
        ? 'Nu mai sunt locuri disponibile în această zi.'
        : `Mai sunt doar ${disponibile} locuri disponibile în această zi.`,
    }, { status: 409 });
  }

  // Salvează în Supabase
  const { error } = await db.from('rezervari').insert([{ nume, email, telefon, numar_persoane, data, ora }]);
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });

  // Trimite email notificare admin (fără să blocheze răspunsul)
  trimiteNotificareAdmin({ nume, email, telefon, numar_persoane, data, ora }).catch(console.error);

  return NextResponse.json({ succes: true });
}

// PATCH /api/rezervari — schimbă statusul + trimite confirmare dacă e 'confirmat'
export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json();

  if (!id || !status) {
    return NextResponse.json({ eroare: 'id și status sunt obligatorii' }, { status: 400 });
  }

  const statusuriPermise = ['în așteptare', 'confirmat', 'respins'];
  if (!statusuriPermise.includes(status)) {
    return NextResponse.json({ eroare: `Status invalid. Permise: ${statusuriPermise.join(', ')}` }, { status: 400 });
  }

  const { error } = await db.from('rezervari').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });

  // Dacă s-a confirmat, trimite email clientului
  if (status === 'confirmat') {
    const { data: rez } = await db.from('rezervari').select('*').eq('id', id).single();
    if (rez) {
      trimiteConfirmareClient({
        nume: rez.nume,
        email: rez.email,
        numar_persoane: rez.numar_persoane,
        data: rez.data,
        ora: rez.ora,
      }).catch(console.error);
    }
  }

  return NextResponse.json({ succes: true, id, status });
}

// DELETE /api/rezervari — șterge o rezervare
export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ eroare: 'id este obligatoriu' }, { status: 400 });
  }

  const { error } = await db.from('rezervari').delete().eq('id', id);
  if (error) return NextResponse.json({ eroare: error.message }, { status: 500 });
  return NextResponse.json({ succes: true, id });
}
