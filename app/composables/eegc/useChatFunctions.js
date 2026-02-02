export function useChatFunctions({
    userMessage,
    currentMode,
    activeChatHistory,
    originalDraft,
    finalDraft,
    bulletPoints,
    isConnected,
    model,
    isThinking,
    isOriginalDraftConfirmed,
    isUpdatingDraft,
    courseInfo,
    courseInfoAssessment,
    currentTopic
}) {
    async function talkToChatbot(chat_history) {
        const res = await fetch("/api/poe-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_history: chat_history,
                model_name: model.value,
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.statusMessage || "API request failed");
        }

        const data = await res.json();
        return data?.choices?.[0]?.message?.content || "";
    }

    async function talkToChatbotStream(chat_history, onChunk) {
        const res = await fetch("/api/poe-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_history: chat_history,
                model_name: model.value,
                stream: true,
            }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.statusMessage || "API request failed");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const data = line.slice(6);
                    if (data === "[DONE]") {
                        break;
                    }
                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                            fullContent += parsed.content;
                            if (onChunk) {
                                onChunk(fullContent);
                            }
                        }
                    } catch (e) {
                    }
                }
            }
        }

        return fullContent;
    }

    async function sendMessage() {
        if (
            !userMessage.value.trim() ||
            isThinking.value ||
            !isConnected.value
        )
            return;

        activeChatHistory.value.push({
            role: "user",
            content: userMessage.value,
            timestamp: new Date(),
        });
        userMessage.value = "";
        isThinking.value = true;

        const assistantMessage = {
            role: "assistant",
            content: "",
            timestamp: new Date(),
        };
        activeChatHistory.value.push(assistantMessage);

        try {
            let payloadHistory = [...activeChatHistory.value.slice(0, -1)];

            if (currentMode.value === "assessment") {
                payloadHistory = [
                    {
                        role: "system",
                        content:
                            Assessment_Mode_Prompt +
                            "These are the student information details:\n" +
                            `Course Info: ${courseInfoAssessment.value || "(none)"}\n` +
                            `Current Topic: ${currentTopic.value || "(none)"}\n` +
                            "Original Draft:\n---\n" +
                            `${originalDraft.value || "(empty)"}\n---\n\n` +
                            "Current Revised Version:\n---\n" +
                            `${finalDraft.value || "(empty)"}\n---\n\n` +
                            "IMPORTANT: If the student makes specific edits or requests changes, provide the updated version of the essay in your response. Always include the full revised text when changes are made.",
                    },
                    ...payloadHistory,
                ];
            } else if (currentMode.value === "training") {
                payloadHistory = [
                    {
                        role: "system",
                        content:
                            Trainging_Mode_Prompt +
                            "These are the student information details:\n" +
                            `Course Info: ${courseInfo.value || "(none)"}\n` +
                            `Current Topic: ${currentTopic.value || "(none)"}\n` +
                            "Original Draft:\n---\n" +
                            `${originalDraft.value || "(empty)"}\n---\n\n` +
                            "Final Draft:\n---\n" +
                            `${finalDraft.value || "(empty)"}\n---\n\n`,
                    },
                    ...payloadHistory,
                ];
            }

            const reply = await talkToChatbotStream(payloadHistory, (content) => {
                const lastIndex = activeChatHistory.value.length - 1;
                if (lastIndex >= 0) {
                    const updatedMsg = { ...activeChatHistory.value[lastIndex], content };
                    activeChatHistory.value.splice(lastIndex, 1, updatedMsg);
                }
            });

            if (reply) {
                const lastIndex = activeChatHistory.value.length - 1;
                if (lastIndex >= 0) {
                    const updatedMsg = { ...activeChatHistory.value[lastIndex], content: reply };
                    activeChatHistory.value.splice(lastIndex, 1, updatedMsg);
                }
                if (isOriginalDraftConfirmed.value) {
                    await extractAndUpdateEssay();
                }
            }
        } catch {
            const lastIndex = activeChatHistory.value.length - 1;
            if (lastIndex >= 0) {
                activeChatHistory.value[lastIndex].content = "⚠️ Error connecting to server.";
            }
        } finally {
            isThinking.value = false;
        }
    }

    async function extractAndUpdateEssay() {
        isUpdatingDraft.value = true;
        const refinedChatHistory = activeChatHistory.value.slice(-4);

        let payloadHistory = [
            {
                role: "system",
                content:
                    BulletPoints_Generation_Prompt +
                    refinedChatHistory
                        .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`)
                        .join("\n")
            },
        ];

        try {
            const reply = await talkToChatbot(payloadHistory);
            if (reply && reply.trim().length > 25) {
                bulletPoints.value = reply.trim();
            }
        } catch (error) {
            console.error("Error extracting essay:", error);
        } finally {
            isUpdatingDraft.value = false;
        }
    }

    return {
        sendMessage,
        talkToChatbot,
    };
}
