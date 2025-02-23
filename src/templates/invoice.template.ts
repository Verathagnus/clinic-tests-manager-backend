export function htmlContentTemplate({companyName, companyNumber, companyAddress, invoice, discountSection}) {
  console.log(companyName, companyNumber, companyAddress, invoice, discountSection)
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Patient Invoice</title>
          <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    @page {
      size: A5;
      margin: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      background: white;
      width: 148mm;
      height: 210mm;
      margin: 0 auto;
      color: #4f46e5;
      font-size: 8pt;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .container {
      width: 100%;
      height: 100%;
      background: white;
      display: flex;
      flex-direction: column;
    }

    .header {
      print-color-adjust: exact;
      background: #4f46e5;
      padding: 0.75rem;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .company-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .company-name {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 14pt;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .company-name svg {
      width: 16px;
      height: 16px;
    }

    .company-details {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      color: #27beff;
      font-size: 7pt;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .detail-item svg {
      width: 10px;
      height: 10px;
      flex-shrink: 0;
    }

    .invoice-info {
      text-align: right;
    }

    .invoice-title {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.25rem;
      font-size: 12pt;
      font-weight: 700;
      letter-spacing: -0.01em;
    }

    .invoice-title svg {
      width: 16px;
      height: 16px;
    }

    .invoice-details {
      margin-top: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      color: #27beff;
      font-size: 7pt;
    }

    .main-content {
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
    }

    .top-section {
      margin-bottom: 1rem;
    }

    .customer-section {
      margin-bottom: 0.75rem;
    }

    .section-title {
      font-size: 9pt;
      font-weight: 600;
      color: #4b5563;
      padding-bottom: 0.25rem;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 0.5rem;
      letter-spacing: -0.01em;
    }

    .customer-details {
      display: grid;
      gap: 0.25rem;
      color: #6b7280;
      font-size: 7pt;
    }

    .label {
      font-weight: 600;
      color: #4b5563;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 0.75rem;
      font-size: 7pt;
    }

    th {
      background: #111;
      padding: 0.375rem 0.75rem;
      text-align: left;
      font-weight: 600;
      color: #4b5563;
      border-bottom: 1px solid #e5e7eb;
    }

    td {
      padding: 0.375rem 0.75rem;
      color: #4b5563;
      border-bottom: 1px solid #e5e7eb;
    }

    tr:hover {
      background: #f9fafb;
    }

    .text-right {
      text-align: right;
    }

    .summary-section {
      border-top: 1px solid #e5e7eb;
      padding-top: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .summary-content {
      width: 100%;
      max-width: 50%;
      margin-left: auto;
      font-size: 7pt;
    }

    .summary-item {
      font-size: 10pt;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
      color: #6b7280;
    }

    .total-item {
      font-weight: 600;
      color: #4b5563;
      padding-top: 0.25rem;
      border-top: 1px solid #e5e7eb;
    }

    .balance-item {
      font-weight: 600;
      color: #4f46e5;
    }

    .remarks-section {
      margin-bottom: 0.75rem;
    }

    .remarks-content {
      color: #6b7280;
      font-size: 7pt;
    }

    .footer {
      text-align: center;
      border-top: 1px solid #e5e7eb;
      padding-top: 0.75rem;
      color: #6b7280;
      font-size: 7pt;
    }

    .footer-icon {
      color: #4f46e5;
      margin-bottom: 0.25rem;
    }

    .footer-icon svg {
      width: 14px;
      height: 14px;
    }

    .footer-title {
      font-weight: 500;
      margin-bottom: 0.125rem;
    }

    .footer-subtitle {
      font-size: 6pt;
    }

    @media print {
      body {
        margin: 0;
        padding: 0;
        width: 148mm;
        height: 210mm;
      }
      
      .container {
        width: 148mm;
        height: 210mm;
      }

      @page {
        size: A5;
        margin: 0;
      }
    }
  </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-content">
              <div class="company-info">
                <div class="company-name">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
    ${(companyName || "").toLocaleUpperCase() }
                </div>
                <div class="company-details">
                  <div class="detail-item">
                    <svg width="5px" height="5px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    ${(companyAddress || "").toLocaleUpperCase()}
                  </div>
                  <div class="detail-item">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    ${(companyNumber || "").toLocaleUpperCase()}
                  </div>
                </div>
              </div>
              <div class="invoice-info">
                <div class="invoice-title">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                  INVOICE:  #${invoice.id}
                </div>
                <div class="invoice-details">
                  <div class="detail-item" style="font-size: 10pt;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    ${new Date(invoice.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="main-content">
            <div class="top-section">
              <div class="customer-section">
                <h3 class="section-title">CUSTOMER DETAILS</h3>
                <div class="customer-details">
                  <p><span class="label">NAME:</span> ${(invoice?.patient_name as string || "").toLocaleUpperCase() || ""}</p>
                  <p><span class="label">AGE:</span> ${(invoice?.age as string || "").toLocaleUpperCase() || ""}</p>
                  <p><span class="label">ADDRESS:</span> ${(invoice?.patient_address as string || "").toLocaleUpperCase() || ""}</p>
                  <p><span class="label">CONTACT:</span> ${invoice?.patient_phone || ""}</p>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>TEST NAME</th>
                    <th>DESCRIPTION</th>
                    <th class="text-right">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice?.items.map(item => `
                    <tr>
                      <td>${(item?.name as string).toLocaleUpperCase()}</td>
                      <td>${(item?.description as string || "").toLocaleUpperCase()}</td>
                      <td class="text-right">₹${item?.price}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="bottom-section">
              <div class="summary-section">
                <div class="summary-content">
                  <div class="summary-item">
                    <span>SUBTOTAL:</span>
                    <span>₹${invoice?.items.reduce((total, item) => total + item?.price, 0)}</span>
                  </div>
                  
                  ${discountSection}

                  <div class="summary-item">
                    <span>AMOUNT PAID:</span>
                    <span>₹${invoice?.amount_paid}</span>
                  </div>
                  <div class="summary-item balance-item">
                    <span>BALANCE:</span>
                    <span>₹${invoice?.items.reduce((total, item) => total + item?.price, 0) - invoice?.discount - invoice?.amount_paid}</span>
                  </div>
                </div>
              </div>

              <div class="remarks-section">
                <h3 class="section-title">Remarks</h3>
                <p class="remarks-content">${(invoice?.remarks as string).toLocaleUpperCase() || 'N/A'}</p>
              </div>

              <div class="footer">
                <div class="footer-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                </div>
                <p class="footer-title">THANK YOU FOR YOUR BUSINESS!</p>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
}