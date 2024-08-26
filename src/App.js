import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GlobalStyles } from "@mui/material";

import ChooseRoom from "./components/ChooseRoom";
import Chat from "./components/Chat/Chat";
import HistoryListener from "./utils/HistoryListener";

import { SocketProvider } from "./context/socketContext";
import { MessageProvider } from "./context/messageContext";

function App() {
  return (
    <>
      <GlobalStyles styles={{
        html: {
          fontSize: 16,
          fontFamily: 'Roboto, Arial, sans-serif',
        },
        body: {
          margin: 0,
          padding: 0,
        },
        '*': {
          boxSizing: 'border-box',
        },
      }} />
      <Router>
        <SocketProvider>
          <MessageProvider>
            <HistoryListener>
              <Routes>
                <Route path="/" element={<ChooseRoom />} />
                <Route path="/chat" element={<Chat />} />
              </Routes>
            </HistoryListener>
          </MessageProvider>
        </SocketProvider>
      </Router>
    </>
  );
}

export default App;
