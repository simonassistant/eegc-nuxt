<template>
    <div ref="chatMessages" class="chat-messages flex-1 overflow-y-auto p-5 space-y-4 border rounded-t-lg bg-white">
        <ChatMessageItem v-for="(msg, i) in messages" :key="`${i}-${msg.content?.length || 0}`" :message="msg" />
    </div>
</template>

<script setup>
import ChatMessageItem from "./ChatMessageItem.vue";

const props = defineProps({
    messages: {
        type: Array,
        required: true,
    },
});

const chatMessages = ref(null);

function scrollToBottom() {
    nextTick(() => {
        if (chatMessages.value) {
            chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
        }
    });
}

watch(() => props.messages, scrollToBottom, { deep: true, flush: "post" });

defineExpose({
    scrollToBottom,
});
</script>
