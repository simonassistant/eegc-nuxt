<template>
    <div class="flex-1 space-y-4 overflow-y-auto h-full pr-2">
        <!-- Original Draft Info for Training -->
        <div class="bg-gray-100 border border-gray-300 text-gray-800 rounded-md p-4 mb-4"
            v-if="currentMode == 'training'">
            Topic: Some people believe that individual actions are insignificant in the fight
            against climate change compared to the efforts of governments and large corporations. To
            what extent do you agree or disagree with this statement?
        </div>

        <!-- Topic Selector for Assessment -->
        <TopicSelector v-else :modelValue="currentTopic" @update:modelValue="$emit('update:currentTopic', $event)" />

        <!-- Original Essay/Draft Textarea -->
        <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-bold mb-2">
                {{ currentMode === "assessment" ? "Your Original Essay" : "Original Draft" }}
            </h2>

            <textarea :value="originalDraft" @input="$emit('update:originalDraft', $event.target.value)" rows="7"
                :placeholder="currentMode === 'assessment'
                    ? 'Paste your original essay here...'
                    : 'Paste or write the original draft here...'
                    " class="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                :disabled="isOriginalDraftConfirmed" />

            <button @click="$emit('confirmDraft')"
                class="w-full mt-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isOriginalDraftConfirmed">
                {{
                    currentMode === "assessment"
                        ? isOriginalDraftConfirmed
                            ? "Essay Confirmed"
                            : "Confirm Your Essay"
                        : isOriginalDraftConfirmed
                            ? "Draft Confirmed (Training)"
                            : "Confirm Training Draft"
                }}
            </button>
        </div>

        <!-- Checklist -->
        <div class="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 class="text-md font-semibold mb-2 text-gray-700">Checklist</h3>
            <ul style="list-style: none; padding: 0; margin: 0">
                <li style="margin-bottom: 8px">
                    <label> <input type="checkbox" /> Step 1: Revise thesis statement </label>
                </li>
                <li style="margin-bottom: 8px">
                    <label> <input type="checkbox" /> Step 2: Revise topic sentences </label>
                </li>
                <li style="margin-bottom: 8px">
                    <label> <input type="checkbox" /> Step 3: Revise one body paragraph </label>
                </li>
                <li style="margin-bottom: 8px">
                    <label>
                        <input type="checkbox" /> Step 4 (optional): Revise the rest of the essay
                    </label>
                </li>
                <li>
                    <label> <input type="checkbox" /> Step 5: Submit the final draft </label>
                </li>
            </ul>
        </div>

        <!-- Final Draft -->
        <div class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-bold mb-2">
                {{ currentMode === "assessment" ? "Revised Version" : "Final Draft" }}
            </h2>
            <div class="bg-gray-100 border border-gray-300 text-gray-800 rounded-md p-4 mb-4">
                Please revise the texts in the box below and complete the steps in the checklist
                above. When finished, please click the blue button to confirm the final draft and
                generate report. You will be asked to enter your name and student ID to receive the
                chat history and report via email.
            </div>
            <div class="relative w-full">
                <textarea :value="finalDraft" @input="$emit('update:finalDraft', $event.target.value)" rows="7"
                    :placeholder="currentMode === 'assessment'
                        ? 'This will be updated automatically as you revise through chat...'
                        : 'Paste or write the improved draft here...'
                        " class="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    :disabled="!isOriginalDraftConfirmed" />
            </div>

            <button @click="
                currentMode === 'assessment'
                    ? $emit('submitAssessment')
                    : $emit('confirmFinalDraft')
                " class="w-full mt-2 px-3 py-2 text-white rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                :class="currentMode === 'assessment' ? 'bg-green-600' : 'bg-blue-600'" :disabled="!isOriginalDraftConfirmed ||
                    isGeneratingAssessment ||
                    isSubmitted ||
                    isThinking
                    ">
                <span v-if="isGeneratingAssessment">
                    {{
                        currentMode === "assessment"
                            ? "🔄 Generating Assessment..."
                            : "🔄 Generating Report..."
                    }}
                </span>
                <span v-else>
                    {{
                        currentMode === "assessment"
                            ? "✅ Submit Assessment"
                            : "✅ Confirm Final Draft & Generate Report"
                    }}
                </span>
            </button>
        </div>
    </div>
</template>

<script setup>
import TopicSelector from "./TopicSelector.vue";

const props = defineProps({
    currentMode: String,
    currentTopic: String,
    originalDraft: String,
    finalDraft: String,
    isOriginalDraftConfirmed: Boolean,
    isGeneratingAssessment: Boolean,
    isSubmitted: Boolean,
    isThinking: Boolean,
});

const emits = defineEmits([
    "update:originalDraft",
    "update:finalDraft",
    "update:currentTopic",
    "confirmDraft",
    "submitAssessment",
    "confirmFinalDraft",
]);
</script>
