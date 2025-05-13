import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class ScreenshotUtil {
    static async captureFailureScreenshot(page: Page, testName: string): Promise<void> {

          console.info(`📸 Capturing failure screenshot for "${testName}"`);

          const now = new Date();
          
          // Generate IST date-time in `dd-mm-yyyy` format
          const istTime = new Intl.DateTimeFormat('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).format(now).replace(/\//g, '-');
        
          // Extract hours and minutes separately in IST
          const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23' // Ensures 24-hour format without AM/PM
          };
          const timeParts = new Intl.DateTimeFormat('en-IN', options).format(now).split(' ');
          const hhmm = timeParts[0].replace(':', ''); // Removes ':' between hour and minutes
        
          const formattedDateTime = `${istTime}-${hhmm}`;
        
          await page.screenshot({
            path: `./test-results/${testName.replace(/\s+/g, '_')}-failure-${formattedDateTime}.png`,
            fullPage: true
          });
        
          console.info(`✅ Screenshot saved: ${formattedDateTime}`);
        }
    }
