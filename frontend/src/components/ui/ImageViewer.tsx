import React, { useState, useRef, useEffect, useCallback } from "react"
import { X, ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ImageViewerProps {
  src: string
  alt: string
  onClose: () => void
}

export function ImageViewer({ src, alt, onClose }: ImageViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const scaleFactor = 1.1 // Adjust zoom speed
    let newZoomLevel = zoomLevel

    if (e.deltaY < 0) { // Zoom in
      newZoomLevel = Math.min(zoomLevel * scaleFactor, 5) // Max zoom 5x
    } else { // Zoom out
      newZoomLevel = Math.max(zoomLevel / scaleFactor, 1) // Min zoom 1x
    }

    setZoomLevel(newZoomLevel)
  }, [zoomLevel])

  const resetZoom = () => {
    setZoomLevel(1)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        imageRef.current &&
        !imageRef.current.contains(event.target as Node) &&
        controlsRef.current &&
        !controlsRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    document.addEventListener("mousedown", handleClickOutside)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
    >
      <motion.div 
        ref={containerRef}
        className="relative flex items-center justify-center max-w-[90vw] max-h-[90vh]"
        onWheel={handleWheel}
      >
        <motion.img
          ref={imageRef}
          src={src}
          alt={alt}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="object-contain w-full h-full"
          style={{
            scale: zoomLevel,
            cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          drag={zoomLevel > 1}
          dragConstraints={containerRef}
          dragElastic={0}
          dragTransition={{ bounceStiffness: 0, bounceDamping: 0 }}
        />
        
        {/* Controls */}
        <div
          ref={controlsRef}
          className="absolute top-4 right-4 flex flex-col space-y-2 bg-background/50 p-2 rounded-lg shadow-lg backdrop-blur-sm"
        >
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setZoomLevel(prev => Math.min(prev * 1.2, 5))} aria-label="Zoom In">
            <ZoomIn className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setZoomLevel(prev => Math.max(prev / 1.2, 1))} aria-label="Zoom Out">
            <ZoomOut className="h-5 w-5" />
          </Button>
          {zoomLevel > 1 && (
            <Button variant="ghost" size="icon" onClick={resetZoom} aria-label="Reset Zoom and Position">
              <Minimize2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
} 