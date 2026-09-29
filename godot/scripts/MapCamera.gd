extends Camera2D
class_name NwcMapCamera

@export var min_zoom := 0.55
@export var max_zoom := 3.2
@export var zoom_speed := 1.12
@export var drag_speed := 1.0
var dragging := false
var last_mouse := Vector2.ZERO

func _ready() -> void:
 position = Vector2(900, 450)
 zoom = Vector2.ONE * 0.75
 make_current()

func _unhandled_input(event: InputEvent) -> void:
 if event is InputEventMouseButton:
  if event.button_index == MOUSE_BUTTON_MIDDLE:
   dragging = event.pressed
   last_mouse = event.position
  elif event.button_index == MOUSE_BUTTON_WHEEL_UP and event.pressed:
   _set_zoom(zoom.x * zoom_speed)
  elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN and event.pressed:
   _set_zoom(zoom.x / zoom_speed)
 if event is InputEventMouseMotion and dragging:
  position -= event.relative * drag_speed / zoom.x

func _set_zoom(value: float) -> void:
 var z: float = clampf(value, min_zoom, max_zoom)
 zoom = Vector2.ONE * z

func _process(_delta: float) -> void:
 position.x = clamp(position.x, -300.0, 2100.0)
 position.y = clamp(position.y, -200.0, 1100.0)

