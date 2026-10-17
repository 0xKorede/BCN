import { EVENT_DATE, EVENT_TIME, EVENT_VENUE } from "@/lib/constants";

interface EmailTemplateParams {
  name: string;
  role: string;
  ticketId: string;
  whatsapp?: string;
}

/**
 * Generates BCN-branded confirmation email HTML.
 * The QR code is embedded as an inline CID attachment (not a remote URL).
 */
export function generateConfirmationEmail({
  name,
  role,
  ticketId,
  whatsapp,
}: EmailTemplateParams): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>BCN Hangout 2026 — Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:'Poppins',Helvetica,Arial,sans-serif;color:#F5F1E8;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0A0A0A;padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" style="max-width:560px;background-color:#141414;border-radius:16px;overflow:hidden;border:1px solid rgba(255,132,0,0.25);" cellpadding="0" cellspacing="0">

          <!-- Header band -->
          <tr>
            <td style="background-color:#000000;padding:28px 32px;border-bottom:2px solid #FF8400;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#FF8400;">Building Creatives Network</p>
                    <h1 style="margin:4px 0 0;font-size:22px;font-weight:800;color:#F5F1E8;letter-spacing:-0.3px;">BCN Hangout 2026</h1>
                    <p style="margin:2px 0 0;font-size:13px;color:#A39C90;">Creators with a Difference</p>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <!-- BCN hex mark (3 nested diamonds) -->
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="24,4 44,14 44,34 24,44 4,34 4,14" fill="none" stroke="#FF8400" stroke-width="1.5" opacity="0.4"/>
                      <polygon points="24,10 38,18 38,30 24,38 10,30 10,18" fill="none" stroke="#FFA341" stroke-width="1.5" opacity="0.6"/>
                      <polygon points="24,16 32,21 32,27 24,32 16,27 16,21" fill="#FF8400" opacity="0.85"/>
                    </svg>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-size:16px;color:#DFD8CE;">Hi <strong style="color:#F5F1E8;">${escapeHtml(name)}</strong>,</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#A39C90;">
                Thank you for registering for <strong style="color:#F5F1E8;">BCN Hangout — Creators with a Difference!</strong> Your spot is secured. We are excited to see you there.
              </p>

              <!-- Details card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1E1E1E;border-radius:12px;border:1px solid rgba(255,132,0,0.2);margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
                          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#FF8400;">Role</p>
                          <p style="margin:3px 0 0;font-size:14px;font-weight:600;color:#F5F1E8;">${escapeHtml(role)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 6px;">
                          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#FF8400;">Reference Code</p>
                          <p style="margin:3px 0 0;font-size:20px;font-weight:800;letter-spacing:3px;color:#FFA341;font-family:monospace;">${ticketId}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- QR instruction -->
              <p style="margin:0 0 16px;font-size:13px;color:#A39C90;text-align:center;">
                Please present the QR code below at the event entrance.
              </p>

              <!-- QR code (inline CID) -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:16px;background-color:#1E1E1E;border-radius:12px;border:1px solid rgba(255,132,0,0.15);">
                    <img src="cid:qr-code" alt="BCN Hangout Entry QR Code" width="200" height="200" style="display:block;border:4px solid #FFFFFF;border-radius:8px;"/>
                    <p style="margin:10px 0 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#FF8400;">Scan at entry</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Event details strip -->
          <tr>
            <td style="background-color:#1A1A1A;padding:16px 32px;border-top:1px solid rgba(255,132,0,0.15);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:16px;vertical-align:top;width:50%;">
                    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#FF8400;">Date &amp; Time</p>
                    <p style="margin:3px 0 0;font-size:13px;color:#DFD8CE;">Saturday, ${EVENT_DATE}, 2026</p>
                    <p style="margin:1px 0 0;font-size:13px;color:#A39C90;">${EVENT_TIME} WAT</p>
                  </td>
                  <td style="vertical-align:top;width:50%;">
                    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#FF8400;">Venue</p>
                    <p style="margin:3px 0 0;font-size:13px;color:#DFD8CE;">${escapeHtml(EVENT_VENUE)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;font-size:12px;color:#5A5550;text-align:center;">
                Follow us:
                <a href="https://youtube.com/@buildingcreativesnetwork?si=hQabV1Tpvs4-ZXr0" style="color:#FF8400;text-decoration:none;">YouTube</a> &nbsp;·&nbsp;
                <a href="https://www.facebook.com/share/1C47CfKY8U/?mibextid=wwXIfr" style="color:#FF8400;text-decoration:none;">Facebook</a> &nbsp;·&nbsp;
                <a href="https://www.instagram.com/building_creatives_network?igsi=MXFvcmp1enBrN211bg==" style="color:#FF8400;text-decoration:none;">Instagram</a> &nbsp;·&nbsp;
                <a href="https://www.tiktok.com/@buildingcreatives?_r=1&amp;_t=ZS-99MvHEPBEuH" style="color:#FF8400;text-decoration:none;">TikTok</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#3A3530;text-align:center;">
                © 2026 Building Creatives Network. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

/** Simple HTML escape to prevent XSS in email content */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
