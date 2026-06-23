import { CabinetLayout } from '@/shared/ui/cabinet-layout';

export default function CabinetRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CabinetLayout>{children}</CabinetLayout>;
}
