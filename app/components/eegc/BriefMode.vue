<template>
  <div class="max-w-7xl mx-auto px-6 py-10 space-y-10">
    <!-- 背景介绍 -->
    <section class="bg-indigo-50 border border-indigo-200 rounded-lg p-6 shadow-sm">
      <h1 class="text-3xl font-bold text-indigo-700 mb-3 text-center">
        EEGC Human–AI Collaboration
      </h1>

      <div class="space-y-3 text-base text-gray-700 leading-relaxed">
        <p>
          In week 10, you took the written test and wrote two IELTS-style essays within an hour. Now
          you will type the longer essay and use AI to revise it.
        </p>
        <p>
          Instead of using a generic chatbot such as <strong>ChatGPT</strong> or
          <strong>DeepSeek</strong>, you will use this customised chatbot platform. Here, you will
          interact with an AI chatbot that the <strong>EEGC teaching team</strong> programmed.
        </p>
        <p>
          We will assess your performance based on your <strong>chat history</strong> (according to
          the Human–AI Communication Rubrics) and the <strong>improvement of quality</strong> in
          your revised essay.
        </p>

        <hr class="my-4 border-gray-300" />

        <p>
          The platform offers two modes for practice and evaluation:
          <strong>Training Mode</strong> helps you get familiar with the revision process while
          working on a sample essay, and <strong>Assessment Mode</strong> is for revising your own
          essay.
        </p>
        <p>To ensure the task is manageable, the revision includes three sub-tasks:</p>
        <ul class="list-disc pl-6 text-sm space-y-1">
          <li>Revise the <strong>thesis statement</strong></li>
          <li>Revise the <strong>topic sentences</strong></li>
          <li>Revise <strong>one body paragraph</strong></li>
        </ul>

        <p class="mt-3">
          ✅ Ready to practice using the platform? Click the sidebar to
          <strong>Enter Training Mode</strong> now.
          <br />
          ✅ Ready to assess your AI communication skills and revise your own essay? Click the
          sidebar to <strong>Enter Assessment Mode</strong> now.
        </p>
      </div>

      <!-- Rubrics -->
      <div class="mt-6 space-y-4">
        <!-- Rubric 1 -->
        <details class="bg-white border border-gray-200 rounded-xl p-6 shadow-md overflow-x-auto">
          <summary
            class="flex items-center justify-between text-gray-800 font-semibold text-base cursor-pointer list-none"
          >
            🧾 Essay Writing Assessment Rubric
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-500 transition-transform duration-300"
              :class="{ 'rotate-180': rubric1Open }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              @click.stop="rubric1Open = !rubric1Open"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <div class="mt-4 text-sm text-gray-700">
            <p class="mb-3 italic">
              The following rubric evaluates the quality of the point-of-view essay itself (10% of
              total assessment).
            </p>

            <!-- Enhanced Table -->
            <div class="overflow-hidden rounded-lg shadow-sm border border-gray-200">
              <table class="w-full text-xs md:text-sm text-gray-700">
                <thead
                  class="bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 uppercase text-xs font-semibold tracking-wide"
                >
                  <tr>
                    <th class="p-3 text-left">Criteria</th>
                    <th class="p-3 text-center">1 (Limited)</th>
                    <th class="p-3 text-center">2 (Basic)</th>
                    <th class="p-3 text-center">3 (Developing)</th>
                    <th class="p-3 text-center">4 (Proficient)</th>
                    <th class="p-3 text-center">5 (Excellent)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr class="hover:bg-indigo-50 transition-colors">
                    <td class="p-3 font-semibold text-gray-800 bg-gray-50">Content and Ideas</td>
                    <td class="p-3">
                      Ideas are irrelevant or minimally related to the topic; lacks awareness of the
                      issue; no clear viewpoint
                    </td>
                    <td class="p-3">
                      Ideas somewhat related but vague; minimal awareness; viewpoint unclear
                    </td>
                    <td class="p-3">
                      Ideas relevant but basic; some awareness; viewpoint weakly developed
                    </td>
                    <td class="p-3">
                      Ideas relevant and solid; good awareness; clear viewpoint with some depth
                    </td>
                    <td class="p-3">
                      Ideas insightful and highly relevant; strong awareness; well-developed,
                      compelling viewpoint
                    </td>
                  </tr>
                  <tr class="hover:bg-indigo-50 transition-colors">
                    <td class="p-3 font-semibold text-gray-800 bg-gray-50">
                      Organisation and Logical Progression
                    </td>
                    <td class="p-3">No clear structure; ideas disjointed, no development</td>
                    <td class="p-3">
                      Basic structure, unclear paragraphing; ideas listed with little expansion
                    </td>
                    <td class="p-3">
                      Clear structure with some paragraphing; ideas developed but limited coherence
                    </td>
                    <td class="p-3">Well-organised with logical flow; ideas clearly developed</td>
                    <td class="p-3">
                      Highly organised, seamless flow; fully developed logical progression
                    </td>
                  </tr>
                  <tr class="hover:bg-indigo-50 transition-colors">
                    <td class="p-3 font-semibold text-gray-800 bg-gray-50">Vocabulary</td>
                    <td class="p-3">
                      Limited, repetitive, or inaccurate vocabulary; lacks topic-specific terms
                    </td>
                    <td class="p-3">Basic vocabulary; minimal use of topic terms</td>
                    <td class="p-3">
                      Adequate vocabulary variety; some topic terms; occasional errors
                    </td>
                    <td class="p-3">Varied and precise vocabulary; few minor errors</td>
                    <td class="p-3">
                      Rich, sophisticated vocabulary; masterful and error-free use of topic terms
                    </td>
                  </tr>
                  <tr class="hover:bg-indigo-50 transition-colors">
                    <td class="p-3 font-semibold text-gray-800 bg-gray-50">
                      Grammar and Sentence Structure
                    </td>
                    <td class="p-3">
                      Frequent grammatical/spelling errors; confusing or incomplete sentences
                    </td>
                    <td class="p-3">Several errors; simple sentence structures</td>
                    <td class="p-3">Some errors; mostly correct but limited variety</td>
                    <td class="p-3">Minor errors; varied and accurate sentences</td>
                    <td class="p-3">
                      Virtually error-free; complex, varied, and accurately structured sentences
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </details>

        <!-- Rubric 2 -->
        <details class="bg-white border border-gray-200 rounded-xl p-6 shadow-md overflow-x-auto">
          <summary
            class="flex items-center justify-between text-gray-800 font-semibold text-base cursor-pointer list-none"
          >
            🤖 AI-Assisted Review Skills Rubric
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-500 transition-transform duration-300"
              :class="{ 'rotate-180': rubric2Open }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              @click.stop="rubric2Open = !rubric2Open"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <div class="mt-4 text-sm text-gray-700">
            <p class="mb-3 italic">
              The following rubric evaluates students' human–AI interaction skills during the
              revision process (10% of total assessment).
            </p>

            <div class="overflow-hidden rounded-lg shadow-sm border border-gray-200">
              <table class="w-full text-xs md:text-sm text-gray-700">
                <thead
                  class="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 uppercase text-xs font-semibold tracking-wide"
                >
                  <tr>
                    <th class="p-3 text-left">Criteria</th>
                    <th class="p-3 text-center">1 (Limited)</th>
                    <th class="p-3 text-center">2 (Basic)</th>
                    <th class="p-3 text-center">3 (Developing)</th>
                    <th class="p-3 text-center">4 (Proficient)</th>
                    <th class="p-3 text-center">5 (Excellent)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr class="hover:bg-purple-50 transition-colors">
                    <td class="p-3 font-semibold text-gray-800 bg-gray-50">
                      A. In-Depth Conversation with AI
                    </td>
                    <td class="p-3">No exchanges or chat history; no questions asked</td>
                    <td class="p-3">Sparse conversation; one or two simple questions</td>
                    <td class="p-3">Adequate exchanges; some relevant questions</td>
                    <td class="p-3">
                      Robust interaction; detailed, relevant questions across levels
                    </td>
                    <td class="p-3">
                      Extensive, well-documented chat history; insightful, multi-level questioning
                    </td>
                  </tr>
                  <tr class="hover:bg-purple-50 transition-colors">
                    <td class="p-3 font-semibold text-gray-800 bg-gray-50">
                      B. Critical Review of AI Suggestions
                    </td>
                    <td class="p-3">All AI suggestions accepted blindly</td>
                    <td class="p-3">Most accepted; little analysis</td>
                    <td class="p-3">Some evaluated; partial justification</td>
                    <td class="p-3">Most critically reviewed with clear justification</td>
                    <td class="p-3">
                      All evaluated thoroughly with strong, evidence-based reasoning
                    </td>
                  </tr>
                  <tr class="hover:bg-purple-50 transition-colors">
                    <td class="p-3 font-semibold text-gray-800 bg-gray-50">C. Refining Process</td>
                    <td class="p-3">No revisions made</td>
                    <td class="p-3">Minimal revisions; no iteration</td>
                    <td class="p-3">Some revisions with limited iteration</td>
                    <td class="p-3">Clear iterative process with multiple revisions</td>
                    <td class="p-3">Extensive refinement with iterative improvements</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </details>
      </div>
    </section>

    <!-- 三阶段流程 -->
    <section
      class="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6"
    >
      <div
        class="text-center bg-blue-50 border border-blue-200 rounded-lg p-4 w-full md:w-1/3 shadow-sm"
      >
        <h2 class="font-semibold text-blue-700 mb-2">1️⃣ Briefing</h2>
        <p class="text-sm text-gray-600">Understand objectives, process, setup</p>
      </div>
      <div class="hidden md:block flex-shrink-0 text-3xl text-gray-400">→</div>
      <div
        class="text-center bg-green-50 border border-green-200 rounded-lg p-4 w-full md:w-1/3 shadow-sm"
      >
        <h2 class="font-semibold text-green-700 mb-2">2️⃣ Training</h2>
        <p class="text-sm text-gray-600">Practice AI-assisted revision skills</p>
      </div>
      <div class="hidden md:block flex-shrink-0 text-3xl text-gray-400">→</div>
      <div
        class="text-center bg-orange-50 border border-orange-200 rounded-lg p-4 w-full md:w-1/3 shadow-sm"
      >
        <h2 class="font-semibold text-orange-700 mb-2">3️⃣ Assessment</h2>
        <p class="text-sm text-gray-600">Apply independently for grading</p>
      </div>
    </section>

    <!-- 修订重点 -->
    <section class="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-5 shadow-sm">
      <h2 class="text-xl font-semibold text-yellow-700 mb-2">🎯 Revision Focus</h2>
      <ul class="list-disc pl-6 text-gray-700 text-sm space-y-1">
        <li>
          Focus only on <strong>thesis statement</strong> and <strong>topic sentences</strong>.
        </li>
        <li>Revise <strong>one body paragraph</strong> for demonstration.</li>
        <li>Collaborate with AI but edit manually by yourself.</li>
      </ul>
    </section>

    <!-- 双栏任务区 -->
    <section class="grid md:grid-cols-2 gap-5">
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-5">
        <h3 class="font-semibold text-purple-700 mb-2">🔍 Your Task</h3>
        <ul class="text-sm text-gray-700 space-y-1 list-disc pl-5">
          <li>Provide background: course, goals, and rubric overview</li>
          <li>Discuss and plan revision strategy with AI</li>
          <li>Critically review AI suggestions before accepting</li>
          <li>Implement your edits manually, guided by reasoning</li>
        </ul>
      </div>

      <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
        <h3 class="font-semibold text-indigo-700 mb-2">💡 Learning Outcomes</h3>
        <ul class="text-sm text-gray-700 space-y-1 list-disc pl-5">
          <li>Develop AI literacy for writing improvement</li>
          <li>Refine structure and coherence of your essay</li>
          <li>Demonstrate independent critical thinking</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script setup>
const rubric1Open = ref(false);
const rubric2Open = ref(false);
</script>
