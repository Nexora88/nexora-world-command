export type RoomStatus = "OPEN" | "STARTING" | "FULL";
export type RoomMode = "offline_guest" | "online_live";
export interface WorldRoom { id:string; campaignId:string; name:string; region:"WORLD"|"EUROPE"; mode:RoomMode; status:RoomStatus; players:number; capacity:number; dayLength:number; description:string; }
export const WORLD_ROOMS:WorldRoom[] = [
 {id:"guest-room",campaignId:"guest-europe",name:"SOLO SANDBOX",region:"EUROPE",mode:"offline_guest",status:"OPEN",players:1,capacity:1,dayLength:1,description:"Yerel dünya. Hesapsız giriş ve güvenli deneme kampanyası."},
 {id:"world-alpha",campaignId:"world-live-01",name:"WORLD COMMAND 01",region:"WORLD",mode:"online_live",status:"OPEN",players:18,capacity:80,dayLength:30,description:"Küresel ekonomi, diplomasi ve stratejik dünya."},
 {id:"world-bravo",campaignId:"world-live-01",name:"WORLD COMMAND 02",region:"WORLD",mode:"online_live",status:"STARTING",players:46,capacity:80,dayLength:30,description:"Yeni dünya odası hazırlanıyor."},
 {id:"europe-alpha",campaignId:"europe-live-01",name:"EUROPEAN FRONT 01",region:"EUROPE",mode:"online_live",status:"OPEN",players:27,capacity:40,dayLength:20,description:"Avrupa merkezli canlı strateji odası."},
 {id:"europe-bravo",campaignId:"europe-live-01",name:"EUROPEAN FRONT 02",region:"EUROPE",mode:"online_live",status:"FULL",players:40,capacity:40,dayLength:20,description:"Dolmuş oda; yeni oyuncular için kapalı."},
];
export const getRoomsForCampaign=(campaignId:string,guest:boolean)=>WORLD_ROOMS.filter(room=>room.campaignId===campaignId&&(guest?room.mode==="offline_guest":room.mode==="online_live"));
