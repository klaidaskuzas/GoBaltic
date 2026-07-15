import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Info, AlertCircle, CreditCard, Volume2, VolumeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  action?: string;
  priority?: string;
}

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  // Initialize sound enabled state from localStorage, default to true if not set
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const savedSetting = localStorage.getItem('notificationSoundEnabled');
    return savedSetting !== null ? savedSetting === 'true' : true;
  });
  const queryClient = useQueryClient();
  const userId = 1; // Assuming admin user for now, should be dynamic based on logged in user
  const prevUnreadCount = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize notification sound
  useEffect(() => {
    audioRef.current = new Audio("/notification-sound.mp3");
  }, []);
  
  // Save sound setting to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('notificationSoundEnabled', soundEnabled.toString());
  }, [soundEnabled]);
  
  // Query notifications
  const { data, isLoading, error } = useQuery<{
    notifications: Notification[];
    unreadCount: number;
  }>({
    queryKey: ["/api/notifications", userId],
    queryFn: async () => {
      const response = await fetch(`/api/notifications?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate the notifications query to refetch
      queryClient.invalidateQueries({ queryKey: ["/api/notifications", userId] });
    },
  });
  
  // Mark all as read
  const markAllAsRead = async () => {
    if (!data?.notifications) return;
    
    // Mark each unread notification as read
    const unreadNotifications = data.notifications.filter(notification => !notification.isRead);
    
    for (const notification of unreadNotifications) {
      await markAsReadMutation.mutateAsync(notification.id);
    }
  };
  
  // Play sound when new notifications arrive
  useEffect(() => {
    // Only play sound if there are new notifications
    if (data?.unreadCount && prevUnreadCount.current !== null) {
      // If unread count has increased, play sound
      if (data.unreadCount > prevUnreadCount.current && soundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          console.error("Failed to play notification sound:", error);
        });
      }
    }
    
    // Update previous unread count
    if (data?.unreadCount !== undefined) {
      prevUnreadCount.current = data.unreadCount;
    }
  }, [data?.unreadCount, soundEnabled]);
  
  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "credit_alert":
        return <CreditCard className="h-5 w-5 text-red-500" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {data?.unreadCount && data.unreadCount > 0 ? (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {data.unreadCount > 9 ? "9+" : data.unreadCount}
            </Badge>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <div className="font-medium">Pranešimai</div>
          {data?.unreadCount && data.unreadCount > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              <CheckCheck className="mr-1 h-4 w-4" />
              Pažymėti visus kaip perskaitytus
            </Button>
          ) : null}
        </div>
        <Separator />
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-gray-600" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-gray-600" />
                  )}
                  <span className="text-xs">Garso pranešimai</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                {soundEnabled ? "Išjungti garso pranešimus" : "Įjungti garso pranešimus"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Switch 
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
            className="h-4 w-7 data-[state=checked]:bg-blue-500"
          />
        </div>
        <Separator />
        <ScrollArea className="h-[350px]">
          {isLoading ? (
            <div className="flex justify-center p-4">Kraunama...</div>
          ) : error ? (
            <div className="text-center p-4 text-red-500">Klaida: nepavyko gauti pranešimų</div>
          ) : !data?.notifications || data.notifications.length === 0 ? (
            <div className="text-center p-4 text-gray-500">Nėra naujų pranešimų</div>
          ) : (
            data.notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b last:border-b-0 ${
                  !notification.isRead ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      {notification.action && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                        >
                          {notification.action}
                        </Button>
                      )}
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto py-1 px-2 text-xs ml-auto"
                          onClick={() => markAsReadMutation.mutate(notification.id)}
                        >
                          <CheckCheck className="mr-1 h-3 w-3" />
                          Pažymėti kaip perskaitytą
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}