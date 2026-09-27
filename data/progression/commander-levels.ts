export interface CommanderLevel { level:number; xpRequired:number; title:string; unlocks:string[]; }
export const COMMANDER_LEVELS:CommanderLevel[]=[
{level:1,xpRequired:0,title:"CADET",unlocks:["WORLD MAP"]},
{level:2,xpRequired:250,title:"FIELD OFFICER",unlocks:["BUILDINGS"]},
{level:3,xpRequired:650,title:"LIEUTENANT",unlocks:["UNIT PRODUCTION"]},
{level:4,xpRequired:1200,title:"CAPTAIN",unlocks:["ARMY COMMAND"]},
{level:5,xpRequired:2000,title:"MAJOR",unlocks:["RESEARCH"]},
{level:6,xpRequired:3100,title:"COLONEL",unlocks:["ADVANCED BUILDINGS"]},
{level:7,xpRequired:4600,title:"BRIGADIER",unlocks:["STRATEGIC INTELLIGENCE"]},
{level:8,xpRequired:6500,title:"GENERAL",unlocks:["MULTI-FRONT OPERATIONS"]},
{level:9,xpRequired:9000,title:"FIELD MARSHAL",unlocks:["ADVANCED OPERATIONS"]},
{level:10,xpRequired:12000,title:"HIGH COMMAND",unlocks:["EUROPEAN THEATRE"]},
];
export function getCommanderLevel(xp:number){
  let current=COMMANDER_LEVELS[0];
  for(const level of COMMANDER_LEVELS){if(xp>=level.xpRequired)current=level;else break;}
  const next=COMMANDER_LEVELS.find(x=>x.level===current.level+1);
  return {level:current.level,title:current.title,xp:Math.max(0,xp),nextXp:next?.xpRequired??current.xpRequired,progressToNext:next?Math.min(100,((xp-current.xpRequired)/(next.xpRequired-current.xpRequired))*100):100,unlocks:current.unlocks};
}
export const initialCommanderXp=3450;
