import { useState } from "react";
import { Bell, Megaphone, Info, AlertTriangle, X, Check } from "lucide-react";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  type: "announcement" | "info" | "warning";
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "announcement",
    title: "🎉 디하북스 오픈 기념 이벤트",
    message: "전자책 전 품목 20% 할인! 3월 31일까지 진행됩니다.",
    date: "2026-03-30",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "서비스 업데이트 안내",
    message: "전자책 뷰어가 개선되었습니다. 더 쾌적한 독서 환경을 경험해보세요.",
    date: "2026-03-28",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "정기 점검 안내",
    message: "4월 2일 02:00~06:00 서버 점검이 예정되어 있습니다.",
    date: "2026-03-27",
    read: true,
  },
];

const typeIcon = {
  announcement: Megaphone,
  info: Info,
  warning: AlertTriangle,
};

const typeColor = {
  announcement: "bg-primary/10 text-primary",
  info: "bg-blue-100 text-blue-600",
  warning: "bg-yellow-100 text-yellow-600",
};

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg transition-colors">
          <Bell className="h-5 w-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 tablet:w-96 p-0 rounded-xl" sideOffset={8}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-sm font-bold">알림</h3>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Check className="h-3 w-3" /> 모두 읽음
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-10 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">알림이 없습니다</p>
            </div>
          ) : (
            notifications.map((n) => {
              const Icon = typeIcon[n.type];
              return (
                <div
                  key={n.id}
                  className={`relative flex gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/50 transition-colors cursor-pointer ${
                    !n.read ? "bg-primary/[0.03]" : ""
                  }`}
                  onClick={() => markAsRead(n.id)}
                >
                  {/* Unread dot */}
                  {!n.read && (
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}

                  {/* Icon */}
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${typeColor[n.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-tight ${!n.read ? "font-semibold" : "font-medium"}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 mt-1">{n.date}</p>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(n.id);
                    }}
                    className="p-1 rounded hover:bg-secondary shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
