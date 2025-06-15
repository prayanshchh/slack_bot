import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/signup" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign Up
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Data Collection</h2>
            <p className="mb-3">We collect and process the following information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Employee data from GreytHR (with your permission)</li>
              <li>Slack messages and interactions with our bot</li>
              <li>Basic workspace information from Slack</li>
              <li>User authentication data</li>
              <li>Usage statistics and logs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Usage</h2>
            <p className="mb-3">Your data is used exclusively for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Providing HR assistance services</li>
              <li>Processing leave requests and attendance</li>
              <li>Responding to HR queries</li>
              <li>Improving our service</li>
              <li>Maintaining system security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Slack Permissions</h2>
            <p className="mb-3">Our Slack app requires the following permissions:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Read messages in channels where the bot is present</li>
              <li>Send messages as the bot</li>
              <li>Access basic user information</li>
              <li>Read and write to channels</li>
              <li>Access workspace information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">GreytHR Integration</h2>
            <p className="mb-3">The GreytHR integration requires:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>API access to employee data</li>
              <li>Leave management permissions</li>
              <li>Attendance record access</li>
              <li>Organization structure access</li>
              <li>API credentials (securely stored)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Protection</h2>
            <p className="mb-3">We implement the following security measures:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>End-to-end encryption for sensitive data</li>
              <li>Regular security audits</li>
              <li>Secure storage of credentials</li>
              <li>Access logging and monitoring</li>
              <li>Regular data backups</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Disclaimers</h2>
            <p className="mb-3">Important notices:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>We are not responsible for any data loss or system issues in your GreytHR or Slack systems</li>
              <li>We do not guarantee 100% uptime or immediate response times</li>
              <li>You are responsible for maintaining the security of your API credentials</li>
              <li>We reserve the right to modify our services and policies</li>
              <li>We are not liable for any indirect or consequential damages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p className="mb-3">If you have any questions about our privacy policy or data handling practices, please contact us.</p>
            <p className="text-gray-600">
              For support inquiries, please reach out to our support team through your designated contact channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 