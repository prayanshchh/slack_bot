import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold text-black mb-2">
            Terms and Conditions
          </h1>
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-black">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">1. Acceptance of Terms</h2>
              <p className="text-black leading-relaxed">
                By accessing and using this HR Assistant service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">2. Description of Service</h2>
              <p className="text-black leading-relaxed mb-4">
                Our HR Assistant service provides automated HR support through Slack integration and GreytHR connectivity. The service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Automated leave request processing</li>
                <li>Employee information queries</li>
                <li>Attendance tracking assistance</li>
                <li>HR policy information</li>
                <li>Integration with existing HR systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">3. User Responsibilities</h2>
              <p className="text-black leading-relaxed mb-4">
                As a user of this service, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-black">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Not attempt to reverse engineer or hack the service</li>
                <li>Respect the privacy and rights of other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">4. Data and Privacy</h2>
              <p className="text-black leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">5. Service Availability</h2>
              <p className="text-black leading-relaxed">
                We strive to maintain high service availability but do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or technical issues. We are not liable for any damages resulting from service interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">6. Limitation of Liability</h2>
              <p className="text-black leading-relaxed">
                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">7. Intellectual Property</h2>
              <p className="text-black leading-relaxed">
                The service and its original content, features, and functionality are and will remain the exclusive property of our company and its licensors. The service is protected by copyright, trademark, and other laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">8. Termination</h2>
              <p className="text-black leading-relaxed">
                We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">9. Changes to Terms</h2>
              <p className="text-black leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">10. Governing Law</h2>
              <p className="text-black leading-relaxed">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which our company is registered, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-black mb-4">11. Contact Information</h2>
              <p className="text-black leading-relaxed">
                If you have any questions about these Terms and Conditions, please contact us at support@hrassistant.com.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm text-center">
            © {new Date().getFullYear()} HR Assistant. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
} 