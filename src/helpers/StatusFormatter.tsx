export function statusColor(status: string) {
  switch (status) {
    case 'paid': return 'bg-green-700';
    case 'prepared': return 'bg-yellow-600';
    case 'to_pay': return 'bg-red-700';
    default: return 'bg-gray-600';
  }
}

export function statusText(status: string): string {
  switch (status) {
    case 'paid':
      return 'Pagada';
    case 'prepared':
      return 'Preparada';
    case 'to_pay':
      return 'A pagar';
    default:
      return status;
  }
}