export interface PopulationState { provinceId:string; population:number; workers:number; soldiers:number; taxBase:number; growthRate:number; groups:{workers:number;farmers:number;professionals:number;soldiers:number}; }
export const populationStates:PopulationState[]=[
{provinceId:"nwc-01",population:4200000,workers:2058000,soldiers:420000,taxBase:78,growthRate:0.9,groups:{workers:1800000,farmers:900000,professionals:1080000,soldiers:420000}},
{provinceId:"nwc-02",population:1800000,workers:720000,soldiers:180000,taxBase:46,growthRate:0.6,groups:{workers:600000,farmers:540000,professionals:480000,soldiers:180000}},
{provinceId:"nwc-03",population:3100000,workers:1395000,soldiers:310000,taxBase:68,growthRate:1.1,groups:{workers:1200000,farmers:950000,professionals:640000,soldiers:310000}},
{provinceId:"nwc-04",population:5200000,workers:2600000,soldiers:520000,taxBase:92,growthRate:1.0,groups:{workers:2300000,farmers:700000,professionals:1680000,soldiers:520000}},
{provinceId:"nwc-05",population:2600000,workers:1170000,soldiers:260000,taxBase:54,growthRate:0.7,groups:{workers:900000,farmers:850000,professionals:590000,soldiers:260000}},
{provinceId:"nwc-06",population:4600000,workers:2300000,soldiers:460000,taxBase:81,growthRate:1.2,groups:{workers:1750000,farmers:1450000,professionals:940000,soldiers:460000}},
{provinceId:"nwc-07",population:3500000,workers:1750000,soldiers:350000,taxBase:86,growthRate:0.8,groups:{workers:1600000,farmers:420000,professionals:1130000,soldiers:350000}},
{provinceId:"nwc-08",population:2900000,workers:1305000,soldiers:290000,taxBase:58,growthRate:1.0,groups:{workers:1050000,farmers:1050000,professionals:510000,soldiers:290000}}];
