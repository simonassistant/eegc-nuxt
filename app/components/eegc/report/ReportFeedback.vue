<template>
  <div class="mb-6 p-4 bg-gray-50 rounded-lg border" v-if="mode === 'assessment'">
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
            @click="$emit('update:rating', star)"
            class="text-3xl font-bold transition-transform transform hover:scale-110 focus:outline-none"
            :class="star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'"
            :aria-label="`Rate ${star} star`"
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
        :value="comment"
        @input="$emit('update:comment', $event.target.value)"
        placeholder="Share your thoughts about the session..."
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mode: String,
  rating: Number,
  comment: String,
});

defineEmits(["update:rating", "update:comment"]);
</script>
