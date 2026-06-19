import { API_BASE_URL } from "../config/api.js";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error("Ошибка запроса");
  }

  const text = await response.text();

  return text ? JSON.parse(text) : null;
};

export const meetingApi = {
  getMeetings: () => request("/meeting/all"),

  createEmptyMeeting: () =>
    request("/meeting/empty", {
      method: "POST",
    }),

  getKonturMeetings: (start) =>
    request(`/meeting/import/kontur?Start=${encodeURIComponent(start)}`),

  importKonturMeeting: ({ konturMeetingId, meetingId }) => {
    const body = {
      konturMeetingId,
      ...(meetingId ? { meetingId } : {}),
    };

    return request("/meeting/import/kontur", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  getMeeting: (meetingId) =>
    request(`/meeting?meetingId=${encodeURIComponent(meetingId)}`),

  getProtocol: (protocolId) =>
    request(`/meeting/protocol?protocolId=${encodeURIComponent(protocolId)}`),

  createProtocol: ({ meetingId, name, description }) =>
    request("/meeting/protocol", {
      method: "POST",
      body: JSON.stringify({
        meetingId,
        name,
        description,
      }),
    }),

  updateProtocol: ({ protocolId, name, description }) =>
    request("/meeting/protocol", {
      method: "PUT",
      body: JSON.stringify({
        protocolId,
        name,
        description,
      }),
    }),

  formalizeProtocol: ({ oldProtocolDesc }) =>
    request("/meeting/protocol/formalize", {
      method: "POST",
      body: JSON.stringify({
        oldProtocolDesc,
      }),
    }),

  sendProtocolEmail: ({ protocolId, protocolDesc }) =>
    request("/meeting/protocol/email/send", {
      method: "POST",
      body: JSON.stringify({
        protocolId,
        protocolDesc,
      }),
    }),
};
