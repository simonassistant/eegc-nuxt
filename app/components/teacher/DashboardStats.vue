<script setup lang="ts">
defineProps<{
    stats: {
        total: number
        avgRating: string | number
        trainingCount: number
        assessmentCount: number
    }
}>()
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <!-- Total Reports -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
            <div class="bg-blue-100 p-3 rounded-xl text-blue-600">
                <span class="text-2xl">📊</span>
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Reports</p>
                <p class="text-2xl font-bold text-slate-800">{{ stats.total }}</p>
            </div>
        </div>

        <!-- Avg Rating -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
            <div class="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                <span class="text-2xl">⭐</span>
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg. Rating</p>
                <p class="text-2xl font-bold text-slate-800">{{ stats.avgRating }} / 5.0</p>
            </div>
        </div>

        <!-- Training Mode -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
            <div class="bg-green-100 p-3 rounded-xl text-green-600">
                <span class="text-2xl">🎓</span>
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Training Mode</p>
                <p class="text-2xl font-bold text-slate-800">{{ stats.trainingCount }}</p>
            </div>
        </div>

        <!-- Assessment Mode -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
            <div class="bg-purple-100 p-3 rounded-xl text-purple-600">
                <span class="text-2xl">📝</span>
            </div>
            <div>
                <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Assessment</p>
                <p class="text-2xl font-bold text-slate-800">{{ stats.assessmentCount }}</p>
            </div>
        </div>
    </div>
</template>
