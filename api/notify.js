export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, table, record } = req.body;

    // Only process INSERT events
    if (type !== 'INSERT') {
      return res.status(200).json({ message: 'Not an INSERT event, skipping' });
    }

    let subject = '';
    let htmlBody = '';

    if (table === 'test_drive') {
      subject = '🚗 Lead Baru: Test Drive - Suzuki NJS Gedebage';
      htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a56db; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">🚗 Permintaan Test Drive Baru</h1>
          </div>
          <div style="padding: 24px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 35%; color: #555;">Nama</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${record.nama || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">No. HP / WA</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${record.no_hp || record.phone || record.whatsapp || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Mobil</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${record.mobil || record.tipe_mobil || record.car || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Tanggal</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${record.tanggal || record.jadwal || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Pesan</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${record.pesan || record.message || record.catatan || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555;">Waktu Submit</td>
                <td style="padding: 10px;">${record.created_at ? new Date(record.created_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : '-'}</td>
              </tr>
            </table>
          </div>
          <div style="background: #1a56db; padding: 14px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 13px;">Suzuki NJS Gedebage · suzukibandungcimahi.vercel.app</p>
          </div>
        </div>
      `;
    } else if (table === 'simulasi_kredit') {
      subject = '💰 Lead Baru: Simulasi Kredit - Suzuki NJS Gedebage';
      htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a56db; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">💰 Permintaan Simulasi Kredit Baru</h1>
          </div>
          <div style="padding: 24px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 35%; color: #555;">Nama</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${record.nama || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">No. HP / WA</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${record.no_hp || record.phone || record.whatsapp || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Mobil</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${record.mobil || record.tipe_mobil || record.car || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Uang Muka (DP)</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${record.dp || record.uang_muka || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Tenor</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${record.tenor ? record.tenor + ' bulan' : '-'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Pesan</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${record.pesan || record.message || record.catatan || '-'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #555;">Waktu Submit</td>
                <td style="padding: 10px;">${record.created_at ? new Date(record.created_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : '-'}</td>
              </tr>
            </table>
          </div>
          <div style="background: #1a56db; padding: 14px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 13px;">Suzuki NJS Gedebage · suzukibandungcimahi.vercel.app</p>
          </div>
        </div>
      `;
    } else {
      return res.status(200).json({ message: `Table '${table}' not handled, skipping` });
    }

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Suzuki NJS <onboarding@resend.dev>',
        to: ['irfan.suzukibdg@gmail.com'],
        subject: subject,
        html: htmlBody,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'Failed to send email', details: data });
    }

    return res.status(200).json({ success: true, emailId: data.id });

  } catch (err) {
    console.error('Notify error:', err);
    return res.status(500).json({ error: err.message });
  }
}
