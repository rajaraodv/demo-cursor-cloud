import { test, before, after } from 'node:test';
import assert from 'node:assert';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  console.error('Please create a .env file with your database connection string');
  process.exit(1);
}

// Create a test client
const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

let testTodoId = null;

// Setup: Connect to database before all tests
before(async () => {
  try {
    await client.connect();
    console.log('✓ Connected to database');
    
    // Ensure todos table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Todos table ready');
  } catch (error) {
    console.error('✗ Failed to connect to database:', error.message);
    throw error;
  }
});

// Cleanup: Close connection after all tests
after(async () => {
  try {
    await client.end();
    console.log('✓ Database connection closed');
  } catch (error) {
    console.error('✗ Error closing connection:', error.message);
  }
});

// Test 1: Database connection
test('Database connection test', async () => {
  const result = await client.query('SELECT NOW() as current_time');
  assert(result.rows.length === 1, 'Should return one row');
  assert(result.rows[0].current_time, 'Should have current_time');
  console.log('✓ Database connection is working');
});

// Test 2: Create a todo
test('Create todo test', async () => {
  const testText = `Test todo - ${Date.now()}`;
  const result = await client.query(
    'INSERT INTO todos (text) VALUES ($1) RETURNING *',
    [testText]
  );
  
  assert(result.rows.length === 1, 'Should return one row');
  assert(result.rows[0].text === testText, 'Todo text should match');
  assert(result.rows[0].completed === false, 'Todo should not be completed by default');
  assert(result.rows[0].id, 'Todo should have an id');
  
  testTodoId = result.rows[0].id;
  console.log(`✓ Created todo with id: ${testTodoId}`);
});

// Test 3: Read todos
test('Read todos test', async () => {
  const result = await client.query('SELECT * FROM todos ORDER BY created_at DESC');
  
  assert(Array.isArray(result.rows), 'Should return an array');
  assert(result.rows.length > 0, 'Should have at least one todo');
  
  // Verify the structure of a todo
  const todo = result.rows[0];
  assert(todo.id, 'Todo should have an id');
  assert(todo.text, 'Todo should have text');
  assert(typeof todo.completed === 'boolean', 'Todo should have completed boolean');
  assert(todo.created_at, 'Todo should have created_at timestamp');
  assert(todo.updated_at, 'Todo should have updated_at timestamp');
  
  console.log(`✓ Read ${result.rows.length} todos successfully`);
});

// Test 4: Update a todo
test('Update todo test', async () => {
  if (!testTodoId) {
    throw new Error('No test todo ID available');
  }
  
  // Update the todo to completed
  const result = await client.query(
    'UPDATE todos SET completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [true, testTodoId]
  );
  
  assert(result.rows.length === 1, 'Should return one row');
  assert(result.rows[0].id === testTodoId, 'Todo ID should match');
  assert(result.rows[0].completed === true, 'Todo should be marked as completed');
  
  console.log(`✓ Updated todo ${testTodoId} to completed`);
  
  // Update the text
  const newText = `Updated test todo - ${Date.now()}`;
  const updateResult = await client.query(
    'UPDATE todos SET text = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [newText, testTodoId]
  );
  
  assert(updateResult.rows[0].text === newText, 'Todo text should be updated');
  console.log(`✓ Updated todo ${testTodoId} text`);
});

// Test 5: Delete a todo
test('Delete todo test', async () => {
  if (!testTodoId) {
    throw new Error('No test todo ID available');
  }
  
  const result = await client.query(
    'DELETE FROM todos WHERE id = $1 RETURNING *',
    [testTodoId]
  );
  
  assert(result.rows.length === 1, 'Should return one row');
  assert(result.rows[0].id === testTodoId, 'Deleted todo ID should match');
  
  // Verify it's actually deleted
  const verifyResult = await client.query('SELECT * FROM todos WHERE id = $1', [testTodoId]);
  assert(verifyResult.rows.length === 0, 'Todo should be deleted');
  
  console.log(`✓ Deleted todo ${testTodoId} successfully`);
});

// Test 6: Test table structure
test('Table structure test', async () => {
  const result = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'todos'
    ORDER BY ordinal_position
  `);
  
  const columns = result.rows.map(row => row.column_name);
  
  assert(columns.includes('id'), 'Table should have id column');
  assert(columns.includes('text'), 'Table should have text column');
  assert(columns.includes('completed'), 'Table should have completed column');
  assert(columns.includes('created_at'), 'Table should have created_at column');
  assert(columns.includes('updated_at'), 'Table should have updated_at column');
  
  console.log('✓ Table structure is correct');
});

console.log('\n🧪 Running database tests...\n');
