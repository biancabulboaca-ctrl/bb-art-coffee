import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const db = createClient(url, key);

const CAPACITATE_MAX = 12;

export async function salveazaRezervare(date: {
  nume: string;
  email: string;
  telefon: string;
  numar_persoane: number;
  data: string;
  ora: string;
}) {
  const { data: existente, error: errVerif } = await db
    .from('rezervari')
    .select('numar_persoane')
    .eq('data', date.data)
    .neq('status', 'respins');

  if (errVerif) throw errVerif;

  const ocupate = existente.reduce((sum: number, r: { numar_persoane: number }) => sum + r.numar_persoane, 0);

  if (ocupate + date.numar_persoane > CAPACITATE_MAX) {
    const disponibile = CAPACITATE_MAX - ocupate;
    throw new Error(
      disponibile <= 0
        ? 'Nu mai sunt locuri disponibile în această zi.'
        : `Mai sunt doar ${disponibile} locuri disponibile în această zi.`
    );
  }

  const { error } = await db.from('rezervari').insert([date]);
  if (error) throw error;
}
