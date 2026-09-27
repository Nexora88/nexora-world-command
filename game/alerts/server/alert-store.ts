export type AlertLevel="info"|"warning"|"critical";
export interface WorldAlert{id:string;key:string;level:AlertLevel;title:string;message:string;provinceId?:string;createdAt:number;}
const alerts:WorldAlert[]=[];const lastSeen=new Map<string,number>();
export function pushAlert(a:Omit<WorldAlert,"id"|"createdAt">,cooldown=30000){const now=Date.now(),last=lastSeen.get(a.key)??0;if(now-last<cooldown)return;lastSeen.set(a.key,now);const item={...a,id:crypto.randomUUID(),createdAt:now};alerts.unshift(item);if(alerts.length>20)alerts.length=20;return item}
export function getAlerts(){return alerts.slice(0,10).map(a=>({...a}))}
export function resetAlerts(){alerts.length=0;lastSeen.clear()}
