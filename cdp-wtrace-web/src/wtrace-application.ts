import * as wt from "wtrace";
import * as THREE from "three";
import { Message, Object, PreloadedModelInfo } from "./types";

const defaultMaterial: wt.Material = new wt.Material();

export default class WtraceApplication {
    private static s_instance: WtraceApplication | null = null;
    private constructor() { }

    public static get(): WtraceApplication {
        if (!WtraceApplication.s_instance) WtraceApplication.s_instance = new WtraceApplication();
        return WtraceApplication.s_instance;
    }

    public async run(canvasElementId: string): Promise<void> {
        await this._init(canvasElementId);

        const animate = (): void => {
            requestAnimationFrame(animate);

            // skip the current frame rendering if the scene is not set yet
            if (!wt.SceneManager.scene && !this.m_loadNewScene) {
                return;
            }

            // handle new scene
            if (this.m_loadNewScene) {
                this._loadNewSceneFromCurrentMessage();
            }

            // camera controller update
            if (this.m_cameraController.update(wt.Application.deltaTime)) {
                wt.Application.refresh();
            }

            // on next frame
            wt.Application.onNextFrame();
        };

        animate();
    }

    public async preLoadModels(modelInfos: PreloadedModelInfo[]) {
        console.log("Pre-loading meshes...")

        for (const modelInfo of modelInfos) {

            if (!modelInfo.path.endsWith(".obj"))  continue;

            let mesh: wt.Mesh | undefined = await wt.MeshLoader.load(modelInfo.path);
            if (!mesh) continue;
            
            // load material
            let material: wt.Material | undefined; 
            if(modelInfo.material) {
                material = new wt.Material();
                
                if(modelInfo.material.baseMapName) {
                    console.log(modelInfo.material.baseMapName);
                    let tex = await wt.TextureLoader.load(modelInfo.material.baseMapName);
                    material.albedoMap = tex;
                } 

                if(modelInfo.material.metallicRoughnessMapName) {
                    console.log(modelInfo.material.metallicRoughnessMapName);
                    let tex = await wt.TextureLoader.load(modelInfo.material.metallicRoughnessMapName);
                    material.metallicMap = tex;
                }
            }
            
            let model: wt.MeshModel = new wt.MeshModel(mesh, material ? material : defaultMaterial);

            this.m_preloadedMeshMap.set(modelInfo.path, model);

            console.log(`Pre-loaded model: ${modelInfo.path}`)
        }

    }

    // store new scene message and set the load new scene flag to true
    public processNewSceneMessage(message: Message) {
        console.log("New scene request received.");

        this.m_newSceneMessage = message;
        this.m_loadNewScene = true;
    }

    private m_newSceneMessage: Message;
    private m_loadNewScene: boolean = false;

    private m_camera: THREE.PerspectiveCamera;
    private m_cameraController: wt.CameraController;

    private m_preloadedMeshMap: Map<string, wt.MeshModel> = new Map<string, wt.MeshModel>();    // model path to mesh model

    private async _init(canvasElementId: string): Promise<void> {
        // get the target canvas
        const canvas: HTMLCanvasElement = document.getElementById(canvasElementId) as HTMLCanvasElement;

        // init the application
        await wt.Application.init(canvas);

        // create camera and camera controller
        this.m_camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.01, 1000);
        this.m_cameraController = new wt.CameraController({ camera: this.m_camera });
    }

    private _loadNewSceneFromCurrentMessage() {
        const objects: Object[] = this.m_newSceneMessage.objects;

        let scene: wt.Scene = new wt.Scene();

        objects.forEach(object => {
            // get model
            let model = this.m_preloadedMeshMap.get(object.modelName);
            if (!model) return;

            // set position
            if (object.transform.position) {
                let p = object.transform.position;
                model.position = new THREE.Vector3(p.x, p.y, p.z);
            }

            // set rotation
            if (object.transform.eulerAngles) {
                let r = object.transform.eulerAngles;
                model.euler = new THREE.Euler(r.x, r.y, r.z);
            }

            // set scale
            if (object.transform.scale) {
                let s = object.transform.scale;
                model.scale = new THREE.Vector3(s.x, s.y, s.z);
            }

            scene.add(model);
        });

        scene.camera = this.m_camera;

        wt.SceneManager.loadScene(scene);
        this.m_loadNewScene = false;

        console.log("New scene loaded.")
    }

}