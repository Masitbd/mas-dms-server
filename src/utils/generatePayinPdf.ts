import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

type TData = {
  receiptName: string;
  receiptTitle: string;
  receiptCompany: string;
  invoiceId: string;
  date: string;
  purpose: string;
  items: {
    sl: number;
    purpose: string;
    method: string;
    trxId: string;
    amount: number;
    remarks: string;
  }[];
};

// Convert the image to a base64 string
const imagePath = path.join(
  __dirname,
  "../../public/images/invoice-header.png"
);
const base64Image = fs.readFileSync(imagePath, "base64");

// Data for the invoice

// Generate HTML content using template literals
const generateHtml = (data: TData) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      .header {
        width: 100%;
      }
      .container {
        max-width: 600px;
        margin: auto;
        border: 1px solid #ddd;
        padding: 20px;
      }
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .gray-text {
        color: #d6d3d3;
        font-style: italic;
        font-size: xx-small;
      }
      .bold {
        font-weight: bold;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      th,
      td {
        border: 1px solid #000;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #0d2753;
        color: #fff;
      }
      .amount {
        font-weight: bold;
        color: #000;
      }
      .footer {
        margin-top: 20px;
        font-style: italic;
      }
      .red {
        color: red;
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <!-- Header Image -->
    <img class="invoice-header" src="data:image/png;base64,${base64Image}" alt="Invoice Header" />
    <!-- main receipt -->
    <div class="head">
      <div>
        <p>
          <strong>To,</strong>
        </p>
        <p>
          ${data.receiptName} <br />
          ${data.receiptTitle} <br />
          ${data.receiptCompany}
        </p>
        <p class="gray-text">${data.invoiceId}</p>
      </div>
      <div>
        <p><strong>Invoice:</strong> ${data.invoiceId}</p>
        <p><strong> Date: </strong> ${data.date}</p>
      </div>
    </div>

    <p class="bold">Purpose: ${data.purpose}</p>

    <table>
      <thead>
        <tr>
          <th>SL</th>
          <th>Purpose</th>
          <th>Method</th>
          <th>TrxId</th>
          <th>Amount</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        ${data.items
          .map(
            (item) => `
          <tr>
            <td>${item.sl}</td>
            <td>${item.purpose}</td>
            <td>${item.method}</td>
            <td>${item.trxId}</td>
            <td class="amount">${item.amount}</td>
            <td>${item.remarks}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </body>
</html>
`;

// Generate PDF using Puppeteer
export const generatePdf = async (invoiceData: any) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const htmlContent = generateHtml(invoiceData); // Use the dynamic HTML generation
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf(); // Return the PDF as a buffer
  await browser.close();
  return pdfBuffer;
};
