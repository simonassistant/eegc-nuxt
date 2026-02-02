<template>
  <!-- Main Content -->
  <div class="w-full p-4 flex-1 flex flex-col">
    <!-- Header -->
    <EegcCourseHeader />
    <!-- Mode Selection -->
    <EegcModeSelector
      :currentMode="currentMode"
      :isThinking="isThinking"
      :modeLabels="modeLabels"
      :modeColors="modeColors"
      :is-open="isModeSelectorOpen"
      @switch-mode="switchMode"
      @toggle-open="isModeSelectorOpen = $event"
    />
    <div
      class="flex-1 transition-all duration-500 ease-in-out p-4"
      :class="isModeSelectorOpen ? 'ml-64' : 'ml-0'"
    >
      <!-- Mode Rendering -->
      <template v-if="currentMode === 'briefing'">
        <div class="w-full p-4 flex-1">
          <div class="mb-6 p-4 bg-gray-50 rounded-lg text-center">
            <h2 class="text-xl font-bold text-gray-900 mb-1">Connect to Chatbot</h2>
            <p class="text-gray-600 text-sm mb-4">
              Configure your API settings to start using the chatbot
            </p>

            <div class="flex flex-col gap-4 justify-center items-stretch w-full">
              <div class="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 class="font-semibold text-yellow-800 mb-2 text-sm">🤖 Model Selection</h3>

                <div class="flex flex-col items-center gap-2">
                  <div class="w-full md:w-1/2 text-left flex flex-col">
                    <label class="block text-xs font-semibold text-gray-700 mb-1">
                      Select Chatbot Model
                    </label>
                    <select
                      v-model="model"
                      class="w-full border rounded-lg p-2 text-sm focus:ring focus:ring-indigo-300"
                    >
                      <optgroup label="Available Models">
                        <option value="gpt-5.2">GPT-5.2</option>
                        <option value="gemini-3-flash">Gemini 3 Flash</option>
                        <option value="gpt-5.2-instant">GPT-5.2 Instant</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-4 justify-center mt-4">
              <button
                class="px-20 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-50 transition-opacity"
                @click="connectAPI"
                :disabled="isConnecting || isConnected || !model"
              >
                <span v-if="isConnecting">🔄 Connecting...</span>
                <span v-else-if="isConnected">✔️ Connected</span>
                <span v-else>✅ Connect</span>
              </button>
              <button
                class="px-20 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-medium"
                @click="clearAPI"
                :disabled="isConnecting"
              >
                🗑️ Clear
              </button>
            </div>

            <div
              v-if="notification.visible"
              class="mt-3 p-3 rounded-lg text-sm text-center"
              :class="
                notification.type === 'success'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              "
            >
              {{ notification.message }}
            </div>
          </div>
        </div>
        <EegcBriefMode />
      </template>
      <!-- Training Mode Section -->
      <div v-if="currentMode == 'training'" class="mb-6 p-6 bg-gray-50 rounded-lg">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-900">🎓 Training Mode Tutorial</h2>
          <div class="flex gap-2">
            <button
              @click="isTrainingTutorialVisible = !isTrainingTutorialVisible"
              class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              {{ isTrainingTutorialVisible ? "▼ Hide Tutorial" : "▶ Show Tutorial" }}
            </button>

            <button
              @click="openTutorial"
              class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              🔗 Jump to Tutorial
            </button>
          </div>
        </div>
        <div
          v-if="isTrainingTutorialVisible"
          class="bg-white border border-gray-300 rounded-lg p-4 shadow-sm"
        >
          <iframe
            src="https://smartlessons.hkbu.tech/tutorial-training-mode.html"
            width="100%"
            height="800"
            allow="fullscreen"
            style="border: 0; min-height: 640px"
            title="Training Mode Tutorial"
          />
        </div>
      </div>
      <EegcBackgroundAndRubrics
        v-if="currentMode == 'training'"
        v-model:courseInfo="courseInfo"
        v-model:currentMode="currentMode"
        v-model:isShowArea="isTrainingBackgroundAreaVisible"
        v-model:isSubmitted="hasSubmittedTrainingBackground"
        @submitAll="handleSubmitRubrics"
        @toggleArea="isTrainingBackgroundAreaVisible = $event"
      />
      <EegcBackgroundAndRubrics
        v-if="currentMode == 'assessment'"
        v-model:courseInfo="courseInfoAssessment"
        v-model:currentMode="currentMode"
        v-model:isShowArea="isAssessmentBackgroundAreaVisible"
        v-model:isSubmitted="hasSubmittedAssessmentBackground"
        @submitAll="handleSubmitRubrics"
        @toggleArea="isAssessmentBackgroundAreaVisible = $event"
      />
      <!-- Chat Interface -->
      <EegcChatInterface
        v-if="
          (currentMode == 'training' && hasSubmittedTrainingBackground) ||
          (currentMode == 'assessment' && hasSubmittedAssessmentBackground)
        "
        v-model:userMessage="userMessage"
        v-model:originalDraft="originalDraft"
        v-model:finalDraft="finalDraft"
        :activeChatHistory="activeChatHistory"
        :currentMode="currentMode"
        :isConnected="isConnected"
        :isThinking="isThinking"
        :isUpdatingDraft="isUpdatingDraft"
        :isGeneratingAssessment="isGeneratingAssessment"
        :isOriginalDraftConfirmed="isOriginalDraftConfirmed"
        :isSubmitted="isSubmitted"
        :bulletPoints="bulletPoints"
        @sendMessage="sendMessage"
        @confirmDraft="confirmDraft"
        @submitAssessment="submitAssessment"
        @confirmFinalDraft="confirmFinalDraft"
        @update:currentTopic="handleTopicChange"
      />

      <!-- Report Modal -->
      <EegcWritingBotReport
        v-bind="{
          show: showReport,
          chatHistory: reportChatHistory,
          reportGenerationInstructions,
          hiddenReport,
          bccEmail,
          ccEmail,
          reprotInfo,
          mode: currentMode,
        }"
        @close="showReport = false"
        @submit="isSubmitted = true"
      />
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
/* ------------ State ------------ */
const currentMode = ref("briefing");
const stats = ref({ exchanges: 0, questions: 0, revisions: 0 });

/* Separate drafts by mode */
const trainingOriginalDraft = ref("");
const trainingFinalDraft = ref("");
const assessmentOriginalDraft = ref("");
const assessmentFinalDraft = ref("");

/* Active working drafts */
const originalDraft = ref("");
const finalDraft = ref("");
const userMessage = ref("");

/* Chat histories per mode */
const trainingChatHistory = ref([]);
const assessmentChatHistory = ref([]);
const activeChatHistory = ref([]);

/* Other UI and session states */
const showReport = ref(false);
const reportChatHistory = ref([]);
const reportGenerationInstructions = ref("");
const isSubmitted = ref(false);
const isModeSelectorOpen = ref(true);
const bccEmail = ref([]);
const ccEmail = ref([]);
const isGeneratingAssessment = ref(false);
const isUpdatingDraft = ref(false);
const hiddenReport = ref("");
const notification = ref({ message: "", type: "success", visible: false });
const isThinking = ref(false);
const isConnected = ref(false);
const isConnecting = ref(false);
const model = ref("gpt-5.2-instant");
const isOriginalDraftConfirmed = ref(false);
const bulletPoints = ref("No bullet points extracted yet.");
const hasSubmittedTrainingBackground = ref(false);
const hasSubmittedAssessmentBackground = ref(false);
const rubric = ref(Rubric);
const isTrainingModeFinished = ref(false);
const isTrainingBackgroundAreaVisible = ref(true);
const isAssessmentBackgroundAreaVisible = ref(true);
const isTrainingTutorialVisible = ref(false);
const essay = Sample_Essay
const courseInfo = ref(`Course Information:
Course: LANG 0036 - English for Academic Purposes
Level: Intermediate to Advanced
Focus: Academic writing and critical thinking
Assessment: Essay writing with rubric-based evaluation\n
Student Background:
Academic Level: University student
Language: English as additional language
Goals: Improve academic writing skills
Challenges: Structure, vocabulary, critical analysis\n
Rubric:
${Rubric}`);

const courseInfoAssessment = ref(`
  Course Information:
  Course:
  Level:
  Focus:
  Assessment: \n
  Student Background:
  Academic Level:
  Language:
  Goals:
  Challenges: \n
  Rubric:
`);

const reprotInfo = ref("");
const currentTopic = ref(`Some people believe that individual actions are insignificant in the fight
            against climate change compared to the efforts of governments and large corporations. To
            what extent do you agree or disagree with this statement?`);
const modeColors = {
  training: "bg-green-100 text-green-800",
  assessment: "bg-red-100 text-red-800",
  briefing: "bg-blue-100 text-blue-800",
};

const modeLabels = {
  training: "Training Mode Active",
  assessment: "Assessment Mode Active",
  briefing: "Briefing Mode Active",
};

const greetings = {
  training: Training_Greetings,
  assessment: Assessment_Greetings,
  briefing: "Welcome to LANG 0036! Configure your API to start.",
};

const { sendMessage, talkToChatbot } = useChatFunctions({
  userMessage,
  currentMode,
  activeChatHistory,
  originalDraft,
  finalDraft,
  bulletPoints,
  isConnected,
  model,
  isThinking,
  isOriginalDraftConfirmed,
  isUpdatingDraft,
  courseInfo,
  courseInfoAssessment,
  currentTopic,
});

function openTutorial() {
  window.open("https://smartlessons.hkbu.tech/tutorial-training-mode.html", "_blank");
}

function handleTopicChange(newTopic) {
  if (newTopic.toLowerCase() == "automation") {
    currentTopic.value = `Automation is transforming industries, potentially reducing jobs while boosting
                  efficiency. Does this technological shift ultimately enhance or undermine global
                  employment prospects in the long term?`;
  } else if (newTopic.toLowerCase() == "migrant") {
    currentTopic.value = `Migrant workers face exploitation due to weak regulations, enduring long hours and
                  unfair pay. Should governments enforce stricter laws to safeguard their rights?`;
  }
}

/* ------------ Mode Switching ------------ */
async function switchMode(mode) {
  if (!isConnected.value && mode !== "briefing") {
    return Swal.fire({
      title: "Not connected to API",
      text: "Please connect to the chatbot API before switching modes.",
      icon: "warning",
    });
  }
  if (currentMode.value === "training") {
    trainingOriginalDraft.value = originalDraft.value;
    trainingFinalDraft.value = finalDraft.value;
  } else if (currentMode.value === "assessment") {
    assessmentOriginalDraft.value = originalDraft.value;
    assessmentFinalDraft.value = finalDraft.value;
  }

  currentMode.value = mode;
  stats.value = { exchanges: 0, questions: 0, revisions: 0 };
  if (mode == "training") isOriginalDraftConfirmed.value = true;
  else isOriginalDraftConfirmed.value = false;

  const chatMap = {
    training: trainingChatHistory,
    assessment: assessmentChatHistory,
  };

  if (mode in chatMap) {
    activeChatHistory.value = chatMap[mode].value;
    if (!chatMap[mode].value.length)
      chatMap[mode].value.push(makeChatHistoryEntry("assistant", greetings[mode]));

    originalDraft.value =
      mode === "training"
        ? trainingOriginalDraft.value || essay
        : assessmentOriginalDraft.value || "";
    finalDraft.value = mode === "training" ? trainingFinalDraft.value : assessmentFinalDraft.value;
  } else {
    activeChatHistory.value = [];
  }
}

/* Sync draft changes to their mode-specific refs */
watch([originalDraft, finalDraft, currentMode], () => {
  if (currentMode.value === "training") {
    trainingOriginalDraft.value = originalDraft.value;
    trainingFinalDraft.value = finalDraft.value;
  } else if (currentMode.value === "assessment") {
    assessmentOriginalDraft.value = originalDraft.value;
    assessmentFinalDraft.value = finalDraft.value;
  }
});

/* ------------ Utilities ------------ */
const makeChatHistoryEntry = (role, content) => ({
  role,
  content,
  timestamp: new Date(),
});

const showNotification = (msg, type = "success") => {
  notification.value = { message: msg, type, visible: true };
  setTimeout(() => (notification.value.visible = false), 3000);
};

function handleSubmitRubrics(newBackground) {
  if (currentMode.value == "assessment") {
    hasSubmittedAssessmentBackground.value = true;
    courseInfoAssessment.value = newBackground;
    Swal.fire({
      title: "Rubrics Submitted!",
      text: "The information is sent to AI tutor.",
      icon: "success",
    });
  } else {
    hasSubmittedTrainingBackground.value = true;
    courseInfo.value = newBackground;
    navigator.clipboard.writeText(rubric.value);
    Swal.fire({
      title: "Rubrics Submitted!",
      text: `The informationhave been submitted. Please note that this is training mode, so the
      information has been pre-filled for your convenience. You will be required to enter it
      manually in assessment mode. The rubrics have also been copied to your clipboard for easy pasting later.`,
      icon: "success",
    });
  }
}

/* ------------ API and Chat ------------ */
async function connectAPI() {
  isConnecting.value = true;

  try {
    const reply = await talkToChatbot([
      { role: "system", content: "connection test, return 1" },
      { role: "user", content: "Hello!" },
    ]);
    isConnected.value = reply?.trim().length > 0;
    showNotification(
      isConnected.value ? "✅ Connected!" : "⚠️ No valid reply",
      isConnected.value ? "success" : "error"
    );
  } catch {
    showNotification("❌ Connection failed", "error");
  } finally {
    isConnecting.value = false;
  }
}

const clearAPI = () => {
  isConnected.value = false;
  activeChatHistory.value = [];
};

const confirmDraft = () => {
  if (!originalDraft.value.trim())
    return alert(
      currentMode.value === "assessment"
        ? "Please paste your essay first."
        : "Please paste the original draft first."
    );
  isOriginalDraftConfirmed.value = true;
  finalDraft.value = originalDraft.value;
};

/* ------------ Report Generation ------------ */
async function generateAssessmentReport(mode = "final") {
  isGeneratingAssessment.value = true;
  isThinking.value = true;
  try {
    const data = {
      original: originalDraft.value || "(empty)",
      revised: finalDraft.value || "(empty)",
      chat: activeChatHistory.value.map(({ role, content, timestamp }) => ({
        role,
        content,
        timestamp,
      })),
    };

    const report = await talkToChatbot([
      {
        role: "system",
        content: `
                  Check whether the student has completed the following tasks:
                    1. Revised the thesis statement
                    2. Revised one of the topic sentence
                    3. Revised one of the body paragraph

                    If the student has not completed any of the above tasks, then you should say 'not finished'.

                    Then execute the following:
                    ${AssessBot_Prompt}\n\n${JSON.stringify(data, null, 2)}`,
      },
      { role: "user", content: makeReportTemplate(mode) },
    ]);
    if (report.includes("not finish")) {
      const result = await Swal.fire({
        text: "It seems that you have not revised all the required components (thesis statement, topic sentence, body paragraph). Please make sure to complete these revisions before generating the report.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirm to Submit",
        cancelButtonText: "Back to editing",
        reverseButtons: true,
      });

      if (!result.isConfirmed) {
        isGeneratingAssessment.value = false;
        return;
      }
      isGeneratingAssessment.value = false;
    }
    hiddenReport.value = report;
    isTrainingModeFinished.value = true;
    reportGenerationInstructions.value = makeReportHeader(mode, report);
    reportChatHistory.value = [
      makeChatHistoryEntry("system", `Original:\n${data.original}\n\nRevised:\n${data.revised}`),
      ...activeChatHistory.value,
    ];
    bccEmail.value =
      currentMode.value === "training"
        ? ["simonwanghkteacher@gmail.com", "azikabanyuki2@gmail.com"]
        : ["simonwanghkteacher+test@gmail.com", "azikabanyuki2@gmail.com"];
    if (currentMode.value === "training") {
      reprotInfo.value = courseInfo.value;
    } else if (currentMode.value === "assessment") {
      reprotInfo.value = courseInfoAssessment.value;
    }
    showReport.value = true;
    showNotification(`📊 ${mode === "training" ? "Training" : "Assessment"} report generated!`);
  } catch (e) {
    console.error(e);
    showNotification("⚠️ Error generating report — fallback used", "error");
  } finally {
    isGeneratingAssessment.value = false;
    isThinking.value = false;
  }
}

const makeReportTemplate = (mode) =>
  mode === "training"
    ? "Please provide a student training progress report emphasizing AI collaboration."
    : "Please provide a comprehensive assessment based on the essay and chat history.";

const makeReportHeader = (mode, body) =>
  `${
    mode === "training" ? "TRAINING" : "FINAL"
  } ASSESSMENT REPORT\n\n${body}\n\n(Do not mention scores.)`;

const submitAssessment = async () => {
  if (!isOriginalDraftConfirmed.value) return alert("Please confirm your original essay first.");
  await generateAssessmentReport("final");
};

const confirmFinalDraft = async () => {
  if (!originalDraft.value.trim() || !finalDraft.value.trim())
    return alert("Please paste your final draft first.");
  await generateAssessmentReport("training");
};

/* ------------ Lifecycle ------------ */
const handleBeforeUnload = (e) => {
  if (!isSubmitted.value) {
    e.preventDefault();
    e.returnValue = "";
    Swal.fire({
      text: "You have not sent the report yet. Please make sure to submit before leaving.",
      icon: "warning",
    });
  }
};

onMounted(async () => {
  window.addEventListener("beforeunload", handleBeforeUnload);
  switchMode(currentMode.value);
});

onBeforeUnmount(() => window.removeEventListener("beforeunload", handleBeforeUnload));
</script>
