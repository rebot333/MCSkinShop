import React, { Component } from "react";
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import steve from "./assets/steve.png";
import alex from "./assets/alex.png";

class App extends Component {
    constructor(props) {
        super(props);

        this.slim = props.slim || false;
        this.skin = props.skin || steve;
        if (this.skin === steve) this.skin = this.slim ? alex : steve;
        this.anim = props.anim == null ? true : props.anim;

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.sceneSetup();
        this.textureSetup();
        this.modelSetup();
        this.addPartsToScene();
        this.startAnimationLoop();
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
        window.cancelAnimationFrame(this.requestID);
        this.controls.dispose();
    }

    componentDidUpdate(prevProps) {
        if (this.props.slim !== prevProps.slim) {
            this.slim = this.props.slim || false;
            this.updateSlim();
        }

        this.skin = this.props.skin || this.steve;
        if (this.skin === steve) this.skin = this.slim ? alex : steve;

        this.textureSetup();

        this.anim = this.props.anim == null ? true : this.props.anim;
    }

    // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
    // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
    sceneSetup = () => {
        // get container dimensions and use them for scene sizing
        const width = this.canvasRef.current.clientWidth;
        const height = this.canvasRef.current.clientHeight;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvasRef.current,
            alpha: true
        });
        this.renderer.setSize(width, height);

        this.camera = new THREE.PerspectiveCamera(
            80, // fov = field of view
            width / height, // aspect ratio
            0.1, // near plane
            1000 // far plane
        );
        this.camera.position.set(0, 18, 40);

        this.controls = new OrbitControls(this.camera, this.canvasRef.current);
        this.controls.target.set(0, 18, 0);
        this.controls.update();
    };

    textureSetup = () => {
        if (typeof this.textureLoader === "undefined")
            this.textureLoader = new THREE.TextureLoader();

        if (typeof this.material === "undefined")
            this.material = new THREE.MeshMatcapMaterial({ flatShading: true });
        const material = this.material;

        if (typeof this.hatMaterial === "undefined")
            this.hatMaterial = new THREE.MeshMatcapMaterial({
                side: THREE.DoubleSide,
                transparent: true,
                flatShading: true,
                clipIntersection: true
            });
        const hatMaterial = this.hatMaterial;

        this.textureLoader.load(this.skin, (texture) => {
            texture.magFilter = THREE.NearestFilter;
            material.map = texture;
            material.needsUpdate = true;
            hatMaterial.map = texture;
            hatMaterial.needsUpdate = true;
        });
    }

    modelSetup = () => {

        ///////////////////////////////
        //                           //
        //                           //
        //      uv shit below:       //
        //                           //
        //                           //
        ///////////////////////////////

        this.headGeometry = new THREE.BoxGeometry(8, 8, 8);
        let uvAttribute = this.headGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 1 / 4, 7 / 8); //Left
        uvAttribute.setXY(1, 3 / 8, 7 / 8);
        uvAttribute.setXY(2, 1 / 4, 3 / 4);
        uvAttribute.setXY(3, 3 / 8, 3 / 4);

        uvAttribute.setXY(4, 0, 7 / 8); //Right
        uvAttribute.setXY(5, 1 / 8, 7 / 8);
        uvAttribute.setXY(6, 0, 3 / 4);
        uvAttribute.setXY(7, 1 / 8, 3 / 4);

        uvAttribute.setXY(8, 1 / 8, 1); //Top
        uvAttribute.setXY(9, 1 / 4, 1);
        uvAttribute.setXY(10, 1 / 8, 7 / 8);
        uvAttribute.setXY(11, 1 / 4, 7 / 8);

        uvAttribute.setXY(12, 1 / 4, 7 / 8); //Bottom
        uvAttribute.setXY(13, 3 / 8, 7 / 8);
        uvAttribute.setXY(14, 1 / 4, 1);
        uvAttribute.setXY(15, 3 / 8, 1);

        uvAttribute.setXY(16, 1 / 8, 7 / 8); //Front
        uvAttribute.setXY(17, 1 / 4, 7 / 8);
        uvAttribute.setXY(18, 1 / 8, 3 / 4);
        uvAttribute.setXY(19, 1 / 4, 3 / 4);

        uvAttribute.setXY(20, 3 / 8, 7 / 8); //Back
        uvAttribute.setXY(21, 1 / 2, 7 / 8);
        uvAttribute.setXY(22, 3 / 8, 3 / 4);
        uvAttribute.setXY(23, 1 / 2, 3 / 4);

        this.headHatGeometry = new THREE.BoxGeometry(9, 9, 9);
        uvAttribute = this.headHatGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 3 / 4, 7 / 8); //Left
        uvAttribute.setXY(1, 7 / 8, 7 / 8);
        uvAttribute.setXY(2, 3 / 4, 3 / 4);
        uvAttribute.setXY(3, 7 / 8, 3 / 4);

        uvAttribute.setXY(4, 1 / 2, 7 / 8); //Right
        uvAttribute.setXY(5, 5 / 8, 7 / 8);
        uvAttribute.setXY(6, 1 / 2, 3 / 4);
        uvAttribute.setXY(7, 5 / 8, 3 / 4);

        uvAttribute.setXY(8, 5 / 8, 1); //Top
        uvAttribute.setXY(9, 3 / 4, 1);
        uvAttribute.setXY(10, 5 / 8, 7 / 8);
        uvAttribute.setXY(11, 3 / 4, 7 / 8);

        uvAttribute.setXY(12, 3 / 4, 7 / 8); //Bottom
        uvAttribute.setXY(13, 7 / 8, 7 / 8);
        uvAttribute.setXY(14, 3 / 4, 1);
        uvAttribute.setXY(15, 7 / 8, 1);

        uvAttribute.setXY(16, 5 / 8, 7 / 8); //Front
        uvAttribute.setXY(17, 3 / 4, 7 / 8);
        uvAttribute.setXY(18, 5 / 8, 3 / 4);
        uvAttribute.setXY(19, 3 / 4, 3 / 4);

        uvAttribute.setXY(20, 7 / 8, 7 / 8); //Back
        uvAttribute.setXY(21, 1, 7 / 8);
        uvAttribute.setXY(22, 7 / 8, 3 / 4);
        uvAttribute.setXY(23, 1, 3 / 4);

        this.torsoGeometry = new THREE.BoxGeometry(8, 12, 4);
        uvAttribute = this.torsoGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 7 / 16, 11 / 16); //Left
        uvAttribute.setXY(1, 1 / 2, 11 / 16);
        uvAttribute.setXY(2, 7 / 16, 1 / 2);
        uvAttribute.setXY(3, 1 / 2, 1 / 2);

        uvAttribute.setXY(4, 1 / 4, 11 / 16); //Right
        uvAttribute.setXY(5, 5 / 16, 11 / 16);
        uvAttribute.setXY(6, 1 / 4, 1 / 2);
        uvAttribute.setXY(7, 5 / 16, 1 / 2);

        uvAttribute.setXY(8, 5 / 16, 3 / 4); //Top
        uvAttribute.setXY(9, 7 / 16, 3 / 4);
        uvAttribute.setXY(10, 5 / 16, 11 / 16);
        uvAttribute.setXY(11, 7 / 16, 11 / 16);

        uvAttribute.setXY(12, 7 / 16, 11 / 16); //Bottom
        uvAttribute.setXY(13, 9 / 16, 11 / 16);
        uvAttribute.setXY(14, 7 / 16, 3 / 4);
        uvAttribute.setXY(15, 9 / 16, 3 / 4);

        uvAttribute.setXY(16, 5 / 16, 11 / 16); //Front
        uvAttribute.setXY(17, 7 / 16, 11 / 16);
        uvAttribute.setXY(18, 5 / 16, 1 / 2);
        uvAttribute.setXY(19, 7 / 16, 1 / 2);

        uvAttribute.setXY(20, 1 / 2, 11 / 16); //Back
        uvAttribute.setXY(21, 5 / 8, 11 / 16);
        uvAttribute.setXY(22, 1 / 2, 1 / 2);
        uvAttribute.setXY(23, 5 / 8, 1 / 2);

        this.torsoHatGeometry = new THREE.BoxGeometry(8.5, 12.5, 4.5);
        uvAttribute = this.torsoHatGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 7 / 16, 7 / 16); //Left
        uvAttribute.setXY(1, 1 / 2, 7 / 16);
        uvAttribute.setXY(2, 7 / 16, 1 / 4);
        uvAttribute.setXY(3, 1 / 2, 1 / 4);

        uvAttribute.setXY(4, 1 / 4, 7 / 16); //Right
        uvAttribute.setXY(5, 5 / 16, 7 / 16);
        uvAttribute.setXY(6, 1 / 4, 1 / 4);
        uvAttribute.setXY(7, 5 / 16, 1 / 4);

        uvAttribute.setXY(8, 5 / 16, 1 / 2); //Top
        uvAttribute.setXY(9, 7 / 16, 1 / 2);
        uvAttribute.setXY(10, 5 / 16, 7 / 16);
        uvAttribute.setXY(11, 7 / 16, 7 / 16);

        uvAttribute.setXY(12, 7 / 16, 7 / 16); //Bottom
        uvAttribute.setXY(13, 9 / 16, 7 / 16);
        uvAttribute.setXY(14, 7 / 16, 1 / 2);
        uvAttribute.setXY(15, 9 / 16, 1 / 2);

        uvAttribute.setXY(16, 5 / 16, 7 / 16); //Front
        uvAttribute.setXY(17, 7 / 16, 7 / 16);
        uvAttribute.setXY(18, 5 / 16, 1 / 4);
        uvAttribute.setXY(19, 7 / 16, 1 / 4);

        uvAttribute.setXY(20, 1 / 2, 7 / 16); //Back
        uvAttribute.setXY(21, 5 / 8, 7 / 16);
        uvAttribute.setXY(22, 1 / 2, 1 / 4);
        uvAttribute.setXY(23, 5 / 8, 1 / 4);

        this.leftLegGeometry = new THREE.BoxGeometry(4, 12, 4);
        uvAttribute = this.leftLegGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 3 / 8, 3 / 16); //Left
        uvAttribute.setXY(1, 7 / 16, 3 / 16);
        uvAttribute.setXY(2, 3 / 8, 0);
        uvAttribute.setXY(3, 7 / 16, 0);

        uvAttribute.setXY(4, 1 / 4, 3 / 16); //Right
        uvAttribute.setXY(5, 5 / 16, 3 / 16);
        uvAttribute.setXY(6, 1 / 4, 0);
        uvAttribute.setXY(7, 5 / 16, 0);

        uvAttribute.setXY(8, 5 / 16, 1 / 4); //Top
        uvAttribute.setXY(9, 3 / 8, 1 / 4);
        uvAttribute.setXY(10, 5 / 16, 3 / 16);
        uvAttribute.setXY(11, 3 / 8, 3 / 16);

        uvAttribute.setXY(12, 3 / 8, 3 / 16); //Bottom
        uvAttribute.setXY(13, 7 / 16, 3 / 16);
        uvAttribute.setXY(14, 3 / 8, 1 / 4);
        uvAttribute.setXY(15, 7 / 16, 1 / 4);

        uvAttribute.setXY(16, 5 / 16, 3 / 16); //Front
        uvAttribute.setXY(17, 3 / 8, 3 / 16);
        uvAttribute.setXY(18, 5 / 16, 0);
        uvAttribute.setXY(19, 3 / 8, 0);

        uvAttribute.setXY(20, 7 / 16, 3 / 16); //Back
        uvAttribute.setXY(21, 1 / 2, 3 / 16);
        uvAttribute.setXY(22, 7 / 16, 0);
        uvAttribute.setXY(23, 1 / 2, 0);

        this.leftLegHatGeometry = new THREE.BoxGeometry(4.5, 12.5, 4.5);
        uvAttribute = this.leftLegHatGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 1 / 8, 3 / 16); //Left
        uvAttribute.setXY(1, 3 / 16, 3 / 16);
        uvAttribute.setXY(2, 1 / 8, 0);
        uvAttribute.setXY(3, 3 / 16, 0);

        uvAttribute.setXY(4, 0, 3 / 16); //Right
        uvAttribute.setXY(5, 1 / 16, 3 / 16);
        uvAttribute.setXY(6, 0, 0);
        uvAttribute.setXY(7, 1 / 16, 0);

        uvAttribute.setXY(8, 1 / 16, 1 / 4); //Top
        uvAttribute.setXY(9, 1 / 8, 1 / 4);
        uvAttribute.setXY(10, 1 / 16, 3 / 16);
        uvAttribute.setXY(11, 1 / 8, 3 / 16);

        uvAttribute.setXY(12, 1 / 8, 3 / 16); //Bottom
        uvAttribute.setXY(13, 3 / 16, 3 / 16);
        uvAttribute.setXY(14, 1 / 8, 1 / 4);
        uvAttribute.setXY(15, 3 / 16, 1 / 4);

        uvAttribute.setXY(16, 1 / 16, 3 / 16); //Front
        uvAttribute.setXY(17, 1 / 8, 3 / 16);
        uvAttribute.setXY(18, 1 / 16, 0);
        uvAttribute.setXY(19, 1 / 8, 0);

        uvAttribute.setXY(20, 3 / 16, 3 / 16); //Back
        uvAttribute.setXY(21, 1 / 4, 3 / 16);
        uvAttribute.setXY(22, 3 / 16, 0);
        uvAttribute.setXY(23, 1 / 4, 0);

        this.rightLegGeometry = new THREE.BoxGeometry(4, 12, 4);
        uvAttribute = this.rightLegGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 1 / 8, 11 / 16); //Left
        uvAttribute.setXY(1, 3 / 16, 11 / 16);
        uvAttribute.setXY(2, 1 / 8, 1 / 2);
        uvAttribute.setXY(3, 3 / 16, 1 / 2);

        uvAttribute.setXY(4, 0, 11 / 16); //Right
        uvAttribute.setXY(5, 1 / 16, 11 / 16);
        uvAttribute.setXY(6, 0, 1 / 2);
        uvAttribute.setXY(7, 1 / 16, 1 / 2);

        uvAttribute.setXY(8, 1 / 16, 3 / 4); //Top
        uvAttribute.setXY(9, 1 / 8, 3 / 4);
        uvAttribute.setXY(10, 1 / 16, 11 / 16);
        uvAttribute.setXY(11, 1 / 8, 11 / 16);

        uvAttribute.setXY(12, 1 / 8, 11 / 16); //Bottom
        uvAttribute.setXY(13, 3 / 16, 11 / 16);
        uvAttribute.setXY(14, 1 / 8, 3 / 4);
        uvAttribute.setXY(15, 3 / 16, 3 / 4);

        uvAttribute.setXY(16, 1 / 16, 11 / 16); //Front
        uvAttribute.setXY(17, 1 / 8, 11 / 16);
        uvAttribute.setXY(18, 1 / 16, 1 / 2);
        uvAttribute.setXY(19, 1 / 8, 1 / 2);

        uvAttribute.setXY(20, 3 / 16, 11 / 16); //Back
        uvAttribute.setXY(21, 2 / 8, 11 / 16);
        uvAttribute.setXY(22, 3 / 16, 1 / 2);
        uvAttribute.setXY(23, 2 / 8, 1 / 2);

        this.rightLegHatGeometry = new THREE.BoxGeometry(4.5, 12.5, 4.5);
        uvAttribute = this.rightLegHatGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 1 / 8, 7 / 16); //Left
        uvAttribute.setXY(1, 3 / 16, 7 / 16);
        uvAttribute.setXY(2, 1 / 8, 1 / 4);
        uvAttribute.setXY(3, 3 / 16, 1 / 4);

        uvAttribute.setXY(4, 0, 7 / 16); //Right
        uvAttribute.setXY(5, 1 / 16, 7 / 16);
        uvAttribute.setXY(6, 0, 1 / 4);
        uvAttribute.setXY(7, 1 / 16, 1 / 4);

        uvAttribute.setXY(8, 1 / 16, 1 / 2); //Top
        uvAttribute.setXY(9, 1 / 8, 1 / 2);
        uvAttribute.setXY(10, 1 / 16, 7 / 16);
        uvAttribute.setXY(11, 1 / 8, 7 / 16);

        uvAttribute.setXY(12, 1 / 8, 7 / 16); //Bottom
        uvAttribute.setXY(13, 3 / 16, 7 / 16);
        uvAttribute.setXY(14, 1 / 8, 1 / 2);
        uvAttribute.setXY(15, 3 / 16, 1 / 2);

        uvAttribute.setXY(16, 1 / 16, 7 / 16); //Front
        uvAttribute.setXY(17, 1 / 8, 7 / 16);
        uvAttribute.setXY(18, 1 / 16, 1 / 4);
        uvAttribute.setXY(19, 1 / 8, 1 / 4);

        uvAttribute.setXY(20, 3 / 16, 7 / 16); //Back
        uvAttribute.setXY(21, 2 / 8, 7 / 16);
        uvAttribute.setXY(22, 3 / 16, 1 / 4);
        uvAttribute.setXY(23, 2 / 8, 1 / 4);

        this.leftArmGeometry = new THREE.BoxGeometry(4, 12, 4);
        uvAttribute = this.leftArmGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 5 / 8, 3 / 16); //Left
        uvAttribute.setXY(1, 11 / 16, 3 / 16);
        uvAttribute.setXY(2, 5 / 8, 0);
        uvAttribute.setXY(3, 11 / 16, 0);

        uvAttribute.setXY(4, 1 / 2, 3 / 16); //Right
        uvAttribute.setXY(5, 9 / 16, 3 / 16);
        uvAttribute.setXY(6, 1 / 2, 0);
        uvAttribute.setXY(7, 9 / 16, 0);

        uvAttribute.setXY(8, 9 / 16, 1 / 4); //Top
        uvAttribute.setXY(9, 5 / 8, 1 / 4);
        uvAttribute.setXY(10, 9 / 16, 3 / 16);
        uvAttribute.setXY(11, 5 / 8, 3 / 16);

        uvAttribute.setXY(12, 5 / 8, 3 / 16); //Bottom
        uvAttribute.setXY(13, 11 / 16, 3 / 16);
        uvAttribute.setXY(14, 5 / 8, 1 / 4);
        uvAttribute.setXY(15, 11 / 16, 1 / 4);

        uvAttribute.setXY(16, 9 / 16, 3 / 16); //Front
        uvAttribute.setXY(17, 5 / 8, 3 / 16);
        uvAttribute.setXY(18, 9 / 16, 0);
        uvAttribute.setXY(19, 5 / 8, 0);

        uvAttribute.setXY(20, 11 / 16, 3 / 16); //Back
        uvAttribute.setXY(21, 3 / 4, 3 / 16);
        uvAttribute.setXY(22, 11 / 16, 0);
        uvAttribute.setXY(23, 3 / 4, 0);

        this.leftArmHatGeometry = new THREE.BoxGeometry(4.5, 12.5, 4.5);
        uvAttribute = this.leftArmHatGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 7 / 8, 3 / 16); //Left
        uvAttribute.setXY(1, 15 / 16, 3 / 16);
        uvAttribute.setXY(2, 7 / 8, 0);
        uvAttribute.setXY(3, 15 / 16, 0);

        uvAttribute.setXY(4, 3 / 4, 3 / 16); //Right
        uvAttribute.setXY(5, 13 / 16, 3 / 16);
        uvAttribute.setXY(6, 3 / 4, 0);
        uvAttribute.setXY(7, 13 / 16, 0);

        uvAttribute.setXY(8, 13 / 16, 1 / 4); //Top
        uvAttribute.setXY(9, 7 / 8, 1 / 4);
        uvAttribute.setXY(10, 13 / 16, 3 / 16);
        uvAttribute.setXY(11, 7 / 8, 3 / 16);

        uvAttribute.setXY(12, 7 / 8, 3 / 16); //Bottom
        uvAttribute.setXY(13, 15 / 16, 3 / 16);
        uvAttribute.setXY(14, 7 / 8, 1 / 4);
        uvAttribute.setXY(15, 15 / 16, 1 / 4);

        uvAttribute.setXY(16, 13 / 16, 3 / 16); //Front
        uvAttribute.setXY(17, 7 / 8, 3 / 16);
        uvAttribute.setXY(18, 13 / 16, 0);
        uvAttribute.setXY(19, 7 / 8, 0);

        uvAttribute.setXY(20, 15 / 16, 3 / 16); //Back
        uvAttribute.setXY(21, 1, 3 / 16);
        uvAttribute.setXY(22, 15 / 16, 0);
        uvAttribute.setXY(23, 1, 0);

        this.rightArmGeometry = new THREE.BoxGeometry(4, 12, 4);
        uvAttribute = this.rightArmGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 3 / 4, 11 / 16); //Left
        uvAttribute.setXY(1, 13 / 16, 11 / 16);
        uvAttribute.setXY(2, 3 / 4, 1 / 2);
        uvAttribute.setXY(3, 13 / 16, 1 / 2);

        uvAttribute.setXY(4, 5 / 8, 11 / 16); //Right
        uvAttribute.setXY(5, 11 / 16, 11 / 16);
        uvAttribute.setXY(6, 5 / 8, 1 / 2);
        uvAttribute.setXY(7, 11 / 16, 1 / 2);

        uvAttribute.setXY(8, 11 / 16, 3 / 4); //Top
        uvAttribute.setXY(9, 3 / 4, 3 / 4);
        uvAttribute.setXY(10, 11 / 16, 11 / 16);
        uvAttribute.setXY(11, 3 / 4, 11 / 16);

        uvAttribute.setXY(12, 3 / 4, 11 / 16); //Bottom
        uvAttribute.setXY(13, 13 / 16, 11 / 16);
        uvAttribute.setXY(14, 3 / 4, 3 / 4);
        uvAttribute.setXY(15, 13 / 16, 3 / 4);

        uvAttribute.setXY(16, 11 / 16, 11 / 16); //Front
        uvAttribute.setXY(17, 3 / 4, 11 / 16);
        uvAttribute.setXY(18, 11 / 16, 1 / 2);
        uvAttribute.setXY(19, 3 / 4, 1 / 2);

        uvAttribute.setXY(20, 13 / 16, 11 / 16); //Back
        uvAttribute.setXY(21, 7 / 8, 11 / 16);
        uvAttribute.setXY(22, 13 / 16, 1 / 2);
        uvAttribute.setXY(23, 7 / 8, 1 / 2);

        this.rightArmHatGeometry = new THREE.BoxGeometry(4.5, 12.5, 4.5);
        uvAttribute = this.rightArmHatGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 3 / 4, 7 / 16); //Left
        uvAttribute.setXY(1, 13 / 16, 7 / 16);
        uvAttribute.setXY(2, 3 / 4, 1 / 4);
        uvAttribute.setXY(3, 13 / 16, 1 / 4);

        uvAttribute.setXY(4, 5 / 8, 7 / 16); //Right
        uvAttribute.setXY(5, 11 / 16, 7 / 16);
        uvAttribute.setXY(6, 5 / 8, 1 / 4);
        uvAttribute.setXY(7, 11 / 16, 1 / 4);

        uvAttribute.setXY(8, 11 / 16, 1 / 2); //Top
        uvAttribute.setXY(9, 3 / 4, 1 / 2);
        uvAttribute.setXY(10, 11 / 16, 7 / 16);
        uvAttribute.setXY(11, 3 / 4, 7 / 16);

        uvAttribute.setXY(12, 3 / 4, 7 / 16); //Bottom
        uvAttribute.setXY(13, 13 / 16, 7 / 16);
        uvAttribute.setXY(14, 3 / 4, 1 / 2);
        uvAttribute.setXY(15, 13 / 16, 1 / 2);

        uvAttribute.setXY(16, 11 / 16, 7 / 16); //Front
        uvAttribute.setXY(17, 3 / 4, 7 / 16);
        uvAttribute.setXY(18, 11 / 16, 1 / 4);
        uvAttribute.setXY(19, 3 / 4, 1 / 4);

        uvAttribute.setXY(20, 13 / 16, 7 / 16); //Back
        uvAttribute.setXY(21, 7 / 8, 7 / 16);
        uvAttribute.setXY(22, 13 / 16, 1 / 4);
        uvAttribute.setXY(23, 7 / 8, 1 / 4);

        this.leftArmSlimGeometry = new THREE.BoxGeometry(3, 12, 4);
        uvAttribute = this.leftArmSlimGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 39 / 64, 3 / 16); //Left
        uvAttribute.setXY(1, 43 / 64, 3 / 16);
        uvAttribute.setXY(2, 39 / 64, 0);
        uvAttribute.setXY(3, 43 / 64, 0);

        uvAttribute.setXY(4, 1 / 2, 3 / 16); //Right
        uvAttribute.setXY(5, 9 / 16, 3 / 16);
        uvAttribute.setXY(6, 1 / 2, 0);
        uvAttribute.setXY(7, 9 / 16, 0);

        uvAttribute.setXY(8, 9 / 16, 1 / 4); //Top
        uvAttribute.setXY(9, 39 / 64, 1 / 4);
        uvAttribute.setXY(10, 9 / 16, 3 / 16);
        uvAttribute.setXY(11, 39 / 64, 3 / 16);

        uvAttribute.setXY(12, 39 / 64, 3 / 16); //Bottom
        uvAttribute.setXY(13, 21 / 32, 3 / 16);
        uvAttribute.setXY(14, 39 / 64, 1 / 4);
        uvAttribute.setXY(15, 21 / 32, 1 / 4);

        uvAttribute.setXY(16, 9 / 16, 3 / 16); //Front
        uvAttribute.setXY(17, 39 / 64, 3 / 16);
        uvAttribute.setXY(18, 9 / 16, 0);
        uvAttribute.setXY(19, 39 / 64, 0);

        uvAttribute.setXY(20, 43 / 64, 3 / 16); //Back
        uvAttribute.setXY(21, 23 / 32, 3 / 16);
        uvAttribute.setXY(22, 43 / 64, 0);
        uvAttribute.setXY(23, 23 / 32, 0);

        this.leftArmSlimHatGeometry = new THREE.BoxGeometry(3.5, 12.5, 4.5);
        uvAttribute = this.leftArmSlimHatGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 55 / 64, 3 / 16); //Left
        uvAttribute.setXY(1, 59 / 64, 3 / 16);
        uvAttribute.setXY(2, 55 / 64, 0);
        uvAttribute.setXY(3, 59 / 64, 0);

        uvAttribute.setXY(4, 3 / 4, 3 / 16); //Right
        uvAttribute.setXY(5, 13 / 16, 3 / 16);
        uvAttribute.setXY(6, 3 / 4, 0);
        uvAttribute.setXY(7, 13 / 16, 0);

        uvAttribute.setXY(8, 13 / 16, 1 / 4); //Top
        uvAttribute.setXY(9, 55 / 64, 1 / 4);
        uvAttribute.setXY(10, 13 / 16, 3 / 16);
        uvAttribute.setXY(11, 55 / 64, 3 / 16);

        uvAttribute.setXY(12, 55 / 64, 3 / 16); //Bottom
        uvAttribute.setXY(13, 29 / 32, 3 / 16);
        uvAttribute.setXY(14, 55 / 64, 1 / 4);
        uvAttribute.setXY(15, 29 / 32, 1 / 4);

        uvAttribute.setXY(16, 13 / 16, 3 / 16); //Front
        uvAttribute.setXY(17, 55 / 64, 3 / 16);
        uvAttribute.setXY(18, 13 / 16, 0);
        uvAttribute.setXY(19, 55 / 64, 0);

        uvAttribute.setXY(20, 59 / 64, 3 / 16); //Back
        uvAttribute.setXY(21, 31 / 32, 3 / 16);
        uvAttribute.setXY(22, 59 / 64, 0);
        uvAttribute.setXY(23, 31 / 32, 0);

        this.rightArmSlimGeometry = new THREE.BoxGeometry(3, 12, 4);
        uvAttribute = this.rightArmSlimGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 47 / 64, 11 / 16); //Left
        uvAttribute.setXY(1, 51 / 64, 11 / 16);
        uvAttribute.setXY(2, 47 / 64, 1 / 2);
        uvAttribute.setXY(3, 51 / 64, 1 / 2);

        uvAttribute.setXY(4, 5 / 8, 11 / 16); //Right
        uvAttribute.setXY(5, 11 / 16, 11 / 16);
        uvAttribute.setXY(6, 5 / 8, 1 / 2);
        uvAttribute.setXY(7, 11 / 16, 1 / 2);

        uvAttribute.setXY(8, 11 / 16, 3 / 4); //Top
        uvAttribute.setXY(9, 47 / 64, 3 / 4);
        uvAttribute.setXY(10, 11 / 16, 11 / 16);
        uvAttribute.setXY(11, 47 / 64, 11 / 16);

        uvAttribute.setXY(12, 47 / 64, 11 / 16); //Bottom
        uvAttribute.setXY(13, 25 / 32, 11 / 16);
        uvAttribute.setXY(14, 47 / 64, 3 / 4);
        uvAttribute.setXY(15, 25 / 32, 3 / 4);

        uvAttribute.setXY(16, 11 / 16, 11 / 16); //Front
        uvAttribute.setXY(17, 47 / 64, 11 / 16);
        uvAttribute.setXY(18, 11 / 16, 1 / 2);
        uvAttribute.setXY(19, 47 / 64, 1 / 2);

        uvAttribute.setXY(20, 51 / 64, 11 / 16); //Back
        uvAttribute.setXY(21, 27 / 32, 11 / 16);
        uvAttribute.setXY(22, 51 / 64, 1 / 2);
        uvAttribute.setXY(23, 27 / 32, 1 / 2);

        this.rightArmSlimHatGeometry = new THREE.BoxGeometry(3.5, 12.5, 4.5);
        uvAttribute = this.rightArmSlimHatGeometry.getAttribute("uv");

        uvAttribute.setXY(0, 47 / 64, 7 / 16); //Left
        uvAttribute.setXY(1, 51 / 64, 7 / 16);
        uvAttribute.setXY(2, 47 / 64, 1 / 4);
        uvAttribute.setXY(3, 51 / 64, 1 / 4);

        uvAttribute.setXY(4, 5 / 8, 7 / 16); //Right
        uvAttribute.setXY(5, 11 / 16, 7 / 16);
        uvAttribute.setXY(6, 5 / 8, 1 / 4);
        uvAttribute.setXY(7, 11 / 16, 1 / 4);

        uvAttribute.setXY(8, 11 / 16, 1 / 2); //Top
        uvAttribute.setXY(9, 47 / 64, 1 / 2);
        uvAttribute.setXY(10, 11 / 16, 7 / 16);
        uvAttribute.setXY(11, 47 / 64, 7 / 16);

        uvAttribute.setXY(12, 47 / 64, 7 / 16); //Bottom
        uvAttribute.setXY(13, 25 / 32, 7 / 16);
        uvAttribute.setXY(14, 47 / 64, 1 / 2);
        uvAttribute.setXY(15, 25 / 32, 1 / 2);

        uvAttribute.setXY(16, 11 / 16, 7 / 16); //Front
        uvAttribute.setXY(17, 47 / 64, 7 / 16);
        uvAttribute.setXY(18, 11 / 16, 1 / 4);
        uvAttribute.setXY(19, 47 / 64, 1 / 4);

        uvAttribute.setXY(20, 51 / 64, 7 / 16); //Back
        uvAttribute.setXY(21, 27 / 32, 7 / 16);
        uvAttribute.setXY(22, 51 / 64, 1 / 4);
        uvAttribute.setXY(23, 27 / 32, 1 / 4);

    };

    addPartsToScene = () => {
        let head = new THREE.Mesh(this.headGeometry, this.material);
        let headHat = new THREE.Mesh(this.headHatGeometry, this.hatMaterial);
        this.headPivot = new THREE.Object3D();
        this.headPivot.add(head);
        this.headPivot.add(headHat);
        this.headPivot.position.y = 24;
        head.position.y = 4;
        headHat.position.y = 4;
        this.scene.add(this.headPivot);

        let torso = new THREE.Mesh(this.torsoGeometry, this.material);
        let torsoHat = new THREE.Mesh(this.torsoHatGeometry, this.hatMaterial);
        this.torsoPivot = new THREE.Object3D();
        this.torsoPivot.add(torso);
        this.torsoPivot.add(torsoHat);
        this.torsoPivot.position.y = 24;
        torso.position.y = -6;
        torsoHat.position.y = -6;
        this.scene.add(this.torsoPivot);

        let leftLeg = new THREE.Mesh(this.leftLegGeometry, this.material);
        let leftLegHat = new THREE.Mesh(this.leftLegHatGeometry, this.hatMaterial);
        this.leftLegPivot = new THREE.Object3D();
        this.leftLegPivot.add(leftLeg);
        this.leftLegPivot.add(leftLegHat);
        this.leftLegPivot.position.x = 1.995;
        this.leftLegPivot.position.y = 12;
        leftLeg.position.y = -6;
        leftLegHat.position.y = -6;
        this.scene.add(this.leftLegPivot);

        let rightLeg = new THREE.Mesh(this.rightLegGeometry, this.material);
        let rightLegHat = new THREE.Mesh(this.rightLegHatGeometry, this.hatMaterial);
        this.rightLegPivot = new THREE.Object3D();
        this.rightLegPivot.add(rightLeg);
        this.rightLegPivot.add(rightLegHat);
        this.rightLegPivot.position.x = -1.995;
        this.rightLegPivot.position.y = 12;
        rightLeg.position.y = -6;
        rightLegHat.position.y = -6;
        this.scene.add(this.rightLegPivot);

        let leftArm = new THREE.Mesh(this.leftArmGeometry, this.material);
        let leftArmHat = new THREE.Mesh(this.leftArmHatGeometry, this.hatMaterial);
        let leftArmSlim = new THREE.Mesh(this.leftArmSlimGeometry, this.material);
        let leftArmSlimHat = new THREE.Mesh(this.leftArmSlimHatGeometry, this.hatMaterial);
        this.leftArmPivot = new THREE.Object3D();
        this.leftArmPivot.add(leftArm);
        this.leftArmPivot.add(leftArmHat);
        this.leftArmPivot.add(leftArmSlim);
        this.leftArmPivot.add(leftArmSlimHat);
        this.leftArmPivot.position.x = 5;
        this.leftArmPivot.position.y = 22;
        leftArm.position.x = 1;
        leftArm.position.y = -4;
        leftArmHat.position.x = 1;
        leftArmHat.position.y = -4;
        leftArmSlim.position.x = 0.5;
        leftArmSlim.position.y = -4;
        leftArmSlimHat.position.x = 0.5;
        leftArmSlimHat.position.y = -4;
        leftArmSlim.slim = true;
        leftArmSlimHat.slim = true;
        this.scene.add(this.leftArmPivot);

        let rightArm = new THREE.Mesh(this.rightArmGeometry, this.material);
        let rightArmHat = new THREE.Mesh(this.rightArmHatGeometry, this.hatMaterial);
        let rightArmSlim = new THREE.Mesh(this.rightArmSlimGeometry, this.material);
        let rightArmSlimHat = new THREE.Mesh(this.rightArmSlimHatGeometry, this.hatMaterial);
        this.rightArmPivot = new THREE.Object3D();
        this.rightArmPivot.add(rightArm);
        this.rightArmPivot.add(rightArmHat);
        this.rightArmPivot.add(rightArmSlim);
        this.rightArmPivot.add(rightArmSlimHat);
        this.rightArmPivot.position.x = -5;
        this.rightArmPivot.position.y = 22;
        rightArm.position.x = -1;
        rightArm.position.y = -4;
        rightArmHat.position.x = -1;
        rightArmHat.position.y = -4;
        rightArmSlim.position.x = -0.5;
        rightArmSlim.position.y = -4;
        rightArmSlimHat.position.x = -0.5;
        rightArmSlimHat.position.y = -4;
        rightArmSlim.slim = true;
        rightArmSlimHat.slim = true;
        this.scene.add(this.rightArmPivot);

        this.updateSlim();
    };

    updateSlim = () => {
        this.rightArmPivot.children.forEach(e => {
            if (e.slim) e.visible = this.slim;
            else e.visible = !this.slim;
        });
        this.leftArmPivot.children.forEach(e => {
            if (e.slim) e.visible = this.slim;
            else e.visible = !this.slim;
        });
    };

    startAnimationLoop = () => {
        this.renderer.render(this.scene, this.camera);

        if (this.anim) {
            this.time = this.time || 0;
            this.time += 0.1;
            if (this.time > Math.PI * 20) this.time -= Math.PI * 20;
        }

        let rotation = Math.sin(this.time)
        this.leftLegPivot.rotation.x = rotation;
        this.rightLegPivot.rotation.x = -rotation;
        this.leftArmPivot.rotation.x = -rotation;
        this.rightArmPivot.rotation.x = rotation;

        this.leftArmPivot.rotation.z = Math.sin(this.time * 0.3) * 0.05 + 0.05;
        this.rightArmPivot.rotation.z = -this.leftArmPivot.rotation.z;

        // The window.requestAnimationFrame() method tells the browser that you wish to perform
        // an animation and requests that the browser call a specified function
        // to update an animation before the next repaint
        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    handleWindowResize = () => {
        const width = this.canvasRef.current.clientWidth;
        const height = this.canvasRef.current.clientHeight;

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;

        // Note that after making changes to most of camera properties you have to call
        // .updateProjectionMatrix for the changes to take effect.
        this.camera.updateProjectionMatrix();
    };

    render() {
        return <canvas className="paperdoll-canvas" ref={this.canvasRef} />;
    }
}

class PaperDoll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slim: !!props.slim,
            anim: props.anim == null ? true : props.anim
        };
    }

    updateSlim = (e) => {
        this.setState({slim: e.target.checked});
        this.props.updateSkin(e.target.checked);
    }
    
    render() {
        return (
            <div className="paperdoll container">
                <span>
                    <label htmlFor="slimToggle">Slim</label>
                    <input type="checkbox" id="slimToggle" checked={this.props.slim} onChange={this.updateSlim.bind(this)}/>
                    <label htmlFor="animToggle">Animate</label>
                    <input type="checkbox" id="animToggle" checked={this.state.anim} onChange={() => this.setState({anim: !this.state.anim})}/>
                </span>
                <App skin={this.props.skin || steve} slim={this.props.slim} anim={this.state.anim} />
            </div>
        );
    }
}

export default PaperDoll;