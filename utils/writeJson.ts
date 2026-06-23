import fs from 'fs';
import path from 'path';

// Step A: Path to your existing JSON file
const filePath = path.join(__dirname, '../writeOutput.json'); // adjust path as needed

// Step B: Read existing JSON data
const rawData = fs.readFileSync(filePath, 'utf-8');
const userData = JSON.parse(rawData);

// Step C: Add new key(s) to the object
userData.email = "admin@example.com";
userData.department = "QA";
userData.isActive = true;

// ✅ Remove the 'department' key
//delete userData.department;

// Step D: Write updated data back to the same file
fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));

console.log('✅ writeOutput.json updated successfully!');