import React from 'react';
import { useNotificationsList, useMarkNotificationRead } from '../../hooks/useNotifications';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Skeleton, EmptyState, ErrorState, Button, SEO } from '../../components';
import { Calendar, CheckCircle } from '../../components/icons';

/**
 * NotificationPage - Displays user notifications history log.
 */
export const NotificationPage: React.FC = () => {
  const { data: notifications, isLoading, error, refetch } = useNotificationsList();
  const { mutateAsync: markRead, isPending } = useMarkNotificationRead();

  const handleMarkAllRead = async () => {
    if (!notifications) return;
    const unread = notifications.filter(n => !n.is_read);
    try {
      await Promise.all(unread.map(n => markRead(n.id)));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <DashboardLayout activeTab="notifications">
      <SEO
        title="Notifications"
        description="View your Commute Connect notifications log. Read booking requests, ride updates, and alerts history."
      />
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-h2 font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <Badge variant="danger" className="font-bold px-2 py-0.5 rounded-full text-tiny">
                  {unreadCount} New
                </Badge>
              )}
            </h1>
            <p className="text-small text-neutral-textSub dark:text-slate-400">
              Stay updated with booking approvals, requests, and ride notifications.
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              loading={isPending}
              onClick={handleMarkAllRead}
              className="w-fit"
            >
              Mark All as Read
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton variant="rect" height="70px" />
            <Skeleton variant="rect" height="70px" />
          </div>
        ) : error ? (
          <ErrorState
            title="Failed to load notifications"
            message={error.message || 'Error occurred retrieving alerts.'}
            onRetry={refetch}
          />
        ) : !notifications || notifications.length === 0 ? (
          <EmptyState
            title="All Caught Up"
            description="You don't have any notifications at the moment. We'll alert you here for pool request updates!"
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const dateStr = new Date(notif.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              });

              return (
                <Card
                  key={notif.id}
                  className={`transition-all duration-theme-fast border
                    ${notif.is_read
                      ? 'border-neutral-borderLine dark:border-slate-850 opacity-80'
                      : 'border-brand-primary/30 dark:border-brand-primary/20 bg-brand-primary/[0.02] dark:bg-brand-primary/[0.01] shadow-shadow-small'
                    }
                  `}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex-1 space-y-1 text-small">
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-bold text-neutral-textMain dark:text-slate-100 flex items-center gap-2">
                          {!notif.is_read && <span className="w-2 h-2 rounded-full bg-brand-error shrink-0" />}
                          {notif.title}
                        </span>
                        
                        <span className="text-[10px] text-neutral-textSub whitespace-nowrap flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {dateStr}
                        </span>
                      </div>

                      <p className="text-neutral-textSub dark:text-slate-300 leading-relaxed">
                        {notif.message_text}
                      </p>
                    </div>

                    {!notif.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markRead(notif.id)}
                        className="p-1.5 h-auto text-brand-primary hover:bg-brand-primary/10 shrink-0"
                        title="Mark as Read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
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
export default NotificationPage;
