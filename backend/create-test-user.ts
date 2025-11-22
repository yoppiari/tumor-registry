import * as bcrypt from 'bcrypt';

async function main() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 12);

  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nSQL to create user:');
  console.log(`
UPDATE system.users
SET "passwordHash" = '${hash}'
WHERE email = 'admin@test.com';
  `);
}

main();
