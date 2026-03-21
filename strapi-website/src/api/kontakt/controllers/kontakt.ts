/**
 * Kontakt Controller - versendet E-Mails über das Strapi Email Plugin
 */

/**
 * Validiert das Cloudflare Turnstile Token
 */
async function validateTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    strapi?.log?.error?.('TURNSTILE_SECRET_KEY fehlt');
    return false;
  }

  try {
    const body = new URLSearchParams();
    body.set('secret', secretKey);
    body.set('response', token);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const result = await response.json() as {
      success: boolean;
      'error-codes'?: string[];
      hostname?: string;
      action?: string;
      cdata?: string;
    };

    if (!result.success) {
      strapi?.log?.warn?.(`Turnstile fail: ${JSON.stringify(result)}`);
    }

    return result.success === true;
  } catch (error) {
    strapi?.log?.error?.('Turnstile validation error', error);
    return false;
  }
}


export default {
  async sendEmail(ctx) {
    try {
      const { formType, data, turnstileToken } = ctx.request.body;

      if (!formType || !data) {
        return ctx.badRequest('Formulartyp und Daten sind erforderlich');
      }

      // Validiere Turnstile Token
      if (!turnstileToken) {
        return ctx.badRequest('Captcha-Token fehlt');
      }

      const isValidToken = await validateTurnstileToken(turnstileToken);
      if (!isValidToken) {
        return ctx.badRequest('Ungültiges Captcha-Token');
      }

      // Email-Empfänger basierend auf Formulartyp
      const emailRecipients = {
        general: 'kontakt@stuk-leipzig.de',
        booking: 'booking@stuk-leipzig.de',
        lost: 'fundsachen@stuk-leipzig.de',
        board: 'vorstand@stuk-leipzig.de',
        join: 'mitmachen@stuk-leipzig.de',
        awareness: 'awareness@stuk-leipzig.de',
      };

      // const emailRecipients = {
      //   general: 'vorstand@stuk-leipzig.de',
      //   booking: 'vorstand@stuk-leipzig.de',
      //   lost: 'vorstand@stuk-leipzig.de',
      //   board: 'vorstand@stuk-leipzig.de',
      //   join: 'vorstand@stuk-leipzig.de',
      //   awareness: 'vorstand@stuk-leipzig.de',
      //   pfand: 'vorstand@stuk-leipzig.de',
      // };

      const recipient = emailRecipients[formType] || 'kontakt@stuk-leipzig.de';

      // const recipient = emailRecipients[formType] || 'vorstand@stuk-leipzig.de';

      // E-Mail-Betreff basierend auf Formulartyp
      const subjectMap = {
        general: 'Neue allgemeine Anfrage',
        booking: 'Neue Buchungsanfrage',
        lost: 'Fundsachen-Anfrage',
        board: 'Anfrage an Vorstand',
        join: 'Neue Bewerbung',
        awareness: '[AWARENESS] Neue Meldung',
        pfand: 'Neue Pfand-Bewerbung',
      };

      const subject = subjectMap[formType] || 'Neue Kontaktanfrage';

      // E-Mail-Body als HTML formatieren
      let emailBody = '';

      switch (formType) {
        case 'general':
          emailBody = `
<h2>Neue allgemeine Anfrage über das Kontaktformular</h2>
<p><strong>Name:</strong> ${data.name}<br>
<strong>E-Mail:</strong> ${data.email}</p>
<h3>Nachricht</h3>
<p>${(data.message || '').replace(/\n/g, '<br>')}</p>
          `;
          break;

        case 'booking':
          emailBody = `
<h2>Neue Buchungsanfrage über das Kontaktformular</h2>
<h3>Persönliche Daten</h3>
<p><strong>Name:</strong> ${data.name}<br>
<strong>E-Mail:</strong> ${data.email}<br>
<strong>Telefon:</strong> ${data.phone || 'Nicht angegeben'}</p>
<h3>Termin</h3>
<p><strong>Verbindlichkeit:</strong> ${data.binding}<br>
<strong>Wunschdatum:</strong> ${data.date}<br>
<strong>Alternativdatum:</strong> ${data.alternativeDate || 'Nicht angegeben'}</p>
<h3>Band / Act</h3>
<p><strong>Name:</strong> ${data.bandName}<br>
<strong>Stilrichtung:</strong> ${data.genre}<br>
<strong>Heimatstadt:</strong> ${data.hometown}<br>
<strong>Anzahl Personen:</strong> ${data.members}<br>
<strong>Webseite/Social:</strong> ${data.website || 'Nicht angegeben'}<br>
<strong>GEMA-Pflicht:</strong> ${data.gema}</p>
<h3>Sonstiges</h3>
<p>${(data.notes || 'Keine weiteren Anmerkungen').replace(/\n/g, '<br>')}</p>
          `;
          break;

        case 'lost':
          emailBody = `
<h2>Neue Fundsachen-Anfrage</h2>
<p><strong>Name:</strong> ${data.name}<br>
<strong>E-Mail:</strong> ${data.email}<br>
<strong>Event / Datum:</strong> ${data.event}</p>
<h3>Beschreibung des verlorenen Gegenstands</h3>
<p>${(data.description || '').replace(/\n/g, '<br>')}</p>
          `;
          break;

        case 'board':
          emailBody = `
<h2>Neue Anfrage an den Vorstand</h2>
<p><strong>Name / Organisation:</strong> ${data.name}<br>
<strong>E-Mail:</strong> ${data.email}<br>
<strong>Betreff:</strong> ${data.subject}</p>
<h3>Nachricht</h3>
<p>${(data.message || '').replace(/\n/g, '<br>')}</p>
          `;
          break;

        case 'join':
          emailBody = `
<h2>Neue Bewerbung</h2>
<p><strong>Name:</strong> ${data.name}<br>
<strong>E-Mail:</strong> ${data.email}<br>
<strong>Telefon:</strong> ${data.phone || 'Nicht angegeben'}<br>
<strong>Gewünschter Bereich:</strong> ${data.area}</p>
          `;
          break;

        case 'awareness':
          emailBody = `
<h2>[AWARENESS] Neue anonyme Meldung</h2>
<p><strong>Event / Datum:</strong> ${data.event || 'Nicht angegeben'}</p>
<h3>Beschreibung des Vorfalls</h3>
<p>${(data.description || '').replace(/\n/g, '<br>')}</p>
<hr>
<p><em>HINWEIS: Diese Meldung wurde anonym eingereicht. Kontaktdaten wurden nicht erfasst.</em></p>
          `;
          break;

        case 'pfand':
          emailBody = `
<h2>Neue Pfand-Bewerbung (über Pfandmarken-Seite)</h2>
<p><strong>Name:</strong> ${data.name}<br>
<strong>E-Mail:</strong> ${data.email}<br>
<strong>Telefon:</strong> ${data.phone || 'Nicht angegeben'}</p>
<hr>
<p><em>HINWEIS: Diese Bewerbung kam über die humorvolle Pfandmarken-Seite.</em></p>
          `;
          break;

        default:
          emailBody = `
<h2>Neue Kontaktanfrage</h2>
<pre>${JSON.stringify(data, null, 2)}</pre>
          `;
      }

      // E-Mail über Strapi Email Plugin versenden
      await strapi.plugins.email.services.email.send({
        to: recipient,
        from: process.env.SMTP_DEFAULT_FROM || 'kontakt@stuk-leipzig.de',
        replyTo: data.email || process.env.SMTP_DEFAULT_REPLY_TO,
        subject: subject,
        html: emailBody,
      });

      // Bestätigungs-E-Mail an Absender (optional, außer bei Awareness)
      if (formType !== 'awareness' && data.email) {
        const confirmationMessages = {
          general: 'Vielen Dank für deine Nachricht! Wir melden uns bald bei dir.',
          booking: 'Vielen Dank für deine Buchungsanfrage! Wir prüfen die Verfügbarkeit und melden uns schnellstmöglich.',
          lost: 'Vielen Dank für deine Anfrage! Wir schauen nach deinem verlorenen Gegenstand.',
          board: 'Vielen Dank für deine Nachricht an den Vorstand. Wir melden uns bald.',
          join: 'Vielen Dank für dein Interesse am StuK! Wir melden uns zeitnah bei dir.',
          pfand: 'Vielen Dank für dein Interesse am StuK! Wir melden uns zeitnah bei dir.',
        };

        const confirmationText = confirmationMessages[formType] || 'Vielen Dank für deine Nachricht!';

        await strapi.plugins.email.services.email.send({
          to: data.email,
          from: process.env.SMTP_DEFAULT_FROM || 'kontakt@stuk-leipzig.de',
          subject: `Bestätigung: ${subject}`,
          html: `
<p>Hallo ${data.name || 'liebe/r Interessent/in'},</p>
<p>${confirmationText}</p>
<p>Deine Anfrage wurde erfolgreich bei uns eingereicht.</p>
<p>Viele Grüße<br>
Das StuK-Team</p>
<hr>
<p><small>StuK Leipzig<br>
Nürnberger Straße 42<br>
04103 Leipzig<br>
www.stuk-leipzig.de</small></p>
          `,
        });
      }

      return ctx.send({
        success: true,
        message: 'E-Mail erfolgreich versendet',
      });
    } catch (error) {
      strapi.log.error('Fehler beim E-Mail-Versand:', error);

      // Detailliertes Error-Logging
      console.error('=== E-Mail Versand Fehler ===');
      console.error('Error:', error);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);

      return ctx.badRequest({
        message: 'Fehler beim E-Mail-Versand',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },
};
