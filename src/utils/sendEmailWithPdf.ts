import nodemailer from "nodemailer";


import path from "path";
import config from "../app/config";
import { generatePdf } from "./generatePayinPdf";

type Tmail = {
  to: string;
  subject: string;
  html: string;
  invoiceData: any;
};

const imagePath = path.join(__dirname, "../../public/image/invoice-header.png");

const emailSendWithPdf = async () => {
  const to = "jubair2810@gmail.com";
  const subject = "Invoice";
  const html = "Invoice check";

  const invoiceData = {
    imagePath: `file://${imagePath}`, // Path to the header image
    receiptName: "John Doe",
    receiptTitle: "Software Engineer",
    receiptCompany: "Tech Corp",
    invoiceId: "INV-12345335",
    date: new Date().toLocaleDateString(),
    purpose: "Payment for services rendered",
    items: [
      {
        sl: 1,
        purpose: "Web Development",
        method: "Bank Transfer",
        trxId: "TRX-001",
        amount: "$500",
        remarks: "Completed",
      },
      {
        sl: 2,
        purpose: "Consulting",
        method: "Credit Card",
        trxId: "TRX-002",
        amount: "$300",
        remarks: "In Progress",
      },
    ],
  };

  const pdfBuffer = await generatePdf(invoiceData);

  //   console.log(pdfPath, "pdf");

  //   try {
  //     const transporter = nodemailer.createTransport({
  //       host: "smtp.gmail.com",
  //       port: 587,
  //       secure: false,
  //       auth: {
  //         user: config.mail_user,
  //         pass: config.mail_secret,
  //       },
  //     });

  //     const mailOptions = {
  //       from: `"Nexist" <${config.mail_user}>`,
  //       to,
  //       subject,
  //       html,
  //       attachments: [
  //         {
  //           filename: `Invoice-${invoiceData.invoiceId}.pdf`,
  //           path: pdfBuffer,
  //         },
  //       ],
  //     };

  //     const response = await transporter.sendMail(mailOptions);

  //     console.log(response.messageId, "res");

  //     return response;
  //   } catch (error) {
  //     console.error("Error sending email:", error);
  //     throw new Error("Failed to send email");
  //   }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.mail_user, // Your email from config
        pass: config.mail_secret, // Your app-specific password
      },
    });

    const mailOptions = {
      from: `"Nexist" <${config.mail_user}>`, // Sender email
      to, // Recipient email
      subject, // Subject of the email
      html, // Body of the email
      attachments: [
        {
          filename: `Invoice-${invoiceData.invoiceId}.pdf`, // Attachment file name
          content: Buffer.from(pdfBuffer), // Convert pdfBuffer to Buffer
          contentType: "application/pdf", // MIME type for PDF
        },
      ],
    };

    const response = await transporter.sendMail(mailOptions); // Send the email

    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

emailSendWithPdf();
