import { describe,it,expect,beforeEach } from "vitest";
import { resetMovement,addProducedUnits,performMovementAction,getArmies } from "@/game/movement/server/movement-service";
import { resetWorld } from "@/game/world/server/world-store";
describe("phase 4 movement",()=>{beforeEach(()=>{resetMovement();resetWorld()});
it("forms an army from produced units",()=>{addProducedUnits("nwc-01",1000);const a=performMovementAction({type:"createArmy",provinceId:"nwc-01"});expect(a.infantry).toBe(1000);expect(a.strength).toBe(1000)});
it("only allows adjacent friendly movement",()=>{addProducedUnits("nwc-01",1000);const a=performMovementAction({type:"createArmy",provinceId:"nwc-01"});expect(()=>performMovementAction({type:"moveArmy",armyId:a.id,provinceId:"nwc-03"})).toThrow();performMovementAction({type:"moveArmy",armyId:a.id,provinceId:"nwc-02"});expect(getArmies()[0].provinceId).toBe("nwc-02")});
it("rejects zero-unit armies",()=>{expect(()=>performMovementAction({type:"createArmy",provinceId:"nwc-01"})).toThrow()});
});
