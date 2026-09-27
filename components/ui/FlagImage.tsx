"use client";
import {useState} from "react";
import {getNationFlag} from "@/data/world/countries";

type Props={countryId:string;className?:string;alt?:string};
export function FlagImage({countryId,className="",alt}:Props){
 const [failed,setFailed]=useState(false);
 const src=`/flags/${countryId.toUpperCase()}.png`;
 if(failed)return <span className={`flag-fallback ${className}`} aria-label={alt??countryId}>{getNationFlag(countryId)}</span>;
 return <img src={src} alt={alt??countryId} className={`flag-image ${className}`} onError={()=>setFailed(true)}/>;
}
