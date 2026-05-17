import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion Instructions | AM Creator Analytics",
  description: "Instructions on how to remove your data from AM Creator Analytics.",
};

export default function DataDeletion() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-24 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1>Data Deletion Instructions</h1>
        <p>Last updated: May 17, 2026</p>

        <p>
          AM Creator Analytics complies with Facebook/Meta's platform rules regarding user data.
          If you no longer want your Instagram or Facebook account linked to AM Creator Analytics,
          you can remove it at any time.
        </p>

        <h2>How to delete your data</h2>
        
        <h3>Option 1: Remove via Facebook / Instagram (Recommended)</h3>
        <p>You can remove our app's access entirely through your own Meta account settings:</p>
        <ol>
          <li>Go to your Facebook profile's <strong>Settings & Privacy</strong> &gt; <strong>Settings</strong>.</li>
          <li>Scroll down to <strong>Permissions</strong> and click on <strong>Apps and Websites</strong>.</li>
          <li>Find <strong>AM Creator Analytics</strong> in the list of active apps.</li>
          <li>Click <strong>Remove</strong> to revoke our access.</li>
        </ol>

        <h3>Option 2: Delete via AM Creator Analytics Dashboard</h3>
        <p>
          If you have an active account with us, you can log in, navigate to <strong>Settings</strong> &gt; <strong>Social Accounts</strong>, 
          and click <strong>Disconnect</strong> next to your Instagram profile. This will immediately delete the connection token from our servers.
        </p>

        <h3>Option 3: Request complete account deletion</h3>
        <p>
          If you wish for us to completely purge all historical data, analytics, and records associated with your profile, 
          please email our support team at <strong>partnerships@amcreatoranalytics.com</strong> with the subject line "Data Deletion Request". 
          We will process your request within 48 hours and confirm when all data has been permanently deleted from our databases.
        </p>
      </div>
    </div>
  );
}
