import { cn } from '../../shared/lib/utils.js';

export function Card({ className, ...props }) {
  return <section className={cn('rounded-2xl border bg-white p-5 shadow-card', className)} {...props} />;
}
