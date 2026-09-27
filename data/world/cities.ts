export interface City { cityId:string; districtId:string; name:string; population:number; isCapital?:boolean; }
export const cities:City[]=[
{cityId:"c01",districtId:"d01",name:"Nova City",population:900000,isCapital:true},
{cityId:"c02",districtId:"d02",name:"Northport Harbor",population:420000},
{cityId:"c03",districtId:"d03",name:"Highland Gate",population:280000},
{cityId:"c04",districtId:"d04",name:"River City",population:520000},
{cityId:"c05",districtId:"d05",name:"Solaris Prime",population:1300000,isCapital:true},
{cityId:"c06",districtId:"d06",name:"Westreach",population:310000},
{cityId:"c07",districtId:"d07",name:"Basin City",population:870000},
{cityId:"c08",districtId:"d08",name:"Ironhaven",population:610000},
{cityId:"c09",districtId:"d09",name:"South City",population:480000}];
