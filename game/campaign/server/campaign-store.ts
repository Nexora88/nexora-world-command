import fs from "node:fs";
import path from "node:path";
import type { CampaignSession } from "@/game/campaign/types";
const file=path.join(process.cwd(),"data","campaigns","sessions.json");
const ensure=()=>{fs.mkdirSync(path.dirname(file),{recursive:true});if(!fs.existsSync(file))fs.writeFileSync(file,"[]","utf8")};
const read=():CampaignSession[]=>{ensure();try{return JSON.parse(fs.readFileSync(file,"utf8")) as CampaignSession[]}catch{return[]}};
const write=(v:CampaignSession[])=>{ensure();fs.writeFileSync(file,JSON.stringify(v,null,2),"utf8")};
export function getSessions(accountId:string){return read().filter(s=>s.accountId===accountId).sort((a,b)=>b.lastPlayedAt-a.lastPlayedAt)}
export function enterSession(accountId:string,campaignId:string,nationId:string){
 const all=read(),now=Date.now();
 const existing=all.find(s=>s.accountId===accountId&&s.campaignId===campaignId&&s.status==="active");
 if(existing){existing.lastPlayedAt=now;write(all);return existing}
 const session:CampaignSession={campaignId,accountId,nationId,mode:"online_live",createdAt:now,lastPlayedAt:now,gameDay:1,status:"active"};
 all.push({...session, campaignId:campaignId || crypto.randomUUID()});write(all);return session;
}
