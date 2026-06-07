import React from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from "../features/auth/AuthProvider.jsx";
import { AppShell } from '../components/layout/AppShell.jsx';
import { LoginPage } from '../pages/LoginPage.jsx';
import { ChatPage } from '../pages/ChatPage.jsx';
import { SummaryPage } from '../pages/SummaryPage.jsx';
import { RoadmapPage } from '../pages/RoadmapPage.jsx';
import { MeetingsPage } from '../pages/MeetingsPage.jsx';
import { MeetingDetailsPage } from '../pages/MeetingDetailsPage.jsx';
import { ProtocolEditorPage } from '../pages/ProtocolEditorPage.jsx';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/chat" replace />,
  },

  {
    element: <AuthProvider />,
    children: [
      {
        element: <AppShell sidebarVariant="chat" />,
        children: [
          {
            path: "/chat",
            element: <ChatPage />,
          },
        ],
      },

      {
        element: <AppShell sidebarVariant="analytics" />,
        children: [
          {
            path: "/analytics/summary",
            element: <SummaryPage />,
          },
          {
            path: "/analytics/roadmap",
            element: <RoadmapPage />,
          },
        ],
      },

      {
        element: <AppShell sidebarVariant="meetings" />,
        children: [
          {
            path: "/meetings",
            element: <MeetingsPage />,
          },
          {
            path: "/meetings/:meetingId",
            element: <MeetingDetailsPage />,
          },
          {
            path: "/meetings/:meetingId/protocol",
            element: <ProtocolEditorPage />,
          },
        ],
      },
    ],
  },
]);
