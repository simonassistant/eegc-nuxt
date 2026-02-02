<template>
  <div class="p-6 bg-gray-50 rounded-lg">
    <h2 class="text-center text-2xl font-bold text-gray-900 mb-6">
      📝 Course, Student Background & Rubric
    </h2>

    <!-- Toggle Button -->
    <div class="flex justify-center mb-4">
      <button
        @click="toggleArea"
        class="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-5 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
      >
        {{ isAreaVisible ? "Hide Background Info" : "Show Background Info" }}
      </button>
    </div>

    <!-- Unified Plain Text Input (toggle visibility) -->
    <div v-if="isAreaVisible" class="bg-white border border-gray-300 rounded-lg p-4 mb-6 shadow-sm">
      <div class="bg-gray-100 border border-gray-300 text-gray-800 rounded-md p-4 mb-4">
        The first goal of this AI training module is to remind students to share contextual
        information about their tasks with AI. The following background information is prepared for
        you to submit to AI. The customised chatbot will then "keep this info in mind" and take it
        into consideration when interacting with students.
      </div>

      <textarea
        v-model="combinedInput"
        :disabled="props.isSubmitted"
        placeholder="Enter Course Information, Student Background, and Rubric here..."
        rows="20"
        class="w-full border border-gray-300 rounded-md p-3 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      <!-- Action Buttons -->
      <div class="flex justify-center gap-4">
        <button
          @click="handleSubmit"
          :disabled="props.isSubmitted"
          class="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 font-semibold px-6 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
        >
          Submit All
        </button>
        <button
          @click="handleClear"
          :disabled="props.isSubmitted"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 font-medium px-6 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Swal from "sweetalert2";

const props = defineProps({
  courseInfo: { type: String, required: true },
  isShowArea: { type: Boolean, default: true },
  rubric: { type: String, default: "" },
  isSubmitted: { type: Boolean, default: false },
  currentMode: { type: String, default: "assessment" },
});

const emit = defineEmits(["submitAll", "toggleArea"]);

const combinedInput = ref("");
const isAreaVisible = ref(true);

onMounted(() => {
  combinedInput.value = props.courseInfo;
  isAreaVisible.value = props.isShowArea;
});

const toggleArea = () => {
  isAreaVisible.value = !isAreaVisible.value;
  emit("toggleArea", isAreaVisible.value);
};

function handleSubmit() {
  if (!combinedInput.value.trim()) {
    Swal.fire({
      icon: "error",
      text: "Please fill out Course Info, Student Background, and Rubric before submitting.",
    });
    return;
  }

  emit("submitAll", combinedInput.value);
  isAreaVisible.value = false;
  emit("toggleArea", isAreaVisible.value);
}

function handleClear() {
  combinedInput.value = "";
  Swal.fire({
    icon: "info",
    title: "Cleared",
    text: "All content has been cleared.",
    timer: 1000,
  });
}
</script>
