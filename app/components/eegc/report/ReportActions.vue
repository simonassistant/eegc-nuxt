<template>
  <div class="mt-6 flex flex-wrap justify-end gap-1" v-if="!generatingAnalysis">
    <button
      class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
      @click="$emit('submit')"
      :disabled="submitting || submitted"
    >
      <span v-if="submitting">⏳ Submitting...</span>
      <span v-else-if="submitted">✅ Submitted</span>
      <span v-else>🚀 Submit Report</span>
    </button>
    <button
      class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
      @click="$emit('downloadPDF')"
    >
      📥 Download PDF
    </button>
    <button
      class="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
      @click="$emit('downloadMarkdown')"
    >
      📝 Download Markdown
    </button>
    <button
      class="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white"
      @click="$emit('copyReport')"
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
</template>

<script setup>
defineProps({
  generatingAnalysis: Boolean,
  submitting: Boolean,
  submitted: Boolean,
});

defineEmits(["submit", "downloadPDF", "downloadMarkdown", "copyReport", "close"]);
</script>
