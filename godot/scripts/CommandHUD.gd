extends CanvasLayer
class_name NwcCommandHUD

var title: Label
var info: Label

func _ready() -> void:
 title = Label.new()
 title.position = Vector2(24, 18)
 title.add_theme_font_size_override("font_size", 24)
 title.add_theme_color_override("font_color", Color("#e8edf0"))
 add_child(title)
 info = Label.new()
 info.position = Vector2(24, 58)
 info.add_theme_font_size_override("font_size", 15)
 info.add_theme_color_override("font_color", Color("#b8c4ca"))
 add_child(info)
 GameState.scenario_loaded.connect(_refresh)
 GameState.province_selected.connect(_province)
 GameState.army_selected.connect(_army)
 _refresh(GameState.scenario_id)

func _refresh(_id: String) -> void:
 title.text = "NEXORA WORLD COMMAND  •  " + GameState.display_name
 info.text = "WORLD MAP  •  %d countries loaded  •  Middle mouse: pan  •  Wheel: zoom" % GameState.countries.size()

func _province(id: String) -> void:
 var p: Dictionary = GameState.get_province(id)
 info.text = "%s  |  Owner: %s  |  Pop: %s  |  Terrain: %s" % [
  p.get("name", id), p.get("owner_country", "—"),
  str(p.get("population", 0)), p.get("terrain", "—")
 ]

func _army(id: String) -> void:
 var a: Dictionary = GameState.get_army(id)
 info.text = "UNIT  %s  |  Strength: %s  |  Province: %s" % [
  a.get("name", id), str(a.get("strength", 0)), a.get("province_id", "—")
 ]
