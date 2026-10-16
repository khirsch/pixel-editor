import { LucideIcon } from 'lucide-react';

interface ToolButtonProps {
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
  title: string;
  size?: 'sm' | 'md';
}

export function ToolButton({ icon: Icon, active, onClick, title, size = 'md' }: ToolButtonProps) {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  
  return (
    <button
      onClick={onClick}
      className={`aspect-square border-2 flex items-center justify-center ${
        active 
          ? 'bg-black text-white' 
          : 'bg-white hover:bg-gray-200'
      }`}
      style={{
        borderTopColor: active ? '#000' : '#fff',
        borderLeftColor: active ? '#000' : '#fff',
        borderRightColor: active ? '#fff' : '#000',
        borderBottomColor: active ? '#fff' : '#000'
      }}
      title={title}
      aria-label={title}
      aria-pressed={active}
    >
      <Icon className={iconSize} aria-hidden="true" />
    </button>
  );
}
