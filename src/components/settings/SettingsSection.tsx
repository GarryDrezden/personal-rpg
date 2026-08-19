import type { ReactNode } from 'react';
import { Card } from '../ui/Card';

type SettingsSectionProps = {
  id: string;
  children: ReactNode;
  testId?: string;
};

export function SettingsSection({ id, children, testId }: SettingsSectionProps) {
  return (
    <Card id={id} className="scroll-mt-28" data-testid={testId}>
      {children}
    </Card>
  );
}
