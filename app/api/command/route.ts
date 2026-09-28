import {NextResponse} from "next/server";
import {changeRelation,getMessages,getRelations,getResearch,setRead,startResearch,tickResearch,publishPressRelease,sendDiplomaticMessage,shareArmyPosition} from "@/game/command/server/command-store";
export const runtime="nodejs";
export async function GET(req:Request){
 const type=new URL(req.url).searchParams.get("type")??"messages";
 if(type==="diplomacy")return NextResponse.json({relations:getRelations()});
 if(type==="research")return NextResponse.json({research:tickResearch()});
 return NextResponse.json({messages:getMessages()});
}
export async function POST(req:Request){
 try{
  const b=await req.json() as Record<string,unknown>;
  if(b.type==="relation"&&typeof b.from==="string"&&typeof b.to==="string"&&typeof b.action==="string")
   return NextResponse.json({relation:changeRelation(b.from,b.to,b.action as "improve"|"trade"|"nap"|"alliance"|"embargo")});
  if(b.type==="read"&&typeof b.id==="string")return NextResponse.json({message:setRead(b.id)});
  if(b.type==="research"&&typeof b.id==="string")return NextResponse.json({research:startResearch(b.id)});
  if(b.type==="press"&&typeof b.from==="string"&&typeof b.title==="string"&&typeof b.body==="string")return NextResponse.json({message:publishPressRelease(b.from,b.title,b.body)});
  if(b.type==="diplomatic_message"&&typeof b.from==="string"&&typeof b.to==="string"&&typeof b.body==="string")return NextResponse.json({message:sendDiplomaticMessage(b.from,b.to,b.body)});
  if(b.type==="share_army_position"&&typeof b.from==="string"&&typeof b.to==="string"&&typeof b.armyName==="string"&&typeof b.provinceId==="string")return NextResponse.json({message:shareArmyPosition(b.from,b.to,b.armyName,b.provinceId)});
  throw new Error("Unknown command action.");
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Command action failed."},{status:400})}
}
