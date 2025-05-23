"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Loader2 } from "lucide-react"

interface ProfileData {
  name: string
  email: string
  phone: string
  address: string
  occupation: string
  birthdate: string
}

interface ProfileFormProps {
  initialData: ProfileData
  onSave: (data: ProfileData) => void
  isLoading?: boolean
}

export function ProfileForm({ initialData, onSave, isLoading = false }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<ProfileData>(initialData)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleCancel = () => {
    setFormData(initialData)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle className="text-lg">Información Personal</CardTitle>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              aria-label="Editar información personal"
            >
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} aria-label="Formulario de información personal">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-500 mb-1 block">
                  Nombre completo
                </label>
                {isEditing ? (
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Nombre completo"
                      required
                      aria-required="true"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <p className="text-[#1C3B5A] font-medium" id="name-display">
                    {formData.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-500 mb-1 block">
                  Correo electrónico
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Correo electrónico"
                      type="email"
                      required
                      aria-required="true"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <p className="text-[#1C3B5A] font-medium" id="email-display">
                    {formData.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-500 mb-1 block">
                  Teléfono
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Número de teléfono"
                      type="tel"
                      required
                      aria-required="true"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <p className="text-[#1C3B5A] font-medium" id="phone-display">
                    {formData.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="birthdate" className="text-sm font-medium text-gray-500 mb-1 block">
                  Fecha de nacimiento
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="birthdate"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="DD/MM/AAAA"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <p className="text-[#1C3B5A] font-medium" id="birthdate-display">
                    {formData.birthdate}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="occupation" className="text-sm font-medium text-gray-500 mb-1 block">
                  Ocupación
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Briefcase
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="occupation"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Ocupación"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <p className="text-[#1C3B5A] font-medium" id="occupation-display">
                    {formData.occupation}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="text-sm font-medium text-gray-500 mb-1 block">
                  Dirección
                </label>
                {isEditing ? (
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Dirección"
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  <p className="text-[#1C3B5A] font-medium" id="address-display">
                    {formData.address}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex flex-wrap justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  aria-label="Cancelar edición"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading} aria-label="Guardar cambios de información personal">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
