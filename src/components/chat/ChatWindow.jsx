import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  useSendMessage,
  useMessageResult,
} from "../../features/chat/useChat.js";
import { useAppStore } from "../../store/appStore.js";
import { useChatStore } from "../../store/chatStore.js";
import { ChatInput } from "./ChatInput.jsx";

const splitByWords = (text) => {
  return text.split(/(\s+)/).filter(Boolean);
};

export function ChatWindow() {
  const [isThinking, setIsThinking] = useState(false);

  const bottomRef = useRef(null);
  const sendMessage = useSendMessage();
  const getMessageResult = useMessageResult();
  const { selectedTeamId } = useAppStore();

  const {
    chats,
    activeChatId,
    initChats,
    addMessageToChat,
    createTempChat,
    updateChatMeta,
    updateMessage,
  } = useChatStore();

  useEffect(() => {
    initChats();
  }, [initChats]);

  const activeChat = useMemo(
    () => chats.find((chat) => chat.id === activeChatId),
    [chats, activeChatId],
  );

  const assistantRole = activeChat?.assistantRole ?? "analyst";

  const messages = useMemo(
    () => activeChat?.messages ?? [],
    [activeChat?.messages],
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const animateAssistantMessage = async (chatId, messageId, fullText) => {
    const words = splitByWords(fullText);
    let currentText = "";

    for (const word of words) {
      currentText += word;
      updateMessage(chatId, messageId, currentText);

      await new Promise((resolve) => setTimeout(resolve, 35));
    }
  };

  const waitForAiAnswer = async (sessionId) => {
    for (let attempt = 0; attempt < 20; attempt++) {
      const result = await getMessageResult.mutateAsync(sessionId);

      if (result?.answer) {
        return result;
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    throw new Error("AI answer timeout");
  };

  const handleSubmit = async ({ message, role }) => {
    const requestRole = activeChat?.assistantRole ?? role;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    let targetChatId = activeChatId;

    if (!targetChatId) {
      targetChatId = createTempChat({
        message: userMessage,
        assistantRole: requestRole,
      });
    } else {
      addMessageToChat(targetChatId, userMessage);
    }

    setIsThinking(true);

    try {
      const startResponse = await sendMessage.mutateAsync({
        chatId: activeChat?.backendChatId ?? null,
        role: requestRole,
        message,
        teamId: selectedTeamId === "all" ? null : selectedTeamId,
      });

      const finalResponse = await waitForAiAnswer(startResponse.sessionId);
      
      setIsThinking(false);

      updateChatMeta(targetChatId, {
        backendChatId: finalResponse.chatId,
        title: finalResponse.title || "Новый чат",
      });

      const assistantMessageId = crypto.randomUUID();

      addMessageToChat(targetChatId, {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        isDigest: finalResponse.isDigest,
      });

      await animateAssistantMessage(
        targetChatId,
        assistantMessageId,
        finalResponse.answer,
      );
    } catch (error) {
      addMessageToChat(targetChatId, {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Ошибка: сервер не принял сообщение.",
      });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center">
          <ChatInput
            showRoles
            onSubmit={handleSubmit}
            isPending={sendMessage.isPending || isThinking}
            className="w-full"
          />
        </div>
      ) : (
        <>
          <div className="flex-1 space-y-4 pb-[130px]">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`flex ${
                  item.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`markdown-body rounded-lg border border-[#C3C0C0] bg-[#F1F1F1] p-4 text-[18px] text-[#666666] break-words ${
                    item.role === "user" ? "max-w-[594px]" : "max-w-[804px]"
                  }`}
                >
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="max-w-[804px] rounded-lg border border-[#C3C0C0] bg-[#F1F1F1] px-4 py-3 text-[18px] text-[#666666]">
                  <span className="thinking-dots font-medium">Думаю</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} className="h-[1px]" />
          </div>

          <div className="sticky bottom-0 bg-[#FAFAFA] pb-4 pt-3">
            <ChatInput
              onSubmit={handleSubmit}
              isPending={sendMessage.isPending || isThinking}
              showRoles={false}
              className="w-full"
            />
          </div>
        </>
      )}
    </div>
  );
}
