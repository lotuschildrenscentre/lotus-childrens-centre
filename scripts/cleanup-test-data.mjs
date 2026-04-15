import { createConnection } from "mysql2/promise";
import { config } from "dotenv";

config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const conn = await createConnection(DATABASE_URL);

// Show what we're about to delete
const [testFields] = await conn.execute(
  "SELECT id, label, fieldKey FROM volunteer_form_fields WHERE fieldKey LIKE 'test_field_%'"
);
console.log("Test fields to delete:", testFields);

// Show all applications (data is JSON, check for test emails)
const [allApps] = await conn.execute("SELECT id, data FROM volunteer_applications");
const testApps = allApps.filter(app => {
  try {
    const data = typeof app.data === 'string' ? JSON.parse(app.data) : app.data;
    const email = data?.email || data?.Email || '';
    return email.includes('example.com');
  } catch { return false; }
});
console.log("Test applications to delete:", testApps.map(a => a.id));

// Delete test form fields
const [fieldResult] = await conn.execute(
  "DELETE FROM volunteer_form_fields WHERE fieldKey LIKE 'test_field_%'"
);
console.log(`Deleted ${fieldResult.affectedRows} test form fields`);

// Delete test applications by id
if (testApps.length > 0) {
  const ids = testApps.map(a => a.id);
  const placeholders = ids.map(() => '?').join(',');
  const [appResult] = await conn.execute(
    `DELETE FROM volunteer_applications WHERE id IN (${placeholders})`,
    ids
  );
  console.log(`Deleted ${appResult.affectedRows} test applications`);
} else {
  console.log('No test applications found to delete');
}

// Show remaining data
const [remainingFields] = await conn.execute(
  "SELECT id, label, fieldKey FROM volunteer_form_fields ORDER BY sortOrder"
);
console.log("\nRemaining form fields:", remainingFields.length);

const [remainingApps] = await conn.execute(
  "SELECT id FROM volunteer_applications"
);
console.log("Remaining applications:", remainingApps.length);

await conn.end();
console.log("\nCleanup complete.");
