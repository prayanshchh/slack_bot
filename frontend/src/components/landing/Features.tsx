import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Bot, 
  Shield, 
  Zap, 
  Clock, 
  BarChart3, 
  Settings,
  MessageSquare,
  Calendar,
  Users,
  FileText,
  Bell,
  CheckCircle2
} from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "AI-Powered Conversations",
    description: "Natural language processing for human-like interactions with your HR bot",
    benefits: [
      "Understands context and intent",
      "Provides accurate HR information",
      "Handles complex queries",
      "Learns from interactions"
    ]
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with end-to-end encryption and compliance",
    benefits: [
      "SOC 2 Type II certified",
      "GDPR compliant",
      "Data encryption at rest",
      "Regular security audits"
    ]
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant responses and real-time updates for all HR processes",
    benefits: [
      "Sub-second response times",
      "Real-time data sync",
      "Instant notifications",
      "Quick leave approvals"
    ]
  }
]

const integrations = [
  {
    icon: MessageSquare,
    title: "Slack Integration",
    description: "Seamlessly works within your Slack workspace",
    features: ["Direct messages", "Channel commands", "Interactive buttons", "Rich message formatting"]
  },
  {
    icon: Calendar,
    title: "GreytHR Sync",
    description: "Bidirectional sync with your HRMS",
    features: ["Leave management", "Attendance tracking", "Employee data", "Policy updates"]
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Comprehensive team and role management",
    features: ["Role-based access", "Department management", "Team hierarchies", "Custom permissions"]
  }
]

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description: "Reduce HR response time from hours to seconds",
    metric: "85% faster"
  },
  {
    icon: BarChart3,
    title: "Increase Productivity",
    description: "Automate routine HR tasks and focus on strategic initiatives",
    metric: "3x more efficient"
  },
  {
    icon: Settings,
    title: "Easy Setup",
    description: "Get started in minutes with our simple integration process",
    metric: "5 min setup"
  }
]

export function Features() {
  return (
    <div className="relative py-24 space-y-24 bg-background">
      {/* Background glow elements for Features */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl animate-breathe-fast" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/6 rounded-full blur-3xl animate-breathe-fast animation-delay-1500" />
        <div className="absolute top-2/3 left-1/2 w-72 h-72 bg-accent/6 rounded-full blur-3xl animate-breathe-fast animation-delay-2500" />
      </div>
      
      {/* Main Features */}
      <section className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern HR
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to transform your HR operations with AI-powered automation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:border-primary/50 transition-colors">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="container mx-auto px-4 bg-muted/30 py-16 rounded-3xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Seamless Integrations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Works perfectly with your existing tools and workflows
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <Card key={index} className="group hover:border-primary/50 transition-colors bg-background/50 backdrop-blur-sm">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                  <integration.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">{integration.title}</CardTitle>
                <CardDescription className="text-base">
                  {integration.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {integration.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transform Your HR Operations
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See measurable results with our AI-powered HR assistant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group hover:border-primary/50 transition-colors text-center">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-2 mx-auto group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{benefit.title}</CardTitle>
                  <p className="text-3xl font-bold text-primary">{benefit.metric}</p>
                </div>
                <CardDescription className="text-base">
                  {benefit.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
} 