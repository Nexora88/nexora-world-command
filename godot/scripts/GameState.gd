extends Node
class_name NwcGameState

signal province_owner_changed(province_id: String, new_owner: String)
signal province_selected(province_id: String)
signal scenario_loaded(scenario_id: String)
signal army_changed(army_id: String)
signal army_selected(army_id: String)

var scenario_id := ""
var display_name := ""
var map_settings: Dictionary = {}
var countries: Dictionary = {}
var provinces: Dictionary = {}
var cities: Dictionary = {}
var armies: Dictionary = {}
var selected_province_id := ""
var selected_army_id := ""

func load_scenario(data: Dictionary) -> void:
 scenario_id = str(data.get("scenario_id", "unknown"))
 display_name = str(data.get("display_name", scenario_id))
 map_settings = data.get("map", {})
 countries.clear()
 provinces.clear()
 cities.clear()
 armies.clear()
 for country in data.get("countries", []):
  countries[str(country["id"])] = country
 for province in data.get("provinces", []):
  provinces[str(province["id"])] = province
 for city in data.get("cities", []):
  cities[str(city["id"])] = city
 for army in data.get("armies", []):
  armies[str(army["id"])] = army
 selected_province_id = ""
 selected_army_id = ""
 scenario_loaded.emit(scenario_id)

func get_country(country_id: String) -> Dictionary:
 return countries.get(country_id, {})

func get_province(province_id: String) -> Dictionary:
 return provinces.get(province_id, {})

func get_city(city_id: String) -> Dictionary:
 return cities.get(city_id, {})

func get_army(army_id: String) -> Dictionary:
 return armies.get(army_id, {})

func set_province_owner(province_id: String, new_owner: String) -> bool:
 if not provinces.has(province_id) or not countries.has(new_owner):
  return false
 provinces[province_id]["owner_country"] = new_owner
 province_owner_changed.emit(province_id, new_owner)
 return true

func select_province(province_id: String) -> void:
 if provinces.has(province_id):
  selected_province_id = province_id
  province_selected.emit(province_id)

func select_army(army_id: String) -> void:
 if armies.has(army_id):
  selected_army_id = army_id
  army_selected.emit(army_id)

func update_army_position(army_id: String, province_id: String) -> bool:
 if not armies.has(army_id) or not provinces.has(province_id):
  return false
 armies[army_id]["province_id"] = province_id
 army_changed.emit(army_id)
 return true
func set_army_route(army_id: String, route: Array) -> bool:
 if not armies.has(army_id):
  return false
 armies[army_id]["route"] = route
 armies[army_id]["route_index"] = 0
 army_changed.emit(army_id)
 return true

func clear_selection() -> void:
 selected_province_id = ""
 selected_army_id = ""

func countries_for_region(region: String) -> Array:
 var result: Array = []
 for id in countries:
  var country: Dictionary = countries[id]
  if str(country.get("region", "")) == region:
   result.append(id)
 return result
