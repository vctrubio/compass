#!/usr/bin/env node

/**
 * This script checks the codebase for inconsistencies between camelCase and snake_case
 * field names to help maintain a consistent naming convention.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SNAKE_CASE_PATTERN = /_[a-z]/;
const CAMEL_CASE_PATTERN = /[a-z][A-Z]/;

// Common field names to check
const FIELD_PAIRS = [
  ['start_date', 'startDate'],
  ['end_date', 'endDate'],
  ['created_at', 'createdAt'],
  ['student_id', 'studentId'],
  ['package_id', 'packageId'],
  ['teacher_id', 'teacherId'],
  ['booking_id', 'bookingId'],
  ['payment_id', 'paymentId'],
  ['post_lesson_id', 'postLessonId'],
  ['availability_window_id', 'availabilityWindowId'],
  ['equipment_ids', 'equipmentIds'],
  ['start_time', 'startTime'],
  ['student_confirmation', 'studentConfirmation'],
  ['auth_id', 'authId'],
  ['user_id', 'userId'],
  ['lesson_id', 'lessonId'],
  ['session_id', 'sessionId'],
];

// Directories to check
const DIRS_TO_CHECK = [
  './rails',
  './drizzle',
  './app',
  './utils',
  './supabase',
];

// Files to skip
const SKIP_FILES = [
  'FIELD_NAMING.md',
  'update-field-names.sql',
];

// File extensions to check
const FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.sql'];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

console.log(`${colors.cyan}=== Field Naming Convention Checker ===${colors.reset}`);
console.log(`${colors.cyan}Checking for inconsistencies between snake_case and camelCase field names...${colors.reset}\n`);

// Track problems found
let problemCount = 0;

// Function to check a file for inconsistencies
function checkFile(filePath) {
  if (SKIP_FILES.some(skipFile => filePath.includes(skipFile))) {
    return;
  }
  
  const ext = path.extname(filePath);
  if (!FILE_EXTENSIONS.includes(ext)) {
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let fileHasProblems = false;
    
    // Check for each field pair
    FIELD_PAIRS.forEach(([snakeCase, camelCase]) => {
      if (content.includes(camelCase)) {
        if (!fileHasProblems) {
          console.log(`${colors.yellow}File: ${filePath}${colors.reset}`);
          fileHasProblems = true;
        }
        
        console.log(`  ${colors.red}Found camelCase '${camelCase}', should use snake_case '${snakeCase}'${colors.reset}`);
        problemCount++;
      }
    });
  } catch (error) {
    console.error(`${colors.red}Error reading file: ${filePath}${colors.reset}`, error);
  }
}

// Function to recursively process directories
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else {
      checkFile(fullPath);
    }
  });
}

// Process each directory
DIRS_TO_CHECK.forEach(dir => {
  if (fs.existsSync(dir)) {
    processDirectory(dir);
  } else {
    console.log(`${colors.yellow}Directory not found: ${dir}${colors.reset}`);
  }
});

// Report summary
console.log(`\n${colors.cyan}=== Summary ===${colors.reset}`);
if (problemCount === 0) {
  console.log(`${colors.green}✓ No field naming inconsistencies found!${colors.reset}`);
} else {
  console.log(`${colors.red}✗ Found ${problemCount} potential field naming inconsistencies.${colors.reset}`);
  console.log(`${colors.yellow}Please review and update field names to use consistent snake_case format.${colors.reset}`);
}
