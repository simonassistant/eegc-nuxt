<script setup lang="ts">
interface Report {
    id: string
    created_at: string
    student_number_suffix: string
    student_name_prefix: string
    section_number: number
    rating: number
    comment: string
    mode: string
    chat_history: any
    contribution_analysis: any
    metadata: any
}

defineProps<{
    reports: Report[]
    isLoading: boolean
}>()

defineEmits<{
    (e: 'refresh'): void
    (e: 'view-report', report: Report): void
}>()

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 class="font-bold text-lg text-slate-800">Recent Student Activity</h3>
            <button @click="$emit('refresh')"
                class="text-indigo-600 hover:text-indigo-800 text-sm font-semibold flex items-center space-x-1">
                <span>Refresh Data</span>
                <span :class="{ 'animate-spin': isLoading }">🔄</span>
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="text-slate-400 text-xs uppercase tracking-widest bg-slate-50/50">
                        <th class="px-6 py-4 font-semibold">Student (Name/ID)</th>
                        <th class="px-6 py-4 font-semibold">Section</th>
                        <th class="px-6 py-4 font-semibold">Mode</th>
                        <th class="px-6 py-4 font-semibold">Rating</th>
                        <th class="px-6 py-4 font-semibold">Submitted At</th>
                        <th class="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <template v-if="isLoading && reports.length === 0">
                        <tr v-for="i in 5" :key="i" class="animate-pulse">
                            <td class="px-6 py-4">
                                <div class="h-4 bg-slate-200 rounded w-24"></div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="h-4 bg-slate-200 rounded w-12"></div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="h-4 bg-slate-200 rounded w-16"></div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="h-4 bg-slate-200 rounded w-20"></div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="h-4 bg-slate-200 rounded w-32"></div>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="h-8 bg-slate-200 rounded w-16 ml-auto"></div>
                            </td>
                        </tr>
                    </template>
                    <template v-else-if="reports.length === 0">
                        <tr>
                            <td colspan="6" class="px-6 py-12 text-center text-slate-400 italic">
                                No reports found. Students will appear here once they complete a session.
                            </td>
                        </tr>
                    </template>
                    <template v-else>
                        <tr v-for="report in reports" :key="report.id"
                            class="hover:bg-slate-50 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="flex items-center space-x-3">
                                    <div
                                        class="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                        {{ report.student_name_prefix[0] }}
                                    </div>
                                    <div>
                                        <div class="font-bold text-slate-800">{{ report.student_name_prefix
                                            }}***</div>
                                        <div class="text-xs text-slate-500">ID suffix: {{
                                            report.student_number_suffix }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-mono">
                                    Sec {{ report.section_number }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="[
                                    'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                                    report.mode === 'assessment' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                ]">
                                    {{ report.mode }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center text-yellow-400">
                                    <span v-for="i in 5" :key="i">{{ i <= (report.rating || 0) ? '★' : '☆' }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-slate-500">
                                {{ formatDate(report.created_at) }}
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button @click="$emit('view-report', report)"
                                    class="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-600 hover:text-white border border-indigo-600 rounded-lg transition-all">
                                    Details
                                </button>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>
