
// Define allowed employee domains for registration
export const ALLOWED_EMPLOYEE_DOMAINS = ['botllm.com', 'company.com'];

// Restrict admin domain to only botllm.com
export const ADMIN_DOMAINS = ['botllm.com'];

// Check if an email belongs to an allowed employee domain
export function isAllowedEmployeeDomain(email: string): boolean {
  const domain = email.split('@')[1];
  return ALLOWED_EMPLOYEE_DOMAINS.includes(domain);
}

// Check if an email belongs to an admin domain
export function isAdminDomain(email: string): boolean {
  const domain = email.split('@')[1];
  return ADMIN_DOMAINS.includes(domain);
}
