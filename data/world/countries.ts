export interface Nation { id:string; name:string; capitalProvinceId:string; population:number; governmentType:string; stability:number; treasury:number; nationalPower:number; color:string; }
export const nations:Nation[]=[
{id:"TR",name:"Turkey",capitalProvinceId:"TR_ANKARA",population:85200000,governmentType:"Republic",stability:78,treasury:125000,nationalPower:62,color:"#45c878"},
{id:"DE",name:"Germany",capitalProvinceId:"DE_BERLIN",population:84000000,governmentType:"Federal Republic",stability:80,treasury:140000,nationalPower:72,color:"#d5a84b"},
{id:"GB",name:"United Kingdom",capitalProvinceId:"GB_LONDON",population:69000000,governmentType:"Constitutional Monarchy",stability:76,treasury:135000,nationalPower:70,color:"#6f9fe8"},
{id:"RU",name:"Russia",capitalProvinceId:"RU_MOSCOW",population:144000000,governmentType:"Federal Republic",stability:68,treasury:150000,nationalPower:78,color:"#c96b6b"}
];