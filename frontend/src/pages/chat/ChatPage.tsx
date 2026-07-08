import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChatMessages, useSendMessage } from '../../hooks/useChat';
import { useRideDetails, usePassengerBookings, useRideRequests } from '../../hooks/useRides';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button, Skeleton, ErrorState, SEO } from '../../components';
import { Avatar } from '../../components/ui/Avatar';
import { ArrowRight, MapPin, Lock } from '../../components/icons';

export const ChatPage: React.FC = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Queries
  const { data: ride, isLoading: isRideLoading, error: rideError } = useRideDetails(rideId || '');
  const { data: messages, isLoading: isMessagesLoading, error: messagesError, refetch } = useChatMessages(rideId || '');
  const { mutateAsync: sendMessage } = useSendMessage(rideId || '');
  const { data: passengerBookings } = usePassengerBookings();
  const { data: rideRequests } = useRideRequests(rideId || '');

  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const messageText = text;
      setText(''); // Optimistic input clear
      await sendMessage(messageText);
    } catch (err) {
      console.error('Failed to dispatch message:', err);
    }
  };

  const isDriver = ride && user && ride.driver_id === user.id;
  const isPassenger = ride && user && ride.driver_id !== user.id;

  // Locks conditions: must have booking exist and status accepted
  const hasAcceptedBooking = passengerBookings?.some(
    (b: any) => b.ride_id === rideId && b.status === 'accepted'
  );
  const hasAcceptedPassenger = rideRequests?.some(
    (req: any) => req.status === 'accepted'
  );

  const isLocked = isDriver ? !hasAcceptedPassenger : (isPassenger ? !hasAcceptedBooking : true);
  const isLoading = isRideLoading || isMessagesLoading;

  if (isLoading) {
    return (
      <DashboardLayout activeTab="messages">
        <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
          <Skeleton variant="rect" height="60px" className="rounded" />
          <Skeleton variant="rect" className="flex-1 mt-4 rounded-radius-md" />
        </div>
      </DashboardLayout>
    );
  }

  if (rideError || !ride) {
    return (
      <DashboardLayout activeTab="messages">
        <ErrorState
          title="Conversation Not Found"
          message={rideError?.message || 'Error occurred retrieving ride offering details.'}
          onRetry={() => navigate('/chat')}
        />
      </DashboardLayout>
    );
  }

  if (isLocked) {
    return (
      <DashboardLayout activeTab="messages">
        <SEO
          title="Ride Chat"
          description="Discuss travel plans, pickup locations, timings, and coordinates directly with your commuter pool participants on Commute Connect."
        />
        <div className="max-w-md mx-auto flex flex-col items-center justify-center text-center p-8 border border-neutral-borderLine dark:border-slate-800 rounded-radius-lg bg-neutral-surface dark:bg-slate-900 shadow-shadow-small my-12 space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-slate-100 dark:bg-slate-800 text-neutral-textSub rounded-full">
            <Lock className="w-8 h-8 text-brand-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-h3 font-bold text-neutral-textMain dark:text-slate-100">
              Chat Room Locked
            </h2>
            <p className="text-small text-neutral-textSub dark:text-slate-400">
              {isDriver 
                ? "This room will unlock once you approve at least one passenger booking request for this carpool."
                : "This conversation channel will unlock once the driver accepts your booking request."
              }
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)} className="px-6 h-10 rounded">
            Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="messages">
      <SEO
        title="Ride Chat"
        description="Discuss travel plans, pickup locations, timings, and coordinates directly with your commuter pool participants on Commute Connect."
      />
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] animate-fade-in">
        {/* Back Link Nav Bar */}
        <div className="mb-3 shrink-0 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/chat')} className="h-9 px-3 rounded">
            Back to Chats
          </Button>

          <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-textSub">
            <MapPin className="w-3.5 h-3.5 text-brand-primary" />
            <span className="truncate max-w-[150px] sm:max-w-xs">{ride.pickup_location.split(',')[0]}</span>
            <ArrowRight className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[150px] sm:max-w-xs">{ride.destination.split(',')[0]}</span>
          </div>
        </div>

        {/* Messaging Container */}
        <Card className="flex-1 flex flex-col overflow-hidden border border-neutral-borderLine dark:border-slate-800 rounded-radius-md shadow-shadow-medium">
          {/* Header */}
          <CardHeader className="py-3 px-4 border-b border-neutral-borderLine dark:border-slate-800 shrink-0 bg-neutral-surface dark:bg-slate-900">
            <CardTitle className="text-small font-bold text-neutral-textMain dark:text-slate-100">
              Ride Pool with {ride.driver?.full_name || 'Verified Commuter'}
            </CardTitle>
          </CardHeader>

          {/* Messages Log Panel */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-slate-50/50 dark:bg-slate-900/10">
            {messagesError ? (
              <ErrorState
                title="Message load failure"
                message={messagesError.message || 'An error occurred fetching channel messages.'}
                onRetry={refetch}
              />
            ) : !messages || messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-textSub p-6">
                <p className="font-semibold text-small text-neutral-textMain dark:text-slate-300">No messages yet</p>
                <p className="text-tiny text-neutral-textSub dark:text-slate-400 mt-1">Introduce yourself to start carpooling route details!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === user?.id;
                const senderName = msg.sender?.full_name || 'Commuter';
                const senderInitials = senderName.split(' ').map((n: string) => n[0]).join('').substring(0, 2);
                
                const timeStr = new Date(msg.created_at).toLocaleTimeString(undefined, {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                });

                return (
                  <div key={msg.id} className={`flex items-start gap-2.5 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                    {!isMe && (
                      <Avatar
                        src={msg.sender?.profile_photo || undefined}
                        fallback={senderInitials}
                        size="sm"
                        alt={senderName}
                        className="mt-0.5 shrink-0"
                      />
                    )}

                    <div className="space-y-1">
                      {!isMe && (
                        <span className="text-[10px] font-bold text-neutral-textSub dark:text-slate-400 block px-1">
                          {senderName}
                        </span>
                      )}

                      <div
                        className={`p-3 rounded-radius-md text-small break-words leading-relaxed shadow-shadow-small
                          ${isMe
                            ? 'bg-brand-primary text-neutral-surface rounded-tr-none'
                            : 'bg-neutral-surface dark:bg-slate-800 text-neutral-textMain dark:text-slate-100 rounded-tl-none border border-neutral-borderLine dark:border-slate-800'
                          }
                        `}
                      >
                        {msg.message_text}
                      </div>

                      <span className={`text-[9px] text-neutral-textSub block px-1 ${isMe ? 'text-right' : ''}`}>
                        {timeStr}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Typing Send Action Form Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-neutral-borderLine dark:border-slate-800 shrink-0 bg-neutral-surface dark:bg-slate-900 flex gap-2">
            <Input
              value={text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
              placeholder="Type message..."
              className="flex-1 h-10"
              aria-label="Message text"
            />
            <Button type="submit" variant="primary" className="h-10 px-6 font-bold shrink-0 rounded">
              Send
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;
