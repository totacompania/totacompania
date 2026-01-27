import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectDB from "@/lib/mongodb";
import { NewsletterSubscriber, Setting } from "@/models";

interface SendRequest {
  subject: string;
  htmlContent: string;
  testEmail?: string;
  sendToAll?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: SendRequest = await request.json();
    const { subject, htmlContent, testEmail, sendToAll } = body;

    if (!subject || !htmlContent) {
      return NextResponse.json(
        { error: "Sujet et contenu requis" },
        { status: 400 }
      );
    }

    // Get SMTP settings from database
    const smtpSetting = await Setting.findOne({ key: "smtp_settings" });

    if (!smtpSetting || !smtpSetting.value) {
      return NextResponse.json(
        { error: "Configuration SMTP non definie. Configurez les parametres SMTP dans les reglages." },
        { status: 400 }
      );
    }

    const smtp = typeof smtpSetting.value === "string" ? JSON.parse(smtpSetting.value) : smtpSetting.value;

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: parseInt(smtp.port) || 587,
      secure: smtp.secure === true || smtp.port === "465",
      auth: {
        user: smtp.user,
        pass: smtp.password
      }
    });

    // Get site URL for unsubscribe links
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://totacompania.fr";
    const fromName = smtp.fromName || "Tota Compania";
    const fromEmail = smtp.fromEmail || smtp.user;

    // Test mode: send to single email
    if (testEmail) {
      const htmlWithUnsubscribe = htmlContent + getUnsubscribeFooter(siteUrl, "test-token");

      await transporter.sendMail({
        from: fromName + " <" + fromEmail + ">",
        to: testEmail,
        subject: "[TEST] " + subject,
        html: htmlWithUnsubscribe
      });

      return NextResponse.json({
        success: true,
        message: "Email de test envoye a " + testEmail
      });
    }

    // Send to all active subscribers
    if (sendToAll) {
      const subscribers = await NewsletterSubscriber.find({ status: "active" });

      if (subscribers.length === 0) {
        return NextResponse.json(
          { error: "Aucun abonne actif" },
          { status: 400 }
        );
      }

      let sent = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const subscriber of subscribers) {
        try {
          const personalizedHtml = htmlContent
            .replace(/{{prenom}}/gi, subscriber.firstName || "")
            .replace(/{{nom}}/gi, subscriber.lastName || "")
            .replace(/{{email}}/gi, subscriber.email);

          const htmlWithUnsubscribe = personalizedHtml + getUnsubscribeFooter(siteUrl, subscriber.unsubscribeToken);

          await transporter.sendMail({
            from: fromName + " <" + fromEmail + ">",
            to: subscriber.email,
            subject: subject,
            html: htmlWithUnsubscribe
          });

          sent++;

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
          failed++;
          const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
          errors.push(subscriber.email + ": " + errorMsg);

          // Mark as bounced if delivery failed
          if (errorMsg.includes("550") || errorMsg.includes("invalid") || errorMsg.includes("rejected")) {
            await NewsletterSubscriber.findByIdAndUpdate(subscriber._id, { status: "bounced" });
          }
        }
      }

      return NextResponse.json({
        success: true,
        results: {
          total: subscribers.length,
          sent,
          failed,
          errors: errors.slice(0, 10) // Limit errors shown
        }
      });
    }

    return NextResponse.json(
      { error: "Specifiez testEmail ou sendToAll" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Send newsletter error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l envoi" },
      { status: 500 }
    );
  }
}

function getUnsubscribeFooter(siteUrl: string, token: string): string {
  return `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
      <p>Vous recevez cet email car vous etes inscrit a notre newsletter.</p>
      <p>
        <a href="${siteUrl}/newsletter/desabonnement?token=${token}" style="color: #844cfc;">
          Se desabonner
        </a>
      </p>
      <p style="margin-top: 10px;">
        Tota Compania - 4 rue Vauban, 54200 Toul
      </p>
    </div>
  `;
}
