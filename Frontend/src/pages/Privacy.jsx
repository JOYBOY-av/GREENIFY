const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔒</span>
          <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
        </div>
        <p className="text-sm text-gray-400 mb-8 border-b border-gray-100 pb-6">Last Updated: April 20, 2025</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>When you use Greenify, we collect the following information:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Account Data:</strong> Name, email address, college name, and password (encrypted).</li>
              <li><strong>Activity Data:</strong> Eco-actions logged, points earned, and badges unlocked.</li>
              <li><strong>Usage Data:</strong> Login times, pages visited, and feature interactions (for improving the app).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide and maintain the Greenify service.</li>
              <li>Calculate points, assign badges, and populate leaderboards.</li>
              <li>Send transactional emails (OTP verification, password reset).</li>
              <li>Improve the app based on usage patterns.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Sharing</h2>
            <p>
              We do <strong>not</strong> sell, trade, or rent your personal data to third parties. Your name and college may be visible to other users on the public leaderboard. All other data is kept private.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Security</h2>
            <p>
              All passwords are hashed using bcrypt before being stored. We use JWT tokens for secure session management. While we implement industry-standard security measures, no system is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Email Communication</h2>
            <p>
              We send emails only for account verification (OTP) and password resets. We do not send marketing emails without your explicit consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Data Retention</h2>
            <p>
              Your data is retained as long as your account is active. You may request deletion of your account and associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Cookies</h2>
            <p>
              Greenify stores your authentication token in browser localStorage to keep you logged in. We do not use tracking cookies or analytics cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify users of significant changes via email. Continued use of the App after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or your data, please contact us at{' '}
              <a href="mailto:atharv.vaish2006@gmail.com" className="text-green-600 hover:underline">atharv.vaish2006@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
