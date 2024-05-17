import * as wt from "wtrace"
import { SceneData } from "./types";
import * as THREE from "three"

export let loadNewSceneFlag: boolean = false;

let latestRequestedSceneData: SceneData;

export function processCDPMessage_NewScene(sceneData: SceneData): void {
    latestRequestedSceneData = sceneData;
    loadNewSceneFlag = true;
}

export async function loadLatestRequestedScene(camera: THREE.Camera): Promise<void> {
    // set load new scene flag false
    loadNewSceneFlag = false;

    // init scene
    let scene: wt.Scene = new wt.Scene();

    for (const meshModelData of latestRequestedSceneData.meshModelsData) {
        let meshPath: string = meshModelData.meshPath;

        // currently only support obj
        if (!meshPath.endsWith('.obj'))
            continue;

        // load the mesh
        let mesh: wt.Mesh | undefined = await wt.MeshLoader.load(meshPath);
        if (mesh == undefined) {
            continue;
        }

        // create the material
        let material: wt.Material = new wt.Material();
        if (meshModelData.materialData) {

            // try to load albedo map
            if (meshModelData.materialData.albedoMap) {
                let flipY: boolean = meshModelData.materialData.albedoMap.flipY ? meshModelData.materialData.albedoMap.flipY : false;
                let texture: wt.Texture | undefined = await wt.TextureLoader.load(meshModelData.materialData.albedoMap.path, flipY);

                if (texture === undefined) {
                    continue;
                }

                material.albedoMap = texture;
            }

            // try to load metallic-roughness map
            if (meshModelData.materialData.metallicRoughnessMap) {
                let flipY: boolean = meshModelData.materialData.metallicRoughnessMap.flipY ? meshModelData.materialData.metallicRoughnessMap.flipY : false;
                let texture: wt.Texture | undefined = await wt.TextureLoader.load(meshModelData.materialData.metallicRoughnessMap.path, flipY);

                if (texture === undefined) {
                    continue;
                }

                material.metallicMap = texture;
            }

        }

        // create mesh model
        let meshModel: wt.MeshModel = new wt.MeshModel(mesh, material);

        // set transform
        if (meshModelData.transform) {

            // position
            if (meshModelData.transform.position) {
                let p = meshModelData.transform.position;
                meshModel.position = new THREE.Vector3(p.x, p.y, p.z);
            }

            // euler angles
            if (meshModelData.transform.eulerAngles) {
                let e = meshModelData.transform.eulerAngles;
                meshModel.euler = new THREE.Euler(e.x, e.y, e.z);
            }

            // scale
            if (meshModelData.transform.scale) {
                let s = meshModelData.transform.scale;
                meshModel.scale = new THREE.Vector3(s.x, s.y, s.z);
            }

        }

        // add mesh model to the scene
        scene.add(meshModel);
    }

    // set the scene camera
    scene.camera = camera;

    // load the created scene
    wt.SceneManager.loadScene(scene);
}

export async function createDefaultScene(meshPath: string, camera: THREE.Camera): Promise<wt.Scene> {
    // create empty scene
    let scene: wt.Scene = new wt.Scene();
    scene.camera = camera;

    // load the default cube mesh
    let mesh: wt.Mesh | undefined = await wt.MeshLoader.load(meshPath);
    if (mesh === undefined) return scene;

    // load the default texture (currently, wtrace crashes if there is not at least one texture)
    let material: wt.Material = new wt.Material();
    material.albedoMap = await wt.TextureLoader.load("assets/textures/default.jpg"); // 1024x1024 white texture

    let model: wt.MeshModel = new wt.MeshModel(mesh, material);

    scene.add(model);

    return scene;
}