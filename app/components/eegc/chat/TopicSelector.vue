<template>
    <div class="bg-gray-100 border border-gray-300 text-gray-800 rounded-md p-4 mb-4">
        <div class="space-y-3">
            <p class="text-sm font-semibold text-gray-800">Select Topic</p>

            <div class="space-y-3">
                <!-- Automation block -->
                <button type="button"
                    class="w-full text-left rounded-lg border p-3 sm:p-4 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                    :class="modelValue === 'Automation'
                        ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                        " @click="selectTopic('Automation')" role="radio" :aria-checked="(modelValue === 'Automation').toString()">
                    <p class="text-xs sm:text-sm font-semibold mb-1"
                        :class="modelValue === 'Automation' ? 'text-indigo-700' : 'text-gray-800'">
                        Automation
                    </p>
                    <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        Automation is transforming industries, potentially reducing jobs while boosting
                        efficiency. Does this technological shift ultimately enhance or undermine global
                        employment prospects in the long term?
                    </p>
                </button>

                <!-- Migrant Workers block -->
                <button type="button"
                    class="w-full text-left rounded-lg border p-3 sm:p-4 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                    :class="modelValue === 'Migrant'
                        ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                        " @click="selectTopic('Migrant')" role="radio" :aria-checked="(modelValue === 'Migrant').toString()">
                    <p class="text-xs sm:text-sm font-semibold mb-1"
                        :class="modelValue === 'Migrant' ? 'text-indigo-700' : 'text-gray-800'">
                        Migrant Workers
                    </p>
                    <p class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        Migrant workers face exploitation due to weak regulations, enduring long hours
                        and unfair pay. Should governments enforce stricter laws to safeguard their
                        rights?
                    </p>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: String,
});

const emits = defineEmits(["update:modelValue"]);

function selectTopic(topic) {
    emits("update:modelValue", topic);
}
</script>
