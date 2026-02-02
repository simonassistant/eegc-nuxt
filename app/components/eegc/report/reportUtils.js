import { jsPDF } from "jspdf";

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

export function downloadPDF(history, contributionAnalysis) {
  if (!history.length) {
    alert("No conversation to export");
    return;
  }

  const doc = new jsPDF();
  let yPos = 20;

  doc.setFontSize(18);
  doc.text("HKBU Learning Session Report", 20, yPos);
  yPos += 15;

  const now = new Date();

  doc.setFontSize(12);
  doc.text(`Generated: ${now.toLocaleString()}`, 20, yPos);
  yPos += 7;
  doc.text(`Total Messages: ${history.length}`, 20, yPos);
  yPos += 15;

  doc.setFontSize(14);
  doc.text("Your Contribution Analysis", 20, yPos);
  yPos += 7;
  doc.setFontSize(11);
  const analysisLines = doc.splitTextToSize(contributionAnalysis, 170);
  analysisLines.forEach((line) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 20, yPos);
    yPos += 6;
  });
  yPos += 10;

  doc.setFontSize(14);
  doc.text("Complete Conversation", 20, yPos);
  yPos += 10;

  doc.setFontSize(11);
  history.forEach((msg) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    const role = msg.role === "user" ? "You:" : "Assistant:";
    doc.setFont(undefined, "bold");
    doc.text(role, 20, yPos);
    doc.setFont(undefined, "normal");
    yPos += 6;

    const lines = doc.splitTextToSize(msg.content, 170);
    lines.forEach((line) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 20, yPos);
      yPos += 6;
    });

    const time = msg.timestamp instanceof Date ? msg.timestamp.toLocaleTimeString() : new Date(msg.timestamp).toLocaleTimeString();
    doc.setFontSize(9);
    doc.text(time, 20, yPos);
    doc.setFontSize(11);
    yPos += 10;
  });

  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  yPos += 10;
  doc.setFontSize(10);
  doc.text("Created by: Dr. Simon Wang, Innovation Officer", 20, yPos);
  yPos += 5;
  doc.text("Language Centre, Hong Kong Baptist University", 20, yPos);
  yPos += 5;
  doc.text("simonwang@hkbu.edu.hk", 20, yPos);

  doc.save(`HKBU_Learning_Report_${new Date().toISOString().split("T")[0]}.pdf`);
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
