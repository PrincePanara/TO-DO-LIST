import * as pdfjsLib from 'pdfjs-dist';
import type { ClassSlot } from '../types';
import { newId } from '../contexts/StudyForgeContext';

// Configure the worker explicitly for Vite
// In a Vite app, we can use the worker from the package directly
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

const DAYS: ClassSlot['day'][] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export async function parsePdfTimetable(file: File, defaultSubjectId: string): Promise<ClassSlot[]> {
  const arrayBuffer = await file.arrayBuffer();
  
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  const extractedText: string[] = [];
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const strings = textContent.items.map((item: any) => item.str.trim()).filter(s => s.length > 0);
    extractedText.push(...strings);
  }

  // Very basic heuristic parser
  const classes: ClassSlot[] = [];
  let currentDay: ClassSlot['day'] | null = null;
  let currentStart = '09:00';
  let currentEnd = '10:00';

  // Hours to map extracted times roughly
  const timeRegex = /([0-9]{1,2})[:.]([0-9]{2})\s*([apAP][mM])?|([0-9]{1,2})\s*([apAP][mM])/;
  
  for (const text of extractedText) {
    const upper = text.toUpperCase();
    
    // Check if it's a day
    if (upper.includes('MONDAY') || upper === 'MON') currentDay = 'MON';
    else if (upper.includes('TUESDAY') || upper === 'TUE') currentDay = 'TUE';
    else if (upper.includes('WEDNESDAY') || upper === 'WED') currentDay = 'WED';
    else if (upper.includes('THURSDAY') || upper === 'THU') currentDay = 'THU';
    else if (upper.includes('FRIDAY') || upper === 'FRI') currentDay = 'FRI';
    else if (upper.includes('SATURDAY') || upper === 'SAT') currentDay = 'SAT';
    
    // Check if it's a time
    else if (timeRegex.test(upper)) {
      // Just a mock parsing logic for time strings
      const match = upper.match(timeRegex);
      if (match) {
        let hourStr = match[1] || match[4];
        let hour = parseInt(hourStr);
        if (upper.includes('PM') && hour < 12) hour += 12;
        if (hour < 10) currentStart = `0${hour}:00`;
        else currentStart = `${hour}:00`;
        
        let endHour = hour + 1;
        if (endHour < 10) currentEnd = `0${endHour}:00`;
        else currentEnd = `${endHour}:00`;
      }
    }
    
    // Otherwise, treat it as a class if it's long enough and we have a day
    else if (text.length > 3 && currentDay && !text.includes('Timetable') && !text.includes('Schedule')) {
      const isLab = upper.includes('LAB') || upper.includes('PRACTICAL');
      classes.push({
        id: newId(),
        subjectId: defaultSubjectId,
        day: currentDay,
        start: currentStart,
        end: currentEnd,
        room: '',
        kind: isLab ? 'Lab' : 'Theory'
      });
      // Advance time slightly to avoid complete overlap if multiple subjects found
      let startHour = parseInt(currentStart.split(':')[0]);
      if (startHour < 16) {
        currentStart = `${startHour + 1 < 10 ? '0' : ''}${startHour + 1}:00`;
        currentEnd = `${startHour + 2 < 10 ? '0' : ''}${startHour + 2}:00`;
      }
    }
  }

  return classes;
}
