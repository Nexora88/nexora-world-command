import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export type Account={id:string;username:string;passwordHash:string;createdAt:number;lastLoginAt:number;gamesPlayed:number;history:{at:number;type:string;mode:string}[]};
const file=path.join(process.cwd(),"data","auth","accounts.json");
const ensure=()=>{fs.mkdirSync(path.dirname(file),{recursive:true});if(!fs.existsSync(file))fs.writeFileSync(file,"[]","utf8");};
const read=():Account[]=>{ensure();try{return JSON.parse(fs.readFileSync(file,"utf8")) as Account[]}catch{return[]}};
const write=(v:Account[])=>{ensure();fs.writeFileSync(file,JSON.stringify(v,null,2),"utf8")};
const norm=(v:string)=>v.trim().toLowerCase();
const hash=(password:string,salt=crypto.randomBytes(16).toString("hex"))=>{const digest=crypto.scryptSync(password,salt,64).toString("hex");return salt+":"+digest};
const verify=(password:string,stored:string)=>{const [salt,digest]=stored.split(":");if(!salt||!digest)return false;const actual=crypto.scryptSync(password,salt,64).toString("hex");return crypto.timingSafeEqual(Buffer.from(actual),Buffer.from(digest))};
const secret=()=>process.env.AUTH_SECRET||"nwc-development-secret-change-me";
export const signToken=(id:string)=>{const body=Buffer.from(JSON.stringify({id,exp:Date.now()+1000*60*60*24*30})).toString("base64url");return body+"."+crypto.createHmac("sha256",secret()).update(body).digest("base64url")};
export const verifyToken=(token:string)=>{try{const [body,sig]=token.split(".");const good=crypto.createHmac("sha256",secret()).update(body).digest("base64url");if(!sig||!crypto.timingSafeEqual(Buffer.from(sig),Buffer.from(good)))return null;const data=JSON.parse(Buffer.from(body,"base64url").toString()) as {id:string;exp:number};return data.exp>Date.now()?data.id:null}catch{return null}};
export function register(username:string,password:string){const u=norm(username);if(!/^[a-z0-9_]{3,20}$/.test(u))throw new Error("Kullanıcı adı 3-20 karakter olmalı.");if(password.length<8)throw new Error("Şifre en az 8 karakter olmalı.");const all=read();if(all.some(a=>a.username===u))throw new Error("Bu kullanıcı adı zaten kayıtlı.");const now=Date.now();const account={id:crypto.randomUUID(),username:u,passwordHash:hash(password),createdAt:now,lastLoginAt:now,gamesPlayed:0,history:[{at:now,type:"ACCOUNT_CREATED",mode:"online"}]};all.push(account);write(all);return account}
export function login(username:string,password:string){const account=read().find(a=>a.username===norm(username));if(!account||!verify(password,account.passwordHash))throw new Error("Kullanıcı adı veya şifre hatalı.");account.lastLoginAt=Date.now();account.history.push({at:account.lastLoginAt,type:"LOGIN",mode:"online"});write(read().map(a=>a.id===account.id?account:a));return account}
export function getAccount(id:string){return read().find(a=>a.id===id)||null}
export function recordGame(id:string,type="GAME_ENTER"){const all=read();const a=all.find(x=>x.id===id);if(!a)return;const now=Date.now();a.gamesPlayed+=1;a.history.push({at:now,type,mode:"online"});a.history=a.history.slice(-100);write(all)}
