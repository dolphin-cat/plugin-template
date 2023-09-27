declare module "tzname" {
  // Define the shape of the timezones.json object
  interface Timezones {
    [key: string]: string;
  }

  /**
   * Get the timezone name by its offset.
   * @param offset - The timezone offset.
   * @returns The name of the timezone.
   * @throws Error if no timezone is found for the given offset.
   */
  export function getTimezoneNameByOffset(offset: number | string): string;

  /**
   * Detect the timezone of the current system.
   * @returns The name of the detected timezone.
   */
  export function detectTimezone(): string;

  // Export the timezones object for external use (optional)
  export const timezones: Timezones;
}
