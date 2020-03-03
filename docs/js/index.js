import{Drag,Measure}from"./gestures.js";import linkActiveText from"./text-panel.js";import{setTransform}from"./utils.js";let plan,$scene,$floor,$pristine,drag,measure;const handleJson=e=>e.json(),handleText=e=>e.text(),$mirror=document.querySelector(".mirror"),$dirty=document.createDocumentFragment(),$port=document.querySelector(".port"),$view=document.querySelector(".view"),$floorSelector=document.querySelector(".floor-selector"),$zoomSlider=document.querySelector(".zoom-slider"),$ruler=document.querySelector(".ruler"),$foots=document.querySelector(".foots"),$zoomControl=document.querySelector(".zoom-control"),$reverse=document.getElementById("reverse"),$measure=document.getElementById("measure"),floorOptions=[],resize=()=>{setDragGesture()},hideNode=e=>e.classList.add("excluded"),selectFloor=e=>{const{target:t}=e;if($floorSelector.classList.toggle("expand"),t.classList.contains("excluded")){const e=`#${t.dataset.ref}`;floorOptions.forEach(hideNode),t.classList.remove("excluded"),$dirty.appendChild($floor),$floor=$dirty.querySelector(e)||$pristine.querySelector(e).cloneNode(!0),$scene.appendChild($floor),restore()}},setDragGesture=()=>{$measure.checked=!1,drag.attach(),$ruler.classList.remove("apply")},toggleMeasure=()=>{$measure.checked?measure.attach():setDragGesture()},zoom=()=>{$view.dataset.z=1+$zoomSlider.value/plan.zoomRatio,$zoomControl.dataset.z=+$zoomSlider.value+100,setTransform($view),$measure.checked&&setDragGesture()},wheel=({deltaY:e})=>{$zoomSlider.value=+$zoomSlider.value+(e>0?-4:4),zoom()},revertView=()=>{$view.dataset.sx*=-1,setTransform($view)},interpolateForeign=e=>{const{sx:t=1,r:r=0}=e.dataset;e.dataset.sx=-1*t,e.dataset.r=-1*r,setTransform(e)},mirror=()=>{if($reverse.checked&&"true"!==$floor.dataset.reversed){const e=$floor.querySelectorAll("text"),t=(t,r)=>{const o=e[r];if(void 0===t.dataset.flip){const e=t.getAttribute("transform"),r=/\(([^)]+)\)/.exec(e)[1].split(" ");o.dataset.transform=e,r[0]=-1,r[4]=t.getBoundingClientRect().right,o.dataset.flip=`matrix(${r.join()})`}o.setAttribute("transform",o.dataset.flip)};$floor.dataset.reversed=!0,$mirror.appendChild($pristine),$pristine.querySelectorAll(`#${$floor.id} text`).forEach(t),$floor.querySelectorAll(".text-field").forEach(interpolateForeign),$pristine.remove(),revertView()}else if(!1===$reverse.checked&&"true"===$floor.dataset.reversed){const e=e=>e.setAttribute("transform",e.dataset.transform);$floor.dataset.reversed=!1,$floor.querySelectorAll("text").forEach(e),$floor.querySelectorAll(".text-field").forEach(interpolateForeign),revertView()}},init=()=>{setScale(),drag.attach()},restore=()=>{$zoomSlider.value=0,setDragGesture(),mirror(),zoom(),init()},reset=()=>{$reverse.checked=!1,$floor.querySelector("foreignObject").innerHTML="",restore()},setScale=()=>{if(void 0===$view.dataset.sx){const{width:e,height:t}=$scene.getBoundingClientRect(),r=Math.min(window.innerWidth/e,window.innerHeight/t);$view.dataset.sy=r,$view.dataset.sx=r,setTransform($view)}},hideViewOptions=({id:e})=>document.getElementById(e).remove(),setFloor=({name:e,id:t,options:r},o)=>{const s=document.createElement("li"),n=document.getElementById(t);n.insertAdjacentHTML("beforeend",'<foreignObject data-drag-area=".view"></foreignObject>'),s.textContent=e,s.className="floor-option",floorOptions.push(s),o?(s.classList.add("excluded"),$pristine.appendChild(n)):($floor=n,$pristine.appendChild(n.cloneNode(!0))),s.dataset.ref=t,$floorSelector.appendChild(s),r&&r.forEach(hideViewOptions)},insertView=e=>{$view.innerHTML=e,$scene=$view.firstElementChild,$pristine=$scene.cloneNode(),plan.floors.forEach(setFloor),drag=new Drag({$scene:$scene,$view:$view,$zoomSlider:$zoomSlider,zoom:zoom}),measure=new Measure({$scene:$scene,$view:$view,$zoomSlider:$zoomSlider,$ruler:$ruler,$foots:$foots,plan:plan}),init(),$floorSelector.onclick=selectFloor,$zoomSlider.oninput=zoom,$port.onwheel=wheel},handlePlan=e=>(plan=e,document.querySelector(".plan-name").textContent=plan.name,fetch(plan.src).then(handleText).then(insertView)),setTextDefaults=e=>{e.className="draggable text-field",e.dataset.x=$scene.width.baseVal.value/2,e.dataset.y=$scene.height.baseVal.value/2,e.dataset.sx=Math.sign($view.dataset.sx)},addText=()=>{const e=document.createElement("pre");e.textContent="Add Text",setTextDefaults(e),$floor.querySelector("foreignObject").appendChild(e),linkActiveText(e),setTransform(e)};document.querySelector(".print-button").onclick=()=>window.print(),document.querySelector(".reset-button").onclick=reset,document.querySelector(".text-button").onclick=addText,$reverse.onchange=mirror,$measure.onchange=toggleMeasure,window.onresize=resize,fetch("plan.json").then(handleJson).then(handlePlan);