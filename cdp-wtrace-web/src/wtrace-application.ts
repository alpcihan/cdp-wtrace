import * as wt from "wtrace";
import * as THREE from "three";

export default class WtraceApplication {
    private static s_instance: WtraceApplication | null = null;
    private constructor() {}

    public set scene(scene: wt.Scene) {
        this.m_scene = scene;
        this.m_newSceneAdded = true;
    }

    public static get(): WtraceApplication {
        if (!WtraceApplication.s_instance) WtraceApplication.s_instance = new WtraceApplication();
        return WtraceApplication.s_instance;
    }

    public async run(canvasElementId: string): Promise<void> {
        await this._init(canvasElementId);

        const animate = (): void => {
            requestAnimationFrame(animate);
            
            // skip the current frame rendering if the scene is not set yet
            if(!this.scene) {
                return;
            }

            if(this.m_newSceneAdded) {
                wt.SceneManager.loadScene(this.m_scene);
                this.m_newSceneAdded = false;
            }

            if(this.m_cameraController.update(wt.Application.deltaTime)) {
                wt.Application.refresh();
            }

            wt.Application.onNextFrame();
        };

        animate();    
    }

    private m_scene: wt.Scene;
    private m_newSceneAdded: boolean = true;

    private m_cameraController: wt.CameraController;

    private async _init(canvasElementId: string): Promise<void> {
        // get the target canvas
        const canvas: HTMLCanvasElement = document.getElementById(canvasElementId) as HTMLCanvasElement;

        // init the application
        await wt.Application.init(canvas);

        // create camera and camera controller
        let camera: THREE.Camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.01, 1000);
        this.m_cameraController = new wt.CameraController({ camera: camera });
    }
    
}