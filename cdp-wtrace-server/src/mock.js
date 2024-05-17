// see cdp-wtrace-web/src/types.ts for the data formats

// create 20 astronauts with random positions and rotations
function getMockData() {
    function rand(max) { return Math.floor(Math.random() * max);}

    let rs = 100;
    let data = { meshModelsData: [] };

    for (let i = 0; i < 20; i++) {
        let randX = rand(rs);
        let randY = rand(rs);
        let randRot = rand(rs);

        data.meshModelsData.push(
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
                    position: { x: randX, y: 0, z: randY },
                    scale: { x: 100, y: 100, z: 100 },
                    eulerAngles: {x: 0, y: randRot, z: 0}
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
                    position: { x: randX, y: 0, z: randY },
                    scale: { x: 100, y: 100, z: 100 },
                    eulerAngles: {x: 0, y: 0, z: 0}
                }
            }
        )
    }

    return data;
}

module.exports = {
    getMockData
}