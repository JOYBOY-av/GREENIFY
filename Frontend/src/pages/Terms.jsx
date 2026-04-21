const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📄</span>
          <h1 className="text-3xl font-extrabold text-gray-900">Terms of Service</h1>
        </div>
        <p className="text-sm text-gray-400 mb-8 border-b border-gray-100 pb-6">Last Updated: April 20, 2025</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Greenify ("the App"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the App.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Use of the Service</h2>
            <p>Greenify is a gamified sustainability tracking platform designed for college students. You agree to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide accurate information when creating an account.</li>
              <li>Not misuse the platform to submit false or misleading eco-actions.</li>
              <li>Respect other users on the leaderboard and in the community.</li>
              <li>Not attempt to hack, exploit, or reverse-engineer any part of the App.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Account Responsibility</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility. Notify us immediately at <a href="mailto:atharv.vaish2006@gmail.com" className="text-green-600 hover:underline">atharv.vaish2006@gmail.com</a> if you suspect unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Points, Badges & Leaderboard</h2>
            <p>
              Points and badges are earned through logged eco-actions. Greenify reserves the right to review, adjust, or revoke points if misuse or fraudulent activity is detected. Leaderboard rankings are computed in real-time and may fluctuate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Intellectual Property</h2>
            <p>
              All content, logos, designs, and code within Greenify are the intellectual property of the Greenify team. You may not reproduce, distribute, or create derivative works without explicit written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms without prior notice. You may also delete your account at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
            <p>
              Greenify is provided "as-is" without any warranties of any kind. We do not guarantee uninterrupted service, accuracy of data, or specific outcomes from using the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the App after changes constitutes your acceptance of the revised terms. We will notify users of significant changes via email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact</h2>
            <p>
              For any questions about these Terms, please contact us at <a href="mailto:atharv.vaish2006@gmail.com" className="text-green-600 hover:underline">atharv.vaish2006@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
