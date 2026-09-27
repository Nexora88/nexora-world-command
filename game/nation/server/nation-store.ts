import {nations as initial} from "@/data/world/countries"; import type {Nation} from "@/data/world/countries";
let state:Nation[]=initial.map(n=>({...n}));
export const getCountries=()=>state.map(n=>({...n}));
export const getCountry=(id:string)=>state.find(n=>n.id===id);
export function applyCapitalLoss(countryId:string){const n=state.find(x=>x.id===countryId);if(n)n.stability=Math.max(0,n.stability-12);}
export function resetCountries(){state=initial.map(n=>({...n}));}
