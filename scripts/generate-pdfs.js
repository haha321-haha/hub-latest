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

async function generateAllPDFs() {
  const files = [
    // Chinese versions
    {
      html: 'campus-emergency-checklist.html',
      pdf: 'campus-emergency-checklist.pdf'
    },
    {
      html: 'parent-communication-guide.html',
      pdf: 'parent-communication-guide.pdf'
    },
    {
      html: 'teacher-health-manual.html',
      pdf: 'teacher-health-manual.pdf'
    },
    {
      html: 'healthy-habits-checklist.html',
      pdf: 'healthy-habits-checklist.pdf'
    },
    {
      html: 'zhan-zhuang-baduanjin-illustrated-guide.html',
      pdf: 'zhan-zhuang-baduanjin-illustrated-guide.pdf'
    },
    // English versions
    {
      html: 'campus-emergency-checklist-en.html',
      pdf: 'campus-emergency-checklist-en.pdf'
    },
    {
      html: 'parent-communication-guide-en.html',
      pdf: 'parent-communication-guide-en.pdf'
    },
    {
      html: 'teacher-health-manual-en.html',
      pdf: 'teacher-health-manual-en.pdf'
    },
    {
      html: 'healthy-habits-checklist-en.html',
      pdf: 'healthy-habits-checklist-en.pdf'
    },
    {
      html: 'zhan-zhuang-baduanjin-illustrated-guide-en.html',
      pdf: 'zhan-zhuang-baduanjin-illustrated-guide-en.pdf'
    },
    {
      html: 'teacher-collaboration-handbook.html',
      pdf: 'teacher-collaboration-handbook.pdf'
    },
    {
      html: 'teacher-collaboration-handbook-en.html',
      pdf: 'teacher-collaboration-handbook-en.pdf'
    },
    // New professional guides
    {
      html: 'specific-menstrual-pain-management-guide.html',
      pdf: 'specific-menstrual-pain-management-guide.pdf'
    },
    {
      html: 'specific-menstrual-pain-management-guide-en.html',
      pdf: 'specific-menstrual-pain-management-guide-en.pdf'
    },
    {
      html: 'menstrual-pain-complications-management.html',
      pdf: 'menstrual-pain-complications-management.pdf'
    },
    {
      html: 'menstrual-pain-complications-management-en.html',
      pdf: 'menstrual-pain-complications-management-en.pdf'
    },
    // Magnesium & Gut Health Guide
    {
      html: 'magnesium-gut-health-menstrual-pain-guide.html',
      pdf: 'magnesium-gut-health-menstrual-pain-guide.pdf'
    },
    {
      html: 'magnesium-gut-health-menstrual-pain-guide-en.html',
      pdf: 'magnesium-gut-health-menstrual-pain-guide-en.pdf'
    },
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
  generateAllPDFs().then(() => {
    console.log('All PDFs generated successfully!');
  }).catch(error => {
    console.error('Error generating PDFs:', error);
  });
}

module.exports = { generatePDF, generateAllPDFs };
