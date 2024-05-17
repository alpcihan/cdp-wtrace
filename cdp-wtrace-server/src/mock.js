// see cdp-wtrace-web/src/types.ts for the data formats

// create an astronaut with head and body
let data = {
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
                position: { x: 0, y: 0, z: 0 },
                scale: { x: 100, y: 100, z: 100 },
                eulerAngles: { x: 0, y: 0, z: 0 }
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
                position: { x: 0, y: 0, z: 0 },
                scale: { x: 100, y: 100, z: 100 },
                eulerAngles: { x: 0, y: 0, z: 0 }
            }
        }
    ]
}

module.exports = {
    data
}