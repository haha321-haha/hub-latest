// ValidationService - Enhanced Pain Tracker Validation System
// Provides comprehensive validation for pain tracker data with detailed error reporting

import {
  PainRecord,
  Medication,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationServiceInterface,
  ValidationErrorCode,
  PainTrackerError,
  VALIDATION_RULES,
  PainType,
  PainLocation,
  Symptom,
  MenstrualStatus,
  LifestyleFactor
} from '../../../types/pain-tracker';

export class ValidationService implements ValidationServiceInterface {
  
  /**
   * Validate a complete pain record
   */
  validateRecord(record: Partial<PainRecord>): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    try {
      // Validate required fields
      this.validateRequiredFields(record, errors);
      
      // Validate individual fields
      this.validatePainLevelField(record.painLevel, errors);
      this.validateDateField(record.date, errors);
      this.validateTimeField(record.time, errors);
      this.validatePainTypesField(record.painTypes, errors, warnings);
      this.validateLocationsField(record.locations, errors, warnings);
      this.validateSymptomsField(record.symptoms, errors, warnings);
      this.validateMenstrualStatusField(record.menstrualStatus, errors);
      this.validateMedicationsField(record.medications, errors, warnings);
      this.validateEffectivenessField(record.effectiveness, errors);
      this.validateLifestyleFactorsField(record.lifestyleFactors, errors, warnings);
      this.validateNotesField(record.notes, errors, warnings);

      // Cross-field validations
      this.validateCrossFieldLogic(record, errors, warnings);

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };
    } catch (error) {
      throw new PainTrackerError(
        'Validation process failed',
        'VALIDATION_ERROR',
        error
      );
    }
  }

  /**
   * Validate pain level (0-10 scale)
   */
  validatePainLevel(level: number): boolean {
    return (
      typeof level === 'number' &&
      !isNaN(level) &&
      level >= VALIDATION_RULES.painLevel.min &&
      level <= VALIDATION_RULES.painLevel.max
    );
  }

  /**
   * Validate date string (YYYY-MM-DD format)
   */
  validateDate(date: string): boolean {
    if (!date || typeof date !== 'string') {
      return false;
    }

    const dateObj = new Date(date);
    const now = new Date();
    const minDate = VALIDATION_RULES.date.minDate();

    return (
      !isNaN(dateObj.getTime()) &&
      dateObj <= now &&
      dateObj >= minDate
    );
  }

  /**
   * Validate time string (HH:mm format)
   */
  validateTime(time: string): boolean {
    if (!time || typeof time !== 'string') {
      return false;
    }

    return VALIDATION_RULES.time.format.test(time);
  }

  /**
   * Validate medication object
   */
  validateMedication(medication: Medication): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!medication.name || medication.name.trim().length === 0) {
      errors.push({
        field: 'medication.name',
        message: 'Medication name is required',
        code: 'REQUIRED_FIELD'
      });
    }

    if (medication.name && medication.name.length > VALIDATION_RULES.medicationName.maxLength) {
      errors.push({
        field: 'medication.name',
        message: `Medication name must be less than ${VALIDATION_RULES.medicationName.maxLength} characters`,
        code: 'OUT_OF_RANGE'
      });
    }

    if (medication.dosage && medication.dosage.length > VALIDATION_RULES.medicationDosage.maxLength) {
      errors.push({
        field: 'medication.dosage',
        message: `Medication dosage must be less than ${VALIDATION_RULES.medicationDosage.maxLength} characters`,
        code: 'OUT_OF_RANGE'
      });
    }

    if (!medication.timing || medication.timing.trim().length === 0) {
      warnings.push({
        field: 'medication.timing',
        message: 'Consider specifying when the medication was taken',
        suggestion: 'Add timing information like "before pain", "during pain", or "preventive"'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Sanitize user input to prevent XSS and other issues
   */
  sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .substring(0, 1000); // Limit length
  }

  /**
   * Check for duplicate records based on date and time
   */
  checkForDuplicates(record: PainRecord, existingRecords: PainRecord[]): boolean {
    return existingRecords.some(existing => 
      existing.id !== record.id &&
      existing.date === record.date &&
      existing.time === record.time
    );
  }

  /**
   * Validate required fields
   */
  private validateRequiredFields(record: Partial<PainRecord>, errors: ValidationError[]): void {
    const requiredFields = [
      { field: 'painLevel', value: record.painLevel },
      { field: 'date', value: record.date },
      { field: 'time', value: record.time }
    ];

    requiredFields.forEach(({ field, value }) => {
      if (value === undefined || value === null || value === '') {
        errors.push({
          field,
          message: `${field} is required`,
          code: 'REQUIRED_FIELD'
        });
      }
    });
  }

  /**
   * Validate pain level field
   */
  private validatePainLevelField(painLevel: any, errors: ValidationError[]): void {
    if (painLevel !== undefined && painLevel !== null) {
      if (!this.validatePainLevel(painLevel)) {
        errors.push({
          field: 'painLevel',
          message: `Pain level must be between ${VALIDATION_RULES.painLevel.min} and ${VALIDATION_RULES.painLevel.max}`,
          code: 'OUT_OF_RANGE'
        });
      }
    }
  }

  /**
   * Validate date field
   */
  private validateDateField(date: any, errors: ValidationError[]): void {
    if (date !== undefined && date !== null) {
      if (!this.validateDate(date)) {
        errors.push({
          field: 'date',
          message: 'Invalid date format or date is in the future',
          code: 'INVALID_DATE'
        });
      }
    }
  }

  /**
   * Validate time field
   */
  private validateTimeField(time: any, errors: ValidationError[]): void {
    if (time !== undefined && time !== null) {
      if (!this.validateTime(time)) {
        errors.push({
          field: 'time',
          message: 'Invalid time format. Use HH:mm format (e.g., 14:30)',
          code: 'INVALID_FORMAT'
        });
      }
    }
  }

  /**
   * Validate pain types field
   */
  private validatePainTypesField(
    painTypes: any, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    if (painTypes !== undefined && painTypes !== null) {
      if (!Array.isArray(painTypes)) {
        errors.push({
          field: 'painTypes',
          message: 'Pain types must be an array',
          code: 'INVALID_FORMAT'
        });
        return;
      }

      if (painTypes.length > VALIDATION_RULES.painTypes.maxSelection) {
        errors.push({
          field: 'painTypes',
          message: `Cannot select more than ${VALIDATION_RULES.painTypes.maxSelection} pain types`,
          code: 'OUT_OF_RANGE'
        });
      }

      const invalidTypes = painTypes.filter(type => 
        !VALIDATION_RULES.painTypes.validOptions.includes(type as PainType)
      );

      if (invalidTypes.length > 0) {
        errors.push({
          field: 'painTypes',
          message: `Invalid pain types: ${invalidTypes.join(', ')}`,
          code: 'INVALID_FORMAT'
        });
      }

      if (painTypes.length === 0) {
        warnings.push({
          field: 'painTypes',
          message: 'Consider selecting pain types to help identify patterns',
          suggestion: 'Select one or more pain types that best describe your experience'
        });
      }
    }
  }

  /**
   * Validate locations field
   */
  private validateLocationsField(
    locations: any, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    if (locations !== undefined && locations !== null) {
      if (!Array.isArray(locations)) {
        errors.push({
          field: 'locations',
          message: 'Locations must be an array',
          code: 'INVALID_FORMAT'
        });
        return;
      }

      if (locations.length > VALIDATION_RULES.locations.maxSelection) {
        errors.push({
          field: 'locations',
          message: `Cannot select more than ${VALIDATION_RULES.locations.maxSelection} locations`,
          code: 'OUT_OF_RANGE'
        });
      }

      const invalidLocations = locations.filter(location => 
        !VALIDATION_RULES.locations.validOptions.includes(location as PainLocation)
      );

      if (invalidLocations.length > 0) {
        errors.push({
          field: 'locations',
          message: `Invalid locations: ${invalidLocations.join(', ')}`,
          code: 'INVALID_FORMAT'
        });
      }

      if (locations.length === 0) {
        warnings.push({
          field: 'locations',
          message: 'Consider specifying pain locations for better tracking',
          suggestion: 'Select one or more locations where you experience pain'
        });
      }
    }
  }

  /**
   * Validate symptoms field
   */
  private validateSymptomsField(
    symptoms: any, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    if (symptoms !== undefined && symptoms !== null) {
      if (!Array.isArray(symptoms)) {
        errors.push({
          field: 'symptoms',
          message: 'Symptoms must be an array',
          code: 'INVALID_FORMAT'
        });
        return;
      }

      if (symptoms.length > VALIDATION_RULES.symptoms.maxSelection) {
        errors.push({
          field: 'symptoms',
          message: `Cannot select more than ${VALIDATION_RULES.symptoms.maxSelection} symptoms`,
          code: 'OUT_OF_RANGE'
        });
      }

      const invalidSymptoms = symptoms.filter(symptom => 
        !VALIDATION_RULES.symptoms.validOptions.includes(symptom as Symptom)
      );

      if (invalidSymptoms.length > 0) {
        errors.push({
          field: 'symptoms',
          message: `Invalid symptoms: ${invalidSymptoms.join(', ')}`,
          code: 'INVALID_FORMAT'
        });
      }
    }
  }

  /**
   * Validate menstrual status field
   */
  private validateMenstrualStatusField(menstrualStatus: any, errors: ValidationError[]): void {
    if (menstrualStatus !== undefined && menstrualStatus !== null && menstrualStatus !== '') {
      const validStatuses: MenstrualStatus[] = [
        'before_period', 'day_1', 'day_2_3', 'day_4_plus', 
        'after_period', 'mid_cycle', 'irregular'
      ];

      if (!validStatuses.includes(menstrualStatus as MenstrualStatus)) {
        errors.push({
          field: 'menstrualStatus',
          message: 'Invalid menstrual status',
          code: 'INVALID_FORMAT'
        });
      }
    }
  }

  /**
   * Validate medications field
   */
  private validateMedicationsField(
    medications: any, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    if (medications !== undefined && medications !== null) {
      if (!Array.isArray(medications)) {
        errors.push({
          field: 'medications',
          message: 'Medications must be an array',
          code: 'INVALID_FORMAT'
        });
        return;
      }

      medications.forEach((medication, index) => {
        const result = this.validateMedication(medication);
        result.errors.forEach(error => {
          errors.push({
            ...error,
            field: `medications[${index}].${error.field.split('.').pop()}`
          });
        });
        result.warnings.forEach(warning => {
          warnings.push({
            ...warning,
            field: `medications[${index}].${warning.field.split('.').pop()}`
          });
        });
      });
    }
  }

  /**
   * Validate effectiveness field
   */
  private validateEffectivenessField(effectiveness: any, errors: ValidationError[]): void {
    if (effectiveness !== undefined && effectiveness !== null) {
      if (typeof effectiveness !== 'number' || 
          isNaN(effectiveness) || 
          effectiveness < 0 || 
          effectiveness > 10) {
        errors.push({
          field: 'effectiveness',
          message: 'Effectiveness must be a number between 0 and 10',
          code: 'OUT_OF_RANGE'
        });
      }
    }
  }

  /**
   * Validate lifestyle factors field
   */
  private validateLifestyleFactorsField(
    lifestyleFactors: any, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    if (lifestyleFactors !== undefined && lifestyleFactors !== null) {
      if (!Array.isArray(lifestyleFactors)) {
        errors.push({
          field: 'lifestyleFactors',
          message: 'Lifestyle factors must be an array',
          code: 'INVALID_FORMAT'
        });
        return;
      }

      lifestyleFactors.forEach((factor: LifestyleFactor, index) => {
        if (!factor.factor || !factor.value) {
          errors.push({
            field: `lifestyleFactors[${index}]`,
            message: 'Lifestyle factor must have both factor and value',
            code: 'REQUIRED_FIELD'
          });
        }

        // Validate specific factor types
        if (factor.factor === 'stress_level' || 
            factor.factor === 'diet_quality' || 
            factor.factor === 'activity_level' ||
            factor.factor === 'hydration') {
          if (typeof factor.value !== 'number' || 
              factor.value < 1 || 
              factor.value > 10) {
            errors.push({
              field: `lifestyleFactors[${index}].value`,
              message: `${factor.factor} must be a number between 1 and 10`,
              code: 'OUT_OF_RANGE'
            });
          }
        }

        if (factor.factor === 'sleep_hours') {
          if (typeof factor.value !== 'number' || 
              factor.value < 0 || 
              factor.value > 24) {
            errors.push({
              field: `lifestyleFactors[${index}].value`,
              message: 'Sleep hours must be a number between 0 and 24',
              code: 'OUT_OF_RANGE'
            });
          }
        }
      });
    }
  }

  /**
   * Validate notes field
   */
  private validateNotesField(notes: any, errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (notes !== undefined && notes !== null) {
      if (typeof notes !== 'string') {
        errors.push({
          field: 'notes',
          message: 'Notes must be a string',
          code: 'INVALID_FORMAT'
        });
        return;
      }

      if (notes.length > VALIDATION_RULES.notes.maxLength) {
        errors.push({
          field: 'notes',
          message: `Notes must be less than ${VALIDATION_RULES.notes.maxLength} characters`,
          code: 'OUT_OF_RANGE'
        });
      }

      // Check for potentially sensitive information
      const sensitivePatterns = [
        /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
        /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card pattern
        /@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ // Email pattern
      ];

      if (sensitivePatterns.some(pattern => pattern.test(notes))) {
        warnings.push({
          field: 'notes',
          message: 'Notes may contain sensitive information',
          suggestion: 'Avoid including personal identifiers, contact information, or financial data'
        });
      }
    }
  }

  /**
   * Validate cross-field logic and relationships
   */
  private validateCrossFieldLogic(
    record: Partial<PainRecord>, 
    errors: ValidationError[], 
    warnings: ValidationWarning[]
  ): void {
    // Check if effectiveness is provided when medications are listed
    if (record.medications && record.medications.length > 0 && 
        (record.effectiveness === undefined || record.effectiveness === null)) {
      warnings.push({
        field: 'effectiveness',
        message: 'Consider rating treatment effectiveness when medications are recorded',
        suggestion: 'Rate how effective the treatments were on a scale of 0-10'
      });
    }

    // Check for logical inconsistencies
    if (record.painLevel === 0 && record.medications && record.medications.length > 0) {
      warnings.push({
        field: 'medications',
        message: 'Medications recorded with no pain level',
        suggestion: 'Consider if medications were taken preventively or if pain level should be higher'
      });
    }

    // Check date/time consistency
    if (record.date && record.time) {
      const recordDateTime = new Date(`${record.date}T${record.time}`);
      const now = new Date();
      
      if (recordDateTime > now) {
        errors.push({
          field: 'date',
          message: 'Record date and time cannot be in the future',
          code: 'INVALID_DATE'
        });
      }
    }
  }
}

export default ValidationService;