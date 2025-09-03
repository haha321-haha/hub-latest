// Data converter utility to transform between PainEntry and PainRecord types
// Bridges the gap between existing pain tracker data and analytics system

import { 
  PainRecord, 
  PainType, 
  PainLocation, 
  Symptom, 
  MenstrualStatus,
  Medication 
} from '../../../../../types/pain-tracker';

// Temporary interface definition to avoid import issues
interface PainEntry {
  id: string;
  date: string;
  painLevel: number;
  duration?: number;
  location: string[];
  menstrualStatus: 'period' | 'pre' | 'post' | 'ovulation' | 'other';
  symptoms: string[];
  remedies: string[];
  effectiveness?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Convert PainEntry to PainRecord for analytics compatibility
 */
export function convertPainEntryToPainRecord(entry: PainEntry): PainRecord {
  return {
    id: entry.id,
    date: entry.date,
    time: extractTimeFromDate(entry.createdAt) || '12:00', // Default time if not available
    painLevel: entry.painLevel,
    painTypes: convertLocationsToPainTypes(entry.location),
    locations: convertToLocations(entry.location),
    symptoms: convertToSymptoms(entry.symptoms),
    menstrualStatus: convertMenstrualStatus(entry.menstrualStatus),
    medications: convertRemediesToMedications(entry.remedies),
    effectiveness: entry.effectiveness || 0,
    lifestyleFactors: [], // Not available in PainEntry, use empty array
    notes: entry.notes || '',
    createdAt: new Date(entry.createdAt),
    updatedAt: new Date(entry.updatedAt)
  };
}

/**
 * Convert array of PainEntry to array of PainRecord
 */
export function convertPainEntriesToPainRecords(entries: PainEntry[]): PainRecord[] {
  return entries.map(convertPainEntryToPainRecord);
}

/**
 * Extract time from ISO timestamp
 */
function extractTimeFromDate(isoString: string): string | null {
  try {
    const date = new Date(isoString);
    return date.toTimeString().slice(0, 5); // HH:MM format
  } catch {
    return null;
  }
}

/**
 * Convert location strings to pain types
 * Maps location-based descriptions to pain type categories
 */
function convertLocationsToPainTypes(locations: string[]): PainType[] {
  const painTypes: PainType[] = [];
  
  locations.forEach(location => {
    const lowerLocation = location.toLowerCase();
    
    // Map locations to likely pain types
    if (lowerLocation.includes('cramp') || lowerLocation.includes('abdomen')) {
      painTypes.push('cramping');
    } else if (lowerLocation.includes('sharp') || lowerLocation.includes('stab')) {
      painTypes.push('sharp');
    } else if (lowerLocation.includes('throb') || lowerLocation.includes('pulse')) {
      painTypes.push('throbbing');
    } else if (lowerLocation.includes('ache') || lowerLocation.includes('dull')) {
      painTypes.push('aching');
    } else if (lowerLocation.includes('burn')) {
      painTypes.push('burning');
    } else if (lowerLocation.includes('pressure') || lowerLocation.includes('heavy')) {
      painTypes.push('pressure');
    } else {
      // Default to cramping for unspecified locations
      painTypes.push('cramping');
    }
  });
  
  // Remove duplicates and ensure at least one pain type
  const uniquePainTypes = Array.from(new Set(painTypes));
  return uniquePainTypes.length > 0 ? uniquePainTypes : ['cramping'];
}

/**
 * Convert location strings to standardized pain locations
 */
function convertToLocations(locations: string[]): PainLocation[] {
  const painLocations: PainLocation[] = [];
  
  locations.forEach(location => {
    const lowerLocation = location.toLowerCase();
    
    if (lowerLocation.includes('lower abdomen') || lowerLocation.includes('lower belly')) {
      painLocations.push('lower_abdomen');
    } else if (lowerLocation.includes('lower back') || lowerLocation.includes('back')) {
      painLocations.push('lower_back');
    } else if (lowerLocation.includes('thigh') || lowerLocation.includes('leg')) {
      painLocations.push('upper_thighs');
    } else if (lowerLocation.includes('pelvis') || lowerLocation.includes('pelvic')) {
      painLocations.push('pelvis');
    } else if (lowerLocation.includes('side') || lowerLocation.includes('flank')) {
      painLocations.push('side');
    } else if (lowerLocation.includes('whole') || lowerLocation.includes('entire') || lowerLocation.includes('all')) {
      painLocations.push('whole_abdomen');
    } else {
      // Default to lower abdomen for unspecified locations
      painLocations.push('lower_abdomen');
    }
  });
  
  // Remove duplicates and ensure at least one location
  const uniqueLocations = Array.from(new Set(painLocations));
  return uniqueLocations.length > 0 ? uniqueLocations : ['lower_abdomen'];
}

/**
 * Convert symptom strings to standardized symptoms
 */
function convertToSymptoms(symptoms: string[]): Symptom[] {
  const standardSymptoms: Symptom[] = [];
  
  symptoms.forEach(symptom => {
    const lowerSymptom = symptom.toLowerCase();
    
    if (lowerSymptom.includes('nausea') || lowerSymptom.includes('sick')) {
      standardSymptoms.push('nausea');
    } else if (lowerSymptom.includes('vomit') || lowerSymptom.includes('throw up')) {
      standardSymptoms.push('vomiting');
    } else if (lowerSymptom.includes('diarrhea') || lowerSymptom.includes('loose stool')) {
      standardSymptoms.push('diarrhea');
    } else if (lowerSymptom.includes('headache') || lowerSymptom.includes('head pain')) {
      standardSymptoms.push('headache');
    } else if (lowerSymptom.includes('fatigue') || lowerSymptom.includes('tired') || lowerSymptom.includes('exhausted')) {
      standardSymptoms.push('fatigue');
    } else if (lowerSymptom.includes('mood') || lowerSymptom.includes('irritable') || lowerSymptom.includes('emotional')) {
      standardSymptoms.push('mood_changes');
    } else if (lowerSymptom.includes('bloat') || lowerSymptom.includes('swollen')) {
      standardSymptoms.push('bloating');
    } else if (lowerSymptom.includes('breast') || lowerSymptom.includes('chest tender')) {
      standardSymptoms.push('breast_tenderness');
    }
  });
  
  // Remove duplicates
  return Array.from(new Set(standardSymptoms));
}

/**
 * Convert menstrual status from PainEntry format to PainRecord format
 */
function convertMenstrualStatus(status: string): MenstrualStatus {
  switch (status) {
    case 'pre':
      return 'before_period';
    case 'period':
      return 'day_1'; // Default to day 1 for period
    case 'post':
      return 'after_period';
    case 'ovulation':
      return 'mid_cycle';
    case 'other':
    default:
      return 'irregular';
  }
}

/**
 * Convert remedy strings to medication objects
 */
function convertRemediesToMedications(remedies: string[]): Medication[] {
  return remedies.map(remedy => ({
    name: remedy,
    dosage: '', // Not available in PainEntry
    timing: '', // Not available in PainEntry
    notes: ''   // Not available in PainEntry
  }));
}

/**
 * Convert PainRecord back to PainEntry (for compatibility)
 */
export function convertPainRecordToPainEntry(record: PainRecord): PainEntry {
  return {
    id: record.id,
    date: record.date,
    painLevel: record.painLevel,
    duration: undefined, // Not available in PainRecord
    location: record.locations.map(loc => loc.replace('_', ' ')),
    menstrualStatus: convertMenstrualStatusBack(record.menstrualStatus),
    symptoms: record.symptoms.map(symptom => symptom.replace('_', ' ')),
    remedies: record.medications.map(med => med.name),
    effectiveness: record.effectiveness,
    notes: record.notes,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

/**
 * Convert menstrual status back to PainEntry format
 */
function convertMenstrualStatusBack(status: MenstrualStatus): 'period' | 'pre' | 'post' | 'ovulation' | 'other' {
  switch (status) {
    case 'before_period':
      return 'pre';
    case 'day_1':
    case 'day_2_3':
    case 'day_4_plus':
      return 'period';
    case 'after_period':
      return 'post';
    case 'mid_cycle':
      return 'ovulation';
    case 'irregular':
    default:
      return 'other';
  }
}