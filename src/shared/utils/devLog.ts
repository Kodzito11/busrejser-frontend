export function devLog(flow: string, message: string, data?: unknown) {
  if (!import.meta.env.DEV) return;

  if (data !== undefined) {
    console.info(`[${flow}] ${message}`, data);
    return;
  }

  console.info(`[${flow}] ${message}`);
}