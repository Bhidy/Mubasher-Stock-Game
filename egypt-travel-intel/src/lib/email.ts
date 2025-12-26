import nodemailer from 'nodemailer';

// --- Interfaces ---

interface EmailStats {
    postsScanned: number;
    newOffersFound: number;
    accountsScraped: number;
    yieldRate: number;
    topDestinations: Array<{ name: string; count: number }>;
    activeAgencies: number;
    durationSeconds?: number;
}

interface OfferHighlight {
    agency: string;
    offerType: string;
    destination: string;
    price: number | null;
    currency: string | null;
    confidence: number;
    caption: string;
}

interface ReportData {
    runId: string;
    timestamp: Date;
    type: 'pulse' | 'daily';
    stats: EmailStats;
    highlights: OfferHighlight[];
    status: 'success' | 'partial' | 'failed';
}

// --- Email Service (Bulletproof Mode) ---

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function sendIngestionReport(data: ReportData) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.REPORT_EMAIL_TO) {
        console.warn('⚠️ SMTP credentials missing. Skipping email report.');
        return { success: false, error: 'SMTP Configuration Missing' };
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 20000,
    });

    try {
        await transporter.verify();
        console.log('✅ SMTP Connection verified');
    } catch (verifyError) {
        console.error('❌ SMTP Connection Failed:', verifyError);
        return { success: false, error: `SMTP Connection Failed: ${verifyError instanceof Error ? verifyError.message : String(verifyError)}` };
    }

    const html = generateEmailHtml(data);
    const subjectPrefix = data.type === 'daily' ? '📅 Atlas Intel Daily Digest' : '⚡ Atlas Intel Pulse';
    const subject = `${subjectPrefix} | ${data.stats.newOffersFound} Opportunities Detected`;

    let attempt = 1;
    while (attempt <= MAX_RETRIES) {
        try {
            console.log(`📧 Sending email (Attempt ${attempt}/${MAX_RETRIES})...`);

            const info = await transporter.sendMail({
                from: `"Atlas Intel" <${process.env.SMTP_USER}>`,
                to: process.env.REPORT_EMAIL_TO,
                subject: subject,
                html: html,
            });

            console.log(`✅ Report sent successfully: ${info.messageId}`);
            return { success: true };

        } catch (error) {
            console.error(`❌ Email attempt ${attempt} failed:`, error);

            if (attempt === MAX_RETRIES) {
                console.error('💀 All email retries failed. Report not sent.');
                return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
            } else {
                const delay = RETRY_DELAY * attempt;
                console.log(`⏳ Waiting ${delay}ms before retry...`);
                await sleep(delay);
            }
            attempt++;
        }
    }
    return { success: false, error: 'Retries exhausted' };
}

// --- Ultra Premium Bulletproof Email Template ---
// Designed for: Outlook (Windows/Mac), Gmail, Apple Mail, Dark Mode compatibility

function generateEmailHtml(data: ReportData): string {
    const { stats, highlights, timestamp, status, type } = data;

    const reportTitle = type === 'daily' ? 'Daily Intelligence Digest' : 'Market Scan Complete';
    const reportTagline = type === 'daily' ? 'DAILY REPORT' : 'AUTOMATED PULSE';

    const dateStr = timestamp.toLocaleString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    });

    const statusColor = status === 'failed' ? '#DC2626' : '#059669';
    const statusBg = status === 'failed' ? '#FEE2E2' : status === 'partial' ? '#FEF3C7' : '#D1FAE5';
    const statusText = status.toUpperCase();

    // Top Destinations (Table-based for Outlook)
    const destinationsHtml = stats.topDestinations.slice(0, 5).map((d) => `
        <tr>
            <td style="padding: 10px 16px; background-color: #FFFFFF; border-bottom: 1px solid #E5E7EB;">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                        <td width="36" valign="middle">
                            <div style="width: 32px; height: 32px; background-color: #059669; border-radius: 8px; text-align: center; line-height: 32px; color: #FFFFFF; font-weight: bold; font-size: 14px;">
                                ●
                            </div>
                        </td>
                        <td style="padding-left: 12px; font-size: 14px; font-weight: 600; color: #1F2937;">
                            ${d.name}
                        </td>
                        <td width="50" align="right">
                            <div style="display: inline-block; background-color: #059669; color: #FFFFFF; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 700;">
                                ${d.count}
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    `).join('');

    // Highlights Cards (Table-based for Outlook)
    const highlightsHtml = highlights.map((h) => `
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
            <tr>
                <td style="background-color: #FFFFFF; border: 2px solid #E5E7EB; border-radius: 16px; overflow: hidden;">
                    <!--[if mso]>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="background-color: #059669; height: 4px; font-size: 1px; line-height: 1px;">&nbsp;</td></tr></table>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <div style="height: 4px; background: linear-gradient(90deg, #059669 0%, #0284C7 50%, #7C3AED 100%);"></div>
                    <!--<![endif]-->
                    
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="padding: 20px;">
                        <tr>
                            <td style="padding: 16px 20px;">
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td valign="top">
                                            <span style="display: inline-block; background-color: #059669; color: #FFFFFF; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                                                ${h.offerType?.replace('_', ' ') || 'OFFER'}
                                            </span>
                                            <span style="font-size: 14px; font-weight: 700; color: #1F2937; margin-left: 8px;">
                                                @${h.agency}
                                            </span>
                                        </td>
                                        <td align="right" valign="top">
                                            <span style="font-size: 18px; font-weight: 800; color: #059669;">
                                                ${h.price ? h.price.toLocaleString() + ' ' + (h.currency || 'EGP') : 'Price TBD'}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                                
                                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 12px;">
                                    <tr>
                                        <td>
                                            <span style="color: #6B7280; font-size: 13px;">📍</span>
                                            <span style="font-size: 13px; font-weight: 600; color: #374151; margin-left: 4px;">${h.destination || 'Unspecified'}</span>
                                            <span style="color: #9CA3AF; margin: 0 8px;">•</span>
                                            <span style="font-size: 12px; color: #6B7280;">AI Confidence: </span>
                                            <span style="font-size: 12px; font-weight: 700; color: ${h.confidence > 0.8 ? '#059669' : '#D97706'};">${Math.round(h.confidence * 100)}%</span>
                                        </td>
                                    </tr>
                                </table>
                                
                                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 14px;">
                                    <tr>
                                        <td style="background-color: #F3F4F6; padding: 14px 16px; border-radius: 10px; border-left: 4px solid #059669;">
                                            <span style="font-size: 13px; color: #4B5563; line-height: 1.6;">
                                                "${h.caption}"
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    `).join('');

    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Atlas Intel - Intelligence Report</title>
    
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    
    <!--[if mso]>
    <style type="text/css">
        body, table, td, p, a, span, div { font-family: Arial, Helvetica, sans-serif !important; }
        .outlook-fallback-font { font-family: Arial, Helvetica, sans-serif !important; }
    </style>
    <![endif]-->
    
    <style type="text/css">
        /* Reset & Base */
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }
        table {
            border-collapse: collapse !important;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
        
        /* Dark Mode Styles */
        @media (prefers-color-scheme: dark) {
            .dark-bg { background-color: #1F2937 !important; }
            .dark-text { color: #F9FAFB !important; }
            .dark-muted { color: #D1D5DB !important; }
            .dark-card { background-color: #374151 !important; border-color: #4B5563 !important; }
        }
        
        /* Outlook Dark Mode Prevention */
        [data-ogsc] .dark-bg { background-color: #1F2937 !important; }
        [data-ogsc] .dark-text { color: #F9FAFB !important; }
        [data-ogsb] .force-white { background-color: #FFFFFF !important; }
        
        /* Mobile Responsive */
        @media only screen and (max-width: 600px) {
            .mobile-full { width: 100% !important; max-width: 100% !important; }
            .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
            .mobile-center { text-align: center !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

    <!-- Outlook Dark Mode Background Fix -->
    <!--[if gte mso 9]>
    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
        <v:fill type="tile" color="#111827"/>
    </v:background>
    <![endif]-->

    <!-- Preheader Text (Hidden) -->
    <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #111827;">
        ${stats.newOffersFound} new travel opportunities detected by Atlas Intel
    </div>

    <!-- Main Wrapper Table -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #111827;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                
                <!-- Logo Header -->
                <table cellpadding="0" cellspacing="0" border="0" width="600" class="mobile-full" style="max-width: 600px;">
                    <tr>
                        <td align="center" style="padding-bottom: 32px;">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <!-- Logo Icon -->
                                        <table cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="width: 48px; height: 48px; background-color: #059669; border-radius: 12px; text-align: center; vertical-align: middle;">
                                                    <span style="font-size: 24px; color: #FFFFFF; font-weight: bold; line-height: 48px;">A</span>
                                                </td>
                                                <td style="padding-left: 14px;">
                                                    <table cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td style="font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
                                                                Atlas Intel
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="font-size: 11px; font-weight: 600; color: #10B981; text-transform: uppercase; letter-spacing: 2px;">
                                                                Intelligence Suite
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Main Content Card -->
                <table cellpadding="0" cellspacing="0" border="0" width="600" class="mobile-full" style="max-width: 600px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                    
                    <!-- Header Section with Solid Color Background (Outlook Safe) -->
                    <tr>
                        <td>
                            <!--[if gte mso 9]>
                            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:180px;">
                                <v:fill type="gradient" color="#059669" color2="#0284C7" angle="135"/>
                                <v:textbox inset="0,0,0,0">
                            <![endif]-->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #059669; background-image: linear-gradient(135deg, #059669 0%, #047857 50%, #0D9488 100%);">
                                <tr>
                                    <td style="padding: 48px 40px; text-align: center;">
                                        
                                        <!-- Report Type Badge -->
                                        <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom: 20px;">
                                            <tr>
                                                <td style="background-color: rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.3);">
                                                    <span style="font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 2px;">
                                                        ${reportTagline}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Main Title -->
                                        <h1 style="margin: 0 0 12px 0; font-size: 32px; font-weight: 800; color: #FFFFFF; letter-spacing: -1px;">
                                            ${reportTitle}
                                        </h1>
                                        
                                        <!-- Date -->
                                        <p style="margin: 0; font-size: 15px; color: rgba(255,255,255,0.9); font-weight: 500;">
                                            ${dateStr}
                                        </p>
                                        
                                    </td>
                                </tr>
                            </table>
                            <!--[if gte mso 9]>
                                </v:textbox>
                            </v:rect>
                            <![endif]-->
                        </td>
                    </tr>

                    <!-- Summary Section -->
                    <tr>
                        <td style="padding: 36px 40px 28px 40px;">
                            <p style="margin: 0; font-size: 17px; color: #374151; line-height: 1.7; text-align: center;">
                                Your intelligence engine just completed a scan of 
                                <strong style="color: #059669; font-weight: 700;">${stats.accountsScraped} active sources</strong>.
                                <br>Here's what we found.
                            </p>
                        </td>
                    </tr>

                    <!-- New Offers Card (Single centered card - removed Scanned and Yield) -->
                    <tr>
                        <td style="padding: 0 40px 36px 40px;">
                            <table cellpadding="0" cellspacing="0" border="0" align="center">
                                <tr>
                                    <td style="background-color: #ECFDF5; padding: 28px 48px; border-radius: 20px; text-align: center; border: 2px solid #A7F3D0;">
                                        <div style="font-size: 11px; font-weight: 800; color: #047857; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                                            New Offers Found
                                        </div>
                                        <div style="font-size: 48px; font-weight: 900; color: #059669; letter-spacing: -2px; line-height: 1;">
                                            ${stats.newOffersFound}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Trending Markets Section -->
                    <tr>
                        <td style="padding: 0 40px 36px 40px;">
                            <!-- Section Header -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                                <tr>
                                    <td width="6" style="background-color: #059669; border-radius: 3px;"></td>
                                    <td style="padding-left: 12px;">
                                        <h3 style="margin: 0; font-size: 13px; font-weight: 800; color: #1F2937; text-transform: uppercase; letter-spacing: 1.5px;">
                                            Trending Markets
                                        </h3>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Destinations Table -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #F9FAFB; border-radius: 16px; overflow: hidden; border: 1px solid #E5E7EB;">
                                ${destinationsHtml || `
                                <tr>
                                    <td style="padding: 32px; text-align: center; color: #6B7280; font-size: 14px;">
                                        No trending destinations detected in this scan.
                                    </td>
                                </tr>
                                `}
                            </table>
                        </td>
                    </tr>

                    <!-- System Health Row -->
                    <tr>
                        <td style="padding: 0 40px 36px 40px;">
                            <!-- Section Header -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 16px;">
                                <tr>
                                    <td width="6" style="background-color: #0284C7; border-radius: 3px; height: 24px;"></td>
                                    <td style="padding-left: 12px;">
                                        <h3 style="margin: 0; font-size: 13px; font-weight: 800; color: #1F2937; text-transform: uppercase; letter-spacing: 1.5px;">
                                            System Health
                                        </h3>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Health Stats Table -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E5E7EB;">
                                <tr>
                                    <td style="padding: 16px 20px; border-bottom: 1px solid #F3F4F6;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="font-size: 14px; color: #6B7280; font-weight: 500;">Duration</td>
                                                <td align="right" style="font-size: 15px; font-weight: 700; color: #1F2937;">${Math.round(stats.durationSeconds || 0)} sec</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 16px 20px; border-bottom: 1px solid #F3F4F6;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="font-size: 14px; color: #6B7280; font-weight: 500;">Active Sources</td>
                                                <td align="right" style="font-size: 15px; font-weight: 700; color: #1F2937;">${stats.accountsScraped}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 16px 20px;">
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="font-size: 14px; color: #6B7280; font-weight: 500;">Status</td>
                                                <td align="right">
                                                    <span style="display: inline-block; background-color: ${statusBg}; color: ${statusColor}; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid ${statusColor};">
                                                        ${statusText}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- High Confidence Opportunities -->
                    <tr>
                        <td style="padding: 0 40px 36px 40px;">
                            <!-- Section Header -->
                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td width="6" style="background-color: #7C3AED; border-radius: 3px; height: 24px;"></td>
                                    <td style="padding-left: 12px;">
                                        <h3 style="margin: 0; font-size: 13px; font-weight: 800; color: #1F2937; text-transform: uppercase; letter-spacing: 1.5px;">
                                            High Confidence Opportunities
                                        </h3>
                                    </td>
                                </tr>
                            </table>
                            
                            ${highlightsHtml.length ? highlightsHtml : `
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td style="background-color: #F9FAFB; padding: 40px 20px; text-align: center; border-radius: 16px; border: 1px dashed #D1D5DB;">
                                        <div style="font-size: 32px; margin-bottom: 12px;">📭</div>
                                        <div style="font-size: 15px; color: #6B7280; margin-bottom: 8px;">
                                            No high-confidence offers detected in this scan.
                                        </div>
                                        <div style="font-size: 12px; color: #9CA3AF;">
                                            Next scan will run automatically in 6 hours.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            `}
                        </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;" align="center">
                            <table cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="background-color: #111827; border-radius: 14px;">
                                        <!--[if mso]>
                                        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://egypt-travel-intel.vercel.app/" style="height:56px;v-text-anchor:middle;width:220px;" arcsize="25%" strokecolor="#111827" fillcolor="#111827">
                                            <w:anchorlock/>
                                            <center style="color:#FFFFFF;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">Open Dashboard →</center>
                                        </v:roundrect>
                                        <![endif]-->
                                        <!--[if !mso]><!-->
                                        <a href="https://egypt-travel-intel.vercel.app/" target="_blank" style="display: inline-block; background-color: #111827; color: #FFFFFF; text-decoration: none; padding: 18px 40px; border-radius: 14px; font-weight: 700; font-size: 15px; letter-spacing: 0.3px; box-shadow: 0 10px 25px -5px rgba(17, 24, 39, 0.5);">
                                            Open Dashboard →
                                        </a>
                                        <!--<![endif]-->
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F9FAFB; padding: 28px 40px; border-top: 1px solid #E5E7EB;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Footer Logo -->
                                        <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 12px;">
                                            <tr>
                                                <td style="width: 28px; height: 28px; background-color: #059669; border-radius: 8px; text-align: center; vertical-align: middle;">
                                                    <span style="font-size: 14px; color: #FFFFFF; font-weight: bold; line-height: 28px;">A</span>
                                                </td>
                                                <td style="padding-left: 10px;">
                                                    <span style="font-size: 14px; font-weight: 700; color: #1F2937;">Atlas Intel</span>
                                                    <span style="color: #6B7280; font-size: 12px;"> • Automated Market Analysis</span>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Run ID -->
                                        <div style="font-size: 12px; color: #9CA3AF; margin-bottom: 8px;">
                                            Run ID: <span style="font-family: 'SF Mono', Monaco, 'Courier New', monospace; background-color: #E5E7EB; padding: 2px 8px; border-radius: 4px; font-size: 11px; color: #6B7280;">${data.runId}</span>
                                        </div>
                                        
                                        <!-- Tagline -->
                                        <div style="font-size: 11px; color: #D1D5DB; font-weight: 500;">
                                            Monitor. Analyze. Dominate.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>

                <!-- Unsubscribe Footer -->
                <table cellpadding="0" cellspacing="0" border="0" width="600" class="mobile-full" style="max-width: 600px;">
                    <tr>
                        <td style="padding: 24px 20px; text-align: center;">
                            <p style="margin: 0; font-size: 11px; color: #6B7280;">
                                You're receiving this because you're subscribed to Atlas Intel automated reports.
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>

</body>
</html>
    `;
}
