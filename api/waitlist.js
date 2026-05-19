export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, major } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Huntly Waitlist <onboarding@resend.dev>',
        to: [email],
        reply_to: 'your@email.com',
        subject: "You're on the Huntly waitlist 🎉",
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #0f0f10;">
            <div style="margin-bottom: 32px;">
              <span style="background: #0f0f10; color: #fff; font-weight: 700; font-size: 16px; padding: 6px 14px; border-radius: 100px; letter-spacing: -0.3px;">● Huntly</span>
            </div>

            <h1 style="font-size: 28px; font-weight: 800; letter-spacing: -1px; margin: 0 0 12px;">
              You're on the list, ${name.split(' ')[0]}!
            </h1>

            <p style="font-size: 16px; color: #4a4a52; line-height: 1.7; margin: 0 0 24px;">
              Thanks for joining the Huntly waitlist. We're onboarding students weekly and you'll be among the first to get access when we launch.
            </p>

            <div style="background: #f3f3ef; border-radius: 14px; padding: 20px 24px; margin-bottom: 28px;">
              <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #9191a0;">Your details</p>
              <p style="margin: 0; font-size: 14px; color: #0f0f10;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 4px 0 0; font-size: 14px; color: #0f0f10;"><strong>Email:</strong> ${email}</p>
              ${major ? `<p style="margin: 4px 0 0; font-size: 14px; color: #0f0f10;"><strong>Major:</strong> ${major}</p>` : ''}
            </div>

            <p style="font-size: 14px; color: #4a4a52; line-height: 1.7; margin: 0 0 32px;">
              In the meantime, spread the word to classmates who are also job hunting. The more students we onboard together, the better the matches get.
            </p>

            <p style="font-size: 13px; color: #9191a0; margin: 0;">
              Made for students, by students · <a href="#" style="color: #9191a0;">Unsubscribe</a>
            </p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
