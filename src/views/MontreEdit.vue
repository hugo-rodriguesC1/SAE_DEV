<script setup>
import { onMounted, ref, getCurrentInstance, onUpdated, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";

import { client } from '@/utils/axios.js'

import { useRoute, useRouter } from 'vue-router'


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

var parent

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

        var test = route.params.id
        console.log('TEST ID : ', test)

        // PARENT -----

        parent = new THREE.Mesh();
        parent.routeID = route.params.id
        scene.add(parent);

        // BOITIER -----
        // CHANGEMENT DYNAMIQUE AVEC REF
        if(boitierChosen.value){
          parent.add(boitier_rond);
          boitier_rond.position.set(0, 0, 0);
          boitier_carre.visible=false
          boitier_rond.visible=true
        }else{
          parent.add(boitier_carre)
          boitier_carre.position.set(0,0,0)
          boitier_rond.visible=false
          boitier_carre.visible=true
        }

        const boitier_rondTextureUrl = "/images/"+fondChosen.value
        boitier_rond.material[1].map = new THREE.TextureLoader().load(
          boitier_rondTextureUrl
        );


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
        // TEXTURE DYNAMIQUE
        const braceletTextureUrl = "/images/"+braceletChosen.value
        bracelet.material.map = new THREE.TextureLoader().load(
          braceletTextureUrl
        );

        parent.rotation.z = Math.PI;

        //   document.getElementById("textB1").value = brique1.copies;
        //   document.getElementById("textB2").value = brique2.copies;
        //   document.getElementById("textB4").value = brique4.copies;
        //   document.getElementById("textB6").value = brique6.copies;

        console.log("SCENE : ",scene)
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


// ROUTER
const route = useRoute()
const router = useRouter()
const userId = ref(null);


// REQUETES API
const montre = ref()
const name = ref()
const montreId = ref()

const braceletChosen = ref("texture-cuir-blanc.jpg")
const fondChosen = ref("background_black01.png")
const boitierChosen = ref(true)

const bracelets = ref([])
const fonds = ref([])

const token = localStorage.getItem('token');
const headers = { Authorization: `Bearer ${token}` };

const getBracelet = async () => {
  const response = await client.get('/bracelet')
  return response.data
}
const getFond = async () => {
  const response = await client.get('/fond')
  return response.data
}
const getMontre = async (id) => {
  const response = await client.get('/montre-single/' + id, { headers })
  return response.data
}

function redirect(err) {
  if(err.response.data.error==="Token invalide"){
    router.push('/login');
  }
}
const Logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
}
const getName = async () => {
  const response = await client.get('/username', { headers }).catch(
    redirect
  )
  return response.data.rows[0].name
}

const reload = ref(false)

onMounted(async ()=>{        
    start()
    animate()
    bracelets.value = await getBracelet()
    fonds.value = await getFond()
    montre.value = await getMontre(route.params.id)
    console.log("MONTRE : ",montre.value)
    braceletChosen.value = montre.value.rows[0].braceletUrl
    fondChosen.value = montre.value.rows[0].fondUrl
    boitierChosen.value = montre.value.rows[0].boitier
    name.value = await getName()
    montreId.value = route.params.id

    generate()





    // MENU ASIDE
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

onUnmounted(()=>{
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
        <div @click="Logout">LOGOUT</div>
      </div>
    </div>

  </div>    
  <div class="aside">
      <div class="aside__part" id="boitier">BOITIER</div>
      <div class="aside__part" id="bracelet">BRACELET</div>
      <div class="aside__part" id="fond">FOND</div>
      <div class="aside__custom" id="braceletCustom">
        <img @click="braceletChosen=bracelet.url; generate()" v-for="bracelet in bracelets.rows" :key="bracelet.bracelet_id" :src="`/images/${bracelet.url}`" alt="">
      </div>
      <div class="aside__custom" id="boitierCustom">
        <div @click="boitierChosen=true; generate()" class="aside__choice" id="boitierRond">ROND</div>
        <div @click="boitierChosen=false; generate()" class="aside__choice" id="boitireCarre">CARRÉ</div>
      </div>
      <div class="aside__custom" id="fondCustom">
        <img @click="fondChosen=fond.url; generate();" v-for="fond in fonds.rows" :key="fond.fond_id" :src="`/images/${fond.url}`" alt="">
      </div>
  </div>
  <div class="menu">
    <div class="menu__part" id="boitier">ADD TO CART</div>
    <div class="menu__part" id="bracelet">SAVE</div>
  </div>
  <div class="username" @click="router.push('/montre-list')">{{ montreId }} - {{ name }}</div>
  <RouterLink to="/cart" class="cart">CART</RouterLink>


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
    &:nth-child(3) {
      border-left: 1px solid $secondary-color;    
      &:hover {
        background-color: $secondary-color;
        color: $primary-color;
    }
    }

  }
}

.username {
  text-transform: uppercase;
  position: absolute;
  bottom: rem(0);
  left: rem(0);
  padding: rem(10);
  text-align: center;
  color: $secondary-color;
  border-top: solid 1px $secondary-color;
  border-right: solid 1px $secondary-color;
  &:hover {
    background-color: $secondary-color;
    color: $primary-color;
  }
}

.cart {
  text-transform: uppercase;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: rem(10);
  text-align: center;
  border-top: solid 1px $secondary-color;
  border-left: solid 1px $secondary-color;
  color: $secondary-color;
  &:hover {
    background-color: $secondary-color;
    color: $primary-color;
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
  &__choice {
    padding: rem(10);
    width: rem(100);
    border-bottom: 1px solid $secondary-color;
    border-right: 1px solid $secondary-color;
    &:hover {
      background-color: $third-color;
    }
  }
}

#boitierCustom {
      flex-direction: row;
    }

#fondCustom {
  max-height: rem(300);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
}

.menu {
    position: absolute;
    z-index: 0;
    top: rem(40);
    right: 0;
    color: $secondary-color;
    &__part {
        border-bottom: 1px solid $secondary-color;
        border-left: 1px solid $secondary-color;
        padding: rem(10);
        padding-right: rem(80);
        &:hover {
            background-color: $secondary-color;
            color: $primary-color;
            }
    }
}


</style>
