import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./button"
import { AlertTriangle, X, CheckCircle } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning" | "info" | "success"
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger"
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "text-red-600",
          button: "bg-red-600 hover:bg-red-700 text-white",
          border: "border-red-200 dark:border-red-800"
        }
      case "warning":
        return {
          icon: "text-amber-600",
          button: "bg-amber-600 hover:bg-amber-700 text-white",
          border: "border-amber-200 dark:border-amber-800"
        }
      case "info":
        return {
          icon: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700 text-white",
          border: "border-blue-200 dark:border-blue-800"
        }
      case "success":
        return {
          icon: "text-green-600",
          button: "bg-green-600 hover:bg-green-700 text-white",
          border: "border-green-200 dark:border-green-800"
        }
      default:
        return {
          icon: "text-red-600",
          button: "bg-red-600 hover:bg-red-700 text-white",
          border: "border-red-200 dark:border-red-800"
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8
            }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
              className="bg-background border border-border rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b ${styles.border}`}>
                <div className="flex items-center gap-3">
                  {variant === "success" ? (
                    <CheckCircle className={`h-6 w-6 ${styles.icon}`} />
                  ) : (
                    <AlertTriangle className={`h-6 w-6 ${styles.icon}`} />
                  )}
                  <h2 className="text-lg font-semibold">{title}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {message}
                </p>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  {cancelText}
                </Button>
                <Button
                  onClick={handleConfirm}
                  className={`flex-1 ${styles.button}`}
                >
                  {confirmText}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 