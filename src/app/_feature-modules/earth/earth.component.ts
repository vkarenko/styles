import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription, fromEvent, debounceTime } from 'rxjs';
import { SphereGeometry, Scene, PerspectiveCamera, WebGLRenderer, TextureLoader, Group, DirectionalLight, SRGBColorSpace, HemisphereLight, BufferGeometry, Vector3, Float32BufferAttribute, PointsMaterial, Points, ShaderMaterial, BackSide, Color, Mesh, Texture, MeshPhongMaterial, Vector2, MeshLambertMaterial } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EarthTextures } from '../../_interfaces';

@Component({
  selector: 'app-earth',
  templateUrl: './earth.component.html',
  styleUrls: ['./earth.component.scss']
})
export class EarthComponent implements OnInit, OnDestroy {

  @ViewChild('spaceBox', { static: true }) private _box!: ElementRef<HTMLDivElement>;
  @ViewChild('spaceCanvas', { static: true }) private _canvas!: ElementRef<HTMLCanvasElement>;


  private _radius = 6371;
  private _earthGeometry = new SphereGeometry(this._radius, 100, 50);
  private _scene: Scene = new Scene();
  private _camera!: PerspectiveCamera;
  private _webGLRenderer!: WebGLRenderer;
  private _textureLoader: TextureLoader = new TextureLoader();

  private _earthTextures$ = new BehaviorSubject<EarthTextures>({
    earth: undefined,
    clouds: undefined
  });

  private _earthGroup = new Group();

  // Direct light
  private _firstNorthLight = new DirectionalLight(0x75acff, 3);
  private _secondNorthLight = new DirectionalLight(0x0066ff, 3);

  private _subscription = new Subscription();

  constructor() { }

  ngOnInit(): void {
    // Camera
    this._setCamera();

    // Renderer
    this._setRenderer();

    // Stars
    this._addStars();

    // Lights
    this._addLights();

    // Atmosphere
    this._addAtmosphere();

    // Earth
    this._addEarth();

    // Controls
    const controls = new OrbitControls(this._camera, this._canvas.nativeElement);
    controls.rotateSpeed = .6;
    controls.zoomSpeed = .2;

    this._animateScene();

    // this._subscription.add(fromEvent(window, 'scroll').subscribe((event: Event) => {
    //   if (event.currentTarget instanceof Window) {
    //     const scrollPosition = event.currentTarget.scrollY;

    //     this._camera.position.set(0, this._radius * 1.08 + (-scrollPosition * 5), this._radius * 3.8 + (scrollPosition * 5));
    //   }
    // }));

    // this._subscription.add(fromEvent(window, 'resize').pipe(debounceTime(200)).subscribe((event: Event) => {
    //   this._webGLRenderer.setSize( this._box.nativeElement.clientWidth, this._box.nativeElement.clientHeight );
    //   this._setCamera();

    //   if (event.currentTarget instanceof Window) {
    //     const scrollPosition = event.currentTarget.scrollY;

    //     this._camera.position.set(0, this._radius * 1.08 + (-scrollPosition * 5), this._radius * 3.8 + (scrollPosition * 5));
    //   }
    // }));
  }

  private _animateScene(): void {
    const animate = () => {
      requestAnimationFrame(animate);

      this._firstNorthLight.rotation.y += 0.0001;
      this._secondNorthLight.rotation.y += 0.0001;

      if (this._earthMesh) {
        this._earthMesh.rotation.y += 0.0001;
      }

      if (this._cloudsMesh) {
        this._cloudsMesh.rotation.y += 0.00008;
        this._cloudsMesh.rotation.z += 0.000038;
      }

      this._webGLRenderer.render( this._scene, this._camera );
    }

    animate();
  }

  private _setCamera(): void {
    this._camera = new PerspectiveCamera( 23, this._box.nativeElement.clientWidth / this._box.nativeElement.clientHeight, 50, 1e7 );
    // this._camera.position.y = this._radius * 1.08;
    // this._camera.position.z = this._radius * 3.8;

    this._camera.position.y = this._radius * 1;
    this._camera.position.z = this._radius * 5;
  }

  private _setRenderer(): void {
    this._webGLRenderer = new WebGLRenderer({
      canvas: this._canvas.nativeElement,
      antialias: true
    });

    this._webGLRenderer.setSize( this._box.nativeElement.clientWidth, this._box.nativeElement.clientHeight );
    this._webGLRenderer.setClearColor( 0x000000, 0 );
    this._webGLRenderer.setPixelRatio( window.devicePixelRatio );
    this._webGLRenderer.outputColorSpace = SRGBColorSpace;
  }

  private _addLights(): void {
    const hemisphereLight = new HemisphereLight(0xffffff, 0x021e78, 3);
    this._scene.add(hemisphereLight);

    this._firstNorthLight.position.set(0.3, 1, -1);
    this._scene.add(this._firstNorthLight);

    this._secondNorthLight.position.set(0, 1, -1);
    this._scene.add(this._secondNorthLight);
  }

  private _addStars(): void {
    const r = 800;
    const starsGeometry = [ new BufferGeometry(), new BufferGeometry() ];

    const vertices1 = [];
    const vertices2 = [];

    const vertex = new Vector3();

    for ( let i = 0; i < 250; i ++ ) {

      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.multiplyScalar( r );

      vertices1.push( vertex.x, vertex.y, vertex.z );

    }

    for ( let i = 0; i < 1500; i ++ ) {

      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.multiplyScalar( r );

      vertices2.push( vertex.x, vertex.y, vertex.z );

    }

    starsGeometry[ 0 ].setAttribute( 'position', new Float32BufferAttribute( vertices1, 3 ) );
    starsGeometry[ 1 ].setAttribute( 'position', new Float32BufferAttribute( vertices2, 3 ) );

    const starSprite = this._textureLoader.load('/assets/images/star.png');
    starSprite.colorSpace = SRGBColorSpace;

    const miniStarSprite = this._textureLoader.load('/assets/images/mini-star.png');
    miniStarSprite.colorSpace = SRGBColorSpace;

    const miniStarSpriteBlue = this._textureLoader.load('/assets/images/mini-star--blue.png');
    miniStarSpriteBlue.colorSpace = SRGBColorSpace;

    const starsMaterials = [
      new PointsMaterial( { size: 10, map: starSprite, transparent: true, sizeAttenuation: false } ),
      new PointsMaterial( { size: 2, map: miniStarSprite, transparent: true, sizeAttenuation: false } ),
      new PointsMaterial( { size: 4, map: miniStarSpriteBlue, transparent: true, sizeAttenuation: false } ),
      new PointsMaterial( { color: 0x838383, size: 1, sizeAttenuation: false } ),
      new PointsMaterial( { color: 0x5a5a5a, size: 2, sizeAttenuation: false } ),
      new PointsMaterial( { color: 0x5a5a5a, size: 1, sizeAttenuation: false } )
    ];

    for ( let i = 10; i < 30; i ++ ) {

      const stars = new Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );

      stars.rotation.x = Math.random() * 6;
      stars.rotation.y = Math.random() * 6;
      stars.rotation.z = Math.random() * 6;
      stars.scale.setScalar( i * 10 );

      stars.matrixAutoUpdate = false;
      stars.updateMatrix();

      this._scene.add( stars );

    }
  }

  private _addAtmosphere(): void {
    const atmosphereMesh = this._atmosphereMesh;
    atmosphereMesh.position.y = 1000;
    atmosphereMesh.position.x = 500;

    this._scene.add(atmosphereMesh);
  }

  private get _vertexShader(): string {
    return `
      varying vec3 vVertexWorldPosition;
      varying vec3 vVertexNormal;
      void main() {
        vVertexNormal	= normalize(normalMatrix * normal);
        vVertexWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
  }

  private get _fragmentShader(): string {
    return `
      uniform vec3 color;
      uniform float coefficient;
      uniform float power;
      varying vec3 vVertexNormal;
      varying vec3 vVertexWorldPosition;
      void main() {
        vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;
        vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;
        viewCameraToVertex = normalize(viewCameraToVertex);
        float intensity	= pow(
          coefficient + dot(vVertexNormal, viewCameraToVertex),
          power
        );
        gl_FragColor = vec4(color, intensity);
      }
    `;
  }

  private get _atmosphereGeometry(): SphereGeometry {
    return new SphereGeometry(this._radius + 500, 100, 50);
  }

  private get _atmosphereMaterial(): ShaderMaterial {
    return new ShaderMaterial({
      side: BackSide,
      depthWrite: false,
      fragmentShader: this._fragmentShader,
      transparent: true,
      uniforms: {
        coefficient: {
          value: 0.01,
        },
        color: {
          value: new Color('#7DBEFF'),
        },
        power: {
          value: 4,
        },
      },
      vertexShader: this._vertexShader
    });
  }

  private get _atmosphereMesh(): Mesh {
    return new Mesh(this._atmosphereGeometry, this._atmosphereMaterial);
  }

  private _loadTextures(): void {
    this._textureLoader.load('/assets/images/dnb_land_ocean_ice.2012.13500x6750.jpg', (texture) => {
      this._earthTextures$.next({
        ...this._earthTextures$.value,
        earth: texture
      });
    });

    this._textureLoader.load('/assets/images/clouds.png', (texture) => {
      this._earthTextures$.next({
        ...this._earthTextures$.value,
        clouds: texture
      });
    });
  }

  private _getEarthMesh(earthTexture: Texture): Mesh {
    const earthMaterial = new MeshPhongMaterial({
      specular: 0x7c7c7c,
      shininess: 8,
      map: earthTexture,
      fog: false,
      normalScale: new Vector2( 0.85, - 0.85 ),
      name: 'earth'
    });

    if (earthMaterial.map) {
      earthMaterial.map.colorSpace = SRGBColorSpace;
    }

    // Earth
    const earthMesh = new Mesh(this._earthGeometry, earthMaterial);
    earthMesh.name = 'earthMesh';
    earthMesh.rotation.x = 0.22;
    earthMesh.rotation.y = 4;
    earthMesh.rotation.z = 0.2;

    return earthMesh;
  }

  private _getCloudsMesh(cloudsTexture: Texture): Mesh {
    const materialClouds = new MeshLambertMaterial( {
      map: cloudsTexture,
      transparent: true
    });

    if (materialClouds.map) {
      materialClouds.map.colorSpace = SRGBColorSpace;
    }

    const meshClouds = new Mesh( this._earthGeometry, materialClouds );
    meshClouds.name = 'cloudsMesh';
    meshClouds.scale.set( 1.001, 1.001, 1.001 );

    return meshClouds;
  }

  private get _earthMesh(): Mesh | undefined {
    const earthMesh = this._earthGroup.children.find((child) => child.name === 'earthMesh') as Mesh;

    return earthMesh;
  }

  private get _cloudsMesh(): Mesh | undefined {
    const cloudsMesh = this._earthGroup.children.find((child) => child.name === 'cloudsMesh') as Mesh;

    return cloudsMesh;
  }

  private _addEarth(): void {
    this._loadTextures();

    this._subscription.add(this._earthTextures$.subscribe((textures) => {
      if (textures.earth && !this._earthMesh) {
        this._earthGroup.add(this._getEarthMesh(textures.earth));
      }

      if (textures.clouds && !this._cloudsMesh) {
        this._earthGroup.add(this._getCloudsMesh(textures.clouds));
      }

      if (textures.earth && textures.clouds) {
        this._scene.add(this._earthGroup);
      }
    }));
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

}
