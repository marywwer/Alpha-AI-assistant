import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Calendar, FileText, Link2, Search, Clock, Users } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { isValidUuid } from "../shared/lib/utils.js";

import {
  useImportKonturMeeting,
  useKonturMeetings,
  useMeeting,
} from "../features/meetings/useMeetings.js";

const participantColors = [
  "bg-[#FFB8B8]",
  "bg-[#D9C7FF]",
  "bg-[#A9D9FF]",
  "bg-[#8EF0A2]",
  "bg-[#FFE5A3]",
];

export function MeetingDetailsPage() {
  const { meetingId } = useParams();
  const isValidMeetingId = isValidUuid(meetingId);
  const navigate = useNavigate();

  const { data: meeting, isLoading } = useMeeting(meetingId);
  const { data: konturMeetings = [] } = useKonturMeetings();
  const importKonturMeeting = useImportKonturMeeting();

  const [selectedKonturMeetingId, setSelectedKonturMeetingId] = useState(null);
  const [selectedProtocolId, setSelectedProtocolId] = useState(null);
  const [search, setSearch] = useState("");
  const [isKonturSearchOpen, setIsKonturSearchOpen] = useState(false);

  const isAttachLoading =
    importKonturMeeting.isPending || importKonturMeeting.isLoading;

  const selectedKonturMeeting = useMemo(() => {
    return konturMeetings.find(
      (item) => item.konturMeetingId === selectedKonturMeetingId,
    );
  }, [konturMeetings, selectedKonturMeetingId]);

  const currentMeeting = meeting;

  const isKonturAttached = Boolean(meeting?.isKonturAttached);

  const protocols = currentMeeting?.protocolInfo || [];
  const selectedProtocol =
    protocols.find((protocol) => protocol.id === selectedProtocolId) || null;

  const openProtocolId = selectedProtocolId;
  const shouldDisableOpenProtocol = !openProtocolId;

  const title = selectedKonturMeeting?.title || getMeetingTitle(currentMeeting);

  const startedAt = currentMeeting?.startedAt
    ? new Date(currentMeeting.startedAt)
    : null;

  const dateText = startedAt
    ? format(startedAt, "dd MMMM yyyy", { locale: ru })
    : format(new Date(), "dd MMMM yyyy", { locale: ru });

  const timeText = startedAt ? format(startedAt, "HH:mm") : "Не указано";

  const durationText = currentMeeting?.durationInMinutes
    ? formatDuration(currentMeeting.durationInMinutes)
    : "Не указано";

  const todayKey = format(new Date(), "yyyy-MM-dd");

  const todayKonturMeetings = konturMeetings.filter((item) => {
    if (!item.startedAt) return false;

    return format(new Date(item.startedAt), "yyyy-MM-dd") === todayKey;
  });

  const searchValue = search.trim().toLowerCase();

  const filteredKonturMeetings = searchValue
    ? todayKonturMeetings.filter((item) =>
        [item.title, item.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(searchValue)),
      )
    : todayKonturMeetings;

  const shouldShowEmptySearchText =
    searchValue.length > 0 && filteredKonturMeetings.length === 0;

  const handleAttachKontur = async () => {
    if (!meetingId) {
      console.error("meetingId is empty");
      return;
    }

    if (!selectedKonturMeetingId || !selectedKonturMeeting) return;

    const response = await importKonturMeeting.mutateAsync({
      meetingId,
      konturMeetingId: selectedKonturMeetingId,

      title: selectedKonturMeeting.title,
      description: selectedKonturMeeting.description,
      startedAt: selectedKonturMeeting.startedAt,
      durationInMinutes: selectedKonturMeeting.durationInMinutes,
    });

    const nextMeetingId = response?.meetingId || meetingId;

    navigate(`/meetings/${nextMeetingId}`, {
      replace: true,
    });
  };

  if (isLoading || isAttachLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-[#D9D9D9] bg-white p-4 shadow-md">
        <div className="mb-2 flex items-start justify-between">
          <h1 className="text-[24px] font-semibold">{title}</h1>

          <span
            className={[
              "rounded-lg border px-3 py-1",
              isKonturAttached
                ? "border-[#93D36B] text-[#68AD3C]"
                : "border-[#D9D9D9] text-[#777]",
            ].join(" ")}
          >
            {isKonturAttached
              ? "Контур.Толк подключен"
              : "Контур.Толк не подключен"}
          </span>
        </div>

        <div className="mb-5 flex items-center gap-3">
          <Badge icon={<Calendar size={24} />}>{dateText}</Badge>
          <Badge icon={<Clock size={24} />}>{timeText}</Badge>
        </div>

        {!isKonturAttached && (
          <div className="mb-6 max-w-[380px]">
            <div className="mb-2 flex items-center gap-2 text-[20px] font-medium">
              <Calendar size={24} />
              <span>Выбрать из Контур.Толк</span>
            </div>

            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />

              <input
                value={search}
                onFocus={() => setIsKonturSearchOpen(true)}
                onChange={(event) => setSearch(event.target.value)}
                className="h-[30px] w-full rounded-lg border border-[#C3C0C0] bg-[#F8F8F8] pl-9 pr-3 text-[#666] outline-none hover:bg-[#EDEDED]"
                placeholder="Поиск встреч..."
              />
            </div>

            {isKonturSearchOpen && (
              <div className="mt-4 space-y-3">
                {filteredKonturMeetings.length > 0 ? (
                  filteredKonturMeetings.map((meeting) => {
                    const isActive =
                      selectedKonturMeetingId === meeting.konturMeetingId;

                    return (
                      <button
                        key={meeting.konturMeetingId}
                        type="button"
                        onClick={() =>
                          setSelectedKonturMeetingId((prevId) =>
                            prevId === meeting.konturMeetingId
                              ? null
                              : meeting.konturMeetingId,
                          )
                        }
                        className={[
                          "w-full rounded-lg p-3 text-left transition",
                          isActive
                            ? "bg-[#FFAAAA] shadow-custom active:shadow-custom"
                            : "bg-white hover:bg-[#FCD9D9] hover:shadow-custom",
                        ].join(" ")}
                      >
                        <p className="text-[18px]">{meeting.title}</p>

                        <div className="mt-5 flex items-center gap-3.5">
                          <Badge
                            className={isActive ? "bg-transparent" : ""}
                            icon={<Calendar size={24} />}
                          >
                            {format(
                              new Date(meeting.startedAt),
                              "dd MMMM yyyy",
                              {
                                locale: ru,
                              },
                            )}
                          </Badge>

                          <Badge
                            className={isActive ? "bg-transparent" : ""}
                            icon={<Clock size={24} />}
                          >
                            {format(new Date(meeting.startedAt), "HH:mm")}
                          </Badge>
                        </div>
                      </button>
                    );
                  })
                ) : shouldShowEmptySearchText ? (
                  <p className="text-[18px] text-[#777]">
                    Подходящих встреч нет.
                  </p>
                ) : null}
              </div>
            )}
          </div>
        )}

        <InfoBlock title="Участники" icon={<Users size={24} />}>
          {currentMeeting?.userInfo?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {currentMeeting.userInfo.map((user, index) => (
                <ParticipantCard
                  key={user.id}
                  user={user}
                  color={participantColors[index % participantColors.length]}
                />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-[#666]">Участники не добавлены</p>
          )}
        </InfoBlock>

        <InfoBlock title="Длительность" icon={<Clock size={24} />}>
          <p className="mt-2 text-[#666]">{durationText}</p>
        </InfoBlock>

        {isKonturAttached && (
          <InfoBlock title="Внешний источник" icon={<Link2 size={24} />}>
            <p className="mt-2 text-[#666]">Контур.Толк</p>
          </InfoBlock>
        )}

        {!isKonturAttached && selectedKonturMeetingId && (
          <button
            type="button"
            onClick={handleAttachKontur}
            disabled={isAttachLoading}
            className="h-[32px] w-full rounded-lg border border-[#C3C0C0] bg-[#FF0404] hover:bg-[#CA0808] active:bg-[#A50505] text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAttachLoading
              ? "Подключаем Контур.Толк..."
              : "Подключить Контур.Толк"}
          </button>
        )}
      </section>

      <section className="rounded-lg border border-[#D9D9D9] bg-white p-4 shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[24px] font-semibold">Протоколы</h2>

          {isValidMeetingId && (
            <Link to={`/meetings/${meetingId}/protocol`}>
              <button
                type="button"
                className="flex items-center gap-1 rounded-lg bg-[#FF0404] hover:bg-[#CA0808] active:bg-[#A50505] px-3 py-1 text-white"
              >
                + Добавить протокол
              </button>
            </Link>
          )}
        </div>

        {protocols.length ? (
          <div className="space-y-6">
            {protocols.map((protocol) => {
              const isActive = selectedProtocolId === protocol.id;

              return (
                <button
                  key={protocol.id}
                  type="button"
                  onClick={() =>
                    setSelectedProtocolId((prevId) =>
                      prevId === protocol.id ? null : protocol.id,
                    )
                  }
                  className={[
                    "w-full rounded-lg border p-4 text-left transition",
                    isActive
                      ? "border-[#B8B8B8] bg-[#D9D9D9]"
                      : "border-transparent bg-white hover:border-[#C3C0C0] hover:bg-[#EFEFEF]",
                  ].join(" ")}
                >
                  <div className="mb-2 flex items-center gap-2 text-[18px]">
                    <FileText size={24} />
                    <span>{protocol.name}</span>
                  </div>

                  <Badge icon={<Calendar size={24} />}>
                    {format(new Date(protocol.createdAt), "dd MMMM yyyy", {
                      locale: ru,
                    })}
                  </Badge>

                  <p className="mt-5 text-[#666]">{protocol.description}</p>
                </button>
              );
            })}
            <Link
              to={`/meetings/${meetingId}/protocol/${openProtocolId}`}
              className={shouldDisableOpenProtocol ? "pointer-events-none" : ""}
            >
              <button
                type="button"
                disabled={shouldDisableOpenProtocol}
                className="mt-4 h-[32px] w-full rounded-lg border border-[#C3C0C0] bg-[#FF0404] text-white hover:bg-[#CA0808] active:bg-[#A50505] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Открыть протокол
              </button>
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center gap-2 text-[18px]">
              <FileText size={24} />
              <span>Протоколов пока нет</span>
            </div>

            <p className="mb-4 text-[#666]">
              Создайте первый протокол для этой встречи
            </p>

            <Link to={`/meetings/${meetingId}/protocol`}>
              <button
                type="button"
                className="h-[32px] w-full rounded-lg border border-[#C3C0C0] bg-[#FF0404] hover:bg-[#CA0808] active:bg-[#A50505] text-white"
              >
                Создать первый протокол
              </button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function ParticipantCard({ user, color }) {
  const fullName = `${user.name} ${user.surname}`;
  const initials = `${user.name?.[0] || ""}${user.surname?.[0] || ""}`;

  return (
    <div
      className={`flex items-center rounded-[3px] gap-2 px-2 py-2 font-medium text-[16px] ${color}`}
    >
      {user.photoUrl ? (
        <img
          src={user.photoUrl}
          alt={fullName}
          className="size-[45px] rounded-full object-cover"
        />
      ) : (
        <span className="flex size-[45px] items-center justify-center rounded-full border border-black bg-[#FFE0E0] text-[#FF1616]">
          {initials}
        </span>
      )}

      <span>{fullName}</span>
    </div>
  );
}

function Badge({ icon, children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-3.5 rounded-lg border border-[#C3C0C0] px-2 text-[#666] bg-[#F8F8F8] ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

function InfoBlock({ title, icon, children }) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center gap-2 text-[18px]">
        {icon}
        <span>{title}</span>
      </div>

      {children}
    </div>
  );
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  if (!hours) return `${restMinutes}мин`;
  if (!restMinutes) return `${hours}ч`;

  return `${hours}ч ${restMinutes}мин`;
}

function getMeetingTitle(meeting) {
  const title = meeting?.title?.trim();

  if (!title) return "Информация о встрече";

  if (title.startsWith("Неизвестная встреча")) {
    return "Информация о встрече";
  }

  return title;
}
