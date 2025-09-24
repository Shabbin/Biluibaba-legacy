const handlebars = require("handlebars");
const puppeteer = require("puppeteer");

module.exports.generateInvoicePDF = async (invoiceTemplate, invoiceData) => {
  let browser = null;

  try {
    let html;
    try {
      html = handlebars.compile(invoiceTemplate)(invoiceData);
    } catch (error) {
      console.error("Error compiling invoice template:", error.message);
      throw new Error("Failed to compile invoice template");
    }

    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1696 });

    await page.setContent(html, {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 30000,
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating invoice PDF:", error.message);
  } finally {
    // Always close the browser to prevent memory leaks
    if (browser) {
      await browser.close();
    }
  }
};
