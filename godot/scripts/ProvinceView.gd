extends Node2D
class_name NwcProvinceView

signal selected(province_id: String)
var province_id := ""
var polygon_node: Polygon2D
var border_node: Line2D
var area: Area2D
var highlight: Polygon2D

func setup(data: Dictionary) -> void:
 province_id = str(data["id"])
 polygon_node = Polygon2D.new()
 polygon_node.polygon = _points(data.get("coordinates", []))
 polygon_node.color = _owner_color(str(data.get("owner_country", "")))
 polygon_node.z_index = 10
 add_child(polygon_node)
 border_node = Line2D.new()
 border_node.points = polygon_node.polygon
 border_node.closed = true
 border_node.width = 2.0
 border_node.default_color = Color("#17232b")
 border_node.z_index = 11
 add_child(border_node)
 highlight = Polygon2D.new()
 highlight.polygon = polygon_node.polygon
 highlight.color = Color(1, 1, 1, 0.0)
 highlight.z_index = 12
 add_child(highlight)
 area = Area2D.new()
 var collision := CollisionPolygon2D.new()
 collision.polygon = polygon_node.polygon
 area.add_child(collision)
 area.input_event.connect(_on_input)
 add_child(area)

func set_selected(value: bool) -> void:
 highlight.color = Color(1, 1, 1, 0.18) if value else Color(1, 1, 1, 0.0)
 border_node.width = 3.5 if value else 2.0

func apply_owner_color(country_id: String) -> void:
 polygon_node.color = _owner_color(country_id)

func _on_input(_viewport: Node, event: InputEvent, _shape: int) -> void:
 if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
  selected.emit(province_id)

func _points(raw: Array) -> PackedVector2Array:
 var points := PackedVector2Array()
 for p in raw:
  if p is Array and p.size() >= 2:
   points.append(Vector2(float(p[0]), float(p[1])))
 return points

func _owner_color(country_id: String) -> Color:
 var country := GameState.get_country(country_id)
 return Color(str(country.get("color", "#59636b")))

