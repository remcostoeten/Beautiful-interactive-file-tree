"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { ChevronRight, Folder, MoreVertical, Edit, Trash2, Copy, Plus } from "lucide-react"
import styles from "./file-tree.module.css"

export type TFileSystemNode = {
    id: string
    name: string
    type: "file" | "directory"
    children?: TFileSystemNode[]
}

interface TFileTreeProps {
    data: TFileSystemNode[]
    defaultExpandedIds?: string[]
    onNodeSelect?: (node: TFileSystemNode) => void
    onNodeRename?: (node: TFileSystemNode, newName: string) => void
    onNodeDelete?: (node: TFileSystemNode) => void
    onNodeCopy?: (node: TFileSystemNode) => void
    onNodeAddChild?: (parentNode: TFileSystemNode) => void
}

function FileTreeItem({
    node,
    level = 0,
    onSelect,
    expandedIds,
    onToggle,
    onNodeRename,
    onNodeDelete,
    onNodeCopy,
    onNodeAddChild,
}: {
    node: TFileSystemNode
    level?: number
    onSelect?: (node: TFileSystemNode) => void
    expandedIds: Set<string>
    onToggle: (id: string) => void
    onNodeRename?: (node: TFileSystemNode, newName: string) => void
    onNodeDelete?: (node: TFileSystemNode) => void
    onNodeCopy?: (node: TFileSystemNode) => void
    onNodeAddChild?: (parentNode: TFileSystemNode) => void
}) {
    const isExpanded = expandedIds.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    const [showActions, setShowActions] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const contentRef = useRef<HTMLUListElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)
    const [contentHeight, setContentHeight] = useState<number | null>(null)

    useEffect(() => {
        if (contentRef.current && isExpanded) {
            const height = contentRef.current.scrollHeight
            setContentHeight(height)
        } else {
            setContentHeight(0)
        }
    }, [isExpanded, node.children])

    useEffect(() => {
        // Close menu when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isMenuOpen])

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onSelect?.(node)
        if (hasChildren) {
            onToggle(node.id)
        }
    }

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsMenuOpen(!isMenuOpen)
    }

    const handleMenuItemClick = (action: string) => (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsMenuOpen(false)

        switch (action) {
            case "rename":
                if (onNodeRename) {
                    const newName = prompt("Enter new name:", node.name)
                    if (newName && newName !== node.name) {
                        onNodeRename(node, newName)
                    }
                }
                break
            case "delete":
                if (onNodeDelete && confirm(`Are you sure you want to delete "${node.name}"?`)) {
                    onNodeDelete(node)
                }
                break
            case "copy":
                onNodeCopy?.(node)
                break
            case "addChild":
                onNodeAddChild?.(node)
                break
        }
    }

    return (
        <li
            className={styles.treeItem}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div
                className={`${styles.itemRow} ${hasChildren ? styles.hasChildren : ""}`}
                style={{ "--tree-level": level } as React.CSSProperties}
                onClick={handleClick}
            >
                <div className={styles.itemContent}>
                    {hasChildren && (
                        <div className={`${styles.chevron} ${isExpanded ? styles.expanded : ""}`}>
                            <ChevronRight size={16} strokeWidth={1.5} />
                        </div>
                    )}
                    <Folder className={styles.folderIcon} size={16} strokeWidth={1.5} />
                    <span className={styles.itemText}>{node.name}</span>
                </div>

                <div className={`${styles.actions} ${showActions ? styles.visible : ""}`} ref={menuRef}>
                    <button className={styles.actionButton} onClick={handleActionClick}>
                        <MoreVertical size={16} strokeWidth={1.5} />
                    </button>

                    {isMenuOpen && (
                        <div className={styles.actionMenu}>
                            <button className={styles.actionMenuItem} onClick={handleMenuItemClick("rename")}>
                                <Edit size={14} strokeWidth={1.5} />
                                <span>Rename</span>
                            </button>
                            <button className={styles.actionMenuItem} onClick={handleMenuItemClick("copy")}>
                                <Copy size={14} strokeWidth={1.5} />
                                <span>Copy</span>
                            </button>
                            {node.type === "directory" && (
                                <button className={styles.actionMenuItem} onClick={handleMenuItemClick("addChild")}>
                                    <Plus size={14} strokeWidth={1.5} />
                                    <span>Add Item</span>
                                </button>
                            )}
                            <button className={styles.actionMenuItem} onClick={handleMenuItemClick("delete")}>
                                <Trash2 size={14} strokeWidth={1.5} />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {hasChildren && (
                <ul
                    className={`${styles.nested} ${isExpanded ? styles.expanded : ""}`}
                    ref={contentRef}
                    style={
                        {
                            "--content-height": contentHeight ? `${contentHeight}px` : "0px",
                        } as React.CSSProperties
                    }
                >
                    {node.children.map((child) => (
                        <FileTreeItem
                            key={child.id}
                            node={child}
                            level={level + 1}
                            onSelect={onSelect}
                            expandedIds={expandedIds}
                            onToggle={onToggle}
                            onNodeRename={onNodeRename}
                            onNodeDelete={onNodeDelete}
                            onNodeCopy={onNodeCopy}
                            onNodeAddChild={onNodeAddChild}
                        />
                    ))}
                </ul>
            )}
        </li>
    )
}

export function FileTree({
    data,
    defaultExpandedIds = [],
    onNodeSelect,
    onNodeRename,
    onNodeDelete,
    onNodeCopy,
    onNodeAddChild,
}: TFileTreeProps) {
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds))

    const toggleNode = useCallback((id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }, [])

    return (
        <div className={styles.treeContainer}>
            <ul className={styles.rootList}>
                {data.map((node) => (
                    <FileTreeItem
                        key={node.id}
                        node={node}
                        onSelect={onNodeSelect}
                        expandedIds={expandedIds}
                        onToggle={toggleNode}
                        onNodeRename={onNodeRename}
                        onNodeDelete={onNodeDelete}
                        onNodeCopy={onNodeCopy}
                        onNodeAddChild={onNodeAddChild}
                    />
                ))}
            </ul>
        </div>
    )
}

