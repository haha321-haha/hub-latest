// Pain Tracker End-to-End Tests
// Critical user journey testing with browser automation

const puppeteer = require('puppeteer');

describe('Pain Tracker E2E Tests', () => {
  let browser;
  let page;
  const baseUrl = process.env.TEST_URL || 'http://localhost:3000';

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: process.env.CI === 'true',
      slowMo: process.env.CI ? 0 : 50,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  });

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    
    // Set up console logging for debugging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });

    // Handle page errors
    page.on('pageerror', error => {
      console.error('Page error:', error.message);
    });
  });

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  describe('Pain Tracker Navigation and Loading', () => {
    it('should load pain tracker page successfully', async () => {
      await page.goto(`${baseUrl}/en/interactive-tools`, { waitUntil: 'networkidle0' });
      
      // Wait for pain tracker tool to be visible
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      // Check that the pain tracker is present
      const painTrackerExists = await page.$('[data-testid="pain-tracker-tool"]');
      expect(painTrackerExists).toBeTruthy();
    });

    it('should display all required tabs', async () => {
      await page.goto(`${baseUrl}/en/interactive-tools`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      // Check for tab navigation
      const tabs = await page.$$('[data-testid^="tab-"]');
      expect(tabs.length).toBeGreaterThanOrEqual(4); // Record, History, Analysis, Export
      
      // Check specific tabs
      const recordTab = await page.$('[data-testid="tab-record"]');
      const historyTab = await page.$('[data-testid="tab-history"]');
      const analysisTab = await page.$('[data-testid="tab-analysis"]');
      const exportTab = await page.$('[data-testid="tab-export"]');
      
      expect(recordTab).toBeTruthy();
      expect(historyTab).toBeTruthy();
      expect(analysisTab).toBeTruthy();
      expect(exportTab).toBeTruthy();
    });

    it('should handle language switching', async () => {
      // Test English version
      await page.goto(`${baseUrl}/en/interactive-tools`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      let recordTabText = await page.$eval('[data-testid="tab-record"]', el => el.textContent);
      expect(recordTabText).toContain('Record');
      
      // Test Chinese version
      await page.goto(`${baseUrl}/zh/interactive-tools`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      recordTabText = await page.$eval('[data-testid="tab-record"]', el => el.textContent);
      expect(recordTabText).toMatch(/记录|录入/);
    });
  });

  describe('Pain Recording Workflow', () => {
    beforeEach(async () => {
      await page.goto(`${baseUrl}/en/interactive-tools`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      // Ensure we're on the Record tab
      await page.click('[data-testid="tab-record"]');
      await page.waitForSelector('[data-testid="pain-record-form"]', { timeout: 5000 });
    });

    it('should complete full pain recording workflow', async () => {
      // Fill out the pain recording form
      await page.type('[data-testid="date-input"]', '2024-01-15');
      await page.type('[data-testid="time-input"]', '09:30');
      
      // Set pain level
      await page.click('[data-testid="pain-level-7"]');
      
      // Select pain types
      await page.click('[data-testid="pain-type-cramping"]');
      await page.click('[data-testid="pain-type-aching"]');
      
      // Select locations
      await page.click('[data-testid="location-lower-abdomen"]');
      await page.click('[data-testid="location-lower-back"]');
      
      // Select symptoms
      await page.click('[data-testid="symptom-nausea"]');
      await page.click('[data-testid="symptom-fatigue"]');
      
      // Select menstrual status
      await page.select('[data-testid="menstrual-status-select"]', 'day_1');
      
      // Add medication
      await page.click('[data-testid="add-medication-button"]');
      await page.type('[data-testid="medication-name-0"]', 'Ibuprofen');
      await page.type('[data-testid="medication-dosage-0"]', '400mg');
      await page.select('[data-testid="medication-timing-0"]', 'during pain');
      
      // Set effectiveness
      await page.click('[data-testid="effectiveness-7"]');
      
      // Add notes
      await page.type('[data-testid="notes-textarea"]', 'Severe cramping started early morning');
      
      // Submit the form
      await page.click('[data-testid="submit-record-button"]');
      
      // Wait for success message
      await page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
      
      const successMessage = await page.$eval('[data-testid="success-message"]', el => el.textContent);
      expect(successMessage).toContain('saved');
    });

    it('should validate required fields', async () => {
      // Try to submit without filling required fields
      await page.click('[data-testid="submit-record-button"]');
      
      // Check for validation errors
      await page.waitForSelector('[data-testid="validation-error"]', { timeout: 3000 });
      
      const errorMessages = await page.$$eval('[data-testid="validation-error"]', 
        elements => elements.map(el => el.textContent)
      );
      
      expect(errorMessages.some(msg => msg.includes('required'))).toBe(true);
    });

    it('should handle form reset', async () => {
      // Fill some fields
      await page.type('[data-testid="date-input"]', '2024-01-15');
      await page.click('[data-testid="pain-level-5"]');
      await page.type('[data-testid="notes-textarea"]', 'Test notes');
      
      // Reset form
      await page.click('[data-testid="reset-form-button"]');
      
      // Check that fields are cleared
      const dateValue = await page.$eval('[data-testid="date-input"]', el => el.value);
      const notesValue = await page.$eval('[data-testid="notes-textarea"]', el => el.value);
      
      expect(dateValue).toBe('');
      expect(notesValue).toBe('');
    });
  });

  describe('History Management Workflow', () => {
    beforeEach(async () => {
      await page.goto(`${baseUrl}/en/interactive-tools`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      // First, add a test record
      await page.click('[data-testid="tab-record"]');
      await page.waitForSelector('[data-testid="pain-record-form"]', { timeout: 5000 });
      
      // Quick record creation
      await page.type('[data-testid="date-input"]', '2024-01-15');
      await page.type('[data-testid="time-input"]', '09:30');
      await page.click('[data-testid="pain-level-7"]');
      await page.click('[data-testid="pain-type-cramping"]');
      await page.click('[data-testid="location-lower-abdomen"]');
      await page.select('[data-testid="menstrual-status-select"]', 'day_1');
      await page.type('[data-testid="notes-textarea"]', 'Test record for history');
      await page.click('[data-testid="submit-record-button"]');
      
      // Wait for success and switch to history tab
      await page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
      await page.click('[data-testid="tab-history"]');
      await page.waitForSelector('[data-testid="history-view"]', { timeout: 5000 });
    });

    it('should display saved records in history', async () => {
      // Check that the record appears in history
      await page.waitForSelector('[data-testid="record-card"]', { timeout: 5000 });
      
      const recordCards = await page.$$('[data-testid="record-card"]');
      expect(recordCards.length).toBeGreaterThan(0);
      
      // Check record content
      const recordText = await page.$eval('[data-testid="record-card"]', el => el.textContent);
      expect(recordText).toContain('Test record for history');
      expect(recordText).toContain('2024-01-15');
    });

    it('should filter records by date range', async () => {
      // Use date range filter
      await page.type('[data-testid="filter-start-date"]', '2024-01-01');
      await page.type('[data-testid="filter-end-date"]', '2024-01-31');
      await page.click('[data-testid="apply-filters-button"]');
      
      // Wait for filtered results
      await page.waitForTimeout(1000);
      
      const recordCards = await page.$$('[data-testid="record-card"]');
      expect(recordCards.length).toBeGreaterThan(0);
    });

    it('should edit existing record', async () => {
      // Click edit button on first record
      await page.waitForSelector('[data-testid="edit-record-button"]', { timeout: 5000 });
      await page.click('[data-testid="edit-record-button"]');
      
      // Wait for edit modal
      await page.waitForSelector('[data-testid="edit-record-modal"]', { timeout: 5000 });
      
      // Modify the notes
      await page.evaluate(() => {
        document.querySelector('[data-testid="edit-notes-textarea"]').value = '';
      });
      await page.type('[data-testid="edit-notes-textarea"]', 'Updated test record');
      
      // Save changes
      await page.click('[data-testid="save-edit-button"]');
      
      // Wait for modal to close and check updated content
      await page.waitForSelector('[data-testid="edit-record-modal"]', { hidden: true, timeout: 5000 });
      
      const updatedText = await page.$eval('[data-testid="record-card"]', el => el.textContent);
      expect(updatedText).toContain('Updated test record');
    });

    it('should delete record with confirmation', async () => {
      // Click delete button
      await page.waitForSelector('[data-testid="delete-record-button"]', { timeout: 5000 });
      await page.click('[data-testid="delete-record-button"]');
      
      // Wait for confirmation dialog
      await page.waitForSelector('[data-testid="delete-confirmation-dialog"]', { timeout: 5000 });
      
      // Confirm deletion
      await page.click('[data-testid="confirm-delete-button"]');
      
      // Wait for record to be removed
      await page.waitForTimeout(1000);
      
      // Check that record is no longer present or empty state is shown
      const recordCards = await page.$$('[data-testid="record-card"]');
      const emptyState = await page.$('[data-testid="empty-history-state"]');
      
      expect(recordCards.length === 0 || emptyState !== null).toBe(true);
    });
  });

  describe('Analytics and Visualization', () => {
    beforeEach(async () => {
      await page.goto(`${baseUrl}/en/interactive-tools`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      // Add multiple test records for analytics
      const testRecords = [
        { date: '2024-01-15', painLevel: '8', notes: 'High pain day 1' },
        { date: '2024-01-16', painLevel: '6', notes: 'Moderate pain day 2' },
        { date: '2024-01-17', painLevel: '4', notes: 'Low pain day 3' }
      ];
      
      for (const record of testRecords) {
        await page.click('[data-testid="tab-record"]');
        await page.waitForSelector('[data-testid="pain-record-form"]', { timeout: 5000 });
        
        await page.evaluate(() => {
          document.querySelector('[data-testid="date-input"]').value = '';
          document.querySelector('[data-testid="time-input"]').value = '';
          document.querySelector('[data-testid="notes-textarea"]').value = '';
        });
        
        await page.type('[data-testid="date-input"]', record.date);
        await page.type('[data-testid="time-input"]', '10:00');
        await page.click(`[data-testid="pain-level-${record.painLevel}"]`);
        await page.click('[data-testid="pain-type-cramping"]');
        await page.click('[data-testid="location-lower-abdomen"]');
        await page.select('[data-testid="menstrual-status-select"]', 'day_1');
        await page.type('[data-testid="notes-textarea"]', record.notes);
        await page.click('[data-testid="submit-record-button"]');
        
        await page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
      }
      
      // Switch to analytics tab
      await page.click('[data-testid="tab-analysis"]');
      await page.waitForSelector('[data-testid="analytics-view"]', { timeout: 5000 });
    });

    it('should display analytics summary', async () => {
      // Check for statistics summary
      await page.waitForSelector('[data-testid="stats-summary"]', { timeout: 5000 });
      
      const totalRecords = await page.$eval('[data-testid="total-records"]', el => el.textContent);
      const averagePain = await page.$eval('[data-testid="average-pain"]', el => el.textContent);
      
      expect(totalRecords).toContain('3');
      expect(averagePain).toMatch(/\d+\.?\d*/);
    });

    it('should render pain trend chart', async () => {
      // Wait for chart to load
      await page.waitForSelector('[data-testid="pain-trend-chart"]', { timeout: 10000 });
      
      // Check that chart canvas exists
      const chartCanvas = await page.$('[data-testid="pain-trend-chart"] canvas');
      expect(chartCanvas).toBeTruthy();
      
      // Verify chart has data points
      const chartExists = await page.evaluate(() => {
        const canvas = document.querySelector('[data-testid="pain-trend-chart"] canvas');
        return canvas && canvas.width > 0 && canvas.height > 0;
      });
      
      expect(chartExists).toBe(true);
    });

    it('should display pattern insights', async () => {
      // Check for insights section
      await page.waitForSelector('[data-testid="pattern-insights"]', { timeout: 5000 });
      
      const insights = await page.$$eval('[data-testid="insight-item"]', 
        elements => elements.map(el => el.textContent)
      );
      
      expect(insights.length).toBeGreaterThan(0);
      expect(insights.some(insight => insight.length > 0)).toBe(true);
    });

    it('should handle empty analytics state', async () => {
      // Clear all data first
      await page.evaluate(() => {
        localStorage.clear();
      });
      
      // Reload page and go to analytics
      await page.reload({ waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      await page.click('[data-testid="tab-analysis"]');
      
      // Check for empty state message
      await page.waitForSelector('[data-testid="empty-analytics-state"]', { timeout: 5000 });
      
      const emptyMessage = await page.$eval('[data-testid="empty-analytics-state"]', el => el.textContent);
      expect(emptyMessage).toContain('No data');
    });
  });

  describe('Export Functionality', () => {
    beforeEach(async () => {
      await page.goto(`${baseUrl}/en/interactive-tools`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      // Add a test record for export
      await page.click('[data-testid="tab-record"]');
      await page.waitForSelector('[data-testid="pain-record-form"]', { timeout: 5000 });
      
      await page.type('[data-testid="date-input"]', '2024-01-15');
      await page.type('[data-testid="time-input"]', '09:30');
      await page.click('[data-testid="pain-level-7"]');
      await page.click('[data-testid="pain-type-cramping"]');
      await page.click('[data-testid="location-lower-abdomen"]');
      await page.select('[data-testid="menstrual-status-select"]', 'day_1');
      await page.type('[data-testid="notes-textarea"]', 'Export test record');
      await page.click('[data-testid="submit-record-button"]');
      
      await page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
      
      // Switch to export tab
      await page.click('[data-testid="tab-export"]');
      await page.waitForSelector('[data-testid="export-view"]', { timeout: 5000 });
    });

    it('should display export options', async () => {
      // Check for export controls
      const dateRangeStart = await page.$('[data-testid="export-start-date"]');
      const dateRangeEnd = await page.$('[data-testid="export-end-date"]');
      const formatSelect = await page.$('[data-testid="export-format-select"]');
      const exportButton = await page.$('[data-testid="export-button"]');
      
      expect(dateRangeStart).toBeTruthy();
      expect(dateRangeEnd).toBeTruthy();
      expect(formatSelect).toBeTruthy();
      expect(exportButton).toBeTruthy();
    });

    it('should generate HTML export', async () => {
      // Set date range
      await page.type('[data-testid="export-start-date"]', '2024-01-01');
      await page.type('[data-testid="export-end-date"]', '2024-01-31');
      
      // Select HTML format
      await page.select('[data-testid="export-format-select"]', 'html');
      
      // Click export button
      await page.click('[data-testid="export-button"]');
      
      // Wait for export to complete
      await page.waitForSelector('[data-testid="export-success"]', { timeout: 10000 });
      
      const successMessage = await page.$eval('[data-testid="export-success"]', el => el.textContent);
      expect(successMessage).toContain('export');
    });

    it('should show export preview', async () => {
      // Set up export options
      await page.type('[data-testid="export-start-date"]', '2024-01-01');
      await page.type('[data-testid="export-end-date"]', '2024-01-31');
      
      // Click preview button
      await page.click('[data-testid="preview-export-button"]');
      
      // Wait for preview modal
      await page.waitForSelector('[data-testid="export-preview-modal"]', { timeout: 5000 });
      
      // Check preview content
      const previewContent = await page.$eval('[data-testid="export-preview-content"]', el => el.textContent);
      expect(previewContent).toContain('Export test record');
      expect(previewContent).toContain('Pain Tracking Report');
    });

    it('should handle export errors gracefully', async () => {
      // Try to export with invalid date range
      await page.type('[data-testid="export-start-date"]', '2024-12-31');
      await page.type('[data-testid="export-end-date"]', '2024-01-01');
      
      await page.click('[data-testid="export-button"]');
      
      // Wait for error message
      await page.waitForSelector('[data-testid="export-error"]', { timeout: 5000 });
      
      const errorMessage = await page.$eval('[data-testid="export-error"]', el => el.textContent);
      expect(errorMessage).toContain('error');
    });
  });

  describe('Responsive Design and Accessibility', () => {
    it('should work on mobile viewport', async () => {
      // Set mobile viewport
      await page.setViewport({ width: 375, height: 667 });
      
      await page.goto(`${baseUrl}/en/interactive-tools`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      // Check that tabs are still accessible
      const tabs = await page.$$('[data-testid^="tab-"]');
      expect(tabs.length).toBeGreaterThanOrEqual(4);
      
      // Test tab switching on mobile
      await page.click('[data-testid="tab-record"]');
      await page.waitForSelector('[data-testid="pain-record-form"]', { timeout: 5000 });
      
      // Check that form is usable on mobile
      const formVisible = await page.isVisible('[data-testid="pain-record-form"]');
      expect(formVisible).toBe(true);
    });

    it('should support keyboard navigation', async () => {
      await page.goto(`${baseUrl}/en/interactive-tools`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      // Focus on first tab and navigate with keyboard
      await page.focus('[data-testid="tab-record"]');
      
      // Tab through navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Check that focus is moving correctly
      const focusedElement = await page.evaluate(() => document.activeElement.getAttribute('data-testid'));
      expect(focusedElement).toBeTruthy();
    });

    it('should have proper ARIA labels', async () => {
      await page.goto(`${baseUrl}/en/interactive-tools`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      // Check for ARIA labels on important elements
      const ariaLabels = await page.$$eval('[aria-label]', elements => 
        elements.map(el => el.getAttribute('aria-label'))
      );
      
      expect(ariaLabels.length).toBeGreaterThan(0);
      expect(ariaLabels.some(label => label && label.length > 0)).toBe(true);
    });
  });

  describe('Data Persistence and Recovery', () => {
    it('should persist data across page reloads', async () => {
      await page.goto(`${baseUrl}/en/interactive-tools`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      // Add a record
      await page.click('[data-testid="tab-record"]');
      await page.waitForSelector('[data-testid="pain-record-form"]', { timeout: 5000 });
      
      await page.type('[data-testid="date-input"]', '2024-01-15');
      await page.type('[data-testid="time-input"]', '09:30');
      await page.click('[data-testid="pain-level-7"]');
      await page.click('[data-testid="pain-type-cramping"]');
      await page.click('[data-testid="location-lower-abdomen"]');
      await page.select('[data-testid="menstrual-status-select"]', 'day_1');
      await page.type('[data-testid="notes-textarea"]', 'Persistence test record');
      await page.click('[data-testid="submit-record-button"]');
      
      await page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
      
      // Reload page
      await page.reload({ waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      // Check that data persists
      await page.click('[data-testid="tab-history"]');
      await page.waitForSelector('[data-testid="history-view"]', { timeout: 5000 });
      
      const recordExists = await page.$('[data-testid="record-card"]');
      expect(recordExists).toBeTruthy();
      
      const recordText = await page.$eval('[data-testid="record-card"]', el => el.textContent);
      expect(recordText).toContain('Persistence test record');
    });

    it('should handle localStorage quota exceeded', async () => {
      await page.goto(`${baseUrl}/en/interactive-tools`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('[data-testid="pain-tracker-tool"]', { timeout: 10000 });
      
      // Mock localStorage quota exceeded
      await page.evaluate(() => {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function() {
          throw new Error('QuotaExceededError');
        };
      });
      
      // Try to add a record
      await page.click('[data-testid="tab-record"]');
      await page.waitForSelector('[data-testid="pain-record-form"]', { timeout: 5000 });
      
      await page.type('[data-testid="date-input"]', '2024-01-15');
      await page.type('[data-testid="time-input"]', '09:30');
      await page.click('[data-testid="pain-level-7"]');
      await page.click('[data-testid="pain-type-cramping"]');
      await page.click('[data-testid="location-lower-abdomen"]');
      await page.select('[data-testid="menstrual-status-select"]', 'day_1');
      await page.type('[data-testid="notes-textarea"]', 'Quota test record');
      await page.click('[data-testid="submit-record-button"]');
      
      // Should show storage error message
      await page.waitForSelector('[data-testid="storage-error"]', { timeout: 5000 });
      
      const errorMessage = await page.$eval('[data-testid="storage-error"]', el => el.textContent);
      expect(errorMessage).toContain('storage');
    });
  });
});