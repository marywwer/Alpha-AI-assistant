import { useRef, useState, useEffect } from "react"; // Добавьте useEffect
import { Button } from "../ui/Button.jsx";
import sendButton from "../../../public/img/arrow-up-circle.svg";

const roles = [
  { id: "analyst", title: "Аналитик" },
  { id: "developer", title: "Разработчик" },
  { id: "tester", title: "Тестировщик" },
  { id: "business-analyst", title: "Бизнес-аналитик" },
];

export function ChatInput({
  onSubmit,
  isPending,
  showRoles = false,
  className = "",
}) {
  const [selectedRole, setSelectedRole] = useState("analyst");
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  // Функция для изменения высоты textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Сбрасываем высоту, чтобы правильно вычислить scrollHeight
    textarea.style.height = "auto";
    // Устанавливаем новую высоту
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
    adjustTextareaHeight(); // Вызываем изменение высоты
  };

  // Эффект для сброса высоты при очистке сообщения
  useEffect(() => {
    if (!message) {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
      }
    }
  }, [message]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const currentMessage = message.trim();

    if (!currentMessage || isPending) return;

    setMessage("");

    // Сбрасываем высоту после очистки
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    await onSubmit({
      message: currentMessage,
      role: selectedRole,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative mx-auto flex flex-col rounded-[8px] border border-[#C3C0C0] bg-[#F1F1F1] px-[15px] py-[10.5px] ${className}`}
    >
      <textarea
        ref={textareaRef}
        className="min-h-[24px] w-full resize-none overflow-hidden border-none bg-transparent pr-[40px] text-[18px] text-[#333333] outline-none placeholder:text-[#666666]"
        placeholder="Спросите помощника"
        value={message}
        rows={1}
        onChange={handleMessageChange}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
          }
        }}
      />

      {showRoles && (
        <div className="mt-[9px] flex items-end gap-3">
          <div className="flex gap-[8px] py-[7px] flex-wrap">
            {roles.map((role) => (
              <button
                type="button"
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`h-[32px] min-w-[160px] rounded-[8px] border border-[#C3C0C0] px-10 text-[16px] text-white transition ${
                  selectedRole === role.id
                    ? "bg-[#A50505]"
                    : "bg-[#FF0404] hover:bg-[#CA0808] active:bg-[#A50505]"
                }`}
              >
                {role.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="absolute right-[15px] top-1/2 -translate-y-1/2 bg-transparent p-0 hover:bg-transparent"
      >
        <img src={sendButton} alt="send" className="h-[24px] w-[24px]" />
      </Button>
    </form>
  );
}