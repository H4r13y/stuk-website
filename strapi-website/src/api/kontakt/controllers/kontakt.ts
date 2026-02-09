/**
 * Kontakt Controller - versendet E-Mails über das Strapi Email Plugin
 */

/**
 * Validiert das Cloudflare Turnstile Token
 */
async function validateTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY || '0x4AAAAAACZyLFD4mMAmHUU0o_-FswVAdWg';

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const result = await response.json() as { success: boolean };
    return result.success === true;
  } catch (error) {
    console.error('Turnstile validation error:', error);
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
      // const emailRecipients = {
      //   general: 'kontakt@stuk-leipzig.de',
      //   booking: 'booking@stuk-leipzig.de',
      //   lost: 'fundsachen@stuk-leipzig.de',
      //   board: 'vorstand@stuk-leipzig.de',
      //   join: 'mitmachen@stuk-leipzig.de',
      //   awareness: 'awareness@stuk-leipzig.de',
      // };

      const emailRecipients = {
        general: 'vorstand@stuk-leipzig.de',
        booking: 'vorstand@stuk-leipzig.de',
        lost: 'vorstand@stuk-leipzig.de',
        board: 'vorstand@stuk-leipzig.de',
        join: 'vorstand@stuk-leipzig.de',
        awareness: 'vorstand@stuk-leipzig.de',
      };

      // const recipient = emailRecipients[formType] || 'kontakt@stuk-leipzig.de';

      const recipient = emailRecipients[formType] || 'vorstand@stuk-leipzig.de';

      // E-Mail-Betreff basierend auf Formulartyp
      const subjectMap = {
        general: 'Neue allgemeine Anfrage',
        booking: 'Neue Buchungsanfrage',
        lost: 'Fundsachen-Anfrage',
        board: 'Anfrage an Vorstand',
        join: 'Neue Bewerbung',
        awareness: '[AWARENESS] Neue Meldung',
      };

      const subject = subjectMap[formType] || 'Neue Kontaktanfrage';

      // E-Mail-Body formatieren
      let emailBody = '';

      switch (formType) {
        case 'general':
          emailBody = `
Neue allgemeine Anfrage über das Kontaktformular:

Name: ${data.name}
E-Mail: ${data.email}

Nachricht:
${data.message}
          `;
          break;

        case 'booking':
          emailBody = `
Neue Buchungsanfrage über das Kontaktformular:

=== Persönliche Daten ===
Name: ${data.name}
E-Mail: ${data.email}
Telefon: ${data.phone || 'Nicht angegeben'}

=== Termin ===
Verbindlichkeit: ${data.binding}
Wunschdatum: ${data.date}
Alternativdatum: ${data.alternativeDate || 'Nicht angegeben'}

=== Band / Act ===
Name: ${data.bandName}
Stilrichtung: ${data.genre}
Heimatstadt: ${data.hometown}
Anzahl Personen: ${data.members}
Webseite/Social: ${data.website || 'Nicht angegeben'}
GEMA-Pflicht: ${data.gema}

=== Sonstiges ===
${data.notes || 'Keine weiteren Anmerkungen'}
          `;
          break;

        case 'lost':
          emailBody = `
Neue Fundsachen-Anfrage:

Name: ${data.name}
E-Mail: ${data.email}
Event / Datum: ${data.event}

Beschreibung des verlorenen Gegenstands:
${data.description}
          `;
          break;

        case 'board':
          emailBody = `
Neue Anfrage an den Vorstand:

Name / Organisation: ${data.name}
E-Mail: ${data.email}
Betreff: ${data.subject}

Nachricht:
${data.message}
          `;
          break;

        case 'join':
          emailBody = `
Neue Bewerbung:

Name: ${data.name}
E-Mail: ${data.email}
Telefon: ${data.phone || 'Nicht angegeben'}
Gewünschter Bereich: ${data.area}
          `;
          break;

        case 'awareness':
          emailBody = `
[AWARENESS] Neue anonyme Meldung

Event / Datum: ${data.event || 'Nicht angegeben'}

Beschreibung des Vorfalls:
${data.description}

HINWEIS: Diese Meldung wurde anonym eingereicht. Kontaktdaten wurden nicht erfasst.
          `;
          break;

        default:
          emailBody = `
Neue Kontaktanfrage:

${JSON.stringify(data, null, 2)}
          `;
      }

      // E-Mail über Strapi Email Plugin versenden
      await strapi.plugins.email.services.email.send({
        to: recipient,
        from: process.env.SMTP_DEFAULT_FROM || 'kontakt@stuk-leipzig.de',
        replyTo: data.email || process.env.SMTP_DEFAULT_REPLY_TO,
        subject: subject,
        text: emailBody,
      });

      // Bestätigungs-E-Mail an Absender (optional, außer bei Awareness)
      if (formType !== 'awareness' && data.email) {
        const confirmationMessages = {
          general: 'Vielen Dank für deine Nachricht! Wir melden uns bald bei dir.',
          booking: 'Vielen Dank für deine Buchungsanfrage! Wir prüfen die Verfügbarkeit und melden uns schnellstmöglich.',
          lost: 'Vielen Dank für deine Anfrage! Wir schauen nach deinem verlorenen Gegenstand.',
          board: 'Vielen Dank für deine Nachricht an den Vorstand. Wir melden uns bald.',
          join: 'Vielen Dank für dein Interesse am StuK! Wir melden uns zeitnah bei dir.',
        };

        const confirmationText = confirmationMessages[formType] || 'Vielen Dank für deine Nachricht!';

        await strapi.plugins.email.services.email.send({
          to: data.email,
          from: process.env.SMTP_DEFAULT_FROM || 'kontakt@stuk-leipzig.de',
          subject: `Bestätigung: ${subject}`,
          text: `
Hallo ${data.name || 'liebe/r Interessent/in'},

${confirmationText}

Deine Anfrage wurde erfolgreich bei uns eingereicht.

Viele Grüße
Das StuK-Team

---
StuK Leipzig
Nürnberger Straße 42
04103 Leipzig
www.stuk-leipzig.de
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
