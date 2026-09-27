export interface District { districtId:string; provinceId:string; name:string; population:number; resources:{oilReserve:number;iron:number;agriculture:number;energy:number}; importance:number; }
export const districts:District[]=[
{districtId:"d01",provinceId:"nwc-01",name:"Northport Central",population:1500000,resources:{oilReserve:8,iron:12,agriculture:55,energy:30},importance:80},
{districtId:"d02",provinceId:"nwc-01",name:"Coast Ward",population:900000,resources:{oilReserve:18,iron:8,agriculture:42,energy:48},importance:70},
{districtId:"d03",provinceId:"nwc-02",name:"Highland",population:700000,resources:{oilReserve:4,iron:75,agriculture:18,energy:62},importance:76},
{districtId:"d04",provinceId:"nwc-03",name:"River District",population:1200000,resources:{oilReserve:5,iron:20,agriculture:82,energy:34},importance:74},
{districtId:"d05",provinceId:"nwc-04",name:"Eastmarch City",population:2300000,resources:{oilReserve:12,iron:34,agriculture:38,energy:50},importance:91},
{districtId:"d06",provinceId:"nwc-05",name:"West Forest",population:1000000,resources:{oilReserve:9,iron:28,agriculture:65,energy:45},importance:63},
{districtId:"d07",provinceId:"nwc-06",name:"Central Basin",population:2100000,resources:{oilReserve:6,iron:30,agriculture:88,energy:40},importance:86},
{districtId:"d08",provinceId:"nwc-07",name:"Iron Coast",population:1600000,resources:{oilReserve:14,iron:92,agriculture:25,energy:58},importance:94},
{districtId:"d09",provinceId:"nwc-08",name:"Southlands",population:1300000,resources:{oilReserve:10,iron:22,agriculture:91,energy:36},importance:72}];
