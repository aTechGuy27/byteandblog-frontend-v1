"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeDebug() {
  const { theme, setTheme, resolvedTheme, themes } = useTheme()

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4 bg-background border rounded-lg shadow-lg">
      <div className="space-y-2 text-sm">
        <p>
          <strong>Current theme:</strong> {theme}
        </p>
        <p>
          <strong>Resolved theme:</strong> {resolvedTheme}
        </p>
        <p>
          <strong>Available themes:</strong> {themes.join(", ")}
        </p>
        <div className="flex gap-2 mt-2">
          <Button size="sm" onClick={() => setTheme("light")}>
            Light
          </Button>
          <Button size="sm" onClick={() => setTheme("dark")}>
            Dark
          </Button>
          <Button size="sm" onClick={() => setTheme("system")}>
            System
          </Button>
        </div>
      </div>
    </div>
  )
}
