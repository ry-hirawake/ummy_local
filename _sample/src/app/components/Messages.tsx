import { Search, Phone, Video, MoreVertical, Send, Smile, Paperclip } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface Conversation {
  id: string;
  user: {
    name: string;
    avatar: string;
    status: "online" | "offline" | "away";
  };
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface Message {
  id: string;
  sender: "me" | "other";
  content: string;
  timestamp: string;
}

const conversations: Conversation[] = [
  {
    id: "1",
    user: {
      name: "田中 美咲",
      avatar: "https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc3MjM4MDMxMnww&ixlib=rb-4.1.0&q=80&w=1080",
      status: "online",
    },
    lastMessage: "ミーティングの資料を確認しました！",
    timestamp: "5分前",
    unread: 2,
  },
  {
    id: "2",
    user: {
      name: "佐藤 健太",
      avatar: "https://images.unsplash.com/photo-1554765345-6ad6a5417cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzI0MjMyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "online",
    },
    lastMessage: "了解です。すぐに対応します。",
    timestamp: "30分前",
    unread: 0,
  },
  {
    id: "3",
    user: {
      name: "鈴木 愛",
      avatar: "https://images.unsplash.com/photo-1507611268508-bf74edce9029?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwYnVzaW5lc3N8ZW58MXx8fHwxNzcyNDc2OTE5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "away",
    },
    lastMessage: "デザインの修正箇所を共有します",
    timestamp: "2時間前",
    unread: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "other",
    content: "こんにちは！新しいプロジェクトの進捗はいかがですか？",
    timestamp: "10:30",
  },
  {
    id: "2",
    sender: "me",
    content: "順調に進んでいます。明日のミーティングで詳細を共有します。",
    timestamp: "10:32",
  },
  {
    id: "3",
    sender: "other",
    content: "素晴らしいですね！楽しみにしています。",
    timestamp: "10:33",
  },
  {
    id: "4",
    sender: "other",
    content: "ミーティングの資料を確認しました！",
    timestamp: "10:35",
  },
];

export function Messages() {
  const [selectedConv, setSelectedConv] = useState(conversations[0]);
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Conversations List */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-96 border-r border-border/50 bg-card"
      >
        <div className="p-6">
          <h2 className="mb-4 text-2xl font-bold">メッセージ</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="会話を検索..."
              className="w-full rounded-xl border border-border bg-secondary py-2.5 pl-10 pr-4 outline-none transition-all focus:border-primary/50 focus:bg-background"
            />
          </div>
        </div>

        <div className="overflow-y-auto">
          {conversations.map((conv, index) => (
            <motion.div
              key={conv.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedConv(conv)}
              className={`cursor-pointer border-l-4 px-6 py-4 transition-all ${
                selectedConv.id === conv.id
                  ? "border-primary bg-secondary"
                  : "border-transparent hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={conv.user.avatar}
                    alt={conv.user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card ${
                      conv.user.status === "online"
                        ? "bg-green-500"
                        : conv.user.status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{conv.user.name}</h3>
                    <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {conv.unread}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between border-b border-border/50 bg-card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={selectedConv.user.avatar}
                alt={selectedConv.user.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <span
                className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card ${
                  selectedConv.user.status === "online"
                    ? "bg-green-500"
                    : selectedConv.user.status === "away"
                    ? "bg-yellow-500"
                    : "bg-gray-500"
                }`}
              />
            </div>
            <div>
              <h3 className="font-semibold">{selectedConv.user.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedConv.user.status === "online" ? "オンライン" : "オフライン"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full bg-secondary p-3 transition-all hover:bg-muted"
            >
              <Phone className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full bg-secondary p-3 transition-all hover:bg-muted"
            >
              <Video className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full bg-secondary p-3 transition-all hover:bg-muted"
            >
              <MoreVertical className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {mockMessages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md rounded-2xl px-5 py-3 ${
                    msg.sender === "me"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p
                    className={`mt-1 text-xs ${
                      msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-t border-border/50 bg-card p-6"
        >
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-3">
                <input
                  type="text"
                  placeholder="メッセージを入力..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-muted-foreground transition-all hover:text-foreground"
                >
                  <Smile className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-muted-foreground transition-all hover:text-foreground"
                >
                  <Paperclip className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-2xl bg-primary p-3 text-primary-foreground transition-all hover:bg-primary/90"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
