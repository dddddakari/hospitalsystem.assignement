// tests/setup.js - Jest Setup File
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Setup before all tests
beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

// Clear database before each test
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Test timeout
jest.setTimeout(30000);

// Mock console.log for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// ==========================================
// package.json - Test Scripts Configuration
// ==========================================

const PACKAGE_JSON_ADDITION = `
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration", 
    "test:system": "jest --testPathPattern=system",
    "test:performance": "jest --testPathPattern=performance",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:runner": "node test-runner.js",
    "test:full": "node test-runner.js full",
    "test:setup": "node test-runner.js setup",
    "test:report": "node test-runner.js report"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "supertest": "^6.3.0",
    "mongodb-memory-server": "^8.0.0",
    "@types/jest": "^29.0.0"
  }
}
`;

// ==========================================
// jest.config.js - Jest Configuration
// ==========================================

const JEST_CONFIG_FILE = `
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'routes/**/*.js',
    'models/**/*.js', 
    'middleware/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/test-reports/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testTimeout: 30000,
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html']
};
`;

// ==========================================
// Manual Test Checklist
// ==========================================

const MANUAL_TEST_CHECKLIST = `
=== MANUAL TESTING CHECKLIST ===
Date: ${new Date().toLocaleDateString()}
Tester: ________________

FUNCTIONAL TESTING
□ TC001: Register New Patient
  - Navigate to patient registration
  - Enter valid patient data
  - Verify patient saved successfully
  - Check patient appears in patient list

□ TC002: Invalid Data Validation
  - Try to register patient with missing name
  - Try invalid date format
  - Verify appropriate error messages

□ TC003: Schedule Appointment
  - Select patient from dropdown
  - Choose available time slot
  - Enter appointment details
  - Verify appointment saved

□ TC004: Search Functionality
  - Search for existing patient
  - Verify search results accuracy
  - Test partial name search

□ TC005: Update Patient Information
  - Select patient to edit
  - Modify patient details
  - Save changes
  - Verify updates reflected

□ TC006: Delete Patient
  - Select patient for deletion
  - Confirm deletion
  - Verify patient removed from system

SECURITY TESTING
□ TC007: Authentication Required
  - Access patient page without login
  - Verify redirect to login page

□ TC008: Session Management
  - Login successfully
  - Wait for session timeout
  - Verify automatic logout

□ TC009: Role-Based Access
  - Login as different user roles
  - Verify appropriate access levels

USABILITY TESTING
□ TC010: Navigation
  - Test all navigation links
  - Verify intuitive user flow

□ TC011: Error Messages
  - Verify clear error messages
  - Check message positioning

□ TC012: Form Validation
  - Test all form fields
  - Verify validation feedback

PERFORMANCE TESTING
□ TC013: Page Load Times
  - Measure patient list load time
  - Verify < 2 second load time

□ TC014: Search Performance
  - Search with 500+ patients
  - Verify < 1 second response

BROWSER COMPATIBILITY
□ TC015: Chrome Testing
  - Test all features in Chrome
  - Verify consistent behavior

□ TC016: Firefox Testing
  - Test all features in Firefox
  - Verify consistent behavior

□ TC017: Safari Testing (if applicable)
  - Test all features in Safari
  - Verify consistent behavior

MOBILE RESPONSIVENESS
□ TC018: Mobile Layout
  - Test on mobile screen size
  - Verify responsive design

□ TC019: Touch Interactions
  - Test touch-based navigation
  - Verify usability on mobile

NOTES:
_________________________________
_________________________________
_________________________________

OVERALL ASSESSMENT:
□ Ready for production
□ Minor issues to fix
□ Major issues to address
□ Not ready for production

Tester Signature: _________________ Date: _______
`;

// ==========================================
// Test Data Generator with Realistic Data
// ==========================================

class RealisticTestDataGenerator {
  constructor() {
    this.firstNames = [
      'John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily',
      'James', 'Ashley', 'William', 'Jessica', 'Richard', 'Amanda', 'Joseph'
    ];
    
    this.lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
      'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez'
    ];
    
    this.conditions = [
      'Hypertension', 'Diabetes Type 2', 'Asthma', 'Allergies', 'Arthritis',
      'High Cholesterol', 'Anxiety', 'Depression', 'Migraine', 'Back Pain'
    ];
    
    this.insuranceProviders = [
      'Blue Cross Blue Shield', 'Aetna', 'Cigna', 'United Healthcare',
      'Humana', 'Kaiser Permanente', 'Anthem', 'Molina Healthcare'
    ];
  }

  generateRandomPatient() {
    const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    const birthYear = 1940 + Math.floor(Math.random() * 80);
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = Math.floor(Math.random() * 28) + 1;
    
    return {
      name: firstName + ' ' + lastName,
      dob: new Date(birthYear, birthMonth, birthDay),
      medicalHistory: this.generateMedicalHistory(),
      insurance: this.insuranceProviders[Math.floor(Math.random() * this.insuranceProviders.length)],
      phone: this.generatePhoneNumber(),
      email: firstName.toLowerCase() + '.' + lastName.toLowerCase() + '@email.com',
      address: this.generateAddress(),
      emergencyContact: this.generateEmergencyContact()
    };
  }

  generateMedicalHistory() {
    const numConditions = Math.floor(Math.random() * 3) + 1;
    const selectedConditions = [];
    
    for (let i = 0; i < numConditions; i++) {
      const condition = this.conditions[Math.floor(Math.random() * this.conditions.length)];
      if (!selectedConditions.includes(condition)) {
        selectedConditions.push(condition);
      }
    }
    
    return selectedConditions.join(', ');
  }

  generatePhoneNumber() {
    const area = Math.floor(Math.random() * 900) + 100;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const number = Math.floor(Math.random() * 9000) + 1000;
    return '(' + area + ') ' + prefix + '-' + number;
  }

  generateAddress() {
    const streetNumbers = Math.floor(Math.random() * 9999) + 1;
    const streetNames = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Ave'];
    const cities = ['Springfield', 'Franklin', 'Georgetown', 'Salem', 'Madison'];
    const states = ['CA', 'NY', 'TX', 'FL', 'PA'];
    
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const zip = Math.floor(Math.random() * 90000) + 10000;
    
    return streetNumbers + ' ' + streetName + ', ' + city + ', ' + state + ' ' + zip;
  }

  generateEmergencyContact() {
    const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
    const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
    const relationships = ['Spouse', 'Child', 'Parent', 'Sibling', 'Friend'];
    
    return {
      name: firstName + ' ' + lastName,
      relationship: relationships[Math.floor(Math.random() * relationships.length)],
      phone: this.generatePhoneNumber()
    };
  }

  generateLoadTestData(patientCount = 500) {
    const patients = [];
    for (let i = 0; i < patientCount; i++) {
      patients.push(this.generateRandomPatient());
    }
    return patients;
  }
}

// ==========================================
// Test Results Analyzer
// ==========================================

class TestResultsAnalyzer {
  constructor() {
    this.results = [];
    this.metrics = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      avgResponseTime: 0,
      coveragePercentage: 0
    };
  }

  analyzeTestResults(jestResults) {
    this.metrics.totalTests = jestResults.numTotalTests;
    this.metrics.passedTests = jestResults.numPassedTests;
    this.metrics.failedTests = jestResults.numFailedTests;
    this.metrics.skippedTests = jestResults.numPendingTests;
    
    const passRate = (this.metrics.passedTests / this.metrics.totalTests) * 100;
    
    return {
      passRate,
      meetsExitCriteria: this.evaluateExitCriteria(passRate),
      recommendations: this.generateRecommendations(passRate),
      metrics: this.metrics
    };
  }

  evaluateExitCriteria(passRate) {
    return {
      unitTests: passRate === 100,
      integrationTests: passRate === 100,
      systemTests: passRate >= 95,
      overallReadiness: passRate >= 95
    };
  }

  generateRecommendations(passRate) {
    const recommendations = [];
    
    if (passRate < 100) {
      recommendations.push('Fix failing tests before proceeding to next phase');
    }
    
    if (passRate < 95) {
      recommendations.push('Consider postponing production release');
      recommendations.push('Conduct additional testing cycles');
    }
    
    if (passRate >= 95) {
      recommendations.push('Ready for User Acceptance Testing');
      recommendations.push('Prepare production deployment checklist');
    }
    
    return recommendations;
  }

  generateDetailedReport() {
    const report = `
=== DETAILED TEST ANALYSIS REPORT ===
Generated: ${new Date().toISOString()}

TEST EXECUTION SUMMARY:
- Total Tests: ${this.metrics.totalTests}
- Passed: ${this.metrics.passedTests}
- Failed: ${this.metrics.failedTests}
- Skipped: ${this.metrics.skippedTests}
- Pass Rate: ${((this.metrics.passedTests / this.metrics.totalTests) * 100).toFixed(2)}%

EXIT CRITERIA EVALUATION:
- Unit Tests: ${this.evaluateExitCriteria((this.metrics.passedTests / this.metrics.totalTests) * 100).unitTests ? 'PASS' : 'FAIL'}
- Integration Tests: ${this.evaluateExitCriteria((this.metrics.passedTests / this.metrics.totalTests) * 100).integrationTests ? 'PASS' : 'FAIL'}
- System Tests: ${this.evaluateExitCriteria((this.metrics.passedTests / this.metrics.totalTests) * 100).systemTests ? 'PASS' : 'FAIL'}

RECOMMENDATIONS:
${this.generateRecommendations((this.metrics.passedTests / this.metrics.totalTests) * 100).map(rec => '- ' + rec).join('\n')}

NEXT STEPS:
1. Review failed test cases
2. Fix identified issues
3. Re-run test suite
4. Proceed to next testing phase if criteria met
    `;
    
    return report;
  }
}

// ==========================================
// Export all utilities
// ==========================================

module.exports = {
  RealisticTestDataGenerator,
  TestResultsAnalyzer,
  PACKAGE_JSON_ADDITION,
  JEST_CONFIG_FILE,
  MANUAL_TEST_CHECKLIST
};