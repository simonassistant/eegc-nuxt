<script setup lang="ts">
import Swal from 'sweetalert2'

useHead({
    title: 'Teacher Dashboard | EEGC'
})

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

const reports = ref<Report[]>([])
const isLoading = ref(true)
const teacherEmail = ref('')

// Statistics
const stats = computed(() => {
    const total = reports.value.length
    const avgRating = total > 0 ? (reports.value.reduce((acc, r) => acc + (r.rating || 0), 0) / total).toFixed(1) : 0
    const trainingCount = reports.value.filter(r => r.mode === 'training').length
    const assessmentCount = reports.value.filter(r => r.mode === 'assessment').length

    return {
        total,
        avgRating,
        trainingCount,
        assessmentCount
    }
})

const fetchReports = async () => {
    isLoading.value = true
    try {
        const response = await $fetch<{ success: boolean, reports: Report[] }>('/api/teacher/reports')
        if (response.success) {
            reports.value = response.reports
        }
    } catch (error: any) {
        console.error('Error fetching reports:', error)
        if (error.statusCode === 401) {
            navigateTo('/teacher/login')
        }
    } finally {
        isLoading.value = false
    }
}

const handleLogout = () => {
    Swal.fire({
        title: 'Logging out...',
        text: 'Are you sure you want to log out?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, Sign Out'
    }).then((result) => {
        if (result.isConfirmed) {
            // Clear local storage and cookies
            localStorage.removeItem('userStatus')
            // To clear the httpOnly cookie, we usually need an API or just redirect/let it expire
            // But we can redirect to a logout API if it exists or just redirect to home
            // For now, let's just clear UI state and redirect
            navigateTo('/')
        }
    })
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const viewReport = (report: Report) => {
    Swal.fire({
        title: `Report from ${report.student_name_prefix}...${report.student_number_suffix}`,
        html: `
            <div class="text-left space-y-4 max-h-[60vh] overflow-y-auto p-2">
                <div class="flex justify-between border-b pb-2">
                    <span class="font-bold">Mode:</span>
                    <span class="capitalize px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs">${report.mode}</span>
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="font-bold">Rating:</span>
                    <span class="text-yellow-500">${'★'.repeat(report.rating)}${'☆'.repeat(5 - report.rating)}</span>
                </div>
                <div>
                    <span class="font-bold block mb-1">Student Comment:</span>
                    <p class="text-sm bg-gray-50 p-3 rounded-lg italic">"${report.comment || 'No comment provided.'}"</p>
                </div>
                <div>
                    <span class="font-bold block mb-1">Action items:</span>
                    <pre class="text-xs bg-slate-900 text-slate-100 p-3 rounded-lg overflow-x-auto">${JSON.stringify(report.contribution_analysis?.content || {}, null, 2)}</pre>
                </div>
            </div>
        `,
        width: '600px',
        confirmButtonColor: '#4f46e5',
    })
}

onMounted(() => {
    fetchReports()
})
</script>

<template>
    <AuthGuard />
    <div class="min-h-screen bg-slate-50 font-sans text-slate-900">
        <!-- Navigation Bar -->
        <nav class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16 items-center">
                    <div class="flex items-center space-x-3">
                        <div class="bg-indigo-600 p-2 rounded-lg">
                            <span class="text-white font-bold text-xl leading-none">EE</span>
                        </div>
                        <h1 class="text-xl font-extrabold text-slate-800 tracking-tight">
                            Teacher <span class="text-indigo-600">Portal</span>
                        </h1>
                    </div>
                    <div class="flex items-center space-x-4">
                        <button @click="handleLogout"
                            class="flex items-center space-x-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all font-medium text-sm">
                            <span>Sign Out</span>
                            <span class="text-lg">🚪</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Header Section -->
            <div class="mb-8">
                <h2 class="text-3xl font-black text-slate-900 mb-2">Reports Dashboard</h2>
                <p class="text-slate-500">Monitor student progress and analyze learning reports in real-time.</p>
            </div>

            <!-- Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div class="bg-blue-100 p-3 rounded-xl text-blue-600">
                        <span class="text-2xl">📊</span>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Reports</p>
                        <p class="text-2xl font-bold text-slate-800">{{ stats.total }}</p>
                    </div>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div class="bg-yellow-100 p-3 rounded-xl text-yellow-600">
                        <span class="text-2xl">⭐</span>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg. Rating</p>
                        <p class="text-2xl font-bold text-slate-800">{{ stats.avgRating }} / 5.0</p>
                    </div>
                </div>

                <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center space-x-4">
                    <div class="bg-green-100 p-3 rounded-xl text-green-600">
                        <span class="text-2xl">🎓</span>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Training Mode</p>
                        <p class="text-2xl font-bold text-slate-800">{{ stats.trainingCount }}</p>
                    </div>
                </div>

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

            <!-- Reports Table Card -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 class="font-bold text-lg text-slate-800">Recent Student Activity</h3>
                    <button @click="fetchReports"
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
                                        <span
                                            class="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-mono">
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
                                            <span v-for="i in 5" :key="i">{{ i <= (report.rating || 0) ? '★' : '☆'
                                                    }}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-500">
                                        {{ formatDate(report.created_at) }}
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <button @click="viewReport(report)"
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
        </main>
    </div>
</template>
