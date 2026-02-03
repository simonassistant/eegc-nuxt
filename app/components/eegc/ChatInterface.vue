<template>
  <div class="chat-interface flex-1 flex flex-col h-full">
    <div class="flex-1 p-5 overflow-hidden">
      <div class="w-full mx-auto flex gap-4" style="height: 80vh">
        <!-- Left: Chat messages + input -->
        <div class="flex flex-col w-1/2 h-full">
          <!-- Chat history -->
          <ChatMessageList :messages="activeChatHistory" />

          <!-- Chat input -->
          <ChatInput v-model="localUserMessage" :isThinking="isThinking" :isConnected="isConnected"
            :isSubmitted="isSubmitted" @sendMessage="$emit('sendMessage')" />
        </div>

        <!-- Right: Draft area -->
        <DraftSection :currentMode="currentMode" :currentTopic="currentTopic" v-model:originalDraft="localOriginalDraft"
          v-model:finalDraft="localFinalDraft" :isOriginalDraftConfirmed="isOriginalDraftConfirmed"
          :isGeneratingAssessment="isGeneratingAssessment" :isSubmitted="isSubmitted" :isThinking="isThinking"
          @update:currentTopic="selectTopic" @confirmDraft="$emit('confirmDraft')"
          @submitAssessment="$emit('submitAssessment')" @confirmFinalDraft="$emit('confirmFinalDraft')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ChatMessageList from "./chat/ChatMessageList.vue";
import ChatInput from "./chat/ChatInput.vue";
import DraftSection from "./chat/DraftSection.vue";

const props = defineProps({
  activeChatHistory: Array,
  currentMode: String,
  bulletPoints: String,
  isConnected: Boolean,
  isThinking: Boolean,
  isUpdatingDraft: Boolean,
  isSubmitted: Boolean,
  isGeneratingAssessment: Boolean,
  isOriginalDraftConfirmed: Boolean,
  userMessage: String,
  originalDraft: String,
  finalDraft: String,
});

const emits = defineEmits([
  "update:userMessage",
  "update:originalDraft",
  "update:finalDraft",
  "update:currentTopic",
  "sendMessage",
  "confirmDraft",
  "submitAssessment",
  "confirmFinalDraft",
]);

const currentTopic = ref("Automation");

function selectTopic(topic) {
  currentTopic.value = topic;
  emits("update:currentTopic", topic);
}

const localUserMessage = ref(props.userMessage);
const localOriginalDraft = ref(props.originalDraft);
const localFinalDraft = ref(props.finalDraft);

const bindSync = (localRef, propName) => {
  watch(localRef, (v) => emits(`update:${propName}`, v));
  watch(
    () => props[propName],
    (v) => (localRef.value = v)
  );
};
bindSync(localUserMessage, "userMessage");
bindSync(localOriginalDraft, "originalDraft");
bindSync(localFinalDraft, "finalDraft");

onMounted(() => {
  if (props.currentMode == "training") {
    localFinalDraft.value = props.originalDraft;
  }
});
</script>
