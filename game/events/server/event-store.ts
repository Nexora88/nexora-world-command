export type WorldEventType="war"|"capture"|"capital"|"battle"|"economy"|"weather"|"ai";
export interface WorldEvent{id:string;type:WorldEventType;title:string;message:string;provinceId?:string;countryId?:string;createdAt:number;}
const events:WorldEvent[]=[];
export function pushWorldEvent(event:Omit<WorldEvent,"id"|"createdAt">){const item={...event,id:crypto.randomUUID(),createdAt:Date.now()};events.unshift(item);if(events.length>60)events.length=60;return item}
export function getWorldEvents(){return events.slice(0,30).map(e=>({...e}))}
export function resetWorldEvents(){events.length=0}
