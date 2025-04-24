"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface DataTableProps<T> {
  data: T[]
  columns: {
    key: keyof T
    header: string
    cell?: (item: T) => React.ReactNode
    sortable?: boolean
  }[]
  searchable?: boolean
  searchKeys?: (keyof T)[]
  pagination?: boolean
  pageSize?: number
}

export function DataTable<T>({
  data,
  columns,
  searchable = false,
  searchKeys = [],
  pagination = false,
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null
    direction: "asc" | "desc"
  }>({
    key: null,
    direction: "asc",
  })

  // Filtrar dados com base no termo de pesquisa
  const filteredData = searchable
    ? data.filter((item) =>
        searchKeys.some((key) => {
          const value = item[key]
          return value !== undefined && String(value).toLowerCase().includes(searchTerm.toLowerCase())
        }),
      )
    : data

  // Ordenar dados
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue === bValue) return 0

    if (aValue === undefined) return 1
    if (bValue === undefined) return -1

    const comparison = String(aValue).localeCompare(String(bValue))
    return sortConfig.direction === "asc" ? comparison : -comparison
  })

  // Paginar dados
  const paginatedData = pagination ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize) : sortedData

  const totalPages = pagination ? Math.ceil(sortedData.length / pageSize) : 1

  // Manipular clique no cabeçalho para ordenação
  const handleSort = (key: keyof T) => {
    if (!columns.find((col) => col.key === key)?.sortable) return

    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    })
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={column.sortable ? "cursor-pointer select-none" : ""}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  {column.header}
                  {sortConfig.key === column.key && (
                    <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.cell ? column.cell(item) : String(item[column.key] || "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * pageSize + 1} a {Math.min(currentPage * pageSize, sortedData.length)} de{" "}
            {sortedData.length} resultados
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
