import { useState } from "react";
import { MessageCircle, Send, Users, X, Minimize2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PlayerChatProps {
  embedded?: boolean;
}

const PlayerChat = ({ embedded = false }: PlayerChatProps) => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Mock chat data
  const chats = [
    {
      id: "1",
      name: "FC Eagles",
      type: "team",
      lastMessage: "Ready for tomorrow's match?",
      unread: 2,
      status: "accepted",
    },
    {
      id: "2",
      name: "Match: Eagles vs Lions",
      type: "match",
      lastMessage: "See you at the stadium!",
      unread: 0,
      status: "pending",
    },
  ];

  const messages = [
    { id: "1", sender: "Ahmed", content: "Hey team! Ready for tomorrow?", time: "10:30" },
    { id: "2", sender: "You", content: "Yes! Can't wait!", time: "10:32" },
    { id: "3", sender: "Karim", content: "What time should we arrive?", time: "10:35" },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    // In real implementation, send message to backend
    setMessage("");
  };

  if (embedded) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <h3 className="font-semibold">Team Chat</h3>
        </div>

        {/* Chat List or Messages */}
        {!activeChat ? (
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users size={18} className="text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{chat.name}</span>
                    {chat.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary text-xs flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <button
                onClick={() => setActiveChat(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back
              </button>
              <span className="font-medium text-sm">FC Eagles</span>
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                Accepted
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2 ${
                      msg.sender === "You"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10"
                    }`}
                  >
                    {msg.sender !== "You" && (
                      <p className="text-xs text-primary font-medium mb-1">{msg.sender}</p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-60 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="bg-white/5 border-white/10"
                />
                <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-primary/90">
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full page chat view
  return (
    <div className="h-full grid grid-cols-3 gap-6">
      {/* Chat List */}
      <div className="bg-card/50 rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="font-semibold">Conversations</h3>
        </div>
        <div className="overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors border-b border-white/5 ${
                activeChat === chat.id ? "bg-white/5" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Users size={20} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{chat.name}</span>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-primary text-xs flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="col-span-2 bg-card/50 rounded-xl border border-white/10 flex flex-col overflow-hidden">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">FC Eagles</h4>
                  <p className="text-xs text-muted-foreground">5 members</p>
                </div>
              </div>
              <span className="text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
                Match Accepted
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[60%] rounded-xl px-4 py-3 ${
                      msg.sender === "You"
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/10"
                    }`}
                  >
                    {msg.sender !== "You" && (
                      <p className="text-xs text-primary font-medium mb-1">{msg.sender}</p>
                    )}
                    <p>{msg.content}</p>
                    <p className="text-xs opacity-60 mt-2">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  className="bg-white/5 border-white/10"
                />
                <Button onClick={handleSend} className="bg-primary hover:bg-primary/90">
                  <Send size={18} className="mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerChat;