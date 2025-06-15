import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Slack, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Shield,
  Settings
} from "lucide-react"

const steps = [
  {
    title: "Visit Slack App Directory",
    description: "Go to the Slack App Directory to find and install our HR Assistant",
    action: "Open Slack App Directory",
    link: "https://api.slack.com/apps",
    icon: ExternalLink
  },
  {
    title: "Add to Workspace",
    description: "Click 'Add to Slack' and select your workspace",
    action: "Install App",
    link: "#",
    icon: Slack
  },
  {
    title: "Grant Permissions",
    description: "Review and approve the required permissions for the bot to function",
    action: "View Required Permissions",
    link: "#permissions",
    icon: Shield
  },
  {
    title: "Configure Channels",
    description: "Set up which channels the bot can access and respond in",
    action: "Configure Channels",
    link: "#channels",
    icon: Settings
  }
]

const permissions = [
  {
    scope: "chat:write",
    description: "Send messages as the HR Assistant bot"
  },
  {
    scope: "channels:history",
    description: "Read messages in channels the bot is invited to"
  },
  {
    scope: "groups:history",
    description: "Read messages in private channels"
  },
  {
    scope: "im:history",
    description: "Read direct messages sent to the bot"
  },
  {
    scope: "users:read",
    description: "Access basic user information"
  },
  {
    scope: "team:read",
    description: "Access workspace information"
  }
]

export function SlackIntegration() {
  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Slack Integration Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow these steps to add our HR Assistant to your Slack workspace
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

        {/* Permissions Section */}
        <div id="permissions" className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Required Permissions
              </CardTitle>
              <CardDescription>
                These permissions are necessary for the HR Assistant to function properly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissions.map((permission, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{permission.scope}</p>
                      <p className="text-sm text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Channel Configuration */}
        <div id="channels" className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Channel Configuration
              </CardTitle>
              <CardDescription>
                Set up which channels the HR Assistant can access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-2">Public Channels</h3>
                  <p className="text-sm text-muted-foreground">
                    The bot can be invited to any public channel where you want it to respond to HR queries
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-2">Private Channels</h3>
                  <p className="text-sm text-muted-foreground">
                    For sensitive HR discussions, create a private channel and invite the bot
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h3 className="font-medium mb-2">Direct Messages</h3>
                  <p className="text-sm text-muted-foreground">
                    Users can message the bot directly for private HR queries
                  </p>
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