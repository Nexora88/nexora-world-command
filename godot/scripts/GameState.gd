extends Node
class_name NwcGameState
signal province_owner_changed(province_id: String, new_owner: String)
signal scenario_loaded(scenario_id: String)
var scenario_id := ""
var countries: Dictionary = {}
var provinces: Dictionary = {}
func load_scenario(data: Dictionary) -> void:
 scenario_id = str(data.get("scenario_id", "unknown"))
 countries.clear()
 provinces.clear()
 for country in data.get("countries", []):
  countries[str(country["id"])] = country
 for province in data.get("provinces", []):
  provinces[str(province["id"])] = province
 scenario_loaded.emit(scenario_id)
func get_country(country_id: String) -> Dictionary:
 return countries.get(country_id, {})
func get_province(province_id: String) -> Dictionary:
 return provinces.get(province_id, {})
func set_province_owner(province_id: String, new_owner: String) -> bool:
 if not provinces.has(province_id) or not countries.has(new_owner): return false
 provinces[province_id]["owner_country"] = new_owner
 province_owner_changed.emit(province_id, new_owner)
 return true
