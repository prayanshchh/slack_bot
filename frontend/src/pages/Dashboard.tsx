import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ConfirmDialog } from "@/components/ui/ConfirmDialog"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building2, 
  Users, 
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  BookOpen
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { apiService, CompanyResponse, CompanyCreate, CompanyUpdate } from "@/lib/api"
import { Navbar } from "@/components/layout/Navbar"

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<CompanyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState<CompanyResponse | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    greyt_hr_username: "",
    greyt_hr_password: "",
    description: ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [deletingCompanies, setDeletingCompanies] = useState<Set<string>>(new Set())
  const [importingCompanies, setImportingCompanies] = useState<Set<string>>(new Set())
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean
    companyId: string
    companyName: string
  }>({
    isOpen: false,
    companyId: "",
    companyName: ""
  })
  const [successDialog, setSuccessDialog] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({
    isOpen: false,
    title: "",
    message: ""
  })

  // Load companies when user is available
  useEffect(() => {
    if (user) {
      loadCompanies()
    }
  }, [user])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      const response = await apiService.getCompanies()
      if (response.error) {
        setError(response.error)
      } else {
        setCompanies(response.data || [])
      }
    } catch (err) {
      setError("Failed to load companies")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")

    try {
      const companyData: CompanyCreate = {
        name: formData.name,
        greyt_hr_username: formData.greyt_hr_username,
        greyt_hr_password: formData.greyt_hr_password,
        description: formData.description || undefined
      }

      const response = await apiService.createCompany(companyData)
      
      if (response.error) {
        setError(response.error)
      } else {
        setCompanies(prev => [...prev, response.data!])
        setShowCreateForm(false)
        resetForm()
      }
    } catch (err) {
      setError("Failed to create company")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCompany) return

    setSubmitting(true)
    setError("")

    try {
      const companyData: CompanyUpdate = {
        name: formData.name || undefined,
        greyt_hr_username: formData.greyt_hr_username || undefined,
        greyt_hr_password: formData.greyt_hr_password || undefined,
        description: formData.description || undefined
      }

      const response = await apiService.updateCompany(editingCompany.name, companyData)
      
      if (response.error) {
        setError(response.error)
      } else {
        setCompanies(prev => 
          prev.map(company => 
            company.id === editingCompany.id ? response.data! : company
          )
        )
        setEditingCompany(null)
        resetForm()
      }
    } catch (err) {
      setError("Failed to update company")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCompany = async (companyId: string, companyName: string) => {
    setDeleteDialog({
      isOpen: true,
      companyId,
      companyName
    })
  }

  const confirmDeleteCompany = async () => {
    const { companyId, companyName } = deleteDialog
    
    try {
      setError("")
      setDeletingCompanies(prev => new Set(prev).add(companyId))
      
      const response = await apiService.deleteCompany(companyName)
      
      if (response.error) {
        setError(response.error)
      } else {
        // Remove from state after successful deletion
        setCompanies(prev => prev.filter(company => company.id !== companyId))
        // Show success message
        setSuccessDialog({
          isOpen: true,
          title: "Company Deleted",
          message: response.data?.message || "Company deleted successfully"
        })
      }
    } catch (err) {
      setError("Failed to delete company")
    } finally {
      setDeletingCompanies(prev => {
        const newSet = new Set(prev)
        newSet.delete(companyId)
        return newSet
      })
    }
  }

  const handleImportEmployees = async (companyName: string) => {
    try {
      setError("")
      setImportingCompanies(prev => new Set(prev).add(companyName))
      
      const response = await apiService.importEmployees(companyName)
      if (response.error) {
        setError(response.error)
      } else {
        // Show success message
        setSuccessDialog({
          isOpen: true,
          title: "Employees Imported",
          message: response.data?.message || "Employees imported successfully"
        })
      }
    } catch (err) {
      setError("Failed to import employees")
    } finally {
      setImportingCompanies(prev => {
        const newSet = new Set(prev)
        newSet.delete(companyName)
        return newSet
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      greyt_hr_username: "",
      greyt_hr_password: "",
      description: ""
    })
  }

  const startEdit = (company: CompanyResponse) => {
    setEditingCompany(company)
    setFormData({
      name: company.name,
      greyt_hr_username: company.greyt_hr_username,
      greyt_hr_password: "", // Don't populate password for security
      description: ""
    })
  }

  const cancelEdit = () => {
    setEditingCompany(null)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar simplified={true} />
      <div className="pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground">
                Manage your companies and GreytHR integrations
              </p>
              <Link 
                to="/greythr-setup-guide" 
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Need help with GreytHR setup?
              </Link>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-2 text-destructive bg-destructive/10 p-4 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Create Company Button */}
          {!showCreateForm && !editingCompany && (
            <div className="mb-6">
              <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Company
              </Button>
            </div>
          )}

          {/* Create/Edit Form */}
          {(showCreateForm || editingCompany) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingCompany ? "Edit Company" : "Add New Company"}
                </CardTitle>
                <CardDescription>
                  {editingCompany 
                    ? "Update your company's GreytHR credentials"
                    : "Add a new company with GreytHR integration"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Company Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your Company Name"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="greyt_hr_username">GreytHR Username</Label>
                      <Input
                        id="greyt_hr_username"
                        value={formData.greyt_hr_username}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, greyt_hr_username: e.target.value }))}
                        placeholder="API Username"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="greyt_hr_password">GreytHR Password</Label>
                    <Input
                      id="greyt_hr_password"
                      type="password"
                      value={formData.greyt_hr_password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, greyt_hr_password: e.target.value }))}
                      placeholder="API Password"
                      required={!editingCompany}
                      disabled={submitting}
                    />
                  </div>
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of your company"
                      disabled={submitting}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingCompany ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        editingCompany ? "Update Company" : "Create Company"
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={editingCompany ? cancelEdit : () => setShowCreateForm(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Companies List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading companies...</span>
            </div>
          ) : companies.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No companies yet</h3>
                <p className="text-muted-foreground mb-4">
                  Get started by adding your first company with GreytHR integration
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Company
                  </Button>
                  <Link to="/greythr-setup-guide">
                    <Button variant="outline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Setup Guide
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.map((company) => (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                        <CardDescription>
                          GreytHR: {company.greyt_hr_username}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(company)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCompany(company.id, company.name)}
                          disabled={deletingCompanies.has(company.id)}
                          className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                        >
                          {deletingCompanies.has(company.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {new Date(company.created_at).toLocaleDateString()}</span>
                      </div>
                      {company.access_token && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Connected to GreytHR</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleImportEmployees(company.name)}
                          disabled={importingCompanies.has(company.name)}
                          className="flex-1 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 dark:hover:border-amber-700 transition-colors"
                        >
                          {importingCompanies.has(company.name) ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Importing...
                            </>
                          ) : (
                            <>
                              <Users className="mr-2 h-4 w-4" />
                              Import Employees
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Custom Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, companyId: "", companyName: "" })}
        onConfirm={confirmDeleteCompany}
        title="Delete Company"
        message={`Are you sure you want to delete "${deleteDialog.companyName}"? This will permanently delete the company and all its employees. This action cannot be undone.`}
        confirmText="Delete Company"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Success Dialog */}
      <ConfirmDialog
        isOpen={successDialog.isOpen}
        onClose={() => setSuccessDialog({ isOpen: false, title: "", message: "" })}
        onConfirm={() => setSuccessDialog({ isOpen: false, title: "", message: "" })}
        title={successDialog.title}
        message={successDialog.message}
        confirmText="OK"
        variant="success"
      />
    </div>
  )
} 