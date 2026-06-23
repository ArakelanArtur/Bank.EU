import Image from 'next/image';

type LogoIconProps = {
  className?: string;
};

export function LogoIcon({ className }: LogoIconProps) {
  return (
    <div className={className}>
      <Image
        src="/logo-icon.png?v=2"
        alt="LumenBridge"
        width={200}
        height={200}
        className="size-full object-contain"
      />
    </div>
  );
}
