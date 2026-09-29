extends Node2D
class_name MapManager

@export_file("*.json") var scenario_file := "res://data/scenarios/modern_world.json"
var province_nodes: Dictionary = {}
var scenario: Dictionary = {}

func _ready() -> void:
 GameState.province_owner_changed.connect(_on_owner_changed)
 GameState.scenario_loaded.connect(_on_scenario_loaded)
 load_scenario(scenario_file)

func load_scenario(path: String) -> bool:
 var file := FileAccess.open(path, FileAccess.READ)
 if file == null:
  push_error("Scenario not found: %s" % path)
  return false
 var parsed = JSON.parse_string(file.get_as_text())
 if typeof(parsed) != TYPE_DICTIONARY:
  push_error("Invalid scenario JSON: %s" % path)
  return false
 scenario = parsed
 GameState.load_scenario(scenario)
 return true

func _on_scenario_loaded(_scenario_id: String) -> void:
 _clear_map()
 for province_id in GameState.provinces:
  _create_province(GameState.provinces[province_id])

func _create_province(data: Dictionary) -> void:
 var id := str(data["id"])
 var polygon := Polygon2D.new()
 polygon.name = "Province_%s" % id
 polygon.polygon = _points(data.get("coordinates", []))
 polygon.color = _owner_color(str(data.get("owner_country", "")))
 polygon.set_meta("province_id", id)
 polygon.mouse_entered.connect(_on_province_hover.bind(id))
 add_child(polygon)
 province_nodes[id] = polygon
 var border := Line2D.new()
 border.width = 1.5
 border.default_color = Color("#18232b")
 border.closed = true
 border.points = polygon.polygon
 polygon.add_child(border)

func _points(raw: Array) -> PackedVector2Array:
 var points := PackedVector2Array()
 for p in raw:
  if p is Array and p.size() >= 2:
   points.append(Vector2(float(p[0]), float(p[1])))
 return points

func _owner_color(country_id: String) -> Color:
 var country := GameState.get_country(country_id)
 return Color(str(country.get("color", "#59636b")))

func _on_owner_changed(province_id: String, _new_owner: String) -> void:
 if province_nodes.has(province_id):
  province_nodes[province_id].color = _owner_color(str(GameState.get_province(province_id).get("owner_country", "")))

func _clear_map() -> void:
 for node in province_nodes.values():
  if is_instance_valid(node): node.queue_free()
 province_nodes.clear()

func _on_province_hover(_province_id: String) -> void:
 pass
