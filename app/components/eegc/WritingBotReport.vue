<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-5xl rounded-lg shadow-xl p-6 overflow-y-auto max-h-[90vh]">
      <!-- Header -->
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <h2 class="text-lg font-bold">📊 Learning Session Report</h2>
        <button class="text-gray-500 hover:text-gray-700 text-2xl" @click="$emit('close')">
          &times;
        </button>
      </div>
      <!-- New Rating & Comment Section -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg border" v-if="props.mode == 'assessment'">
        <h3 class="text-md font-semibold mb-3 text-gray-700">🌟 Session Feedback</h3>

        <!-- Rating Stars -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Rate Your Learning Session:
          </label>
          <div class="flex items-center gap-2">
            <template v-for="star in 5" :key="star">
              <button
                type="button"
                @click="rating = star"
                class="text-3xl font-bold transition-transform transform hover:scale-110 focus:outline-none"
                :class="star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'"
                aria-label="Rate {{ star }} star"
              >
                ★
              </button>
            </template>
            <span class="text-gray-700 font-medium">{{ rating }}/5</span>
          </div>
        </div>

        <!-- Comment Box -->
        <div>
          <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">
            Additional Comments:
          </label>
          <textarea
            id="comment"
            v-model="comment"
            placeholder="Share your thoughts about the session..."
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
      </div>
      <!-- User Input Section -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h3 class="text-md font-semibold mb-3 text-gray-700">📋 Student Information</h3>
        <div class="space-y-3">
          <div>
            <label for="studentEmail" class="block text-sm font-medium text-gray-700 mb-1">
              Your Email Address:
            </label>
            <input
              id="studentEmail"
              v-model="student_email"
              type="email"
              placeholder="Enter your email address"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label for="studentNumber" class="block text-sm font-medium text-gray-700 mb-1">
              Student Number:
            </label>
            <input
              id="studentNumber"
              v-model="student_number"
              type="text"
              placeholder="Enter your student number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label for="confirmStudentNumber" class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Student Number:
            </label>
            <input
              id="confirmStudentNumber"
              v-model="confirm_student_number"
              type="text"
              placeholder="Enter your student number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label for="sectionNumber" class="block text-sm font-medium text-gray-700 mb-1">
              Section Number:
            </label>
            <input
              id="sectionNumber"
              v-model="section_number"
              type="text"
              placeholder="Enter your section number"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Teacher:</label>
          <p class="border rounded-md px-3 py-2 bg-gray-100 text-gray-800">
            {{ teacher_name }} — {{ teacher_email }}
          </p>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap justify-end gap-1" v-if="!generatingAnalysis">
        <button
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
          @click="submitReport"
          :disabled="submitting || submitted"
        >
          <span v-if="submitting">⏳ Submitting...</span>
          <span v-else-if="submitted">✅ Submitted</span>
          <span v-else>🚀 Submit Report</span>
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          @click="downloadPDF"
        >
          📥 Download PDF
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
          @click="downloadMarkdown"
        >
          📝 Download Markdown
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white"
          @click="copyReport"
        >
          📋 Copy Text
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
      <div v-else class="mt-6 text-center text-gray-500">
        ⏳ Generating analysis, please wait...
      </div>
      <p><strong>Total Messages:</strong> {{ props.chatHistory.length }}</p>
      <h3>📈 Your Contribution Analysis</h3>
      <div
        class="prose prose-sm max-w-none break-words [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:whitespace-pre-wrap [&_ol]:list-decimal [&_ol]:ml-6 [&_ul]:list-disc"
        v-html="renderMarkdown(contributionAnalysis)"
      />
      <h3>📝 Complete Conversation</h3>
      <div ref="chatMessages" class="chat-messages flex-1 overflow-y-auto p-5 space-y-4">
        <div
          v-for="(msg, i) in chatHistory"
          :key="i"
          class="flex"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-lg md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow text-base break-words"
            :class="msgClasses(msg, i)"
          >
            <div class="font-semibold text-xs mb-1">
              {{ msgSenderLabel(msg.role) }}
            </div>

            <div
              class="prose prose-sm max-w-none break-words [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:whitespace-pre-wrap [&_ol]:list-decimal [&_ol]:ml-6 [&_ul]:list-disc"
              v-html="renderMarkdown(msg.content)"
            />
          </div>
        </div>
      </div>

      <div class="text-sm text-gray-500 mt-4">Generated: {{ timestamp }}</div>
    </div>
  </div>
</template>

<script setup>
import { jsPDF } from "jspdf";
import MarkdownIt from "markdown-it";
import studentSectionMap from "~/components/eegc/student_section_map.json";
import sectionInfoMap from "~/components/eegc/section_info_map.json";
import Swal from "sweetalert2";

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});
const emit = defineEmits(["submit", "close"]);
const props = defineProps({
  show: Boolean,
  chatHistory: {
    type: Array,
    default: () => [],
  },
  reportGenerationInstructions: {
    type: String,
  },
  bccEmail: {
    type: Array,
  },
  hiddenReport: {
    type: String,
  },
  ccEmail: {
    type: Array,
  },
  reprotInfo: {
    type: String,
  },
  mode: {
    type: String,
  },
});

const timestamp = ref("");
const student_number = ref("");
const confirm_student_number = ref("");
const section_number = ref("");
const contributionAnalysis = ref("[Analyzing contribution...]");
const generatingAnalysis = ref(true);
const teacher_name = ref("");
const teacher_email = ref("");
const rating = ref(0);
const comment = ref("");

watch(student_number, (newVal) => {
  if (newVal && studentSectionMap[newVal]) {
    const secNum = studentSectionMap[newVal];
    section_number.value = secNum;
    teacher_name.value = sectionInfoMap[secNum].teacher;
    teacher_email.value = sectionInfoMap[secNum].email;
  } else {
    section_number.value = "";
    teacher_name.value = "No Teacher Found";
    teacher_email.value = "Please Check Your Student Number";
  }
});

watch(
  () => props.show,
  async (val) => {
    if (val) {
      timestamp.value = new Date().toLocaleString();
      if (props.chatHistory.length) {
        contributionAnalysis.value = "[Analyzing contribution...]";
        contributionAnalysis.value = await analyzeContribution(props.chatHistory, props);
      }
    }
  }
);

function renderMarkdown(text) {
  return markdown.render(text || "");
}
function msgSenderLabel(role) {
  return role === "user" ? "You" : "AI Assistant";
}

function msgClasses(msg) {
  return msg.role === "user"
    ? "bg-indigo-600 text-white rounded-br-none"
    : "bg-gray-100 text-gray-800 rounded-bl-none";
}

async function analyzeContribution(userMessages, props) {
  generatingAnalysis.value = true;
  try {
    const chat_history = [
      {
        role: "user",
        content: `${props.reportGenerationInstructions} here are the chat history ${JSON.stringify(
          userMessages
        )}`,
      },
    ];
    const res = await fetch("/api/poe-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_history,
        model_name: "gpt-5.2-instant",
        stream: false,
      }),
    });

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || data?.error || "[No response]";
  } catch (err) {
    console.error("Error analyzing contribution:", err);
    return "[Request failed]";
  } finally {
    generatingAnalysis.value = false;
  }
}

function downloadPDF() {
  const history = props.chatHistory;
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
  const analysisLines = doc.splitTextToSize(contributionAnalysis.value, 170);
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

    doc.setFontSize(9);
    doc.text(msg.timestamp.toLocaleTimeString(), 20, yPos);
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

function downloadMarkdown() {
  const report = createMarkdownReport(props.chatHistory);
  const blob = new Blob([report], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `HKBU_Learning_Report_${new Date().toISOString().split("T")[0]}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function createMarkdownReport(history) {
  const now = new Date();
  let markdown = `# 📊 HKBU Learning Session Report

**Generated:** ${now.toLocaleString()}
**Total Messages:** ${history.length}

## 📈 Your Contribution Analysis

${contributionAnalysis.value}

## 📝 Complete Conversation

`;

  history.forEach((msg) => {
    const role = msg.role === "user" ? "👤 **You**" : "🤖 **Assistant**";
    markdown += `### ${role} (${msg.timestamp.toLocaleTimeString()})\n\n${msg.content}\n\n`;
  });

  markdown += `---
*Created by: Dr. Simon Wang, Innovation Officer*
*Language Centre, Hong Kong Baptist University*
*simonwang@hkbu.edu.hk*`;

  return markdown;
}

async function copyReport() {
  try {
    const report = createMarkdownReport(props.chatHistory);
    await navigator.clipboard.writeText(report);
    alert("✅ Full markdown report copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy report:", error);
    alert("❌ Failed to copy report.");
  }
}

const student_email = ref("@life.hkbu.edu.hk");
const submitting = ref(false);
const submitted = ref(false);

async function submitReport() {
  const history = props.chatHistory;

  if (!history.length) {
    alert("No conversation to export");
    return;
  }

  if (student_number.value !== confirm_student_number.value) {
    alert("Student number does not match!");
    return;
  }

  if (!isValidEmail(student_email.value)) {
    alert("Please enter a valid email address");
    return;
  }

  submitting.value = true;

  try {
    const response = await fetch("/api/submit-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_number: student_number.value,
        student_email: student_email.value,
        section_number: section_number.value,
        rating: rating.value,
        comment: comment.value,
        mode: props.mode,
        teacher_name: teacher_name.value,
        chat_history: history,
        contribution_analysis: contributionAnalysis.value,
        hidden_report: props.hiddenReport,
        report_info: props.reprotInfo,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.statusMessage || "Failed to submit report");
    }

    submitted.value = true;
    emit("submit");
    await Swal.fire({
      icon: "success",
      title: "Assessment Submitted",
      text: "Your assessment has been submitted successfully.",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.error("Submission error:", error);
    alert(`Error: ${error.message}`);
  } finally {
    submitting.value = false;
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
</script>
