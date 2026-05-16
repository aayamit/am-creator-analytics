export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p>When you connect your social media accounts (Instagram, YouTube, LinkedIn) to AM Creator Analytics, we collect:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Account public profile information (username, profile picture, bio)</li>
          <li>Engagement metrics (followers, likes, comments, views)</li>
          <li>OAuth access tokens (encrypted, never shared)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p>We use collected data solely to:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Generate creator analytics dashboards</li>
          <li>Create media kits and performance reports</li>
          <li>Match creators with relevant brand campaigns</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
        <p>We never sell your personal data. We only share aggregated, anonymized analytics with brands you explicitly approve for campaigns.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
        <p>You can revoke access to your social accounts at any time. We delete all associated data within 30 days of account disconnection.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
        <p>For privacy-related questions, contact us at: <a href="mailto:partnerships@amcreatoranalytics.com" className="text-blue-600 hover:underline">partnerships@amcreatoranalytics.com</a></p>
      </section>
    </div>
  );
}
