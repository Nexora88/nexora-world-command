import {NextResponse} from "next/server";
import {register,login,getAccount,signToken,verifyToken,recordGame} from "@/game/auth/server/auth-store";
export const runtime="nodejs";
const cookie=(token:string)=>({name:"nwc_session",value:token,httpOnly:true,sameSite:"lax" as const,secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*24*30});
export async function GET(req:Request){
 const token=req.headers.get("cookie")?.match(/(?:^|;\s*)nwc_session=([^;]+)/)?.[1];
 const id=token?verifyToken(decodeURIComponent(token)):null; const account=id?getAccount(id):null;
 return NextResponse.json({authenticated:!!account,account:account?{id:account.id,username:account.username,createdAt:account.createdAt,gamesPlayed:account.gamesPlayed,history:account.history}:null});
}
export async function POST(req:Request){
 try{const b=await req.json();const mode=b.mode;
  if(mode==="register"){const a=register(String(b.username),String(b.password));const res=NextResponse.json({ok:true,account:{id:a.id,username:a.username,createdAt:a.createdAt,gamesPlayed:a.gamesPlayed}});res.cookies.set(cookie(signToken(a.id)));return res}
  if(mode==="login"){const a=login(String(b.username),String(b.password));const res=NextResponse.json({ok:true,account:{id:a.id,username:a.username,createdAt:a.createdAt,gamesPlayed:a.gamesPlayed}});res.cookies.set(cookie(signToken(a.id)));return res}
  if(mode==="recordGame"){const token=req.headers.get("cookie")?.match(/(?:^|;\s*)nwc_session=([^;]+)/)?.[1];const id=token?verifyToken(decodeURIComponent(token)):null;if(!id)return NextResponse.json({error:"Oturum gerekli."},{status:401});recordGame(id,String(b.type||"GAME_ENTER"));return NextResponse.json({ok:true})}
  if(mode==="logout"){const res=NextResponse.json({ok:true});res.cookies.set({...cookie(""),maxAge:0});return res}
  return NextResponse.json({error:"Geçersiz işlem."},{status:400});
 }catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Auth failed."},{status:400})}
}
