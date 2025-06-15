import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Database, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Key,
  Shield,
  Settings,
  FileText
} from "lucide-react"

const steps = [
  {
    title: "Access GreytHR Admin Panel",
    description: "Log in to your GreytHR account with admin privileges",
    action: "Open GreytHR",
    link: "https://gsp.greythr.com",
    icon: Database
  },
  {
    title: "Create API User",
    description: "Navigate to Admin → API Users and create a new API user",
    action: "View API User Guide",
    link: "#api-user",
    icon: Key
  },
  {
    title: "Configure API Scopes",
    description: "Set up the required API permissions for the HR Assistant",
    action: "View Required Scopes",
    link: "#scopes",
    icon: Shield
  },
  {
    title: "Save Credentials",
    description: "Securely store your API credentials in our dashboard",
    action: "Configure API Settings",
    link: "#credentials",
    icon: Settings
  }
]

const scopes = [
  {
    name: "Employee Data",
    description: "Access to employee profiles and basic information",
    required: true
  },
  {
    name: "Leave Management",
    description: "View and manage leave requests and balances",
    required: true
  },
  {
    name: "Attendance",
    description: "Access attendance records and reports",
    required: true
  },
  {
    name: "Organization Structure",
    description: "View department and reporting hierarchy",
    required: true
  }
]

const apiUserGuide = [
  {
    title: "Navigate to API Users",
    steps: [
      "Log in to GreytHR Admin Panel",
      "Go to Admin → API Users",
      "Click 'Add New API User'"
    ]
  },
  {
    title: "Configure User Details",
    steps: [
      "Enter a descriptive name (e.g., 'HR Assistant Bot')",
      "Set a strong password",
      "Select appropriate access levels"
    ]
  },
  {
    title: "Set API Permissions",
    steps: [
      "Enable required API scopes",
      "Set IP restrictions if needed",
      "Configure rate limits"
    ]
  }
]

export function GreytHRIntegration() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            GreytHR Integration Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Set up API access to connect your GreytHR account with our HR Assistant
          </p>
        </div>

        {/* Main Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="group hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full group"
                  asChild
                >
                  <a href={step.link} target="_blank" rel="noopener noreferrer">
                    {step.action}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API User Guide */}
        <div id="api-user" className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                API User Setup Guide
              </CardTitle>
              <CardDescription>
                Detailed steps to create and configure your API user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {apiUserGuide.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-lg font-medium">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                          <span className="text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Required Scopes */}
        <div id="scopes" className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Required API Scopes
              </CardTitle>
              <CardDescription>
                These permissions are necessary for the HR Assistant to function properly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scopes.map((scope, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{scope.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {scope.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notes */}
        <div id="credentials" className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Security Best Practices
              </CardTitle>
              <CardDescription>
                Important security considerations for API integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-2">API Credentials</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Use a dedicated API user, not your admin account</li>
                    <li>Set a strong, unique password</li>
                    <li>Enable IP restrictions if possible</li>
                    <li>Regularly rotate API credentials</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-2">Data Access</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Grant only necessary permissions</li>
                    <li>Review access logs regularly</li>
                    <li>Monitor for unusual activity</li>
                    <li>Keep integration documentation secure</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you encounter any issues during the integration process, our support team is here to help
            </p>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 