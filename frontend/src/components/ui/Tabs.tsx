import React, { createContext, useContext, useState, useId } from 'react';

interface TabsContextProps {
  activeValue: string;
  setActiveValue: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextProps | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound subcomponents must be rendered inside a <Tabs> container');
  }
  return context;
}

/**
 * Props for the Tabs container component.
 */
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The value of the active tab for controlled state */
  value?: string;
  /** Default active tab value */
  defaultValue: string;
  /** Event triggered when the active tab shifts */
  onValueChange?: (value: string) => void;
}

/**
 * Tabs - Compound root component to orchestrate tab switching panels.
 * Exposes layout context to child subcomponents, removing manual trigger state coupling.
 */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value, defaultValue, onValueChange, children, ...props }, ref) => {
    const [localActive, setLocalActive] = useState(defaultValue);
    const activeValue = value !== undefined ? value : localActive;
    const baseId = useId();

    const setActiveValue = (val: string) => {
      setLocalActive(val);
      if (onValueChange) {
        onValueChange(val);
      }
    };

    return (
      <TabsContext.Provider value={{ activeValue, setActiveValue, baseId }}>
        <div ref={ref} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

/**
 * TabsList - Group container for tabs headers.
 */
export const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={`inline-flex items-center gap-1.5 p-1 rounded-radius-md bg-slate-100 dark:bg-slate-800 text-neutral-textSub ${className}`}
      {...props}
    />
  )
);
TabsList.displayName = 'TabsList';

/**
 * Props for the individual TabsTrigger component.
 */
export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The unique state target identifier matching content panel values */
  value: string;
}

/**
 * TabsTrigger - Clickable navigation tab trigger.
 */
export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className = '', value, children, ...props }, ref) => {
    const { activeValue, setActiveValue, baseId } = useTabsContext();
    const isActive = activeValue === value;

    const triggerId = `${baseId}-trigger-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={triggerId}
        aria-selected={isActive}
        aria-controls={panelId}
        tabIndex={isActive ? 0 : -1}
        onClick={() => setActiveValue(value)}
        className={`
          inline-flex items-center justify-center px-4 py-2 text-small font-medium rounded-radius-sm outline-none transition-all duration-theme-fast cursor-pointer select-none
          ${isActive 
            ? 'bg-neutral-surface dark:bg-slate-900 text-neutral-textMain dark:text-slate-100 shadow-shadow-small' 
            : 'text-neutral-textSub hover:text-neutral-textMain dark:hover:text-slate-200'
          }
          focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
          disabled:opacity-50 disabled:pointer-events-none
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

/**
 * Props for the TabsContent panel component.
 */
export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The unique value matching trigger identifier value keys */
  value: string;
}

/**
 * TabsContent - Viewport tab contents panel.
 */
export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className = '', value, children, ...props }, ref) => {
    const { activeValue, baseId } = useTabsContext();
    const isActive = activeValue === value;

    const triggerId = `${baseId}-trigger-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={triggerId}
        tabIndex={0}
        className={`mt-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 rounded-radius-md ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = 'TabsContent';
