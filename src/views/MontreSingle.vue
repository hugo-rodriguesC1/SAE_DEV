<script setup>
import { onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(13,window.innerWidth / window.innerHeight, 1, 6000);
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();



//VARIABLES

var SCREEN_WIDTH, SCREEN_HEIGHT, SCREEN_LEFT, SCREEN_TOP;
var clickInfo = [];

var animations = [];

var boitier_rond;
var boitier_carre;
var pierre;
var aiguille_minutes;
var aiguille_secondes;
var aiguille_heures;
var bouton;
var bracelet;
var fermoir;

var textureCuirBlanc;
var textureTissusMarron;
var textureTissusOr;

var backgroundBlack1;
var backgroundBlack2;

//CLIC
function onClickEvent(event) {
  clickInfo.userHasClicked = true;
  clickInfo.mouse = new THREE.Vector2();
  clickInfo.mouse.x =
    ((event.clientX - SCREEN_LEFT) / SCREEN_WIDTH) * 2 - 1;
  clickInfo.mouse.y =
    -((event.clientY - SCREEN_TOP) / SCREEN_HEIGHT) * 2 + 1;
}


function start () {

    //RENDERER
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x060606, 1);
    SCREEN_WIDTH = document.body.scrollWidth;
    SCREEN_HEIGHT = document.body.scrollHeight;
    SCREEN_LEFT = document.body.offsetLeft - document.body.scrollLeft + document.body.clientLeft;
    SCREEN_TOP = document.body.offsetTop - document.body.scrollTop + document.body.clientTop;
    document.body.appendChild(renderer.domElement);

    //CLIC
    document.body.addEventListener("click", onClickEvent, false);


    //CAMERA
    camera.position.set(200, 350, 350);
    camera.lookAt(new THREE.Vector3(0, 0, 5)); 
    camera.up.set(0, 0, 1);

    const controls = new OrbitControls(camera, renderer.domElement);

    clock.start()
    const loader = new ColladaLoader();
    loader.load("/models/montre.dae", onLoaded, onProgress, onError);

    //LIGHTS
    const ambientLight = new THREE.AmbientLight(0x0a0a0a);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2750);
    pointLight.position.set(0, 0, 30);
    scene.add(pointLight);
    const pointLight2 = new THREE.PointLight(0xffffff, 1000);
    pointLight2.position.set(0, 75, 0);
    scene.add(pointLight2);
    const pointLight3 = new THREE.PointLight(0xffffff, 1000);
    pointLight3.position.set(50, 0, -50);
    scene.add(pointLight3);
    const pointLight4 = new THREE.PointLight(0xffffff, 500);
    pointLight4.position.set(-50, 0, -50);
    scene.add(pointLight4);
    // const directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
    // directionalLight.position.set(0,0,1000)
    // scene.add( directionalLight );
    // scene.fog = new THREE.FogExp2(0xcccccc, 0.001);
}

//FONCTIONS LOAD --------------------
function onLoaded(collada) {
  let object = collada.scene;
  

  boitier_rond = object.getObjectByName("boitier_rond");
  boitier_carre = object.getObjectByName("boitier_carre");
  aiguille_secondes = object.getObjectByName("aiguille_secondes");
  aiguille_minutes = object.getObjectByName("aiguille_minutes");
  aiguille_heures = object.getObjectByName("aiguille_heures");
  pierre = object.getObjectByName("pierre");
  bouton = object.getObjectByName("bouton");
  fermoir = object.getObjectByName("fermoir");
  bracelet = object.getObjectByName("bracelet");

  textureCuirBlanc = new THREE.TextureLoader().load(
    "/images/texture-cuir-blanc.jpg"
  );
  textureTissusOr = new THREE.TextureLoader().load(
    "/images/texture-tissus-or.jpg"
  );
  textureTissusMarron = new THREE.TextureLoader().load(
    "/images/texture-tissus-marron.jpg"
  );

  backgroundBlack1 = new THREE.TextureLoader().load(
    "/images/background_black01.png"
  );
  backgroundBlack2 = new THREE.TextureLoader().load(
    "/images/background_black02.png"
  );

  let dt = clock.getElapsedTime();
  console.log("Loading completed after " + dt + " s.");

  generate();
}

var onProgress = function (data) {
  if (data.lengthComputable) {
    var percentComplete = (data.loaded / data.total) * 100;
    console.log(Math.round(percentComplete, 2) + "% downloaded");
  }
};

var onError = function (data) {
  console.error(data);
};

var t = 0;


//ANIMATE --------------------
function animate() {
  renderer.render(scene, camera);

  // détection du picking
  if (clickInfo.userHasClicked) {
          console.log(
            "(" +
              parseInt(
                0.5 * (clickInfo.mouse.x + 1) * SCREEN_WIDTH + SCREEN_LEFT
              ) +
              ";" +
              parseInt(
                -0.5 * (clickInfo.mouse.y - 1) * SCREEN_HEIGHT + SCREEN_TOP
              ) +
              ")"
          );
          clickInfo.userHasClicked = false; // pret pour le clique suivant
          raycaster.setFromCamera(clickInfo.mouse, camera);
          let intersections = raycaster.intersectObjects(scene.children, true);
          console.log(intersections)
          let obj = null;
          if (intersections.length > 0) {
            obj = intersections[0].object; // l'objet de la premiere intersection
            // si l'objet à un nom vide alors on sélectionne son pere
            while (obj != null && obj.name == "") {
              // cherche le nom du parent
              obj = obj.parent;
            }
            console.log(
              obj.name +
                " uv= (" +
                intersections[0].uv.x.toFixed(2) +
                "," +
                intersections[0].uv.y.toFixed(2) +
                ")"
            );
            if (obj) {
              // Lance la fonction onclick sur l'objet cliqué
              animations.forEach((object) => {
                if (object.name == obj.name) {
                  object.onClick(intersections[0]);
                }
              });
            }
          }
        }

    // restart next frame
    requestAnimationFrame(function () {
      animate();
      updateWatchHands();
    });
};

function generate() {

        var old = scene.getObjectByName("parent");
        if (old) {
          scene.remove(old);
        }

        // PARENT -----

        parent = new THREE.Mesh();
        scene.add(parent);

        // BOITIER -----

        parent.add(boitier_rond);
        boitier_rond.position.set(0, 0, 0);

        //   parent.add(boitier_carre)
        //   boitier_carre.position.set(0,0,0)

        // console.log(aiguille_heures);
        boitier_rond.material[1].map = backgroundBlack1;
        // boitier_rond.material[1].map = backgroundBlack2;

        // AIGUILLES -----

        parent.add(aiguille_secondes);
        aiguille_secondes.position.set(0, 0, 3);

        parent.add(aiguille_minutes);
        aiguille_minutes.position.set(0, 0, 2.9);

        parent.add(aiguille_heures);
        aiguille_heures.position.set(0, 0, 2.8);

        // PIERRES -----

        parent.add(pierre);
        pierre.position.set(0, 18.5, 4.5);

        let pierre2 = pierre.clone();
        parent.add(pierre2);
        pierre2.position.set(0, -18.5, 4.5);

        // BOUTON -----

        parent.add(bouton);
        bouton.position.set(-22, 0, 2.5);

        bouton.onClick = function () {
          aiguille_heures.material.emissive = new THREE.Color(1, 1, 1);
          aiguille_minutes.material.emissive = new THREE.Color(1, 1, 1);
          aiguille_secondes.material.emissive = new THREE.Color(1, 1, 1);

          // Rétablissez l'émissivité d'origine après 10 secondes
          setTimeout(function () {
            resetHandsEmissivity();
          }, 10000);
        };
        bouton.updateAnimation = function (dt) {};
        animations.push(bouton);

        // FERMOIR -----

        parent.add(fermoir);
        fermoir.position.set(0, 0, -26);

        // BRACELET -----

        parent.add(bracelet);
        bracelet.position.set(0, 0, 0);
        // bracelet.material.map = textureCuirBlanc;
          bracelet.material.map = textureTissusMarron;
        //   bracelet.material.map = textureTissusOr;

        parent.rotation.z = Math.PI;

        //   document.getElementById("textB1").value = brique1.copies;
        //   document.getElementById("textB2").value = brique2.copies;
        //   document.getElementById("textB4").value = brique4.copies;
        //   document.getElementById("textB6").value = brique6.copies;

        console.log(scene)
      }

      function getSystemTime() {
        const now = new Date();
        return {
          hours: now.getHours(),
          minutes: now.getMinutes(),
          seconds: now.getSeconds(),
        };
      }

      function resetHandsEmissivity() {
        aiguille_heures.material.emissivenew = new THREE.Color(0, 0, 0);
        aiguille_minutes.material.emissive = new THREE.Color(0, 0, 0);
        aiguille_secondes.material.emissive = new THREE.Color(0, 0, 0);
      }

      function updateWatchHands() {
        const systemTime = getSystemTime();

        // Mettez à jour les rotations des aiguilles en fonction de l'heure système
        aiguille_heures.rotation.z =
          ((systemTime.hours % 12) + systemTime.minutes / 60) * (-Math.PI / 6);
        aiguille_minutes.rotation.z =
          (systemTime.minutes + systemTime.seconds / 60) * (-Math.PI / 30);
        aiguille_secondes.rotation.z = systemTime.seconds * (-Math.PI / 30);
      }



onMounted(()=>{    
    start()
    animate()


    document.getElementById('bracelet').addEventListener("click", function(){
      document.getElementById('braceletCustom').style='display:flex;'
      document.getElementById('fondCustom').style='display:none;'
      document.getElementById('boitierCustom').style='display:none;'
    })
    document.getElementById('fond').addEventListener("click", function(){
      document.getElementById('fondCustom').style='display:flex;'
      document.getElementById('braceletCustom').style='display:none;'
      document.getElementById('boitierCustom').style='display:none;'
    })
    document.getElementById('boitier').addEventListener("click", function(){
      document.getElementById('boitierCustom').style='display:flex;'
      document.getElementById('fondCustom').style='display:none;'
      document.getElementById('braceletCustom').style='display:none;'
    })
})

</script>

<template>
  <div class="page">
    <div class="firstline">
      <div class="firstline__content">
        <p><span></span>WATCH</p>
      </div>
      <div class="firstline__content">
        <p>3D VIEWER</p>
      </div>
      <div class="firstline__content">
        <p>ADD TO CART</p>
      </div>
    </div>

  </div>    
  <div class="aside">
      <div class="aside__part" id="boitier">BOITIER</div>
      <div class="aside__part" id="bracelet">BRACELET</div>
      <div class="aside__part" id="fond">FOND</div>
      <div class="aside__custom" id="braceletCustom">
        <img src="/public/images/texture-cuir-blanc.jpg" alt="">
        <img src="/public/images/texture-tissus-marron.jpg" alt="">
      </div>
      <div class="aside__custom" id="boitierCustom">
        <div class="aside__img">ROND</div>
        <div class="aside__img">CARRÉ</div>
      </div>
      <div class="aside__custom" id="fondCustom">
        <div class="aside__img"><img src="/public/images/background_black01.png" alt=""></div>
        <div class="aside__img"><img src="/public/images/background_black02.png" alt=""></div>
      </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  position: absolute;
  z-index: 0;
  overflow: hidden;    
  color: $secondary-color;
}

.firstline{
  display: flex;
  width: 100vw;
  justify-content: space-between;
  border-bottom: 1px solid $secondary-color;
  &__content {
    display: flex;
    width: fit-content;
    height: rem(20);
    padding: rem(10);
    &:nth-child(3):hover {
      background-color: $secondary-color;
      color: $primary-color;
    }
  }
}

.aside {
  position: absolute;
  z-index: 0;
  width: rem(220);
  color: $secondary-color;
  top: rem(40);
  &__part {
    border-bottom: 1px solid $secondary-color;
    border-right: 1px solid $secondary-color;
    padding: rem(10);
    width: rem(200);
    &:hover {
      background-color: $secondary-color;
      color: $primary-color;
    }
  }
  &__custom {
    display: none;
    flex-direction: column;
    img {
      width: rem(200);
      height: rem(100);      
      object-fit: cover;
      padding: rem(10) rem(10);
      border-bottom: 1px solid $secondary-color;
      border-right: 1px solid $secondary-color;
    }
  }

}






</style>
