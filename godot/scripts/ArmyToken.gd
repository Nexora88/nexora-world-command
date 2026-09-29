extends Node2D
class_name NwcArmyToken

var army_id := ""
var route: Array = []
var route_line: Line2D
var unit_sprite: Sprite2D
var pulse := 0.0

func setup(data: Dictionary, position_2d: Vector2) -> void:
 army_id = str(data["id"])
 position = position_2d
 _build_3d_icon()
 route_line = Line2D.new()
 route_line.width = 3.0
 route_line.default_color = Color("#f4c95d")
 route_line.z_index = -1
 add_child(route_line)
 set_route(data.get("route", []))

func _build_3d_icon() -> void:
 var viewport := SubViewport.new()
 viewport.size = Vector2i(96, 96)
 viewport.transparent_bg = true
 viewport.render_target_update_mode = SubViewport.UPDATE_ALWAYS
 add_child(viewport)
 var world := World3D.new()
 viewport.world_3d = world
 var camera := Camera3D.new()
 camera.position = Vector3(0.0, 2.2, 5.5)
 camera.look_at_from_position(camera.position, Vector3(0, 0.8, 0))
 viewport.add_child(camera)
 var light := DirectionalLight3D.new()
 light.rotation_degrees = Vector3(-35, -25, 0)
 light.light_energy = 1.4
 viewport.add_child(light)
 var body := MeshInstance3D.new()
 var box := BoxMesh.new()
 box.size = Vector3(1.6, 1.0, 1.0)
 body.mesh = box
 body.position.y = 0.7
 viewport.add_child(body)
 var turret := MeshInstance3D.new()
 var cylinder := CylinderMesh.new()
 cylinder.top_radius = 0.35
 cylinder.bottom_radius = 0.42
 cylinder.height = 0.45
 turret.mesh = cylinder
 turret.position = Vector3(0, 1.4, 0)
 viewport.add_child(turret)
 var barrel := MeshInstance3D.new()
 var barrel_mesh := BoxMesh.new()
 barrel_mesh.size = Vector3(0.22, 0.22, 1.6)
 barrel.mesh = barrel_mesh
 barrel.position = Vector3(0, 1.42, -0.7)
 viewport.add_child(barrel)
 unit_sprite = Sprite2D.new()
 unit_sprite.texture = viewport.get_texture()
 unit_sprite.scale = Vector2(0.82, 0.82)
 unit_sprite.position = Vector2(0, -8)
 add_child(unit_sprite)

func set_route(points: Array) -> void:
 route = points
 if route_line:
  var packed := PackedVector2Array()
  for point in route:
   if point is Array and point.size() >= 2:
    packed.append(Vector2(float(point[0]), float(point[1])))
  route_line.points = packed

func _process(delta: float) -> void:
 pulse += delta
 if unit_sprite:
  unit_sprite.scale = Vector2.ONE * (0.82 + sin(pulse * 3.0) * 0.025)
