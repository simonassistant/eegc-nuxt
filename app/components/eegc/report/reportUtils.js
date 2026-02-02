import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import MarkdownIt from "markdown-it";

// Ensure html2canvas is available globally for jsPDF
if (typeof window !== "undefined") {
  window.html2canvas = html2canvas;
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export function createMarkdownReport(history, contributionAnalysis) {
  const now = new Date();
  let markdown = `# 📊 HKBU Learning Session Report

**Generated:** ${now.toLocaleString()}
**Total Messages:** ${history.length}

## 📈 Your Contribution Analysis

${contributionAnalysis}

## 📝 Complete Conversation

`;

  history.forEach((msg) => {
    const role = msg.role === "user" ? "👤 **You**" : "🤖 **Assistant**";
    const time = msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString() : new Date(msg.timestamp).toLocaleTimeString();
    markdown += `### ${role} (${time})

${msg.content}

`;
  });

  markdown += `---
*Created by: Dr. Simon Wang, Innovation Officer*
*Language Centre, Hong Kong Baptist University*
*simonwang@hkbu.edu.hk*`;

  return markdown;
}

export async function downloadPDF(history, contributionAnalysis) {
  if (!history.length) {
    alert("No conversation to export");
    return;
  }

  const now = new Date();
  const analysisHtml = contributionAnalysis ? md.render(contributionAnalysis) : "<p>No analysis available.</p>";
  
  let conversationHtml = "";
  history.forEach((msg) => {
    const role = msg.role === "user" ? "You" : "Assistant";
    const time = msg.timestamp instanceof Date ? msg.timestamp.toLocaleString() : new Date(msg.timestamp).toLocaleString();
    const contentHtml = md.render(msg.content || "");
    
        conversationHtml += `
      <div class="message ${msg.role}" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee; page-break-inside: avoid;">
        <div class="message-header" style="margin-bottom: 5px; font-size: 13px;">
          <strong>${role}</strong> <span class="timestamp" style="color: #888; margin-left: 10px;">${time}</span>
        </div>
        <div class="message-content" style="font-size: 14px;">${contentHtml}</div>
      </div>
    `;

  });

        const htmlContent = `
    <div id="pdf-content" style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; width: 700px; background: white;">
      <h1 style="color: #004085; border-bottom: 2px solid #004085; padding-bottom: 15px; margin: 0 0 20px 0; display: block; width: 100%;">HKBU Learning Session Report</h1>
      
      <div class="meta" style="margin-bottom: 25px; color: #666; font-size: 13px; display: block;">
        <p style="margin: 5px 0;">Generated: ${now.toLocaleString()}</p>
        <p style="margin: 5px 0;">Total Messages: ${history.length}</p>
      </div>

      <div class="section" style="page-break-inside: avoid; margin-bottom: 30px; display: block;">
        <h2 style="color: #004085; font-size: 18px; margin-bottom: 15px;">Your Contribution Analysis</h2>
        <div class="analysis-content" style="background: #f8f9fa; padding: 20px; border-radius: 5px; border-left: 5px solid #004085; display: block;">
          ${analysisHtml}
        </div>
      </div>

      <div class="section" style="display: block;">
        <h2 style="color: #004085; font-size: 18px; margin-top: 30px; margin-bottom: 15px;">Complete Conversation</h2>
        <div class="conversation-history" style="display: block;">
          ${conversationHtml}
        </div>
      </div>

      <div class="footer" style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 11px; color: #666; page-break-inside: avoid; display: block;">
        <p style="margin: 5px 0;"><strong>Created by:</strong> Dr. Simon Wang, Innovation Officer</p>
        <p style="margin: 5px 0;">Language Centre, Hong Kong Baptist University</p>
        <p style="margin: 5px 0;">simonwang@hkbu.edu.hk</p>
      </div>
    </div>
  `;



  // Create a temporary container to render HTML
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-10000px";
  container.style.top = "0";
  container.style.zIndex = "-9999";
  container.innerHTML = htmlContent;
  document.body.appendChild(container);

  try {
    // Wait for DOM to render
    await new Promise(resolve => setTimeout(resolve, 500));

    const target = container.querySelector('#pdf-content');

        // Use jsPDF's built-in html method for better multi-page support
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });

    await doc.html(target, {
      callback: function (doc) {
        doc.save(`HKBU_Learning_Report_${new Date().toISOString().split("T")[0]}.pdf`);
      },
      margin: [40, 40, 40, 40],
      autoPaging: 'text',
      x: 0,
      y: 0,
      width: 515, // A4 width (595.28) - margins (80)
      windowWidth: 700, // Matching the width of our container div
    });


  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

export function downloadMarkdownFile(reportText) {
  const blob = new Blob([reportText], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `HKBU_Learning_Report_${new Date().toISOString().split("T")[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
