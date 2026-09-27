export interface Nation { id:string; name:string; capitalProvinceId:string; population:number; governmentType:string; stability:number; treasury:number; nationalPower:number; color:string; }
export const nations:Nation[]=[
{id:"aurora",name:"Aurora Union",capitalProvinceId:"nwc-01",population:9100000,governmentType:"Republic",stability:78,treasury:125000,nationalPower:62,color:"#4ade80"},
{id:"solaris",name:"Solaris Pact",capitalProvinceId:"nwc-04",population:8700000,governmentType:"Federal Republic",stability:71,treasury:112000,nationalPower:67,color:"#f59e0b"},
{id:"verdant",name:"Verdant Republic",capitalProvinceId:"nwc-06",population:10100000,governmentType:"Republic",stability:83,treasury:138000,nationalPower:64,color:"#60a5fa"}];
