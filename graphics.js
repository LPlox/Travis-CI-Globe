/*
Resources:
Made with the help of: https://codepen.io/b29/pen/vQwrNZ
Textures from: https://www.gsmlondon.ac.uk/global-oil-map/#1995-importers-392
*/

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { StereoEffect } from "three/addons/effects/StereoEffect.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
// import { MaskPass } from "three/addons/postprocessing/MaskPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { CopyShader } from "three/addons/shaders/CopyShader.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
// import { ConvolutionShader } from "three/addons/shaders/ConvolutionShader.js";
// import { LuminosityHighPassShader } from "three/addons/shaders/LuminosityHighPassShader.js";

//===================================================== add Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);
//===================================================== add Camera
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  1,
  10000
);
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 275;
//===================================================== add front & back lighting

let light = new THREE.AmbientLight(new THREE.Color("white"), 0.3); //soft white light
scene.add(light);

light = new THREE.DirectionalLight(new THREE.Color("white"), 1.2);
light.position.set(1, 3, 2).normalize();
scene.add(light);

light = new THREE.DirectionalLight(new THREE.Color("white"), 1);
light.position.set(-1, -3, -2).normalize();
scene.add(light);

//===================================================== add canvas
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.LinearToneMapping;
document.body.appendChild(renderer.domElement);

//===================================================== add controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

//===================================================== add GLow
const renderScene = new RenderPass(scene, camera);
const effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms["resolution"].value.set(
  1 / window.innerWidth,
  1 / window.innerHeight
);
const copyShader = new ShaderPass(CopyShader);
copyShader.renderToScreen = true;

const bloomStrength = 2;
const bloomRadius = 0;
const bloomThreshold = 0.5;
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  bloomStrength,
  bloomRadius,
  bloomThreshold
);

const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
composer.addPass(renderScene);
composer.addPass(effectFXAA);
composer.addPass(bloomPass);
composer.addPass(copyShader);

//===================================================== resize
window.addEventListener("resize", function () {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

//===================================================== d3.json
d3.json(
  "https://raw.githubusercontent.com/baronwatts/data/master/world.json",
  function (err, data) {
    //===================================================== crate canvas texturefor the globe
    const projection = d3.geo
      .equirectangular()
      .translate([1024, 512])
      .scale(326);

    const countries = topojson.feature(data, data.objects.countries);

    const canvas = d3
      .select("body")
      .append("canvas")
      .style("display", "none")
      .attr("width", "2048px")
      .attr("height", "1024px");

    const context = canvas.node().getContext("2d");

    const path = d3.geo.path().projection(projection).context(context);

    context.strokeStyle = "white";
    context.lineWidth = 0.25;
    context.fillStyle = "#000";

    context.beginPath();

    path(countries);

    context.fill();
    context.stroke();

    const mapTexture = new THREE.Texture(canvas.node());
    mapTexture.needsUpdate = true;

    //===================================================== add globe
    const group = new THREE.Group();
    scene.add(group);
    group.rotateX(Math.PI / 8);

    const RADIUS = 140;

    const sphereGeometry = new THREE.SphereGeometry(RADIUS, 60, 60);

    //Test wireframe material
    // const sphereMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x0000ff,
    //   transparent: false,
    //   wireframe: true,
    //   wireframeLinewidth: 5,
    //   wireframeLinejoin: "round",
    //   wireframeLinecap: "round"
    // });

    const sphereMaterial = new THREE.MeshPhongMaterial({
      opacity: 1,
      shininess: 5,
      specular: 0x1d1d1d,
      color: new THREE.Color("white"),
      map: new THREE.TextureLoader().load("assets/earth.jpg"),
      bumpMap: new THREE.TextureLoader().load("assets/earth-bump.jpg"),
    });

    const earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    earthMesh.name = "earth";
    group.add(earthMesh);

    let countDisplayedPoints = 0;
    placePoint();
    //===================================================== Placing the points
    async function placePoint() {
      await fetchData;
      let color;

      commitArray.map((commit) => {
        const lat = commit.latitude;
        const long = commit.longitude;
        const radius = commit.radius;

        const x = -(
          radius *
          Math.sin((90 - lat) * (Math.PI / 180)) *
          Math.cos((long + 180) * (Math.PI / 180))
        );
        const z =
          radius *
          Math.sin((90 - lat) * (Math.PI / 180)) *
          Math.sin((long + 180) * (Math.PI / 180));
        const y = radius * Math.cos((90 - lat) * (Math.PI / 180));

        switch (radius) {
          case 140:
            color = "white";
            break;
          case 200:
            color = "yellow";
            break;
          case 260:
            color = "red";
            break;
        }

        const pointWidthHeight = Math.floor(Math.random() * 10);

        const pointGeo = new THREE.SphereGeometry(
          1,
          pointWidthHeight,
          pointWidthHeight
        );
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(color),
        });
        const point = new THREE.Mesh(pointGeo, material);

        point.position.set(x, y, z);
        group.add(point);
        countDisplayedPoints++;
      });
    }

    //===================================================== add Animation
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
      composer.render();
      document.getElementById("commits").innerHTML = countDisplayedPoints;
    }
    animate();
  }
);
