import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatPage = () => {
  const location = useLocation();
  const preReceiver = location.state?.receiverUsername || null;
  const username = localStorage.getItem("username");
  const [groupMessages, setGroupMessages] = useState([]);
  const [privateInbox, setPrivateInbox] = useState([]);
  const [currentPrivateChat, setCurrentPrivateChat] = useState(null);
  const [privateMessagesMap, setPrivateMessagesMap] = useState({});
  const [input, setInput] = useState("");
  const [chatMode, setChatMode] = useState("group");

  const stompRef = useRef(null);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // WebSocket STOMP
  useEffect(() => {
    if (!username) return;

    const token = localStorage.getItem("token");
    const socket = new SockJS("https://findwork.duckdns.org/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({ Authorization: `Bearer ${token}` }, () => {
      // Group chat
      stompClient.subscribe("/topic/chat/group", (msg) => {
        try {
          const data = JSON.parse(msg.body);
          setGroupMessages((prev) => [...prev, data]);
          setTimeout(scrollToBottom, 50);
        } catch (err) {
          console.error("Lỗi parse group message", err);
        }
      });

      // Private chat
      stompClient.subscribe(`/user/${username}/queue/messages`, (msg) => {
        try {
          const data = JSON.parse(msg.body);
          const otherUser = data.sender === username ? data.receiver : data.sender;

          setPrivateMessagesMap((prev) => {
            const messages = prev[otherUser] ? [...prev[otherUser], data] : [data];
            return { ...prev, [otherUser]: messages };
          });
        } catch (err) {
          console.error("Lỗi parse private message", err);
        }
      });
    });

    stompRef.current = stompClient;
    return () => stompClient.disconnect();
  }, [username]);

  useEffect(() => {
    const fetchPrivateHistory = async () => {
      if (!username) return;
      try {
        const token = localStorage.getItem("token");

        const resInbox = await fetch(
          `https://findwork.duckdns.org/api/chat/chat/private/inbox?myUsername=${username}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        let inboxUsers = [];
        try {
          inboxUsers = await resInbox.json();
          if (!Array.isArray(inboxUsers)) inboxUsers = [];
        } catch {
          inboxUsers = [];
        }

        setPrivateInbox(inboxUsers.filter((u) => u !== username));

        const messagesMap = {};
        for (const user of inboxUsers) {
          if (user === username) continue;
          try {
            const resMessages = await fetch(
              `https://findwork.duckdns.org/api/chat/chat/history/private?user=${user}&limit=50`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            const msgs = await resMessages.json();
            messagesMap[user] = Array.isArray(msgs) ? msgs : [];
          } catch (err) {
            console.error(`Lấy tin nhắn của ${user} thất bại`, err);
            messagesMap[user] = [];
          }
        }
        setPrivateMessagesMap(messagesMap);
      } catch (err) {
        console.error("Lỗi fetch inbox/lịch sử", err);
      }
    };

    fetchPrivateHistory();
  }, [username]);

  useEffect(() => {
    if (preReceiver) {
      setChatMode("private");
      setCurrentPrivateChat(preReceiver);

      if (!privateMessagesMap[preReceiver]) {
        selectPrivateChat(preReceiver);
      }
    }
  }, [preReceiver]);

  const selectPrivateChat = async (user) => {
    setCurrentPrivateChat(user);
    setChatMode("private");

    if (!privateMessagesMap[user] || privateMessagesMap[user].length === 0) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `https://findwork.duckdns.org/api/chat/chat/history/private?user=${user}&limit=50`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setPrivateMessagesMap((prev) => ({ ...prev, [user]: Array.isArray(data) ? data : [] }));
      } catch (err) {
        console.error("Lấy lịch sử tin nhắn thất bại", err);
        setPrivateMessagesMap((prev) => ({ ...prev, [user]: [] }));
      }
    }

    setTimeout(scrollToBottom, 50);
  };

  const sendMessage = () => {
    if (!input.trim() || !stompRef.current) return;

    const message = {
      content: input,
      sender: username,
      timestamp: new Date().toISOString(),
    };

    if (chatMode === "group") {
      setGroupMessages((prev) => [...prev, message]);
      stompRef.current.send("/app/chat.group", {}, JSON.stringify(message));
    } else if (chatMode === "private" && currentPrivateChat) {
      if (currentPrivateChat === username) {
        console.warn("Không thể gửi tin nhắn cho chính bạn!");
        return;
      }

      const privateMsg = { ...message, receiver: currentPrivateChat };

      setPrivateMessagesMap((prev) => {
        const prevMsgs = prev[currentPrivateChat] || [];
        return { ...prev, [currentPrivateChat]: [...prevMsgs, privateMsg] };
      });

      stompRef.current.send("/app/chat.private", {}, JSON.stringify(privateMsg));
    }

    setInput("");
    setTimeout(scrollToBottom, 50);
  };

  const renderMessages = (messages) =>
    Array.isArray(messages)
      ? messages.map((msg, idx) => {
          const isMe = msg.sender === username;
          let timestamp = null;
          if (msg.timestamp) {
            timestamp = msg.timestamp.includes("T") ? new Date(msg.timestamp) : new Date(msg.timestamp + "Z");
          }
          return (
            <div
              key={idx}
              className={`mb-2 p-3 rounded-lg max-w-[70%] shadow ${
                isMe ? "ml-auto bg-blue-500/80 text-white" : "mr-auto bg-gray-700/70 text-white"
              }`}
            >
              <div className="font-semibold">{msg.sender}</div>
              <div>{msg.content}</div>
              {timestamp && (
                <div className="text-xs mt-1 text-gray-300">
                  {timestamp.getHours()}:
                  {timestamp.getMinutes().toString().padStart(2, "0")} {timestamp.getDate()}/{timestamp.getMonth() + 1}
                </div>
              )}
            </div>
          );
        })
      : null;

  const privateMessages = currentPrivateChat ? privateMessagesMap[currentPrivateChat] || [] : [];

  const starBackgrounds = [
    "https://images.unsplash.com/photo-1528818955841-a7f1425131b5?auto=format&fit=crop&w=1350&q=80",

  ];
  const backgroundImage = starBackgrounds[Math.floor(Math.random() * starBackgrounds.length)];

  return (
    <div className="flex gap-4 h-screen p-4" style={{ background: "#0b0c27" }}>
      {/* Sidebar */}
      <div className="w-1/4 border rounded-lg p-2 bg-gray-900 text-white flex flex-col">
        <h2 className="font-bold mb-2 text-center">Hộp thư</h2>
        <div className="flex justify-around mb-2">
          <button
            onClick={() => setChatMode("group")}
            className={`px-2 py-1 rounded ${chatMode === "group" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"}`}
          >
            Group
          </button>
          <button
            onClick={() => setChatMode("private")}
            className={`px-2 py-1 rounded ${chatMode === "private" ? "bg-blue-600 text-white" : "bg-gray-700 text-white"}`}
          >
            Private
          </button>
        </div>
        {chatMode === "private" && (
          <div className="flex-1 overflow-y-auto">
            {privateInbox.map((user) => (
              <div
                key={user}
                onClick={() => selectPrivateChat(user)}
                className={`p-2 cursor-pointer rounded mb-1 hover:bg-gray-700 ${
                  currentPrivateChat === user ? "bg-gray-600 font-semibold" : ""
                }`}
              >
                {user}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div
        className="flex-1 flex flex-col border rounded-lg p-4 shadow overflow-y-auto"
        ref={scrollRef}
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 className="font-bold mb-2 text-xl text-white">
          {chatMode === "group"
            ? "Chat nhóm"
            : currentPrivateChat
            ? `Chat với ${currentPrivateChat}`
            : "Chọn người để chat"}
        </h2>

        <div className="flex-1 overflow-y-auto p-2 rounded-lg mb-2">
          {chatMode === "group" ? renderMessages(groupMessages) : renderMessages(privateMessages)}
        </div>

        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border rounded-lg px-3 py-2 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
