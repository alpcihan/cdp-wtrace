import { SceneData } from "./types";

export const CDP_TEST_SCENE_DATA: SceneData = {
    meshModelsData: [
        {
            meshPath: "assets/models/meetman_head.obj",
            materialData: {
                albedoMap: {
                    path: "assets/textures/meetman_head_base.jpg",
                    flipY: true
                },
                metallicRoughnessMap: {
                    path: "assets/textures/meetman_head_metallic_roughness.jpg",
                    flipY: true
                } 
            },
            transform: {
                scale: {x: 100, y: 100, z: 100}
            }
        },
        {
            meshPath: "assets/models/meetman_body.obj",
            materialData: {
                albedoMap: {
                    path: "assets/textures/meetman_body_base.jpg",
                    flipY: true
                },
                metallicRoughnessMap: {
                    path: "assets/textures/meetman_body_metallic_roughness.jpg",
                    flipY: true
                } 
            },
            transform: {
                scale: {x: 100, y: 100, z: 100}
            }
        }
    ]
}