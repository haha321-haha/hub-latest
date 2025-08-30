const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generatePDF(htmlFile, outputFile) {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new'
  });
  const page = await browser.newPage();
  
  // Read HTML file
  const htmlPath = path.join(__dirname, '..', 'public', 'downloads', htmlFile);
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // Set content
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  // Generate PDF
  const outputPath = path.join(__dirname, '..', 'public', 'downloads', outputFile);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm'
    }
  });
  
  await browser.close();
  console.log(`Generated: ${outputFile}`);
}

async function generateNewPDFs() {
  const files = [
    // New Health Management Tools
    {
      html: 'pain-tracking-form.html',
      pdf: 'pain-tracking-form.pdf'
    },
    {
      html: 'pain-tracking-form-en.html',
      pdf: 'pain-tracking-form-en.pdf'
    },
    {
      html: 'menstrual-cycle-nutrition-plan.html',
      pdf: 'menstrual-cycle-nutrition-plan.pdf'
    },
    {
      html: 'menstrual-cycle-nutrition-plan-en.html',
      pdf: 'menstrual-cycle-nutrition-plan-en.pdf'
    },
    {
      html: 'natural-therapy-assessment.html',
      pdf: 'natural-therapy-assessment.pdf'
    },
    {
      html: 'natural-therapy-assessment-en.html',
      pdf: 'natural-therapy-assessment-en.pdf'
    }
  ];

  for (const file of files) {
    try {
      await generatePDF(file.html, file.pdf);
    } catch (error) {
      console.error(`Error generating ${file.pdf}:`, error);
    }
  }
}

// Run if called directly
if (require.main === module) {
  generateNewPDFs().then(() => {
    console.log('All new PDFs generated successfully!');
  }).catch(error => {
    console.error('Error generating PDFs:', error);
  });
}

module.exports = { generatePDF, generateNewPDFs };
