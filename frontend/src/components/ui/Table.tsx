import React from 'react';

/**
 * Table - Main wrapper for clean tables.
 * Employs horizontal scroll container to prevent responsive overflow layouts.
 */
export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className = '', ...props }, ref) => (
    <div className="w-full overflow-x-auto rounded-radius-md border border-neutral-borderLine dark:border-slate-800 bg-neutral-surface dark:bg-slate-900 shadow-shadow-small">
      <table
        ref={ref}
        className={`w-full caption-bottom text-small border-collapse ${className}`}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

/**
 * TableHeader - Thead container.
 */
export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <thead ref={ref} className={`border-b border-neutral-borderLine dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 ${className}`} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

/**
 * TableBody - Tbody container.
 */
export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <tbody ref={ref} className={`divide-y divide-neutral-borderLine dark:divide-slate-800 ${className}`} {...props} />
  )
);
TableBody.displayName = 'TableBody';

/**
 * TableRow - Table tr rows.
 */
export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className = '', ...props }, ref) => (
    <tr
      ref={ref}
      className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${className}`}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

/**
 * TableHead - Column headers (th).
 */
export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <th
      ref={ref}
      className={`h-12 px-4 text-left align-middle font-semibold text-neutral-textMain dark:text-slate-200 select-none [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

/**
 * TableCell - Individual cells (td).
 */
export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <td
      ref={ref}
      className={`p-4 align-middle text-neutral-textMain dark:text-slate-300 [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';
