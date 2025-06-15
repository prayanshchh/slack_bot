import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, MessageSquare, Calendar, Users } from "lucide-react"
import { Link } from "react-router-dom"

export function Hero() {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 text-center overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl animate-breathe-slow" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-secondary/10 rounded-full blur-3xl animate-breathe-slow animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/10 rounded-full blur-3xl animate-breathe-slow animation-delay-4000" />
        
        {/* Additional background elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-breathe-fast" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl animate-breathe-fast animation-delay-1000" />
        <div className="absolute top-3/4 left-1/3 w-72 h-72 bg-accent/8 rounded-full blur-3xl animate-breathe-fast animation-delay-3000" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-12 pt-16">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            AI-Powered HR Assistant
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your HR processes with an intelligent bot that handles leave requests,
            answers policy questions, and manages employee data through natural conversation.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" variant="glow" className="text-lg group">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/greythr-setup-guide">
            <Button size="lg" variant="outline" className="text-lg hover:bg-accent/50">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <Card className="group hover:border-primary/50 transition-colors">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Smart HR Queries</CardTitle>
              <CardDescription className="text-base">
                Get instant answers to HR-related questions through natural conversation
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:border-primary/50 transition-colors">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Leave Management</CardTitle>
              <CardDescription className="text-base">
                Seamlessly integrated with GreytHR for leave requests and approvals
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:border-primary/50 transition-colors">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Employee Data</CardTitle>
              <CardDescription className="text-base">
                Access and manage employee information securely
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
} 