import type { APIRoute } from "astro";
import { Resend } from "resend";

// Ensure this endpoint runs on the server
export const prerender = false;

// Initialize Resend
const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Types for form data
interface ContactFormData {
  name: string;
  email: string;
  location: string;
  service: string;
  message?: string;
}

// Validation schemas
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateFormData = (
  data: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!data.location || data.location.trim().length === 0) {
    errors.push("Please select a location");
  }

  if (!data.service || data.service.trim().length === 0) {
    errors.push("Please select a service");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Function to create HTML email template
const createEmailTemplate = (data: ContactFormData): string => {
  const serviceNames: Record<string, string> = {
    "facade-cleaning": "High-Rise Facade Cleaning",
    "window-washing": "High-Rise Window Washing",
    "roof-washing": "Roof Washing",
    "solar-panel-cleaning": "Solar Panel Cleaning",
    "gutter-cleaning": "Gutter Cleaning",
    "pressure-washing": "Pressure Washing",
    "multiple-services": "Multiple Services",
    consultation: "Free Consultation",
  };

  const locationNames: Record<string, string> = {
    miami: "Miami",
    orlando: "Orlando",
    tampa: "Tampa",
    jacksonville: "Jacksonville",
    "fort-myers": "Fort Myers",
    "west-palm-beach": "West Palm Beach",
    sarasota: "Sarasota",
    tallahassee: "Tallahassee",
    other: "Other",
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8fafc;
          color: #334155;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #000517 0%, #1e293b 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .field {
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
        }
        .field:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .label {
          font-weight: 600;
          color: #475569;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .value {
          font-size: 16px;
          color: #1e293b;
          line-height: 1.5;
        }
        .urgent {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 6px;
          padding: 16px;
          margin: 20px 0;
        }
        .urgent-text {
          color: #92400e;
          font-weight: 600;
          margin: 0;
        }
        .footer {
          background-color: #f1f5f9;
          padding: 20px 30px;
          text-align: center;
          font-size: 14px;
          color: #64748b;
        }
        .timestamp {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          font-size: 12px;
          color: #64748b;
          text-align: center;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Sky Blast</p>
        </div>
        
        <div class="content">
          <div class="urgent">
            <p class="urgent-text">New customer inquiry received!</p>
          </div>
          
          <div class="field">
            <div class="label">Full Name</div>
            <div class="value">${data.name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email Address</div>
            <div class="value">
              <a href="mailto:${
                data.email
              }" style="color: #2563eb; text-decoration: none;">
                ${data.email}
              </a>
            </div>
          </div>
          
          <div class="field">
            <div class="label">Location</div>
            <div class="value">${
              locationNames[data.location] || data.location
            }</div>
          </div>
          
          <div class="field">
            <div class="label">Service Requested</div>
            <div class="value">${
              serviceNames[data.service] || data.service
            }</div>
          </div>
          
          ${
            data.message
              ? `
          <div class="field">
            <div class="label">Additional Message</div>
            <div class="value">${data.message}</div>
          </div>
          `
              : ""
          }
          
          <div class="timestamp">
            Received on ${new Date().toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZoneName: "short",
            })}
          </div>
        </div>
        
        <div class="footer">
          <p>This email was automatically generated from the Sky Blast contact form.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Function to create auto-reply email template
const createAutoReplyTemplate = (data: ContactFormData): string => {
  const serviceNames: Record<string, string> = {
    "facade-cleaning": "High-Rise Facade Cleaning",
    "window-washing": "High-Rise Window Washing",
    "roof-washing": "Roof Washing",
    "solar-panel-cleaning": "Solar Panel Cleaning",
    "gutter-cleaning": "Gutter Cleaning",
    "pressure-washing": "Pressure Washing",
    "multiple-services": "Multiple Services",
    consultation: "Free Consultation",
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank you for contacting Sky Blast</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8fafc;
          color: #334155;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #000517 0%, #1e293b 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #1e293b;
          margin-bottom: 20px;
        }
        .message {
          font-size: 16px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 25px;
        }
        .summary-box {
          background-color: #f8fafc;
          border-left: 4px solid #000517;
          padding: 20px;
          margin: 25px 0;
          border-radius: 0 6px 6px 0;
        }
        .summary-title {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 15px;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .summary-label {
          color: #64748b;
          font-weight: 500;
        }
        .summary-value {
          color: #1e293b;
          font-weight: 600;
        }
        .cta-section {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 25px;
          border-radius: 8px;
          text-align: center;
          margin: 30px 0;
        }
        .cta-title {
          color: #0c4a6e;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .cta-text {
          color: #075985;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .contact-info {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
          font-size: 14px;
        }
        .contact-item {
          text-align: center;
        }
        .contact-label {
          color: #64748b;
          font-weight: 500;
          margin-bottom: 5px;
        }
        .contact-value {
          color: #1e293b;
          font-weight: 600;
        }
        .footer {
          background-color: #f1f5f9;
          padding: 25px 30px;
          text-align: center;
          font-size: 14px;
          color: #64748b;
        }
        .social-links {
          margin-top: 15px;
        }
        .social-links a {
          color: #64748b;
          text-decoration: none;
          margin: 0 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You!</h1>
          <p style="margin: 0; opacity: 0.9; font-size: 16px;">We've received your message</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hello ${data.name}!
          </div>
          
          <div class="message">
            Thank you for reaching out to <strong>Sky Blast</strong>! We've successfully received your inquiry about our professional drone services.
          </div>
          
          <div class="summary-box">
            <div class="summary-title">Your Request Summary:</div>
            <div class="summary-item">
              <span class="summary-label">Service:</span>
              <span class="summary-value">${
                serviceNames[data.service] || data.service
              }</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Location:</span>
              <span class="summary-value">${data.location}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Submitted:</span>
              <span class="summary-value">${new Date().toLocaleDateString(
                "en-US"
              )}</span>
            </div>
          </div>
          
          <div class="message">
            Our team of experts will review your request and get back to you within <strong>24 hours</strong> with a personalized quote and more information about how we can help you.
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Sky Blast Professional Services</strong></p>
          <p>Professional drone cleaning services across Florida</p>
          <p style="margin-top: 15px; font-size: 12px;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse JSON data instead of form data
    const data: ContactFormData = await request.json();

    // Validate form data
    const validation = validateFormData(data);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          errors: validation.errors,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check if required environment variables are set
    if (!import.meta.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email service is not properly configured",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Send email to company
    const companyEmailResult = await resend.emails.send({
      from: import.meta.env.FROM_EMAIL || "noreply@sky-blast.com",
      to: import.meta.env.CONTACT_EMAIL || "contact@sky-blast.com",
      subject: `New Contact Form Submission - ${data.service}`,
      html: createEmailTemplate(data),
      replyTo: data.email,
    });

    // Send auto-reply to customer
    const customerEmailResult = await resend.emails.send({
      from: import.meta.env.FROM_EMAIL || "noreply@sky-blast.com",
      to: data.email,
      subject: "Thank you for contacting Sky Blast - We'll be in touch soon!",
      html: createAutoReplyTemplate(data),
      replyTo: import.meta.env.REPLY_TO_EMAIL || "contact@sky-blast.com",
    });

    // Log results for debugging
    console.log("Company email result:", companyEmailResult);
    console.log("Customer email result:", customerEmailResult);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Emails sent successfully",
        companyEmailId: companyEmailResult.data?.id,
        customerEmailId: customerEmailResult.data?.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending emails:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to send email. Please try again or contact us directly.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
