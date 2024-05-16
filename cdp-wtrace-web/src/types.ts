export interface SceneData {
    meshModelsData: MeshModelData[]
}

export interface MeshModelData {
    meshPath: string,
    materialData?: {
        // baseColor?: {r: number, g: number, b: number},
        // roughness?: number,
        // metallic?: number,
        albedoMap?: {
            path: string,
            flipY?: boolean
        }
        metallicRoughnessMap?: {
            path: string,
            flipY?: boolean
        }
    },
    transform?: {
        position?: { x: number, y: number, z: number },
        eulerAngles?: { x: number, y: number, z: number }
        scale?: { x: number, y: number, z: number }
    }
}