export interface CreateProjectDTO {
  title: string;
  description?: string;
  clientId?: string;
  deadline?: string;
}

export interface UpdateProjectDTO {
  title?: string;
  description?: string;
  // string = vincular cliente, null = desvincular, ausente = não altera
  clientId?: string | null;
  progress?: number;
  status?: 'PENDING' | 'IN_PROGRESS' | 'AWAITING_CLIENT' | 'COMPLETED' | 'PAUSED' | 'ARCHIVED';
  deadline?: string | null;
  estimatedHours?: number | null;
  // ── Financeiro ──
  billingType?: 'FIXED' | 'HOURLY' | 'INSTALLMENTS';
  totalValue?: number | null;
  hourlyRate?: number | null;
  currency?: string;
}
