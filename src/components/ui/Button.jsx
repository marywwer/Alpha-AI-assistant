import { cn } from '../../shared/lib/utils.js';

export function Button({ className, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-transparent text-black hover:bg-[#C3C0C0] flex gap-[10px] items-center',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    ghost: 'bg-transparent text-slate-700 hover:bg-[#C3C0C0]'
  };
  return <button className={cn('p-0 text-[18px] font-normal transition disabled:opacity-50', variants[variant], className)} {...props} />;
}
