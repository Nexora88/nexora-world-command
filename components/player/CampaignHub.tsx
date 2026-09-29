"use client";
import { ArrowRight, Clock3, Globe2, Radio, Users, WifiOff, CheckCircle2 } from "lucide-react";
import { CAMPAIGNS } from "@/data/campaigns";
import { getRoomsForCampaign, type WorldRoom } from "@/data/rooms";
import type { CampaignDefinition } from "@/game/campaign/types";
interface Props { guest:boolean; onSelect:(campaign:CampaignDefinition)=>void; }
export function CampaignHub({guest,onSelect}:Props){
 const available=CAMPAIGNS.filter(c=>guest?c.mode==="offline_guest":c.mode==="online_live");
 return <div className="campaign-hub">
  <div className="campaign-header"><div><p className="entry-kicker">{guest?"LOCAL COMMAND NETWORK":"GLOBAL COMMAND NETWORK"}</p><h1>SELECT WORLD ROOM</h1><p>Önce bir dünya odası seç. Oda; harita, senaryo, oyuncu kapasitesi ve zaman akışını belirler.</p></div>
   <div className="campaign-network">{guest?<WifiOff/>:<Radio/>}<b>{guest?"OFFLINE GUEST":"SERVER CONNECTED"}</b><span>{guest?"LOCAL WORLD SNAPSHOT":"AUTHORITATIVE WORLD"}</span></div></div>
  <div className="campaign-grid">{available.map(c=><CampaignCard key={c.id} campaign={c} onSelect={onSelect} guest={guest}/>)}</div>
 </div>;
}
function CampaignCard({campaign,onSelect,guest}:{campaign:CampaignDefinition;onSelect:Props["onSelect"];guest:boolean}){
 const rooms=getRoomsForCampaign(campaign.id,guest); return <article className={`campaign-card ${campaign.map}`}>
  <div className="campaign-map-art"><span>{campaign.map==="europe"?"EUROPE":"WORLD"}</span><Globe2/></div>
  <div className="campaign-card-body"><div className="campaign-meta"><span className="campaign-status live">● {guest?"LOCAL":"LIVE"}</span><small>{rooms.length} ROOM</small></div>
   <h2>{campaign.name}</h2><p>{campaign.description}</p>
   <div className="room-list">{rooms.map(room=><RoomRow key={room.id} room={room} onJoin={()=>room.status!=="FULL"&&onSelect(campaign)}/>)}</div>
  </div>
 </article>;
}
function RoomRow({room,onJoin}:{room:WorldRoom;onJoin:()=>void}){const open=room.status!=="FULL";return <button type="button" className="room-row" disabled={!open} onClick={onJoin}>
 <span className={`room-state ${room.status.toLowerCase()}`}>{room.status==="OPEN"?<CheckCircle2/>:room.status==="STARTING"?<Radio/>:<WifiOff/>}</span>
 <span className="room-main"><b>{room.name}</b><small>{room.description}</small></span>
 <span className="room-stats"><i><Users/> {room.players}/{room.capacity}</i><i><Clock3/> {room.dayLength}m</i></span><ArrowRight className="room-arrow"/>
 </button>}
