export interface StartingArmySeed { countryId:string; provinceId:string; name:string; infantry:number; tanks:number; }

// Starting forces are deliberately small and only use provinces with pre-built barracks.
export const STARTING_ARMIES:StartingArmySeed[]=[
  {countryId:"TR",provinceId:"TR_ANKARA",name:"Ankara Defense Army",infantry:3000,tanks:80},
  {countryId:"TR",provinceId:"TR_ISTANBUL",name:"Marmara Field Army",infantry:2500,tanks:60},
  {countryId:"TR",provinceId:"TR_IZMIR",name:"Aegean Army",infantry:1800,tanks:40},
  {countryId:"TR",provinceId:"TR_GAZIANTEP",name:"Southeastern Army",infantry:1600,tanks:50},
  {countryId:"DE",provinceId:"DE_BERLIN",name:"Berlin Defense Army",infantry:3000,tanks:100},
  {countryId:"DE",provinceId:"DE_HAMBURG",name:"Northern Army",infantry:1800,tanks:60},
  {countryId:"FR",provinceId:"FR_PARIS",name:"Paris Defense Army",infantry:3000,tanks:90},
  {countryId:"FR",provinceId:"FR_LYON",name:"Alpine Army",infantry:1800,tanks:50},
  {countryId:"GB",provinceId:"GB_LONDON",name:"London Defense Army",infantry:2600,tanks:70},
  {countryId:"GB",provinceId:"GB_MANCHESTER",name:"Northern Army",infantry:1600,tanks:40},
  {countryId:"RU",provinceId:"RU_MOSCOW",name:"Moscow Defense Army",infantry:4000,tanks:120},
  {countryId:"RU",provinceId:"RU_SAINT_PETERSBURG",name:"Baltic Army",infantry:2200,tanks:70},
  {countryId:"RU",provinceId:"RU_ROSTOV",name:"Southern Army",infantry:2000,tanks:60},
];
