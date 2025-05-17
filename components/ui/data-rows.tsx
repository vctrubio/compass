import React from 'react';
import { cn } from '@/lib/twMerge';

export interface DataItem {
  heading: string;
  value: string | number | React.ReactNode;
}

export interface DataRowsProps {
  data: DataItem[];
  className?: string;
  rowClassName?: string;
  headingClassName?: string;
  valueClassName?: string;
}

export function DataRows({
  data,
  className,
  rowClassName,
  headingClassName,
  valueClassName,
}: DataRowsProps) {
  return (
    <div className={cn('flex flex-col divide-y', className)}>
      {data.map((item, index) => (
        <div 
          key={index} 
          className={cn('flex flex-col sm:flex-row py-3 px-4', rowClassName)}
        >
          <div className={cn('font-medium text-sm text-muted-foreground sm:w-1/3', headingClassName)}>
            {item.heading}
          </div>
          <div className={cn('text-sm sm:w-2/3', valueClassName)}>
            {item.value || <span className="text-muted-foreground italic">Not provided</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

export interface DataCardProps extends DataRowsProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  cardClassName?: string;
  headerClassName?: string;
}

export function DataCard({
  data,
  title,
  subtitle,
  actions,
  cardClassName,
  headerClassName,
  ...props
}: DataCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card', cardClassName)}>
      {(title || subtitle || actions) && (
        <div className={cn('flex flex-col sm:flex-row justify-between p-4 border-b', headerClassName)}>
          <div>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
          {actions && <div className="mt-2 sm:mt-0">{actions}</div>}
        </div>
      )}
      <DataRows data={data} {...props} />
    </div>
  );
}