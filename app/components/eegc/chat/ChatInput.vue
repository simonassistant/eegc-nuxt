<template>
    <div class="mt-0 flex gap-2 items-start relative bg-gray-50 p-3 border border-t-0 rounded-b-lg">
        <div class="flex-1 flex flex-col-reverse">
            <textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                :style="{ height: inputHeight + 'px' }" :placeholder="isConnected ? 'Type your message...' : 'Please connect to API first...'
                    " class="border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                @keyup.enter.exact.prevent="$emit('sendMessage')" :disabled="isThinking || !isConnected"
                ref="chatInput"></textarea>

            <div class="h-2 cursor-ns-resize bg-transparent hover:bg-indigo-200 transition-colors rounded-t-lg"
                @mousedown="startDrag" @touchstart.prevent="startDrag"></div>
        </div>

        <button @click="$emit('sendMessage')"
            class="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed h-fit"
            :disabled="isThinking || !isConnected || isSubmitted">
            {{ isThinking ? "Thinking..." : "Send" }}
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: String,
    isThinking: Boolean,
    isConnected: Boolean,
    isSubmitted: Boolean,
});

const emits = defineEmits(["update:modelValue", "sendMessage"]);

const chatInput = ref(null);
const inputHeight = ref(80);
let dragState = { startY: 0, startHeight: 0 };

function startDrag(e) {
    const y = e.touches?.[0]?.clientY ?? e.clientY;
    dragState = { startY: y, startHeight: chatInput.value.offsetHeight };

    const move = (ev) => {
        const currentY = ev.touches?.[0]?.clientY ?? ev.clientY;
        const diff = dragState.startY - currentY;
        inputHeight.value = Math.max(60, Math.min(400, dragState.startHeight + diff));
    };
    const stop = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", stop);
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", stop);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", stop);
}

function focus() {
    chatInput.value?.focus();
}

defineExpose({
    focus,
});

watch(() => props.isThinking, (isThinking) => {
    if (!isThinking) {
        nextTick(() => {
            focus();
        });
    }
});
</script>
