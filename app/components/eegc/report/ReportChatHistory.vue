<template>
  <div class="chat-messages flex-1 overflow-y-auto p-5 space-y-4">
    <div
      v-for="(msg, i) in chatHistory"
      :key="i"
      class="flex"
      :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
    >
      <div
        class="max-w-lg md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow text-base break-words"
        :class="msgClasses(msg)"
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
</template>

<script setup>
defineProps({
  chatHistory: {
    type: Array,
    default: () => [],
  },
  renderMarkdown: Function,
});

function msgSenderLabel(role) {
  return role === "user" ? "You" : "AI Assistant";
}

function msgClasses(msg) {
  return msg.role === "user"
    ? "bg-indigo-600 text-white rounded-br-none"
    : "bg-gray-100 text-gray-800 rounded-bl-none";
}
</script>
