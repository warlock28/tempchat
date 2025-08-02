import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import RoomManagementSettings from './pages/room-management-settings';
import RoomAccessAuthentication from './pages/room-access-authentication';
import MediaSharingVoiceChat from './pages/media-sharing-voice-chat';
import MainChatInterface from './pages/main-chat-interface';
import RoomCreationSetup from './pages/room-creation-setup';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<MainChatInterface />} />
        <Route path="/room-management-settings" element={<RoomManagementSettings />} />
        <Route path="/room-access-authentication" element={<RoomAccessAuthentication />} />
        <Route path="/media-sharing-voice-chat" element={<MediaSharingVoiceChat />} />
        <Route path="/main-chat-interface" element={<MainChatInterface />} />
        <Route path="/room-creation-setup" element={<RoomCreationSetup />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
