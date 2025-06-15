import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { 
  MessageSquare, 
  Users, 
  Settings, 
  CheckCircle2,
  ArrowRight,
  Slack,
  Database
} from "lucide-react"

const steps = [
  {
    icon: Slack,
    title: "Install Slack App",
    description: "Add our bot to your Slack workspace to enable HR conversations",
    link: "/slack-integration",
    linkText: "View Slack Setup Guide",
    status: "active"
  },
  {
    icon: Database,
    title: "Configure GreytHR",
    description: "Set up API access to sync employee data and manage leave requests",
    link: "/greythr-integration",
    linkText: "View GreytHR Setup Guide",
    status: "active"
  },
  {
    icon: Users,
    title: "Invite Team Members",
    description: "Add your HR team to manage and monitor the bot's activities",
    link: "#",
    linkText: "Coming Soon",
    status: "upcoming"
  },
  {
    icon: Settings,
    title: "Customize Settings",
    description: "Configure bot behavior, permissions, and notification preferences",
    link: "#",
    linkText: "Coming Soon",
    status: "upcoming"
  }
]

export function Roadmap() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Started in Minutes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Follow these simple steps to integrate our HR Assistant into your workspace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className={cn(
                "group relative overflow-hidden",
                step.status === "upcoming" && "opacity-60"
              )}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link to={step.link}>
                  <Button 
                    variant={step.status === "upcoming" ? "outline" : "glow"}
                    className="w-full group"
                    disabled={step.status === "upcoming"}
                  >
                    {step.linkText}
                    {step.status === "active" && (
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Prerequisites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Admin access to your Slack workspace
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  GreytHR account with API access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Basic understanding of your HR processes
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our support team is here to help you with the integration process
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
} 