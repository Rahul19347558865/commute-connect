import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatConversations } from '../../hooks/useChat';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Skeleton, EmptyState, ErrorState, SEO } from '../../components';
import { MessageSquare, MapPin } from '../../components/icons';

/**
 * ChatList - Sub-panel displaying active conversations users participate in.
 */
export const ChatList: React.FC = () => {
  const navigate = useNavigate();
  const { data: chats, isLoading, error, refetch } = useChatConversations();

  return (
    <DashboardLayout activeTab="messages">
      <SEO
        title="My Chats"
        description="Connect and message with your carpool drivers and fellow passengers in real time on Commute Connect."
      />
      <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
        <div>
          <h1 className="text-h2 font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-brand-primary" />
            Commute Chats
          </h1>
          <p className="text-small text-neutral-textSub dark:text-slate-400">
            Select an active carpool conversation to message drivers and co-passengers.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton variant="rect" height="80px" />
            <Skeleton variant="rect" height="80px" />
          </div>
        ) : error ? (
          <ErrorState
            title="Chat Loading Failed"
            message={error.message || 'Could not retrieve chat channels list.'}
            onRetry={refetch}
          />
        ) : !chats || chats.length === 0 ? (
          <EmptyState
            title="No Active Chats"
            description="You don't have any active ride offerings or approved bookings. Join or publish a ride to start chatting!"
          />
        ) : (
          <div className="space-y-3">
            {chats.map((chat: any) => {
              const driverName = chat.driver?.full_name || 'Verified Commuter';
              const college = chat.driver?.college_company || 'Commute Connect Partner';
              const initials = driverName.split(' ').map((n: string) => n[0]).join('').substring(0, 2);

              return (
                <Card
                  key={chat.id}
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className="hover:border-brand-primary/20 hover:shadow-shadow-medium cursor-pointer transition-all duration-theme-fast"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <Avatar
                      src={chat.driver?.profile_photo || undefined}
                      fallback={initials}
                      size="md"
                      alt={driverName}
                    />

                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-center">
                        <div className="min-w-0">
                          <span className="font-bold text-small text-neutral-textMain dark:text-slate-100 truncate block">
                            Ride with {driverName}
                          </span>
                          <span className="text-[10px] text-neutral-textSub block truncate mt-0.5">
                            {college}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-textSub uppercase font-bold shrink-0">
                          {chat.driver?.vehicle_information?.company || 'Carpool'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-neutral-textSub dark:text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                        <span className="truncate">To: {chat.destination}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
export default ChatList;
