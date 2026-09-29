extends Node2D
class_name NwcArmyLayer

var army_nodes: Dictionary = {}
var map_manager: Node

func setup(manager: Node) -> void:
 map_manager = manager
 GameState.army_changed.connect(_on_army_changed)
 GameState.scenario_loaded.connect(_on_scenario_loaded)
 _rebuild()

func _on_scenario_loaded(_id: String) -> void:
 _rebuild()

func _rebuild() -> void:
 for node in army_nodes.values():
  if is_instance_valid(node):
   node.queue_free()
 army_nodes.clear()
 for id in GameState.armies:
  _create_army(GameState.armies[id])

func _create_army(data: Dictionary) -> void:
 var province_id := str(data.get("province_id", ""))
 var position: Vector2 = map_manager.get_province_center(province_id)
 if position == Vector2(-1, -1):
  return
 var token := preload("res://scripts/ArmyToken.gd").new()
 token.setup(data, position)
 token.z_index = 50
 add_child(token)
 army_nodes[str(data["id"])] = token
func _on_army_changed(army_id: String) -> void:
 if not GameState.armies.has(army_id):
  return
 if army_nodes.has(army_id):
  army_nodes[army_id].queue_free()
  army_nodes.erase(army_id)
 _create_army(GameState.armies[army_id])

