const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;
const feeSlipTemplate = require('./templates/feeTemplate'); // Adjust path as needed
const { sendFeeSubmissionEmail } = require('./generalUtility');

// Reusable browser instance (for better performance)
let browserInstance;
const MAX_PDF_GENERATION_RETRIES = 2;

const getBrowserInstance = async () => {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ]
    });
  }
  return browserInstance;
};

const generatePDF = async (html, filePath, retryCount = 0) => {
  try {
     const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    
    await page.setContent(html, { 
      waitUntil: ['domcontentloaded', 'networkidle0'],
      timeout: 30000 
    });

    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    await page.close();
    
    // Verify PDF was created
    try {
      await fs.access(filePath);
      return { success: true, filename: path.basename(filePath), path: filePath };
    } catch {
      throw new Error('PDF file was not created');
    }
  } catch (error) {
    // Clean up any partial files
    try {
      await fs.unlink(filePath).catch(() => {});
    } catch (cleanupError) {
      console.error('Failed to clean up partial PDF:', cleanupError);
    }

    if (retryCount <3) {
      console.warn(`Retrying PDF generation (attempt ${retryCount + 1})`);
      return generatePDF(html, filePath, retryCount + 1);
    }

    throw new Error(`Failed to generate PDF after ${retryCount} attempts: ${error.message}`);
  }
};

const generateAndEmailFeeSlip = async (student, feeDetails) => {
  try {
    // Create directory if it doesn't exist
    const slipsDir = path.join(__dirname, '../slips');
    await fs.mkdir(slipsDir, { recursive: true });

    // Generate HTML and PDF
    const html = feeSlipTemplate(student, feeDetails);
    const fileName = `FeeSlip-${student.admissionNumber}-${feeDetails.month}-${feeDetails.year}.pdf`;
    const filePath = path.join(slipsDir, fileName);

    const pdfResult = await generatePDF(html, filePath);

    // Determine recipient (prioritize student email, fallback to parent contact)
    const recipient = student.email || student.parentContact;
    if (!recipient) {
      return {
        success: false,
        message: 'No email address available',
        pdfGenerated: true,
        pdfPath: pdfResult.path
      };
    }

    // Send email (with retry logic)
    let emailSent = false;
    // try {
    //   await sendFeeSubmissionEmail(
    //     recipient,
    //     student.name,
    //     pdfResult.filename,
    //     pdfResult.path
    //   );
    //   emailSent = true;
    // } catch (emailError) {
    //   console.error(`Failed to send email to ${recipient}:`, emailError);
    //   // Consider implementing a retry mechanism for emails too
    // }

    return {
      success: emailSent,
      message: emailSent 
        ? 'PDF generated and email sent successfully' 
        : 'PDF generated but email failed',
      pdfPath: pdfResult.path,
      recipient
    };
  } catch (error) {
    console.error('Fee slip processing failed:', error);
    throw error; // Re-throw for higher-level handling
  }
};

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  if (browserInstance) {
    await browserInstance.close();
  }
});

module.exports = {
  generatePDF,
  generateAndEmailFeeSlip,
  closeBrowser: async () => {
    if (browserInstance) {
      await browserInstance.close();
      browserInstance = null;
    }
  }
};