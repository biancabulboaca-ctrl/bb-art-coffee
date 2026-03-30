import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'BB Art Caffè <onboarding@resend.dev>';
const LUNI = ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie',
               'Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'];

function dataFrumos(str: string) {
  const [y, m, z] = str.split('-');
  return `${z} ${LUNI[Number(m) - 1]} ${y}`;
}

function genereazaICS(rezervare: {
  nume: string;
  data: string;
  ora: string;
  numar_persoane: number;
}) {
  const [an, luna, zi] = rezervare.data.split('-');
  const [ore, minute] = rezervare.ora.split(':');

  const start = `${an}${luna}${zi}T${ore}${minute}00`;
  const oreEnd = String(Number(ore) + 1).padStart(2, '0');
  const end   = `${an}${luna}${zi}T${oreEnd}${minute}00`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BB Art Caffe//Rezervare//RO',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Rezervare BB Art Caffè`,
    `DESCRIPTION:Rezervare pentru ${rezervare.numar_persoane} ${rezervare.numar_persoane === 1 ? 'persoană' : 'persoane'} pe numele ${rezervare.nume}.`,
    'LOCATION:Strada Nicolae Bălcescu nr. 17\\, Sibiu',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Rezervare BB Art Caffè în 1 oră!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export async function trimiteNotificareAdmin(rezervare: {
  nume: string;
  email: string;
  telefon: string;
  numar_persoane: number;
  data: string;
  ora: string;
}) {
  await resend.emails.send({
    from: FROM,
    to: process.env.ADMIN_EMAIL!,
    subject: `Rezervare nouă – ${rezervare.nume}, ${dataFrumos(rezervare.data)}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#14B8A6;margin-bottom:4px">Rezervare nouă</h2>
        <p style="color:#666;margin-top:0">BB Art Caffè · Sibiu</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <tr><td style="padding:8px 0;color:#999;width:140px">Nume</td><td style="font-weight:600">${rezervare.nume}</td></tr>
          <tr><td style="padding:8px 0;color:#999">Data</td><td style="font-weight:600">${dataFrumos(rezervare.data)}</td></tr>
          <tr><td style="padding:8px 0;color:#999">Ora</td><td style="font-weight:600">${rezervare.ora}</td></tr>
          <tr><td style="padding:8px 0;color:#999">Persoane</td><td style="font-weight:600">${rezervare.numar_persoane}</td></tr>
          <tr><td style="padding:8px 0;color:#999">Email</td><td>${rezervare.email}</td></tr>
          <tr><td style="padding:8px 0;color:#999">Telefon</td><td>${rezervare.telefon}</td></tr>
        </table>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bb-art-coffee.vercel.app'}/admin"
           style="display:inline-block;margin-top:24px;padding:12px 24px;background:#14B8A6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
          Vezi în Admin
        </a>
      </div>
    `,
  });
}

export async function trimiteConfirmareClient(rezervare: {
  nume: string;
  email: string;
  numar_persoane: number;
  data: string;
  ora: string;
}) {
  const ics = genereazaICS(rezervare);

  await resend.emails.send({
    from: FROM,
    to: rezervare.email,
    subject: `Rezervare confirmată – ${dataFrumos(rezervare.data)}, ora ${rezervare.ora}`,
    attachments: [
      {
        filename: 'rezervare-bb-art-caffe.ics',
        content: Buffer.from(ics).toString('base64'),
      },
    ],
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#14B8A6;margin-bottom:4px">Rezervare confirmată!</h2>
        <p style="color:#666;margin-top:0">BB Art Caffè · Strada Nicolae Bălcescu nr. 17, Sibiu</p>
        <p>Bună <strong>${rezervare.nume}</strong>,</p>
        <p>Rezervarea ta a fost confirmată. Abia așteptăm să te vedem!</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;background:#f9fafb;border-radius:8px;padding:16px">
          <tr><td style="padding:8px 0;color:#999;width:120px">Data</td><td style="font-weight:600">${dataFrumos(rezervare.data)}</td></tr>
          <tr><td style="padding:8px 0;color:#999">Ora</td><td style="font-weight:600">${rezervare.ora}</td></tr>
          <tr><td style="padding:8px 0;color:#999">Persoane</td><td style="font-weight:600">${rezervare.numar_persoane}</td></tr>
        </table>
        <p style="color:#666;margin-top:24px;font-size:14px">
          📎 Am atașat un fișier <strong>.ics</strong> — deschide-l pentru a adăuga rezervarea în Google Calendar, Apple Calendar sau Outlook.
        </p>
        <p style="color:#999;font-size:12px;margin-top:32px">BB Art Caffè · contact@bbartcoffee.ro</p>
      </div>
    `,
  });
}
