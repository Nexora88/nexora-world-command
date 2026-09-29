extends Node2D
class_name NwcWorldMap

@export_file("*.geojson") var geojson_file := "res://data/world/countries.geojson"
@export var map_size := Vector2(1800, 900)
@export var border_color := Color("#26323a")
var country_nodes: Dictionary = {}
var country_centers: Dictionary = {}
var geo_features: Array = []

func _ready() -> void:
 load_world()

func load_world() -> void:
 var file := FileAccess.open(geojson_file, FileAccess.READ)
 if file == null:
  push_error("World GeoJSON not found: %s" % geojson_file)
  return
 var data: Variant = JSON.parse_string(file.get_as_text())
 if typeof(data) != TYPE_DICTIONARY:
  push_error("Invalid world GeoJSON")
  return
 geo_features = data.get("features", [])
 _clear_world()
 for feature in geo_features:
  _create_country(feature)

func _create_country(feature: Dictionary) -> void:
 var props: Dictionary = feature.get("properties", {})
 var iso := str(props.get("ISO3166-1-Alpha-2", props.get("ISO_A2", "")))
 var name := str(props.get("name", iso))
 if iso == "":
  return
 var root := Node2D.new()
 root.name = "Country_%s" % iso
 root.set_meta("country_id", iso)
 root.set_meta("country_name", name)
 add_child(root)
 country_nodes[iso] = root
 var geometry: Dictionary = feature.get("geometry", {})
 var kind := str(geometry.get("type", ""))
 var polygons: Array = geometry.get("coordinates", [])
 var all_points := PackedVector2Array()
 if kind == "Polygon":
  _add_polygon(root, polygons, all_points)
 elif kind == "MultiPolygon":
  for polygon in polygons:
   _add_polygon(root, polygon, all_points)
 if all_points.size() > 0:
  country_centers[iso] = _center_of(all_points)

func _add_polygon(root: Node2D, rings: Array, accumulator: PackedVector2Array) -> void:
 if rings.is_empty():
  return
 var points := _project_ring(rings[0])
 if points.size() < 3:
  return
 var fill := Polygon2D.new()
 fill.polygon = points
 fill.color = _country_color(str(root.get_meta("country_id")))
 root.add_child(fill)
 var border := Line2D.new()
 border.points = points
 border.closed = true
 border.width = 1.0
 border.default_color = border_color
 root.add_child(border)
 for point in points:
  accumulator.append(point)

func _project_ring(ring: Array) -> PackedVector2Array:
 var points := PackedVector2Array()
 for pair in ring:
  if pair is Array and pair.size() >= 2:
   points.append(Vector2((float(pair[0]) + 180.0) / 360.0 * map_size.x, (90.0 - float(pair[1])) / 180.0 * map_size.y))
 return points
func _center_of(points: PackedVector2Array) -> Vector2:
 var total := Vector2.ZERO
 for p in points:
  total += p
 return total / max(1, points.size())

func _country_color(iso: String) -> Color:
 if GameState.countries.has(iso):
  return Color(str(GameState.countries[iso].get("color", "#40515c")))
 var hash_value: int = abs(iso.hash())
 return Color.from_hsv(float(hash_value % 360) / 360.0, 0.32, 0.48)

func focus_country(iso: String) -> void:
 if country_centers.has(iso):
  position = -country_centers[iso] + map_size * 0.5

func get_country_center(iso: String) -> Vector2:
 return country_centers.get(iso, map_size * 0.5)

func _clear_world() -> void:
 for node in country_nodes.values():
  if is_instance_valid(node):
   node.queue_free()
 country_nodes.clear()
 country_centers.clear()

