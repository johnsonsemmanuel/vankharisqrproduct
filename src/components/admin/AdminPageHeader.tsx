import { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function AdminPageHeader({ title, description, children }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}
