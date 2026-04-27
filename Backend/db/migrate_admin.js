

const db = require('./index');

async function migrate() {
  try {
    console.log('Starting admin migration...');

    await db.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(10) DEFAULT 'user' NOT NULL;
    `);
    console.log('✅ Added role column to users');

    await db.query(`
      CREATE TABLE IF NOT EXISTS legal_pages (
        id         SERIAL PRIMARY KEY,
        slug       VARCHAR(20) UNIQUE NOT NULL,
        title      VARCHAR(200) NOT NULL,
        content    TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created legal_pages table');

    const termsContent = `1. Acceptance of Terms
By accessing or using Greenify ("the App"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the App.

2. Use of the Service
Greenify is a gamified sustainability tracking platform designed for college students. You agree to:
- Provide accurate information when creating an account.
- Not misuse the platform to submit false or misleading eco-actions.
- Respect other users on the leaderboard and in the community.
- Not attempt to hack, exploit, or reverse-engineer any part of the App.

3. Account Responsibility
You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. Notify us immediately at atharv.vaish2006@gmail.com if you suspect unauthorized access.

4. Points, Badges & Leaderboard
Points and badges are earned through logged eco-actions. Greenify reserves the right to review, adjust, or revoke points if misuse or fraudulent activity is detected.

5. Intellectual Property
All content, logos, designs, and code within Greenify are the intellectual property of the Greenify team. You may not reproduce, distribute, or create derivative works without explicit written permission.

6. Termination
We reserve the right to suspend or terminate accounts that violate these terms without prior notice.

7. Disclaimer of Warranties
Greenify is provided "as-is" without any warranties of any kind.

8. Changes to Terms
We may update these Terms at any time. Continued use of the App after changes constitutes your acceptance of the revised terms.

9. Contact
For any questions about these Terms, please contact us at atharv.vaish2006@gmail.com.`;

    const privacyContent = `1. Information We Collect
When you use Greenify, we collect the following information:
- Account Data: Name, email address, college name, and password (encrypted).
- Activity Data: Eco-actions logged, points earned, and badges unlocked.
- Usage Data: Login times, pages visited, and feature interactions.

2. How We Use Your Information
We use collected information to:
- Provide and maintain the Greenify service.
- Calculate points, assign badges, and populate leaderboards.
- Send transactional emails (OTP verification, password reset).
- Improve the app based on usage patterns.

3. Data Sharing
We do not sell, trade, or rent your personal data to third parties. Your name and college may be visible to other users on the public leaderboard.

4. Data Security
All passwords are hashed using bcrypt before being stored. We use JWT tokens for secure session management.

5. Email Communication
We send emails only for account verification (OTP) and password resets. We do not send marketing emails without your explicit consent.

6. Data Retention
Your data is retained as long as your account is active. You may request deletion at any time.

7. Cookies
Greenify stores your authentication token in browser localStorage. We do not use tracking or analytics cookies.

8. Changes to This Policy
We may update this Privacy Policy periodically. Continued use after changes constitutes acceptance.

9. Contact Us
If you have questions about this Privacy Policy, contact us at atharv.vaish2006@gmail.com.`;

    await db.query(`
      INSERT INTO legal_pages (slug, title, content)
      VALUES ('terms', 'Terms of Service', $1)
      ON CONFLICT (slug) DO NOTHING;
    `, [termsContent]);

    await db.query(`
      INSERT INTO legal_pages (slug, title, content)
      VALUES ('privacy', 'Privacy Policy', $1)
      ON CONFLICT (slug) DO NOTHING;
    `, [privacyContent]);

    console.log('✅ Seeded legal_pages with default content');
    console.log('');
    console.log('Migration complete! Now run:');
    console.log("  psql $DATABASE_URL -c \"UPDATE users SET role='admin' WHERE email='atharv.vaish2006@gmail.com';\"");
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
