"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link2, Plus, Trash2, Loader2 } from "lucide-react"

interface LinkedAccount {
  id: string
  name: string
  type: string
  icon: string
  isConnected: boolean
}

interface LinkedAccountsProps {
  accounts: LinkedAccount[]
  onConnect: (accountType: string) => void
  onDisconnect: (accountId: string) => void
  isLoading?: boolean
}

export function LinkedAccounts({ accounts, onConnect, onDisconnect, isLoading = false }: LinkedAccountsProps) {
  const availableServices = [
    { type: "google", name: "Google" },
    { type: "facebook", name: "Facebook" },
    { type: "apple", name: "Apple" },
    { type: "twitter", name: "Twitter" },
  ]

  const connectedAccounts = accounts.filter((account) => account.isConnected)
  const availableToConnect = availableServices.filter(
    (service) => !accounts.some((account) => account.type === service.type && account.isConnected),
  )

  return (
    <Card>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Link2 size={18} className="mr-2" aria-hidden="true" /> Cuentas vinculadas
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        {connectedAccounts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No tienes cuentas vinculadas</p>
          </div>
        ) : (
          <div className="space-y-4" role="list" aria-label="Cuentas vinculadas">
            {connectedAccounts.map((account) => (
              <div key={account.id} className="flex justify-between items-center" role="listitem">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {account.icon ? (
                      <img
                        src={account.icon || "/placeholder.svg"}
                        alt={`Logo de ${account.name}`}
                        className="h-6 w-6"
                      />
                    ) : (
                      <div className="h-6 w-6 bg-gray-300 rounded-full" aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1C3B5A]">{account.name}</p>
                    <p className="text-xs text-gray-500">Conectado</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDisconnect(account.id)}
                  disabled={isLoading}
                  aria-label={`Desvincular cuenta de ${account.name}`}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 size={16} aria-hidden="true" />
                  )}
                  <span className="sr-only">Desvincular cuenta de {account.name}</span>
                </Button>
              </div>
            ))}
          </div>
        )}

        {availableToConnect.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-500 mb-4" id="connect-account-heading">
              Conectar cuenta
            </h3>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2"
              role="group"
              aria-labelledby="connect-account-heading"
            >
              {availableToConnect.map((service) => (
                <Button
                  key={service.type}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => onConnect(service.type)}
                  disabled={isLoading}
                  aria-label={`Conectar cuenta de ${service.name}`}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="mr-2 animate-spin" aria-hidden="true" />
                  ) : (
                    <Plus size={16} className="mr-2" aria-hidden="true" />
                  )}
                  {service.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
