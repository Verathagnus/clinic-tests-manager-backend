// src/templates/invoice.template.ts
export const invoiceTemplate = {
  variables: 'invoiceId,date,patientName,patientAge,patientAddress,patientPhone,items,subtotal,discount,grandTotal,amountPaid,balance,remarks',
  content: `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .details { margin-bottom: 20px; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .totals { margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Invoice #\${invoiceId}</h1>
          <p>Date: \${date}</p>
        </div>
        
        <div class="details">
          <h2>Patient Details</h2>
          <p>Name: \${patientName}</p>
          <p>Age: \${patientAge}</p>
          <p>Address: \${patientAddress}</p>
          <p>Phone: \${patientPhone}</p>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            \${items}
          </tbody>
        </table>

        <div class="totals">
          <p>Subtotal: ₹\${subtotal}</p>
          <p>Discount: ₹\${discount}</p>
          <p>Grand Total: ₹\${grandTotal}</p>
          <p>Amount Paid: ₹\${amountPaid}</p>
          <p>Balance: ₹\${balance}</p>
        </div>

        \${remarks ? \`
          <div class="remarks">
            <h2>Remarks</h2>
            <p>\${remarks}</p>
          </div>
        \` : ''}
      </body>
    </html>
  `
};