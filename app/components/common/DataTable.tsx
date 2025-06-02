"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, RefreshCw, ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export interface Column<T> {
  id: string
  header: string | React.ReactNode
  accessorKey?: keyof T
  cell?: (item: T) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  className?: string
}

export interface DataTableProps<T> {
  /** 表格数据 */
  data: T[]
  /** 列定义 */
  columns: Column<T>[]
  /** 是否显示搜索框 */
  showSearch?: boolean
  /** 是否显示刷新按钮 */
  showRefresh?: boolean
  /** 是否显示分页 */
  showPagination?: boolean
  /** 是否显示选择框 */
  showSelection?: boolean
  /** 是否显示表格头部 */
  showHeader?: boolean
  /** 表格标题 */
  title?: string
  /** 表格描述 */
  description?: string
  /** 每页显示数量 */
  pageSize?: number
  /** 是否显示卡片包装 */
  withCard?: boolean
  /** 自定义类名 */
  className?: string
  /** 加载状态 */
  loading?: boolean
  /** 空数据提示 */
  emptyMessage?: string
  /** 行点击事件 */
  onRowClick?: (item: T) => void
  /** 选择变更事件 */
  onSelectionChange?: (selectedItems: T[]) => void
  /** 刷新事件 */
  onRefresh?: () => void
  /** 搜索事件 */
  onSearch?: (query: string) => void
  /** 排序事件 */
  onSort?: (columnId: string, direction: "asc" | "desc") => void
  /** 分页事件 */
  onPageChange?: (page: number) => void
  /** 行操作菜单项 */
  rowActions?: {
    label: string
    icon?: React.ReactNode
    onClick: (item: T) => void
    className?: string
  }[]
  /** 批量操作菜单项 */
  batchActions?: {
    label: string
    icon?: React.ReactNode
    onClick: (selectedItems: T[]) => void
    className?: string
  }[]
}

/**
 * 统一的数据表格组件
 * 支持搜索、排序、分页、选择、行操作等功能
 */
export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  showSearch = true,
  showRefresh = true,
  showPagination = true,
  showSelection = false,
  showHeader = true,
  title,
  description,
  pageSize = 10,
  withCard = true,
  className,
  loading = false,
  emptyMessage = "暂无数据",
  onRowClick,
  onSelectionChange,
  onRefresh,
  onSearch,
  onSort,
  onPageChange,
  rowActions,
  batchActions,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState<T[]>([])
  const [sortConfig, setSortConfig] = useState<{ columnId: string; direction: "asc" | "desc" } | null>(null)
  const [filteredData, setFilteredData] = useState<T[]>(data)

  // 当数据变化时，重置过滤后的数据
  useEffect(() => {
    setFilteredData(data)
  }, [data])

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)

    if (onSearch) {
      onSearch(query)
      return
    }

    // 本地搜索
    if (query.trim() === "") {
      setFilteredData(data)
    } else {
      const lowercasedQuery = query.toLowerCase()
      const filtered = data.filter((item) => {
        return columns.some((column) => {
          if (!column.accessorKey) return false
          const value = item[column.accessorKey]
          return value !== undefined && value !== null && String(value).toLowerCase().includes(lowercasedQuery)
        })
      })
      setFilteredData(filtered)
    }
  }

  // 处理排序
  const handleSort = (columnId: string) => {
    let direction: "asc" | "desc" = "asc"

    if (sortConfig && sortConfig.columnId === columnId) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc"
    }

    setSortConfig({ columnId, direction })

    if (onSort) {
      onSort(columnId, direction)
      return
    }

    // 本地排序
    const column = columns.find((col) => col.id === columnId)
    if (column && column.accessorKey) {
      const sorted = [...filteredData].sort((a, b) => {
        const aValue = a[column.accessorKey as keyof T]
        const bValue = b[column.accessorKey as keyof T]

        if (aValue === bValue) return 0

        if (aValue === null || aValue === undefined) return direction === "asc" ? -1 : 1
        if (bValue === null || bValue === undefined) return direction === "asc" ? 1 : -1

        if (typeof aValue === "string" && typeof bValue === "string") {
          return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }

        return direction === "asc" ? (aValue < bValue ? -1 : 1) : bValue < aValue ? -1 : 1
      })

      setFilteredData(sorted)
    }
  }

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)

    if (onPageChange) {
      onPageChange(page)
    }
  }

  // 处理刷新
  const handleRefresh = () => {
    setSearchQuery("")
    setCurrentPage(1)
    setSortConfig(null)
    setSelectedItems([])

    if (onRefresh) {
      onRefresh()
    } else {
      setFilteredData(data)
    }
  }

  // 处理选择
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageItems = getCurrentPageItems()
      setSelectedItems(currentPageItems)
      if (onSelectionChange) {
        onSelectionChange(currentPageItems)
      }
    } else {
      setSelectedItems([])
      if (onSelectionChange) {
        onSelectionChange([])
      }
    }
  }

  const handleSelectItem = (item: T, checked: boolean) => {
    let newSelectedItems: T[]

    if (checked) {
      newSelectedItems = [...selectedItems, item]
    } else {
      newSelectedItems = selectedItems.filter((selectedItem) => String(selectedItem.id) !== String(item.id))
    }

    setSelectedItems(newSelectedItems)

    if (onSelectionChange) {
      onSelectionChange(newSelectedItems)
    }
  }

  // 获取当前页数据
  const getCurrentPageItems = (): T[] => {
    if (!showPagination) return filteredData

    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize

    return filteredData.slice(startIndex, endIndex)
  }

  // 计算总页数
  const totalPages = Math.ceil(filteredData.length / pageSize)

  // 当前页数据
  const currentPageItems = getCurrentPageItems()

  // 是否所有当前页项目都被选中
  const isAllCurrentPageSelected =
    currentPageItems.length > 0 &&
    currentPageItems.every((item) => selectedItems.some((selectedItem) => String(selectedItem.id) === String(item.id)))

  // 表格内容
  const TableContent = () => (
    <div className="space-y-4">
      {/* 表格工具栏 */}
      {(showSearch || showRefresh || batchActions) && (
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <div className="flex flex-1 gap-2">
            {showSearch && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="搜索..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            )}
            {showRefresh && (
              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* 批量操作 */}
          {batchActions && batchActions.length > 0 && selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">已选择 {selectedItems.length} 项</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    批量操作
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>批量操作</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {batchActions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => action.onClick(selectedItems)}
                      className={action.className}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      )}

      {/* 表格 */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {showSelection && (
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={isAllCurrentPageSelected && currentPageItems.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="全选"
                  />
                </TableHead>
              )}

              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(column.sortable && "cursor-pointer select-none", column.className)}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable &&
                      sortConfig &&
                      sortConfig.columnId === column.id &&
                      (sortConfig.direction === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              ))}

              {rowActions && rowActions.length > 0 && <TableHead className="w-[80px] text-right">操作</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showSelection ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center">
                    <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                    <span>加载中...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : currentPageItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (showSelection ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              currentPageItems.map((item) => (
                <TableRow
                  key={item.id}
                  className={cn(onRowClick && "cursor-pointer hover:bg-gray-50")}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {showSelection && (
                    <TableCell className="w-[40px]" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedItems.some((selectedItem) => String(selectedItem.id) === String(item.id))}
                        onCheckedChange={(checked) => handleSelectItem(item, !!checked)}
                        aria-label="选择行"
                      />
                    </TableCell>
                  )}

                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.className}>
                      {column.cell
                        ? column.cell(item)
                        : column.accessorKey
                          ? String(item[column.accessorKey] || "")
                          : null}
                    </TableCell>
                  ))}

                  {rowActions && rowActions.length > 0 && (
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>操作</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {rowActions.map((action, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={() => action.onClick(item)}
                              className={action.className}
                            >
                              {action.icon && <span className="mr-2">{action.icon}</span>}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 分页 */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            显示 {filteredData.length} 条中的
            {(currentPage - 1) * pageSize + 1} -{Math.min(currentPage * pageSize, filteredData.length)} 条
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  )

  // 根据是否需要卡片包装返回不同的渲染结果
  if (withCard) {
    return (
      <Card className={className}>
        {showHeader && (title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>
          <TableContent />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      {showHeader && (title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <TableContent />
    </div>
  )
}
