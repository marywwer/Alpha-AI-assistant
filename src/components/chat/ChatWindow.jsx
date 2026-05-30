import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSendMessage } from "../../features/chat/useChat.js";
import { useChatStore } from "../../store/chatStore.js";
import { ChatInput } from "./ChatInput.jsx";

const splitByWords = (text) => {
  return text.split(/(\s+)/).filter(Boolean);
};

export function ChatWindow() {
  const [isThinking, setIsThinking] = useState(false);

  const bottomRef = useRef(null);
  const sendMessage = useSendMessage();

  const { chats, activeChatId, initChats, addMessage, updateMessage } =
    useChatStore();

  useEffect(() => {
    initChats();
  }, [initChats]);

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const assistantRole = activeChat?.assistantRole ?? "analyst";
  const messages = activeChat?.messages ?? [];

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

  const animateAssistantMessage = async (messageId, fullText) => {
    const words = splitByWords(fullText);
    let currentText = "";

    for (const word of words) {
      currentText += word;
      updateMessage(messageId, currentText);

      await new Promise((resolve) => setTimeout(resolve, 35));
    }
  };

  const handleSubmit = async ({ message, role }) => {
    const requestRole = activeChat?.assistantRole ?? role;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    addMessage(userMessage, role);
    setIsThinking(true);

    const response = await sendMessage.mutateAsync({
      role: requestRole,
      message,
    });

    setIsThinking(false);

    const assistantMessageId = response.id ?? crypto.randomUUID();

    addMessage({
      id: assistantMessageId,
      role: response.role ?? "assistant",
      content: "",
    });

    await animateAssistantMessage(assistantMessageId, response.content);
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] flex-col">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center">
          <ChatInput
            showRoles
            onSubmit={handleSubmit}
            isPending={sendMessage.isPending}
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
              isPending={sendMessage.isPending}
              showRoles={false}
              className="w-full"
            />
          </div>
        </>
      )}
    </div>
  );
}
