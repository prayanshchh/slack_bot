import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowRight, 
  CheckCircle, 
  Copy, 
  ExternalLink,
  AlertTriangle,
  Info,
  Shield,
  Key,
  Settings,
  User,
  Eye
} from "lucide-react"
import { Link } from "react-router-dom"
import { Navbar } from "@/components/layout/Navbar"
import { ImageViewer } from "@/components/ui/ImageViewer"
import { AnimatePresence } from "framer-motion"

export function GreytHRSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const steps = [
    {
      id: 1,
      title: "Login to GreytHR Account",
      description: "Access your GreytHR administrator account",
      details: "Make sure you have administrator privileges in your GreytHR account. You'll need full access to create API users.",
      icon: User,
      color: "bg-blue-500",
      image: "/images/greythr-login.png"
    },
    {
      id: 2,
      title: "Navigate to Settings",
      description: "Find the API configuration section",
      details: "In your GreytHR dashboard, locate the Settings or Configuration section where API management is handled.",
      icon: Settings,
      color: "bg-green-500",
      image: "/images/greythr-settings.png"
    },
    {
      id: 3,
      title: "Go to API Users",
      description: "Access the API user management area",
      details: "Look for 'API Users', 'API Management', or 'External Access' in the settings menu.",
      icon: Key,
      color: "bg-purple-500",
      image: "/images/greythr-api-users.png"
    },
    {
      id: 4,
      title: "Create API User with All Scopes",
      description: "Set up a new API user with full permissions",
      details: "Create a new API user and ensure all scopes/permissions are enabled. This is crucial for our integration to work properly. All access API scopes are needed.",
      icon: Shield,
      color: "bg-orange-500",
      image: "/images/greythr-add-api-user.png"
    },
    {
      id: 5,
      title: "Copy Username and Password",
      description: "Save your API credentials securely",
      details: "Once created, copy the API username and password. Store them securely as you'll need them for our integration. Please note: The password is typically shown only once.",
      icon: Copy,
      color: "bg-red-500",
      animation: true
    }
  ]

  const handleCopyStep = (stepNumber: number) => {
    const stepText = `Step ${stepNumber}: ${steps[stepNumber - 1].title} - ${steps[stepNumber - 1].description}`
    navigator.clipboard.writeText(stepText)
    setCopiedStep(stepNumber)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  // Component for animated password field
  const AnimatedPasswordField = () => {
    const [usernameText, setUsernameText] = useState("")
    const [passwordText, setPasswordText] = useState("")
    const [blurred, setBlurred] = useState(false)

    useEffect(() => {
      const usernameTarget = "apiusername"
      const passwordTarget = "*********"
      let usernameIndex = 0
      let passwordIndex = 0

      const typeUsername = setInterval(() => {
        if (usernameIndex < usernameTarget.length) {
          setUsernameText(prev => prev + usernameTarget.charAt(usernameIndex))
          usernameIndex++
        } else {
          clearInterval(typeUsername)
          // Start typing password after username is done
          const typePassword = setInterval(() => {
            if (passwordIndex < passwordTarget.length) {
              setPasswordText(prev => prev + passwordTarget.charAt(passwordIndex))
              passwordIndex++
            } else {
              clearInterval(typePassword)
              // Blur after password is fully typed
              setTimeout(() => {
                setBlurred(true)
              }, 1000) // Stay clear for 1 second before blurring
            }
          }, 100) // Typing speed for password
        }
      }, 150) // Typing speed for username

      return () => { // Cleanup
        clearInterval(typeUsername)
        // You might need to clear the password interval too if it's still running
      }
    }, [])

    return (
      <div className="w-full max-w-sm mx-auto p-4 bg-white dark:bg-gray-800 rounded-md shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username:</label>
          <div className="mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-lg">
            {usernameText}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password:</label>
          <div className={`mt-1 p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-lg transition-all duration-500 ${blurred ? 'blur-sm' : ''}`}>
            {passwordText}
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <Info className="h-3 w-3" />
          For demonstration. Your actual password will be visible only once!
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Key className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">GreytHR API Setup Guide</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Follow these 5 simple steps to create your GreytHR API credentials and connect your company to our platform
            </p>
          </div>

          {/* Important Notice */}
          <Card className="mb-8 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Important Security Notice
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    Your API credentials are encrypted and stored securely. Never share your GreytHR API password with anyone. 
                    Our platform only uses these credentials to sync employee data and leave information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <div className="space-y-8 mb-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <Card key={step.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${step.color}`}></div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-lg`}>
                          {step.id}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl">{step.title}</CardTitle>
                          </div>
                          <CardDescription className="text-base">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyStep(step.id)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {copiedStep === step.id ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <h4 className="font-medium">What you need to do:</h4>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {step.details}
                        </p>
                      </div>
                      <div 
                        className="bg-muted/50 rounded-lg p-6 flex items-center justify-center min-h-[200px] overflow-hidden"
                        onClick={step.image ? () => setSelectedImage(step.image) : undefined}
                        style={{ cursor: step.image ? 'pointer' : 'default' }}
                      >
                        {step.image ? (
                          <img 
                            src={step.image} 
                            alt={step.title} 
                            className="max-w-full max-h-full object-contain rounded-md shadow-md"
                          />
                        ) : step.animation ? (
                          <AnimatedPasswordField />
                        ) : (
                          <div className="text-center text-muted-foreground">
                            <Eye className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No preview available</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Ready to Connect?
              </CardTitle>
              <CardDescription>
                Now that you have your API credentials, you can create your company integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="flex-1">
                  <Button className="w-full" variant="glow">
                    Create Account & Connect
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/signin" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Already have an account? Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      <AnimatePresence>
        {selectedImage && (
          <ImageViewer 
            key={selectedImage}
            src={selectedImage} 
            alt="GreytHR Setup Screenshot" 
            onClose={() => setSelectedImage(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
} 