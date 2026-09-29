extends Node2D
class_name MapManager

@export_file("*.json") var scenario_file := "res://data/scenarios/europe_1914.json"
var province_nodes: Dictionary = {}
var city_nodes: Dictionary = {}
var selected_province := ""
var world_map: NwcWorldMap
var army_layer: NwcArmyLayer

func _ready() -> void:
 GameState.province_owner_changed.connect(_on_owner_changed)
 GameState.province_selected.connect(_on_province_selected)
 GameState.scenario_loaded.connect(_on_scenario_loaded)
 _ensure_layers()
 load_scenario(scenario_file)

func _ensure_layers() -> void:
 world_map = NwcWorldMap.new()
 world_map.z_index = 0
 add_child(world_map)
 army_layer = NwcArmyLayer.new()
 army_layer.z_index = 50
 add_child(army_layer)
 army_layer.setup(self)

func load_scenario(path: String) -> bool:
 var file := FileAccess.open(path, FileAccess.READ)
 if file == null:
  push_error("Scenario not found: %s" % path)
  return false
 var parsed = JSON.parse_string(file.get_as_text())
 if typeof(parsed) != TYPE_DICTIONARY:
  push_error("Invalid scenario JSON: %s" % path)
  return false
 GameState.load_scenario(parsed)
 return true

func _on_scenario_loaded(_id: String) -> void:
 _clear_provinces()
 _create_provinces()
 _create_cities()

func _create_provinces() -> void:
 for id in GameState.provinces:
  var view := NwcProvinceView.new()
  view.setup(GameState.provinces[id])
  view.position = Vector2.ZERO
  view.selected.connect(_on_province_clicked)
  add_child(view)
  province_nodes[id] = view

func _create_cities() -> void:
 for id in GameState.cities:
  var data: Dictionary = GameState.cities[id]
  var marker := _city_marker(data)
  add_child(marker)
  city_nodes[id] = marker

func _city_marker(data: Dictionary) -> Node2D:
 var root := Node2D.new()
 root.position = _point(data.get("coordinates", [0, 0]))
 root.z_index = 35
 var dot := Polygon2D.new()
 dot.polygon = PackedVector2Array([
  Vector2(0,-7), Vector2(6,0), Vector2(0,7), Vector2(-6,0)
 ])
 dot.color = Color("#e8edf0")
 root.add_child(dot)
 var label := Label.new()
 label.text = str(data.get("name", "City"))
 label.position = Vector2(9, -14)
 label.add_theme_font_size_override("font_size", 12)
 label.modulate = Color("#d7e0e5")
 root.add_child(label)
 if bool(data.get("is_capital", false)):
  label.add_theme_color_override("font_color", Color("#ffd166"))
 return root
func _point(raw: Array) -> Vector2:
 if raw.size() >= 2:
  return Vector2(float(raw[0]), float(raw[1]))
 return Vector2.ZERO

func _on_province_clicked(province_id: String) -> void:
 GameState.select_province(province_id)

func _on_province_selected(province_id: String) -> void:
 for id in province_nodes:
  province_nodes[id].set_selected(id == province_id)
 selected_province = province_id

func _on_owner_changed(province_id: String, new_owner: String) -> void:
 if province_nodes.has(province_id):
  province_nodes[province_id].apply_owner_color(new_owner)

func get_province_center(province_id: String) -> Vector2:
 if not GameState.provinces.has(province_id):
  return Vector2(-1, -1)
 var data: Dictionary = GameState.provinces[province_id]
 var points: Array = data.get("coordinates", [])
 if points.is_empty():
  return Vector2(-1, -1)
 var center := Vector2.ZERO
 for p in points:
  center += _point(p)
 return center / points.size()

func focus_country(country_id: String) -> void:
 world_map.focus_country(country_id)

func _clear_provinces() -> void:
 for node in province_nodes.values():
  if is_instance_valid(node):
   node.queue_free()
 for node in city_nodes.values():
  if is_instance_valid(node):
   node.queue_free()
 province_nodes.clear()
 city_nodes.clear()
func change_owner(province_id: String, country_id: String) -> void:
 GameState.set_province_owner(province_id, country_id)

func set_army_route(army_id: String, route: Array) -> void:
 GameState.set_army_route(army_id, route)



