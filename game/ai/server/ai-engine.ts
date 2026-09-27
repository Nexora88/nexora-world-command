import {nations} from "@/data/world/countries";
import {getWorld,getProvince} from "@/game/world/server/world-store";
import {createAIArmy,getArmies,moveArmyForCountry} from "@/game/movement/server/movement-service";
import {declareWar,getWars,attackProvince} from "@/game/war/server/war-service";
import {pushWorldEvent} from "@/game/events/server/event-store";
export interface AIState{countryId:string;treasury:number;manpower:number;steel:number;priority:string;lastDecision:number}
const states=new Map<string,AIState>();let lastTick=0;
function init(){for(const n of nations.filter(n=>n.id!=="aurora"))if(!states.has(n.id))states.set(n.id,{countryId:n.id,treasury:n.treasury,manpower:5000,steel:3000,priority:"defend capital",lastDecision:0})}init();
const owned=(id:string)=>getWorld().filter(p=>p.ownerId===id);
const score=(id:string)=>{const p=getProvince(id);if(!p)return 0;return p.industryLevel*18+p.infrastructureLevel*12+p.population/500000+p.fortificationLevel*8+(p.id===nations.find(n=>n.id===p.ownerId)?.capitalProvinceId?60:0)};
function produce(s:AIState){const p=owned(s.countryId).sort((a,b)=>b.barracksLevel-a.barracksLevel)[0];if(!p||s.manpower<1200||s.steel<500||s.treasury<6000)return false;createAIArmy(s.countryId,p.id,1200,0,`${s.countryId.toUpperCase()} Guard`);s.manpower-=1200;s.steel-=500;s.treasury-=6000;pushWorldEvent({type:"ai",title:"AI MOBILIZATION",message:`${nations.find(n=>n.id===s.countryId)?.name} mobilization started`,countryId:s.countryId});return true}
function decide(s:AIState,now:number){const armies=getArmies().filter(a=>a.countryId===s.countryId&&a.status!=="destroyed");const capital=nations.find(n=>n.id===s.countryId)?.capitalProvinceId;const threat=capital?getWorld().find(p=>p.id===capital)?.neighbors.some(id=>getWorld().some(x=>x.id===id&&x.ownerId!==s.countryId)):false;s.priority=threat?"defend capital":armies.length===0?"produce army":"attack weak enemy";
 if(armies.length===0&&produce(s))return;const army=armies[0];if(!army)return;const current=getProvince(army.provinceId);const adjacent=getWorld().filter(p=>current?.neighbors.includes(p.id));const neutral=adjacent.find(p=>p.ownerId==="neutral");if(neutral){moveArmyForCountry(army.id,neutral.id,true);s.priority="capture strategic province";pushWorldEvent({type:"ai",title:"AI ADVANCE",message:`${nations.find(n=>n.id===s.countryId)?.name} captured an undefended province`,provinceId:neutral.id,countryId:s.countryId});return}
 const target=adjacent.filter(p=>p.ownerId!==s.countryId).sort((a,b)=>score(b.id)-score(a.id))[0];if(!target)return;let war=getWars().find(w=>w.status==="active"&&((w.attacker===s.countryId&&w.defender===target.ownerId)||(w.defender===s.countryId&&w.attacker===target.ownerId)));if(!war){try{war=declareWar(s.countryId,target.ownerId);pushWorldEvent({type:"war",title:"WAR DECLARED",message:`${nations.find(n=>n.id===s.countryId)?.name} declared war`,countryId:s.countryId})}catch{return}}
 if(war.attacker===s.countryId){try{const result=attackProvince(war.warId,army.id,target.id,now+s.countryId.length);s.priority=result.captured?"reinforce frontline":"recover after losses";pushWorldEvent({type:"battle",title:"MAJOR BATTLE",message:`AI forces engaged ${target.name}`,provinceId:target.id,countryId:s.countryId})}catch{}}s.lastDecision=now}
export function tickAI(now=Date.now()){if(now-lastTick<5000)return;lastTick=now;init();for(const s of states.values())if(now-s.lastDecision>=5000)decide(s,now)}
export function getAIStates(){init();return [...states.values()].map(s=>({...s}))}
export function resetAI(){states.clear();lastTick=0;init()}
