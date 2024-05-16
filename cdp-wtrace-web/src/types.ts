export interface Message {
    type: "NewScene" // | "ObjectsAdded" | "ObjectsRemoved" | "ObjectsUpdated"
    objects: Object[]
}

export interface Object {
    modelName: string
    transform: {
        position?: { x: number, y: number, z: number },
        eulerAngles?: { x: number, y: number, z: number }
        scale?: { x: number, y: number, z: number }
    }
}

export interface PreloadedModelInfo {
    path: string,
    material?: {
        baseMapName?: string,
        metallicRoughnessMapName?: string
    }
}