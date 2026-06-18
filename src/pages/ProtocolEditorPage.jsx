import { useLayoutEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { ArrowLeft, AtSign, Save, Zap } from "lucide-react";
import { isValidUuid } from "../shared/lib/utils.js";

import {
  useCreateProtocol,
  useFormalizeProtocol,
  useMeeting,
  useProtocol,
  useSendProtocolEmail,
  useUpdateProtocol,
} from "../features/meetings/useMeetings.js";

export function ProtocolEditorPage() {
  const { meetingId, protocolId } = useParams();

  const isNewProtocol = !protocolId;

  const { data: meeting, isLoading: isMeetingLoading } = useMeeting(meetingId);

  const {
    data: protocol,
    isLoading: isProtocolLoading,
    isError: isProtocolError,
  } = useProtocol(protocolId);

  if (isMeetingLoading || isProtocolLoading) {
    return <div>Загрузка...</div>;
  }

  if (!isNewProtocol && isProtocolError) {
    return <div>Протокол не найден</div>;
  }

  return (
    <ProtocolEditor
      key={protocolId || "new"}
      meeting={meeting}
      protocol={protocol}
      isNewProtocol={isNewProtocol}
    />
  );
}

function ProtocolEditor({ meeting, protocol, isNewProtocol }) {
  const navigate = useNavigate();
  const { meetingId, protocolId } = useParams();
  const isValidMeetingId = isValidUuid(meetingId);

  const createProtocol = useCreateProtocol(meetingId);
  const updateProtocol = useUpdateProtocol(meetingId);
  const formalizeProtocol = useFormalizeProtocol();
  const sendProtocolEmail = useSendProtocolEmail();

  const currentProtocol = Array.isArray(protocol) ? protocol[0] : protocol;

  const [isEditMode, setIsEditMode] = useState(isNewProtocol);
  const [isFormalizing, setIsFormalizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [isDirtyAfterSave, setIsDirtyAfterSave] = useState(false);

  const [title, setTitle] = useState("Новый протокол");
  const [protocolText, setProtocolText] = useState("");

  useLayoutEffect(() => {
    if (isNewProtocol) {
      setTitle("Новый протокол");
      setProtocolText("");
      setIsEditMode(true);
      setIsDirtyAfterSave(false);
      return;
    }

    if (!currentProtocol) return;

    if (isDirtyAfterSave) {
      return;
    }

    setTitle(currentProtocol.name || "Протокол");
    setProtocolText(currentProtocol.description || "");
    setIsEditMode(false);
  }, [isNewProtocol, currentProtocol, isDirtyAfterSave]);

  const canSendEmail = Boolean(
    currentProtocol?.isKonturAttached || meeting?.isKonturAttached,
  );

  const saveStatusText = useMemo(() => {
    if (isSaving) return "Сохранение...";

    if (savedAt) {
      return `Сохранено ${formatDateTime(savedAt)}`;
    }

    return "";
  }, [isSaving, savedAt]);

  const handleFormalize = async () => {
    if (!isEditMode) {
      alert("Сначала нажмите «Изменить текст»");
      return;
    }

    if (!protocolText.trim()) return;

    setIsFormalizing(true);

    try {
      const oneLineText = protocolText
        .replace(/\s*\n+\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const response = await formalizeProtocol.mutateAsync({
        oldProtocolDesc: oneLineText,
      });

      const newText = response?.newProtocolDesc || "";

      if (!newText.trim()) {
        alert("ИИ не вернул формализованный текст");
        return;
      }

      setProtocolText(newText);

      setIsEditMode(true);
    } finally {
      setIsFormalizing(false);
    }
  };

  const handleSave = async () => {
    if (!isValidMeetingId) {
      console.error("Некорректный meetingId:", meetingId);
      alert("Нельзя создать протокол: некорректный id встречи");
      return;
    }

    if (!title.trim() || !protocolText.trim()) return;

    setIsSaving(true);

    try {
      if (isNewProtocol) {
        const response = await createProtocol.mutateAsync({
          meetingId,
          name: title,
          description: protocolText,
        });

        const newProtocolId = response?.protocolId || response?.id;

        setSavedAt(new Date());

        if (newProtocolId) {
          navigate(`/meetings/${meetingId}/protocol/${newProtocolId}`, {
            replace: true,
          });
        }

        return;
      }

      setIsDirtyAfterSave(true);

      await updateProtocol.mutateAsync({
        protocolId,
        name: title,
        description: protocolText,
      });

      setSavedAt(new Date());
      setIsEditMode(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendEmail = async () => {
    if (!protocolId || !protocolText.trim()) return;

    await sendProtocolEmail.mutateAsync({
      protocolId,
      protocolDesc: protocolText,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(`/meetings/${meetingId}`)}
          className="inline-flex items-center gap-2 rounded-lg border border-[#C3C0C0] bg-white hover:bg-gray-50 px-3 py-1"
        >
          <ArrowLeft size={24} />
          Назад к панели
        </button>

        <div className="flex items-center gap-3">
          <span
            className={[isSaving ? "text-[#666]" : "text-[#67AF3D]"].join(" ")}
          >
            {saveStatusText}
          </span>

          <button
            type="button"
            onClick={handleFormalize}
            disabled={!isEditMode || isFormalizing || !protocolText.trim()}
            className="inline-flex items-center gap-2 rounded-lg border border-[#C3C0C0] bg-white hover:bg-gray-50 px-4 py-1 disabled:cursor-not-allowed disabled:opacity-50"
            title={
              isEditMode
                ? "Формализовать текущий текст протокола"
                : "Сначала нажмите «Изменить текст»"
            }
          >
            <Zap size={24} />
            {isFormalizing ? "Формализуем..." : "Формализовать"}
          </button>

          <button
            type="button"
            onClick={handleSendEmail}
            disabled={
              !canSendEmail || !protocolId || sendProtocolEmail.isPending
            }
            className="inline-flex items-center gap-2 rounded-lg border border-[#C3C0C0] bg-white hover:bg-gray-50 px-4 py-1 disabled:cursor-not-allowed disabled:opacity-40"
            title={
              canSendEmail
                ? "Отправить протокол участникам"
                : "Email рассылка доступна только при подключенном Контур.Толк"
            }
          >
            <AtSign size={24} />
            {sendProtocolEmail.isPending ? "Отправляем..." : "Email рассылка"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !isValidMeetingId}
            className="inline-flex items-center gap-2 rounded-lg border border-[#C3C0C0] bg-[#FF1616] hover:bg-[#CA0808] active:bg-[#A50505] px-4 py-1 text-white disabled:opacity-60"
          >
            <Save size={24} />
            Сохранить
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-[#D9D9D9] bg-white p-3 text-[18px] leading-[150%] tracking-tighter shadow-custom">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mb-5 h-[38px] w-full rounded-lg border border-[#CFCFCF] bg-[#F8F8F8] px-3 outline-none"
          placeholder="Новый протокол"
        />

        {isEditMode ? (
          <textarea
            value={protocolText}
            onChange={(event) => {
              setProtocolText(event.target.value);
              setIsDirtyAfterSave(false);
            }}
            className="min-h-[560px] w-full resize-none rounded-lg border border-[#CFCFCF] bg-[#F8F8F8] p-3 outline-none"
            placeholder="Начните писать протокол встречи..."
          />
        ) : (
          <div className="min-h-[560px] w-full rounded-lg border border-[#CFCFCF] bg-[#F8F8F8] p-4">
            <ReactMarkdown
              remarkPlugins={[remarkBreaks]}
              components={{
                h3: ({ children }) => (
                  <h3 className="mb-3 mt-4 text-[22px] font-semibold">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>
                ),
                li: ({ children }) => <li>{children}</li>,
                p: ({ children }) => (
                  <p className="mb-2 whitespace-pre-wrap break-words">
                    {children}
                  </p>
                ),
              }}
            >
              {protocolText}
            </ReactMarkdown>
          </div>
        )}

        {!isEditMode && (
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className="rounded-lg border border-[#C3C0C0] bg-[#FF1616] hover:bg-[#CA0808] active:bg-[#A50505] px-4 py-1 text-white"
            >
              Изменить текст
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
