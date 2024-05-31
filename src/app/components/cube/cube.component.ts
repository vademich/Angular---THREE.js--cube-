import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'app-cube',
    standalone: true,
    imports: [],
    templateUrl: './cube.component.html',
    styleUrl: './cube.component.scss'
})
export class CubeComponent implements AfterViewInit {
    // 
    showHideCube = 'Скрыть';
    showHideSphere = 'Скрыть';

    public switchVisibilityCube() {
        if (this.showHideCube == 'Показать') {
            this.showHideCube = 'Скрыть';
            this.scene.add(this.cube);
        } else {
            this.showHideCube = 'Показать';
            this.scene.remove(this.cube);
        }
    }
    public switchVisibilitySphere() {
        if (this.showHideSphere == 'Показать') {
            this.showHideSphere = 'Скрыть';
            this.scene.add(this.sphere);
        } else {
            this.showHideSphere = 'Показать';
            this.scene.remove(this.sphere);
        }
    }
    // 
    @ViewChild('canvas')
    private canvasRef!: ElementRef;

    //* Cube Properties
    @Input() public rotationSpeedX: number = 0.05;
    @Input() public rotationSpeedY: number = 0.01;
    @Input() public size: number = 200;
    @Input() public texture: string = '../../assets/texture.jpg';

    //* Stage Properties
    @Input() public cameraZ: number = 400;
    @Input() public fieldOfView: number = 1;
    @Input('nearClipping') public nearClippingPlane: number = 1;
    @Input('farClipping') public farClippingPlane: number = 1000;

    //* Helper Properties
    private camera!: THREE.PerspectiveCamera;
    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }
    private loader = new THREE.TextureLoader();
    private geometry = new THREE.BoxGeometry(1, 1, 1);
    private material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) });
    private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material);
    private renderer!: THREE.WebGLRenderer;
    private scene!: THREE.Scene;
    // Sphere
    private spheregeometry = new THREE.SphereGeometry(0.7);
    private sphere: THREE.Mesh = new THREE.Mesh(this.spheregeometry, this.material);

    /**
     * Create the scene
     * 
     * @private
     * @memberof CubeComponent
     */
    private createScene() {

        //* Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.add(this.cube);
        this.cube.position.x = -1;
        // Add sphere
        this.scene.add(this.sphere);
        this.sphere.position.x = 1;

        //* Camera
        let aspectRatio = this.getAspectRatio();
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPlane,
            this.farClippingPlane
        )
        this.camera.position.z = this.cameraZ;
    }

    private getAspectRatio() {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    /**
     * Animate the cube
     * 
     * @private
     * @memberof CubeComponent
     */
    private animateCube() {
        this.cube.rotation.x += this.rotationSpeedX;
        this.cube.rotation.y += this.rotationSpeedY;
    }
    private animateSphere() {
        // this.sphere.rotation.x += this.rotationSpeedX;
        this.sphere.rotation.y -= this.rotationSpeedY * 3;
    }

    /**
     * Start the rendering loop
     * 
     * @private
     * @memberof CubeComponent
     */
    private startRenderingLoop() {
        //* Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

        let component: CubeComponent = this;
        (function render() {
            requestAnimationFrame(render);
            component.animateCube();
            component.animateSphere();
            component.renderer.render(component.scene, component.camera);
        }());
    }

    ngAfterViewInit() {
        this.createScene();
        this.startRenderingLoop();
    }
}
