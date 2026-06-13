import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, AtSign, Save, Zap } from "lucide-react";

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

  const createProtocol = useCreateProtocol(meetingId);
  const updateProtocol = useUpdateProtocol(meetingId);
  const formalizeProtocol = useFormalizeProtocol();
  const sendProtocolEmail = useSendProtocolEmail();

  const [title, setTitle] = useState(
    isNewProtocol ? "Новый протокол" : protocol?.name || "",
  );

  const [protocolText, setProtocolText] = useState(
    isNewProtocol ? "" : protocol?.description || "",
  );

  const [isEditMode, setIsEditMode] = useState(isNewProtocol);
  const [isFormalizing, setIsFormalizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const canSendEmail = Boolean(meeting?.isKonturAttached);

  const saveStatusText = useMemo(() => {
    if (isSaving) return "Сохранение...";

    if (savedAt) {
      return `Сохранено ${formatDateTime(savedAt)}`;
    }

    return "";
  }, [isSaving, savedAt]);

  const handleFormalize = async () => {
    if (!protocolText.trim()) return;

    setIsFormalizing(true);

    try {
      const response = await formalizeProtocol.mutateAsync({
        oldProtocolDesc: protocolText,
      });

      setProtocolText(response.newProtocolDesc || "");
      setIsEditMode(false);
    } finally {
      setIsFormalizing(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !protocolText.trim()) return;

    setIsSaving(true);

    try {
      if (isNewProtocol) {
        const response = await createProtocol.mutateAsync({
          name: title,
          description: protocolText,
        });

        setSavedAt(new Date());

        if (response?.protocolId) {
          navigate(`/meetings/${meetingId}/protocol/${response.protocolId}`, {
            replace: true,
          });
        }

        return;
      }

      await updateProtocol.mutateAsync({
        protocolId,
        name: title,
        description: protocolText,
      });

      setSavedAt(new Date());
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
            className={[
              isSaving ? "text-[#666]" : "text-[#67AF3D]",
            ].join(" ")}
          >
            {saveStatusText}
          </span>

          <button
            type="button"
            onClick={handleFormalize}
            disabled={isFormalizing || !protocolText.trim()}
            className="inline-flex items-center gap-2 rounded-lg border border-[#C3C0C0] bg-white hover:bg-gray-50 px-4 py-1 disabled:opacity-50"
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
            disabled={isSaving}
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
            onChange={(event) => setProtocolText(event.target.value)}
            className="min-h-[560px] w-full resize-none rounded-lg border border-[#CFCFCF] bg-[#F8F8F8] p-3 outline-none"
            placeholder="Начните писать протокол встречи..."
          />
        ) : (
          <div className="min-h-[560px] w-full rounded-lg border border-[#CFCFCF] bg-[#F8F8F8] p-4">
            <ReactMarkdown>{protocolText}</ReactMarkdown>
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
