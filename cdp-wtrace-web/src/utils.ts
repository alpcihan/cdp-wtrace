import * as wt from "wtrace"
import { SceneData } from "./types";
import * as THREE from "three"

export async function createDefaultCubeScene(): Promise<wt.Scene> {
    // create empty scene
    let scene: wt.Scene = new wt.Scene();

    // load the default cube mesh
    let mesh: wt.Mesh | undefined = await wt.MeshLoader.load("assets/models/cube.obj");
    if (mesh === undefined) return scene;

    // load the default texture (currently, wtrace crashes if there is not at least one texture)
    let material: wt.Material = new wt.Material();
    material.albedoMap = await wt.TextureLoader.load("assets/textures/default.jpg");

    let model: wt.MeshModel = new wt.MeshModel(mesh, material);

    scene.add(model);

    return scene;
}

const meshPathToMeshMap: Map<string, wt.Mesh> = new Map<string, wt.Mesh>();             // temporary workaround to cache already loaded meshes
const texturePathToTextureMap: Map<string, wt.Texture> = new Map<string, wt.Texture>(); // temporary workaround to cache already loaded textures

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
            return;

        // load the mesh
        let mesh: wt.Mesh | undefined = meshPathToMeshMap.get(meshPath);
        if (mesh == undefined) {
            mesh = await wt.MeshLoader.load(meshPath);
            if (mesh == undefined) {
                return;
            }
            meshPathToMeshMap.set(meshPath, mesh);
        }

        // create the material
        let material: wt.Material = new wt.Material();
        if (meshModelData.materialData) {

            // try to load albedo map
            if (meshModelData.materialData.albedoMap) {

                let texture: wt.Texture | undefined = texturePathToTextureMap.get(meshModelData.materialData.albedoMap.path);
                if (texture === undefined) {
                    let flipY: boolean = meshModelData.materialData.albedoMap.flipY ? meshModelData.materialData.albedoMap.flipY : false;
                    texture = await wt.TextureLoader.load(meshModelData.materialData.albedoMap.path, flipY);
                    if (texture === undefined) {
                        return;
                    }
                    texturePathToTextureMap.set(meshModelData.materialData.albedoMap.path, texture)
                }

                material.albedoMap = texture;

            }

            // try to load metallic-roughness map
            if (meshModelData.materialData.metallicRoughnessMap) {
                let texture: wt.Texture | undefined = texturePathToTextureMap.get(meshModelData.materialData.metallicRoughnessMap.path);
                if (texture === undefined) {
                    let flipY: boolean = meshModelData.materialData.metallicRoughnessMap.flipY ? meshModelData.materialData.metallicRoughnessMap.flipY : false;
                    texture = await wt.TextureLoader.load(meshModelData.materialData.metallicRoughnessMap.path, flipY);
                    if (texture === undefined) {
                        return;
                    }
                    texturePathToTextureMap.set(meshModelData.materialData.metallicRoughnessMap.path, texture)
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