import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
  const token = localStorage.getItem('token');
  const socket = new SockJS('https://fwfe.duckdns.org/ws');
  stompClient = Stomp.over(socket);

  stompClient.connect(
    { Authorization: `Bearer ${token}` },
    () => {
      console.log('✅ Web connected to WebSocket');

      stompClient.subscribe(`/user/queue/private`, (msg) => {
        const message = JSON.parse(msg.body);
        if (onMessageReceived) onMessageReceived(message);
      });
    },
    (err) => console.error('❌ WebSocket error', err)
  );
};

export const sendPrivateMessage = (receiverUsername, content) => {
  if (!stompClient || !stompClient.connected) {
    console.error('WebSocket chưa kết nối');
    return;
  }
  stompClient.send('/app/chat.private', {}, JSON.stringify({
    receiver: receiverUsername,
    content,
  }));
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect(() => {
      console.log('WebSocket disconnected');
    });
  }
};
