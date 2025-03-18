"use client"

import { FileTree, type TFileSystemNode } from "./_components/file-tree"
import { useState } from "react"

const initialFileSystemData: TFileSystemNode[] = [
    {
        id: "1",
        name: "pages",
        type: "directory",
        children: [
            {
                id: "2",
                name: "index.tsx",
                type: "file",
            },
            {
                id: "3",
                name: "about.tsx",
                type: "file",
            },
            {
                id: "4",
                name: "blog",
                type: "directory",
                children: [
                    {
                        id: "5",
                        name: "index.tsx",
                        type: "file",
                    },
                    {
                        id: "6",
                        name: "[slug].tsx",
                        type: "file",
                    },
                ],
            },
            {
                id: "7",
                name: "api",
                type: "directory",
                children: [
                    {
                        id: "8",
                        name: "hello.ts",
                        type: "file",
                    },
                    {
                        id: "9",
                        name: "users",
                        type: "directory",
                        children: [
                            {
                                id: "10",
                                name: "index.ts",
                                type: "file",
                            },
                            {
                                id: "11",
                                name: "[id].ts",
                                type: "file",
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: "12",
        name: "components",
        type: "directory",
        children: [
            {
                id: "13",
                name: "Layout.tsx",
                type: "file",
            },
            {
                id: "14",
                name: "Header.tsx",
                type: "file",
            },
            {
                id: "15",
                name: "Footer.tsx",
                type: "file",
            },
        ],
    },
    {
        id: "16",
        name: "styles",
        type: "directory",
        children: [
            {
                id: "17",
                name: "globals.css",
                type: "file",
            },
        ],
    },
    {
        id: "18",
        name: "package.json",
        type: "file",
    },
    {
        id: "19",
        name: "tsconfig.json",
        type: "file",
    },
    {
        id: "20",
        name: "next.config.js",
        type: "file",
    },
]

export default function ExampleFileTree() {
    const [fileSystemData, setFileSystemData] = useState<TFileSystemNode[]>(initialFileSystemData)
    const [selectedNode, setSelectedNode] = useState<TFileSystemNode | null>(null)

    const handleNodeSelect = (node: TFileSystemNode) => {
        setSelectedNode(node)
        console.log("Selected node:", node)
    }

    const handleNodeRename = (node: TFileSystemNode, newName: string) => {
        console.log(`Renaming ${node.name} to ${newName}`)

        const updateNodeName = (nodes: TFileSystemNode[]): TFileSystemNode[] => {
            return nodes.map((item) => {
                if (item.id === node.id) {
                    return { ...item, name: newName }
                }
                if (item.children) {
                    return { ...item, children: updateNodeName(item.children) }
                }
                return item
            })
        }

        setFileSystemData(updateNodeName(fileSystemData))
    }

    const handleNodeDelete = (node: TFileSystemNode) => {
        console.log(`Deleting ${node.name}`)

        // Deep clone and remove the node
        const removeNode = (nodes: TFileSystemNode[]): TFileSystemNode[] => {
            return nodes.filter((item) => {
                if (item.id === node.id) {
                    return false
                }
                if (item.children) {
                    item.children = removeNode(item.children)
                }
                return true
            })
        }

        setFileSystemData(removeNode(fileSystemData))
        if (selectedNode?.id === node.id) {
            setSelectedNode(null)
        }
    }

    const handleNodeCopy = (node: TFileSystemNode) => {
        console.log(`Copying ${node.name}`)

        const newNode = {
            ...node,
            id: `copy-${Date.now()}`,
            name: `${node.name} (copy)`,
            children: node.children ? JSON.parse(JSON.stringify(node.children)) : undefined,
        }

        const addCopy = (nodes: TFileSystemNode[]): TFileSystemNode[] => {
            return nodes.map((item) => {
                if (item.children) {
                    const childIndex = item.children.findIndex((child) => child.id === node.id)
                    if (childIndex >= 0) {
                        const newChildren = [...item.children]
                        newChildren.splice(childIndex + 1, 0, newNode)
                        return { ...item, children: newChildren }
                    }
                    return { ...item, children: addCopy(item.children) }
                }
                return item
            })
        }

        // If it's a top-level node
        if (fileSystemData.some((item) => item.id === node.id)) {
            const index = fileSystemData.findIndex((item) => item.id === node.id)
            const newData = [...fileSystemData]
            newData.splice(index + 1, 0, newNode)
            setFileSystemData(newData)
        } else {
            setFileSystemData(addCopy(fileSystemData))
        }
    }

    const handleNodeAddChild = (parentNode: TFileSystemNode) => {
        console.log(`Adding child to ${parentNode.name}`)

        if (parentNode.type !== "directory") return

        const newName = prompt("Enter name for new item:")
        if (!newName) return

        const isFile = confirm("Is this a file? (Cancel for directory)")

        const newNode: TFileSystemNode = {
            id: `new-${Date.now()}`,
            name: newName,
            type: isFile ? "file" : "directory",
            children: isFile ? undefined : [],
        }

        const addChild = (nodes: TFileSystemNode[]): TFileSystemNode[] => {
            return nodes.map((item) => {
                if (item.id === parentNode.id) {
                    return {
                        ...item,
                        children: [...(item.children || []), newNode],
                    }
                }
                if (item.children) {
                    return { ...item, children: addChild(item.children) }
                }
                return item
            })
        }

        setFileSystemData(addChild(fileSystemData))
    }

    return (
        <div className="p-4 border rounded-lg max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-4">Project Files</h2>
            <FileTree
                data={fileSystemData}
                defaultExpandedIds={["1", "4", "7"]}
                onNodeSelect={handleNodeSelect}
                onNodeRename={handleNodeRename}
                onNodeDelete={handleNodeDelete}
                onNodeCopy={handleNodeCopy}
                onNodeAddChild={handleNodeAddChild}
            />

            {selectedNode && (
                <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                    <p>
                        <strong>Selected:</strong> {selectedNode.name}
                    </p>
                    <p>
                        <strong>Type:</strong> {selectedNode.type}
                    </p>
                    <p>
                        <strong>ID:</strong> {selectedNode.id}
                    </p>
                </div>
            )}
        </div>
    )
}

