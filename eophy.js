/// <reference path="./onetap.d.ts" />
var bit = {}

bit.band = function(a, b) {return a & b }
bit.lshift = function(a, b) {return a << b}
bit.rshift = function(a, b) {return a >> b}
bit.bnot = function(a) {return ~a}

var   IN_ATTACK              = bit.lshift(1, 0) 
var   IN_JUMP                = bit.lshift(1, 1) 
var   IN_DUCK                = bit.lshift(1, 2) 
var   IN_FORWARD             = bit.lshift(1, 3) 
var   IN_BACK                = bit.lshift(1, 4) 
var   IN_USE                 = bit.lshift(1, 5) 
var   IN_CANCEL              = bit.lshift(1, 6) 
var   IN_LEFT                = bit.lshift(1, 7) 
var   IN_RIGHT               = bit.lshift(1, 8) 
var   IN_MOVELEFT            = bit.lshift(1, 9) 
var   IN_MOVERIGHT           = bit.lshift(1, 10) 
var   IN_ATTACK2             = bit.lshift(1, 11) 
var   IN_RUN                 = bit.lshift(1, 12)
var   IN_RELOAD              = bit.lshift(1, 13) 
var   IN_ALT1                = bit.lshift(1, 14)
var   IN_ALT2                = bit.lshift(1, 15)
var   IN_SCORE               = bit.lshift(1, 16)
var   IN_SPEED               = bit.lshift(1, 17)
var   IN_WALK                = bit.lshift(1, 18)
var   IN_ZOOM                = bit.lshift(1, 19) 
var   IN_WEAPON1             = bit.lshift(1, 20)
var   IN_WEAPON2             = bit.lshift(1, 21)
var   IN_BULLRUSH            = bit.lshift(1, 22)
//ЕБАНЫЙ ПИЗДЕЦ АЛО
var   FL_ONGROUND            = bit.lshift(1, 0)
var   FL_DUCKING             = bit.lshift(1, 1)
var   FL_WATERJUMP           = bit.lshift(1, 3)
var   FL_ONTRAIN             = bit.lshift(1, 4)
var   FL_INRAIN              = bit.lshift(1, 5)
var   FL_FROZEN              = bit.lshift(1, 6)
var   FL_ATCONTROLS          = bit.lshift(1, 7)
var   FL_CLIENT              = bit.lshift(1, 8)
var   FL_FAKECLIENT          = bit.lshift(1, 9)
var   FL_INWATER             = bit.lshift(1, 10)


var script = {}

script.name = 'eophy OBT'
script.build = 'beta, not released' //ПХПХПХХПХП NOT RELIEASD 

Math.deg = function (rad) {
    return rad * (180 / Math.PI)
}

Math.rad = function (deg) {
    return deg * (Math.PI / 180)
}

Math.yaw_normalize = function (yaw) {
    while (yaw > 180) {
        yaw = yaw - 360
    }

    while (yaw < -180) {
        yaw = yaw + 360
    }

    return yaw
}

Math.forward = function (angle, forward) {
    var sin_pitch = Math.sin(Math.rad(angle[0]))
    var sin_yaw = Math.sin(Math.rad(angle[1]))
    var cos_pitch = Math.cos(Math.rad(angle[0]))
    var cos_yaw = Math.cos(Math.rad(angle[1]))
    
    return [
        cos_pitch * cos_yaw * forward,
        cos_pitch * sin_yaw * forward,
        -sin_pitch * forward
    ]
}

Math.vector_to_angle = function (vec) {
	var	temp, yaw, pitch
	if (vec[1] == 0 && vec[0] == 0) {
		yaw = 0
		if (vec[2] > 0) {
			pitch = 270
		} else {
			pitch = 90
		}
	} else {
		yaw = Math.atan2(vec[1], vec[0]) * 180 / Math.PI
		if (yaw < 0) {
			yaw += 360
		}
		temp = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1])
		pitch = Math.atan2(-vec[2], temp) * 180 / Math.PI
		if (pitch < 0){
			pitch += 360
		}
	}
	return ([pitch, yaw, 0])
}

Math.clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max)
}

Math.lerp = function (time, start_pos, end_pos) {

    time = Math.clamp(Globals.Frametime() * time * 175, 0, 1)

    if (typeof(start_pos) == 'object') {
        var r = start_pos[0], 
            g = start_pos[1],
            b = start_pos[2],
            a = start_pos[3]

        var e_r = end_pos[0],
            e_g = end_pos[1],
            e_b = end_pos[2],
            e_a = end_pos[3]

        r = Math.lerp(time, r, e_r)
        g = Math.lerp(time, g, e_g)
        b = Math.lerp(time, b, e_b)
        a = Math.lerp(time, a, e_a)

        return [r, g, b, a]
    }

    var delta = end_pos - start_pos
    delta = delta * time
    delta = delta + start_pos

    if (end_pos == 0 && delta < 0.01 && delta > -0.01) {
        delta = 0
    } else if (end_pos == 1 && delta < 1.01 && delta > 0.99) {
        delta = 1
    }

    return delta
}

Math.dLerp = function(value, min, max) {
    return min * (1 - value) + max * value
}

Math.vector_lerp = function (time, a, b) {
    return [
        Math.dLerp(time, a[0], b[0]),
        Math.dLerp(time, a[1], b[1]),
        Math.dLerp(time, a[2], b[2])
    ]
}

Math.vector_sum = function (vec, vec2) {
    return [
        vec[0] + vec2[0],
        vec[1] + vec2[1],
        vec[2] + vec2[2]
    ]
}

Math.vector_sub = function (vec, vec2) {
    return [
        vec[0] - vec2[0],
        vec[1] - vec2[1],
        vec[2] - vec2[2]
    ]
}

Math.vector_div = function (vec, vec2) {
    return [
        vec[0] / vec2[0],
        vec[1] / vec2[1],
        vec[2] / vec2[2]
    ]
}

Math.vector_mul = function (vec, vec2) {
    return [
        vec[0] * vec2[0],
        vec[1] * vec2[1],
        vec[2] * vec2[2]
    ]
}

Math.dLerpReverse = function(value, min, max) {
    return (value - min) / (max - min)
}

Math.LerpColor = function(value, min, max) {

    var r = min[0] * (1-value) + max[0] * value
    var g = min[1] * (1-value) + max[1] * value
    var b = min[2] * (1-value) + max[2] * value
    var a = min[3] * (1-value) + max[3] * value
    return [r, g, b, a]
}

Math.distance = function (vec, vec2) {
    return Math.sqrt(
        Math.pow(vec2[0] - vec[0], 2) + Math.pow(vec2[1] - vec[1], 2) + Math.pow(vec2[2] - vec[2], 2)
    )
}

var render = {}

//ДЕЛО В ТОМ, ЧТО ВАНТАП ХАВАЕТ ФПС, КОГДА РЕНДЕРИШЬ ЛЮБУЮ ХУЙНЮ С ПРОЗРАЧНОСТЬЮ НОЛЬ
//думаю кому не похуй тот предложит вариант получше, как это можно сделать) пока только так
//все аргументы те же

render.Gradient = function(x, y, w, h, top_left, top_right, bottom_left, bottom_right) {
    if (h < w) {
        for (i = 0; i < h; i++) {
            render.GradientRect(x, y + i, w, 1, 1, Math.LerpColor(i / h, top_left, bottom_left), Math.LerpColor(i / h, top_right, bottom_right))
        }
    }
    else {
        for (i = 0; i < w; i++) {
            render.GradientRect(x + i, y, 1, h, 0, Math.LerpColor(i / w, top_left, top_right), Math.LerpColor(i / w, bottom_left , bottom_right))
        }
    }
} //Сорян если фпса мало будет )

render.GetFont = function () {
    return Render.GetFont(arguments[0], arguments[1], arguments[2])
}

render.TextSize = function () {
    return Render.TextSize(arguments[0], arguments[1])
}

render.String = function () {
    if (arguments[4][3] == 0) {
        return
    }

    var y_remove_leave = arguments[6] ? 0 : 2

    Render.String(arguments[0],
        arguments[1] - y_remove_leave,
        arguments[2],
        arguments[3],
        arguments[4],
        arguments[5])

    if (arguments[5] == undefined) {
        //я ваще не ебу почему крашила эта строка когда я конфиги делал
        Cheat.Print(arguments[3] + ' please DM script author. \n')
    }
}

render.FilledCircle = function () {
    if (arguments[3][3] == 0) {
        return
    }

    Render.FilledCircle(arguments[0],
        arguments[1],
        arguments[2],
        arguments[3])
}

render.Polygon = function () {
    if (arguments[1][3] == 0) {
        return
    }

    Render.Polygon(arguments[0],
        arguments[1])
}

render.GradientRect = function () {
    if (arguments[5][3] == 0 && arguments[6][3] == 0) {
        return
    }

    Render.GradientRect(arguments[0],
        arguments[1],
        arguments[2],
        arguments[3],
        arguments[4],
        arguments[5],
        arguments[6])
}

render.GetScreenSize = function () {
    return Render.GetScreenSize()
}

render.WorldToScreen = function () {
    return Render.WorldToScreen(arguments[0])
}

render.Circle = function () {
    if (arguments[3][3] == 0) {
        return
    }

    Render.Circle(arguments[0],
        arguments[1],
        arguments[2],
        arguments[3])
}

render.FilledRect = function () {
    if (arguments[4][3] == 0) {
        return
    }

    Render.FilledRect(arguments[0],
        arguments[1],
        arguments[2],
        arguments[3],
        arguments[4])
}

render.Rect = function () {
    if (arguments[4][3] == 0) {
        return
    }

    Render.Rect(arguments[0],
        arguments[1],
        arguments[2],
        arguments[3],
        arguments[4])
}

render.Line = function () {
    if (arguments[4][3] == 0) {
        return
    }

    Render.Line(arguments[0],
        arguments[1],
        arguments[2],
        arguments[3],
        arguments[4])
}


Entity.Extrapolate = function (player, ticks, vector) {
    var velocity = Entity.GetProp(player, 'CBasePlayer', 'm_vecVelocity[0]')

    var new_vector = [
        vector[0] + Globals.TickInterval() * velocity[0] * ticks,
        vector[1] + Globals.TickInterval() * velocity[1] * ticks,
        vector[2] + Globals.TickInterval() * velocity[2] * ticks
    ]

    return new_vector
}

//Решил, так сказать, повыебываться -_-



var defines = {}
//возвращает хитбоксы для каждой хитгрупы (для хитмаркера)
defines.hitboxes_by_hitgroup = function (hitgroup) {
    var hitgroups = []
    
    hitgroups[1] = [0, 1]
    hitgroups[2] = [4, 5, 6]
    hitgroups[3] = [2, 3]
    hitgroups[4] = [13, 15, 16]
    hitgroups[5] = [14, 17, 18]
    hitgroups[6] = [7, 9, 11]
    hitgroups[7] = [8, 10, 12]

    if (hitgroups[hitgroup] == undefined) {
        return
    }

    return hitgroups[hitgroup]
}

defines.key_names = [
    "-", "mouse1", "mouse2", "break", "mouse3", "mouse4", "mouse5", "-", "backspace", "tab", "-", "-", "-", "enter", "-", "-", "shift", "control", "alt", "pause", "capslock", "-", "-", "-", "-", "-", "-", "escape", "-", "-", "-", "-", "space", "page up", "page down", "end", "home", "left", "up", "right", "down", "-", "Print", "-", "print screen", "insert", "delete", "-", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "-", "-", "-", "-", "-", "Error", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "left windows", "right windows", "-", "-", "-", "insert", "end", "down", "page down", "left", "numpad 5", "right", "home", "up", "page up", "*", "+", "_", "-", ".", "/", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12", "f13", "f14", "f15", "f16", "f17", "f18", "f19", "f20", "f21", "f22", "f23", "f24", "-", "-", "-", "-", "-", "-", "-", "-", "number lock", "scroll lock", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "shift", "right shift", "control", "right control", "menu", "right menu", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "next", "previous", "stop", "toggle", "-", "-", "-", "-", "-", "-", ";", "+", ",", "-", ".", "/?", "~", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "[{", "\\|", "}]", "'\"", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-", "-"
]
//названия кнопок по ключам
//спасибо klient

defines.screen_size = render.GetScreenSize()

defines.alpha_override = function (color, new_alpha) {
    return [color[0], color[1], color[2], 255 * new_alpha]
}

defines.alpha_multiply = function (color, multiplier) {
    return [color[0], color[1], color[2], color[3] * multiplier]
}

defines.colors_equal = function (a, b) {
    return a[0] == b[0] && a[1] == b[1] && a[2] == b[2] && a[3] == b[3]
} 

defines.in_bounds = function (source, start_pos, size) {
    return source[0] >= start_pos[0] && source[1] >= start_pos[1] && source[0] < (start_pos[0] + size[0]) && source[1] < (start_pos[1] + size[1])
}

defines.rbg_to_hsv = function (rgb_color) {
    var r = rgb_color[0] / 255,
        g = rgb_color[1] / 255,
        b = rgb_color[2] / 255,
        a = rgb_color[3]
    var v = Math.max(r, g, b), c = v - Math.min(r, g, b);
    var h = c && ((v==r) ? (g - b) / c : ((v == g) ? 2 + (b - r) / c : 4 + (r - g) / c)); 
    
    return [(1 / 6) * (h < 0 ? h + 6 : h), v && c / v, v, a];
} //лан ебало закройте насчет кода

defines.hsv_to_rbg = function (hsv_color) {
    var r, g, b, i, f, p, q, t;
    var h = hsv_color[0],
        s = hsv_color[1],
        v = hsv_color[2],
        a = hsv_color[3]
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a]
}

var input = {}

input.cursor = function () {
    return Input.GetCursorPosition()
}

input.pressed_keys = []
input.last_pressed_keys = []

input.pressed = function (key_code) {
    return input.pressed_keys[key_code] && !input.last_pressed_keys[key_code]
}

input.released = function (key_code) {
    return !input.pressed_keys[key_code] && input.last_pressed_keys[key_code]
}

input.held = function (key_code) {
    return Input.IsKeyPressed(key_code)
}

input.cache_cursor_pos = input.cursor()
input.cursor_pos = input.cursor()

input.held_cursor = function () {
    if (!input.held(0x01)) {
        input.cursor_pos = input.cache_cursor_pos
    }

    input.cache_cursor_pos = input.cursor()

    return input.cursor_pos
} //думаю дохуища фпса хавает

input.update = function () {
    input.held_cursor() //наверн я долбоеб но я не понимаю почему оно не работало без этого
    for (i = 1; i < 255; i++) {
        input.last_pressed_keys[i] = input.pressed_keys[i]
        input.pressed_keys[i] = Input.IsKeyPressed(i)
    }
}

var drag = {}

drag.item_list = []
drag.existing_items = []
//Ну драг система драг системой
drag.new = function (name, start_pos_x, start_pos_y) { //float [0, 1]
    
    menu.add_slider('Settings', 'Configs', name + 'pos_x', Math.floor(defines.screen_size[0] * start_pos_x), 0, defines.screen_size[0], function () {
        return false
    }, undefined, undefined, true)

    menu.add_slider('Settings', 'Configs', name + 'pos_y', Math.floor(defines.screen_size[1] * start_pos_y), 0, defines.screen_size[1], function () {
        return false
    }, undefined, undefined, true)

    drag.existing_items.push(name)
}

drag.current_dragging_item = undefined

drag.handle = function (x, y, w, h, name) {

    if (drag.existing_items.indexOf(name) == -1) {
        throw new Error('Can`t find element.')
    }

    if (!drag.item_list[name]) {
        drag.item_list[name] = {}
        drag.item_list[name].drag_position = [0, 0]
        drag.item_list[name].is_dragging = false
    }

    var cursor = input.cursor()

    if (defines.in_bounds(cursor, [x, y], [w, h]) && defines.in_bounds(cursor, [0, 0], defines.screen_size)) {
        if (input.held(0x01) && !drag.item_list[name].is_dragging && (drag.current_dragging_item == undefined || drag.current_dragging_item == name)) {
            drag.item_list[name].is_dragging = true
            drag.current_dragging_item = name
            drag.item_list[name].drag_position = [x - cursor[0], y - cursor[1]]
        }
    }

    if (!defines.in_bounds(cursor, [0, 0], defines.screen_size)) {
        drag.item_list[name].is_dragging = false
    }

    if (!input.held(0x01)) {
        drag.item_list[name].is_dragging = false
        drag.current_dragging_item = undefined
    }

    if (drag.item_list[name].is_dragging == true && UI.IsMenuOpen()) {
        menu.set_value('Settings', 'Configs', name + 'pos_x', 
            Math.clamp(cursor[0] + drag.item_list[name].drag_position[0], 0, defines.screen_size[0] - w))
        
        menu.set_value('Settings', 'Configs', name + 'pos_y', 
            Math.clamp(cursor[1] + drag.item_list[name].drag_position[1], 0, defines.screen_size[1] - h))
    }
}

drag.get_position = function (name) {
    return [
        menu.get_value('Settings', 'Configs', name + 'pos_x'),
        menu.get_value('Settings', 'Configs', name + 'pos_y')
    ]
}


var visuals = {}

visuals.is_rendering = false
visuals.animation_time = 0.095

visuals.animation_list = []

//я вот эту хуинищу вырезал, жрала дохуя фпса, когда менюшка была закрыта
//жаль что я не JS SKRIPTS OMPTIMIZER, потому я не ебу, как лучше писать
//если кто то шарит за оптимизацию - буду рад помощи :) оценю как я, так и юзеры

visuals.update_animations = function () {
    /*
    for (k in visuals.animation_list) {
        if (!visuals.animation_list[k] || !visuals.animation_list[k].called_this_frame) {
            if (typeof(visuals.get_animation(k).number) == 'object') {
                if (defines.colors_equal(visuals.new_animation(k, [0, 0, 0, 0], true), [0, 0, 0, 0])) {
                    visuals.animation_list[k] = undefined
                }
            } else {
                if (visuals.new_animation(k, 0, true) == 0) {
                    visuals.animation_list[k] = undefined
                }
            }

            continue
        }

        visuals.animation_list[k].called_this_frame = false
    }
    

    ФПСА ДОХУЩИА ЖРЕТ
    
    */
}

visuals.new_animation = function (name, new_value, removing, speed_multiplier) {

    if (!visuals.animation_list[name]) {
        visuals.animation_list[name] = {}
        visuals.animation_list[name].color = [0, 0, 0, 0]
        visuals.animation_list[name].number = 0
        visuals.animation_list[name].called_this_frame = true
    }

    if (!removing) {
        visuals.animation_list[name].called_this_frame = true
    }

    if (!speed_multiplier) {
        speed_multiplier = 1
    }

    if (typeof(new_value) == 'object') {

        var lerping = Math.lerp(
            visuals.animation_time * speed_multiplier,
            visuals.animation_list[name].color,
            new_value)

        visuals.animation_list[name].color = lerping

        return lerping
    }

    var lerping = Math.lerp(
        visuals.animation_time * speed_multiplier,
        visuals.animation_list[name].number,
        new_value)

    visuals.animation_list[name].number = lerping

    return lerping
}

visuals.get_animation = function (name) {
    return !visuals.animation_list[name] ? {
        number : 0,
        color : [0, 0, 0, 0],
        called_this_frame : false
    } : visuals.animation_list[name]
}

visuals.start_render = function () {
    if (!menu.get_value('Visuals', 'Main', 'Enable')) {
        visuals.is_rendering = false
        return
    }

    var world_map_name = World.GetMapName()

    if (!world_map_name) {
        visuals.is_rendering = false
        return
    }

    var localplayer = Entity.GetLocalPlayer()

    if (!localplayer) {
        visuals.is_rendering = false
        return
    }

    if (!Entity.IsAlive(localplayer)) {
        visuals.is_rendering = false
        return
    }

    visuals.is_rendering = true
}

visuals.end_render = function () {
    input.update()
    visuals.update_animations()
    visuals.is_rendering = false
}

var menu = {}

menu.position = [400, 400]

menu.items = []

// бля думаю лучше сделать попроще через = {k : v}

menu.add_tab = function (name) {

    if (!menu.current_tab) {
        menu.current_tab = name
    }

    menu.items[name] = {}
    menu.items[name].items = []
    menu.items[name].name = name
}

menu.add_subtab = function(tab, name) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (Object.keys(menu.items[tab].items).length >= 2) {
        throw new Error('Reached maximum quantity of subtabs.')
    }

    menu.items[tab].items[name] = {}
    menu.items[tab].items[name].items = []
    menu.items[tab].items[name].tab = tab
    menu.items[tab].items[name].name = name 
}

menu.add_checkbox = function (tab, subtab, name, def_value, visibility_condition, hint, subscribed_function, skip_config) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    menu.items[tab].items[subtab].items[name] = {}
    menu.items[tab].items[subtab].items[name].name = name
    menu.items[tab].items[subtab].items[name].tab = tab
    menu.items[tab].items[subtab].items[name].subtab = subtab
    menu.items[tab].items[subtab].items[name].type = 'checkbox'
    menu.items[tab].items[subtab].items[name].value = def_value
    menu.items[tab].items[subtab].items[name].hint = hint

    if (visibility_condition == undefined) {
        visibility_condition = function () {
            return true
        }
    }

    if (subscribed_function == undefined) {
        subscribed_function = function () {}
    }

    menu.items[tab].items[subtab].items[name].visibility_condition = visibility_condition
    menu.items[tab].items[subtab].items[name].subscribed_function = subscribed_function
    menu.items[tab].items[subtab].items[name].hint_timer = 0

    if (skip_config == undefined) {
        skip_config = false
    }

    menu.items[tab].items[subtab].items[name].skip_config = skip_config

    return menu.items[tab].items[subtab].items[name]
}

menu.add_slider = function (tab, subtab, name, def_value, min, max, visibility_condition, hint, subscribed_function, skip_config) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    menu.items[tab].items[subtab].items[name] = {}
    menu.items[tab].items[subtab].items[name].name = name
    menu.items[tab].items[subtab].items[name].tab = tab
    menu.items[tab].items[subtab].items[name].subtab = subtab
    menu.items[tab].items[subtab].items[name].type = 'slider'
    menu.items[tab].items[subtab].items[name].value = def_value
    menu.items[tab].items[subtab].items[name].min = min
    menu.items[tab].items[subtab].items[name].max = max
    menu.items[tab].items[subtab].items[name].hint = hint

    if (visibility_condition == undefined) {
        visibility_condition = function () {
            return true
        }
    }

    if (subscribed_function == undefined) {
        subscribed_function = function () {}
    }

    menu.items[tab].items[subtab].items[name].visibility_condition = visibility_condition
    menu.items[tab].items[subtab].items[name].subscribed_function = subscribed_function
    menu.items[tab].items[subtab].items[name].cache_value = def_value
    menu.items[tab].items[subtab].items[name].hint_timer = 0

    if (skip_config == undefined) {
        skip_config = false
    }

    menu.items[tab].items[subtab].items[name].skip_config = skip_config

    return menu.items[tab].items[subtab].items[name]
}

menu.add_dropdown = function (tab, subtab, name, options, def_value, visibility_condition, hint, subscribed_function, skip_config) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    menu.items[tab].items[subtab].items[name] = {}
    menu.items[tab].items[subtab].items[name].name = name
    menu.items[tab].items[subtab].items[name].tab = tab
    menu.items[tab].items[subtab].items[name].subtab = subtab
    menu.items[tab].items[subtab].items[name].type = 'dropdown'
    menu.items[tab].items[subtab].items[name].value = def_value
    menu.items[tab].items[subtab].items[name].options = options
    menu.items[tab].items[subtab].items[name].is_visible = false
    menu.items[tab].items[subtab].items[name].hint = hint

    if (visibility_condition == undefined) {
        visibility_condition = function () {
            return true
        }
    }

    if (subscribed_function == undefined) {
        subscribed_function = function () {}
    }

    menu.items[tab].items[subtab].items[name].visibility_condition = visibility_condition
    menu.items[tab].items[subtab].items[name].subscribed_function = subscribed_function
    menu.items[tab].items[subtab].items[name].hint_timer = 0

    if (skip_config == undefined) {
        skip_config = false
    }

    menu.items[tab].items[subtab].items[name].skip_config = skip_config

    return menu.items[tab].items[subtab].items[name]
}

menu.add_multidropdown = function (tab, subtab, name, options, def_value, visibility_condition, hint, subscribed_function, skip_config) { //def_value [bool, bool, bool]

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    if (def_value == undefined) {
        def_value = (function (len, new_value) {
            var table = []
        
            for (i = 0; i < len; i++) {
                table[i] = new_value
            }
        
            return table
        })(options.length, false)
    }

    menu.items[tab].items[subtab].items[name] = {}
    menu.items[tab].items[subtab].items[name].name = name
    menu.items[tab].items[subtab].items[name].tab = tab
    menu.items[tab].items[subtab].items[name].subtab = subtab
    menu.items[tab].items[subtab].items[name].type = 'multidropdown'
    menu.items[tab].items[subtab].items[name].value = def_value
    menu.items[tab].items[subtab].items[name].options = options
    menu.items[tab].items[subtab].items[name].is_visible = false
    menu.items[tab].items[subtab].items[name].hint = hint

    if (visibility_condition == undefined) {
        visibility_condition = function () {
            return true
        }
    }

    if (subscribed_function == undefined) {
        subscribed_function = function () {}
    }

    menu.items[tab].items[subtab].items[name].visibility_condition = visibility_condition
    menu.items[tab].items[subtab].items[name].subscribed_function = subscribed_function
    menu.items[tab].items[subtab].items[name].hint_timer = 0

    if (skip_config == undefined) {
        skip_config = false
    }

    menu.items[tab].items[subtab].items[name].skip_config = skip_config

    return menu.items[tab].items[subtab].items[name]
}

menu.add_colorpicker = function (tab, subtab, name, def_value, visibility_condition, hint, subscribed_function, skip_config) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    menu.items[tab].items[subtab].items[name] = {}
    menu.items[tab].items[subtab].items[name].name = name
    menu.items[tab].items[subtab].items[name].tab = tab
    menu.items[tab].items[subtab].items[name].subtab = subtab
    menu.items[tab].items[subtab].items[name].type = 'colorpicker'
    menu.items[tab].items[subtab].items[name].value = def_value
    menu.items[tab].items[subtab].items[name].hsv = defines.rbg_to_hsv(def_value)
    menu.items[tab].items[subtab].items[name].is_visible = false
    menu.items[tab].items[subtab].items[name].hint = hint

    if (visibility_condition == undefined) {
        visibility_condition = function () {
            return true
        }
    }

    if (subscribed_function == undefined) {
        subscribed_function = function () {}
    }

    menu.items[tab].items[subtab].items[name].visibility_condition = visibility_condition
    menu.items[tab].items[subtab].items[name].subscribed_function = subscribed_function
    menu.items[tab].items[subtab].items[name].cache_value = def_value
    menu.items[tab].items[subtab].items[name].hint_timer = 0

    if (skip_config == undefined) {
        skip_config = false
    }

    menu.items[tab].items[subtab].items[name].skip_config = skip_config

    return menu.items[tab].items[subtab].items[name]
}

menu.add_button = function (tab, subtab, name, func, visibility_condition, hint) { 

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    if (func == undefined) {
        func = function () {
            Cheat.Print('[' + script.name + '] Empty button funciton. \n')
        }
    }

    menu.items[tab].items[subtab].items[name] = {}
    menu.items[tab].items[subtab].items[name].name = name
    menu.items[tab].items[subtab].items[name].tab = tab
    menu.items[tab].items[subtab].items[name].subtab = subtab
    menu.items[tab].items[subtab].items[name].type = 'button'
    menu.items[tab].items[subtab].items[name].func = func
    menu.items[tab].items[subtab].items[name].hint = hint

    if (visibility_condition == undefined) {
        visibility_condition = function () {
            return true
        }
    }

    menu.items[tab].items[subtab].items[name].visibility_condition = visibility_condition
    menu.items[tab].items[subtab].items[name].hint_timer = 0

    return menu.items[tab].items[subtab].items[name]
}

menu.add_keybind = function (tab, subtab, name, visibility_condition, hint, skip_config) { 

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    menu.items[tab].items[subtab].items[name] = {}
    menu.items[tab].items[subtab].items[name].name = name
    menu.items[tab].items[subtab].items[name].tab = tab
    menu.items[tab].items[subtab].items[name].subtab = subtab
    menu.items[tab].items[subtab].items[name].type = 'keybind'
    menu.items[tab].items[subtab].items[name].key = undefined
    menu.items[tab].items[subtab].items[name].value = false
    menu.items[tab].items[subtab].items[name].listening = false
    menu.items[tab].items[subtab].items[name].modes = ['Hold', 'Toggle', 'Always']
    menu.items[tab].items[subtab].items[name].mode = 0
    menu.items[tab].items[subtab].items[name].is_visible = false
    menu.items[tab].items[subtab].items[name].hint = hint

    if (visibility_condition == undefined) {
        visibility_condition = function () {
            return true
        }
    }

    menu.items[tab].items[subtab].items[name].visibility_condition = visibility_condition
    menu.items[tab].items[subtab].items[name].hint_timer = 0

    if (skip_config == undefined) {
        skip_config = false
    }

    menu.items[tab].items[subtab].items[name].skip_config = skip_config

    return menu.items[tab].items[subtab].items[name]
}

menu.add_label = function (tab, subtab, name, text, visibility_condition, hint) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    menu.items[tab].items[subtab].items[name] = {}
    menu.items[tab].items[subtab].items[name].name = name
    menu.items[tab].items[subtab].items[name].tab = tab
    menu.items[tab].items[subtab].items[name].subtab = subtab
    menu.items[tab].items[subtab].items[name].type = 'label'
    menu.items[tab].items[subtab].items[name].text = text
    menu.items[tab].items[subtab].items[name].hint = hint

    if (visibility_condition == undefined) {
        visibility_condition = function () {
            return true
        }
    }

    menu.items[tab].items[subtab].items[name].visibility_condition = visibility_condition
    menu.items[tab].items[subtab].items[name].hint_timer = 0

    return menu.items[tab].items[subtab].items[name]
}

menu.get_value = function (tab, subtab, name) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab. ')
    }

    if (!menu.items[tab].items[subtab].items[name]) {
        throw new Error('Can`t find item. ')
    }

    return menu.items[tab].items[subtab].items[name].value
}

menu.destroy = function (tab, subtab, name) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    if (!menu.items[tab].items[subtab].items[name]) {
        throw new Error('Can`t find item.')
    }

    menu.items[tab].items[subtab].items[name] = undefined
}

menu.set_value = function (tab, subtab, name, new_value) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    if (!menu.items[tab].items[subtab].items[name]) {
        throw new Error('Can`t find item.')
    }

    menu.items[tab].items[subtab].items[name].value = new_value
    menu.items[tab].items[subtab].items[name].subscribed_function()

    var item_type = menu.items[tab].items[subtab].items[name].type

    if (item_type == 'colorpicker') {
        menu.items[tab].items[subtab].items[name].hsv = defines.rbg_to_hsv(new_value)
    }

    if (item_type == 'colorpicker' || item_type == 'slider') {
        menu.items[tab].items[subtab].items[name].cache_value = new_value
    }

}

menu.set_keybind = function (tab, subtab, name, key, mode) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    if (!menu.items[tab].items[subtab].items[name]) {
        throw new Error('Can`t find item.')
    }

    if (key == 0) {
        key = undefined
    }

    menu.items[tab].items[subtab].items[name].key = key
    menu.items[tab].items[subtab].items[name].mode = mode
}
//подвязывает функцию к элементу, чтобы она выполнялась при каждой дрочке элемента
menu.subscribe = function (tab, subtab, name, func) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    if (!menu.items[tab].items[subtab].items[name]) {
        throw new Error('Can`t find item.')
    }

    menu.items[tab].items[subtab].items[name].subscribed_function = func
}

menu.update_list = function (tab, subtab, name, new_table) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    if (!menu.items[tab].items[subtab].items[name]) {
        throw new Error('Can`t find item.')
    }

    if (!menu.items[tab].items[subtab].items[name].type.includes('dropdown')) {
        throw new Error('Not-a-dropdown')
    }

    menu.items[tab].items[subtab].items[name].options = new_table
    menu.items[tab].items[subtab].items[name].value = menu.items[tab].items[subtab].items[name].type == 'dropdown' ? 0 : (function (len, new_value) {
        var table = []
    
        for (i = 0; i < len; i++) {
            table[i] = new_value
        }
    
        return table
    })(new_table.length, false)
}

menu.get_item = function (tab, subtab, name) {

    if (!menu.items[tab]) {
        throw new Error('Can`t find tab.')
    }

    if (!menu.items[tab].items[subtab]) {
        throw new Error('Can`t find subtab.')
    }

    if (!menu.items[tab].items[subtab].items[name]) {
        throw new Error('Can`t find item.')
    }

    return menu.items[tab].items[subtab].items[name]
}

menu.colors = {}
menu.colors.current_theme = 'Default'
menu.colors.themes = []
menu.colors.themes_table = []

menu.colors.new_theme = function (name, colors) {
    menu.colors.themes[name] = colors
    menu.colors.themes_table.push(name)
}

menu.colors.new_theme('Default', {
    MAIN_THEME_COLOR : [255, 170, 0, 255],

    BACKGROUND_COLOR : [15, 15, 20, 255],
    BACKGROUND_OUTLINE_COLOR : [32, 32, 32, 255],

    TAB_ACTIVE_COLOR : [255, 170, 0, 255],
    TAB_INACTIVE_COLOR : [69, 69, 69, 255],

    SUBTAB_NAME_COLOR : [69, 69, 69, 255],

    CHECKBOX_BOX_ACTIVE : [255, 170, 0, 255],
    CHECBKOX_BOX_INACTIVE : [12, 12, 15, 255],
    CHECKBOX_OUTLINE : [32, 32, 32, 255], 
    CHECKBOX_NAME_INACTIVE : [100, 100, 100, 255],
    CHECKBOX_NAME_ACTIVE : [250, 250, 250, 255],

    SLIDER_BOX_ACTIVE : [255, 170, 0, 255],
    SLIDER_BOX_INACTIVE : [12, 12, 15, 255],
    SLIDER_OUTLINE : [32, 32, 32, 255],
    SLIDER_NAME : [250, 250, 250, 255],

    DROPDOWN_NAME : [250, 250, 250, 255], 
    DROPDOWN_BOX : [12, 12, 15, 255],
    DROPDOWN_OUTLINE : [32, 32, 32, 255],
    DROPDOWN_VALUES_PREVIEW : [100, 100, 100, 255],
    DROPDOWN_VALUES_ACTIVE : [240, 240, 240, 255],
    DROPDOWN_VALUES_INACTIVE : [100, 100, 100, 255],

    COLORPICKER_BOX : [12, 12, 15, 255],
    COLORPICKER_OUTLINE : [32, 32, 32, 255],
    COLORPICKER_NAME : [250, 250, 250, 255],

    BUTTON_NAME : [200, 200, 200, 255], 
    BUTTON_BOX_1 : [30, 30, 36, 255],
    BUTTON_BOX_2 : [12, 12, 15, 255],
    BUTTON_OUTLINE : [32, 32, 32, 255],

    KEYBIND_NAME : [250, 250, 250, 255],
    KEYBIND_BOX : [12, 12, 15, 255],
    KEYBIND_OUTLINE : [32, 32, 32, 255],
    KEYBIND_KEY : [200, 200, 200, 255],
    KEYBIND_MODE_ACTIVE : [240, 240, 240, 255],
    KEYBIND_MODE_INACTIVE : [100, 100, 100, 255],

    HINT_BACKGROUND : [12, 12, 15, 255],
    HINT_OUTLINE : [32, 32, 32, 255],
    HINT_ITEM_NAME : [240, 240, 240, 255],
    HINT_DESCRIPTION : [150, 150, 150, 255],

    LABEL_NAME : [250, 250, 250, 255]

})

menu.colors.new_theme('Cherry', {
    MAIN_THEME_COLOR : [255, 127, 127, 255],

    BACKGROUND_COLOR : [18, 15, 15, 255],
    BACKGROUND_OUTLINE_COLOR : [32, 32, 32, 255],

    TAB_ACTIVE_COLOR : [255, 127, 127, 255],
    TAB_INACTIVE_COLOR : [69, 69, 69, 255],

    SUBTAB_NAME_COLOR : [69, 69, 69, 255],

    CHECKBOX_BOX_ACTIVE : [255, 127, 127, 255],
    CHECBKOX_BOX_INACTIVE : [15, 12, 12, 255],
    CHECKBOX_OUTLINE : [32, 32, 32, 255],
    CHECKBOX_NAME_INACTIVE : [110, 100, 100, 255],
    CHECKBOX_NAME_ACTIVE : [255, 250, 250, 255],

    SLIDER_BOX_ACTIVE : [255, 127, 127, 255],
    SLIDER_BOX_INACTIVE : [15, 12, 12, 255],
    SLIDER_OUTLINE : [32, 32, 32, 255],
    SLIDER_NAME : [255, 250, 250, 255],

    DROPDOWN_NAME : [255, 250, 250, 255], 
    DROPDOWN_BOX : [15, 12, 12, 255],
    DROPDOWN_OUTLINE : [32, 32, 32, 255],
    DROPDOWN_VALUES_PREVIEW : [110, 100, 100, 255],
    DROPDOWN_VALUES_ACTIVE : [245, 240, 240, 255],
    DROPDOWN_VALUES_INACTIVE : [110, 100, 100, 255],

    COLORPICKER_BOX : [15, 12, 12, 255],
    COLORPICKER_OUTLINE : [32, 32, 32, 255],
    COLORPICKER_NAME : [255, 250, 250, 255],

    BUTTON_NAME : [210, 200, 200, 255], 
    BUTTON_BOX_1 : [36, 30, 30, 255],
    BUTTON_BOX_2 : [15, 12, 12, 255],
    BUTTON_OUTLINE : [32, 32, 32, 255],

    KEYBIND_NAME : [255, 250, 250, 255],
    KEYBIND_BOX : [15, 12, 12, 255],
    KEYBIND_OUTLINE : [32, 32, 32, 255],
    KEYBIND_KEY : [210, 200, 200, 255],
    KEYBIND_MODE_ACTIVE : [245, 240, 240, 255],
    KEYBIND_MODE_INACTIVE : [110, 100, 100, 255],

    HINT_BACKGROUND : [15, 12, 12, 255],
    HINT_OUTLINE : [32, 32, 32, 255],
    HINT_ITEM_NAME : [245, 240, 240, 255],
    HINT_DESCRIPTION : [165, 150, 150, 255],

    LABEL_NAME : [255, 250, 250, 255]
})

menu.colors.new_theme('Midnight', {
    MAIN_THEME_COLOR : [150, 168, 212, 255],

    BACKGROUND_COLOR : [12, 15, 22, 255],
    BACKGROUND_OUTLINE_COLOR : [32, 32, 32, 255],

    TAB_ACTIVE_COLOR : [150, 168, 212, 255],
    TAB_INACTIVE_COLOR : [69, 69, 69, 255],

    SUBTAB_NAME_COLOR : [69, 69, 69, 255],

    CHECKBOX_BOX_ACTIVE : [150, 168, 212, 255],
    CHECBKOX_BOX_INACTIVE : [6, 12, 15, 255],
    CHECKBOX_OUTLINE : [32, 32, 32, 255], 
    CHECKBOX_NAME_INACTIVE : [100, 100, 110, 255],
    CHECKBOX_NAME_ACTIVE : [250, 250, 255, 255],

    SLIDER_BOX_ACTIVE : [150, 168, 212, 255], 
    SLIDER_BOX_INACTIVE : [6, 12, 15, 255],
    SLIDER_OUTLINE : [32, 32, 32, 255],
    SLIDER_NAME : [250, 250, 255, 255],

    DROPDOWN_NAME : [250, 250, 255, 255], 
    DROPDOWN_BOX : [6, 12, 15, 255],
    DROPDOWN_OUTLINE : [32, 32, 32, 255],
    DROPDOWN_VALUES_PREVIEW : [100, 100, 110, 255],
    DROPDOWN_VALUES_ACTIVE : [240, 240, 245, 255],
    DROPDOWN_VALUES_INACTIVE : [100, 100, 110, 255],

    COLORPICKER_BOX : [6, 12, 15, 255],
    COLORPICKER_OUTLINE : [32, 32, 32, 255],
    COLORPICKER_NAME : [250, 250, 255, 255],

    BUTTON_NAME : [200, 200, 210, 255], 
    BUTTON_BOX_1 : [25, 30, 36, 255],
    BUTTON_BOX_2 : [9, 12, 15, 255],
    BUTTON_OUTLINE : [32, 32, 32, 255],

    KEYBIND_NAME : [250, 250, 255, 255],
    KEYBIND_BOX : [9, 12, 15, 255],
    KEYBIND_OUTLINE : [32, 32, 32, 255],
    KEYBIND_KEY : [200, 200, 210, 255],
    KEYBIND_MODE_ACTIVE : [240, 240, 245, 255],
    KEYBIND_MODE_INACTIVE : [100, 100, 110, 255],

    HINT_BACKGROUND : [9, 12, 15, 255],
    HINT_OUTLINE : [32, 32, 32, 255],
    HINT_ITEM_NAME : [240, 240, 245, 255],
    HINT_DESCRIPTION : [150, 150, 165, 255],

    LABEL_NAME : [250, 250, 255, 255]
})

menu.dpi_scale = 1
menu.dpi_scale_table = [1, 1.25, 1.5, 1.75, 2]

menu.hint_timer = 1 //seconds

var COLORS = {}

menu.current_tab = undefined
menu.subtab_offsets = [] //оффсеты айтемов в сабтабах
//menu.subtabs_offsets = [] //оффесты самих сабтабов чтобы они не накладывались друг на друга //01.08.2023 ахах а ты дохуя умный я смотрю

menu.add_tab('Rage')
menu.add_tab('Anti Aim')
menu.add_tab('Visuals')
menu.add_tab('Misc')
menu.add_tab('Settings')

menu.add_subtab('Settings', 'Configs')
menu.add_subtab('Settings', 'Menu')

drag.new('menu', 0.2, 0.2)

menu.render = function () {
    var menu_alpha = visuals.new_animation('menu_alpha_test', UI.IsMenuOpen() ? 1 : 0)

    if (menu_alpha == 0) { 
        return
    }

    for (name in menu.colors.themes[menu.colors.current_theme]) {
        COLORS[name] = defines.alpha_multiply(
            visuals.new_animation('color theme' + name, menu.colors.themes[menu.colors.current_theme][name], undefined, 0.5), //эт по сути тоже хавать должно дохуя //ахах да тут все жрет сукааа
            menu_alpha
        )
    }

    var MENU_INTERACTION_PERMISSION = menu_alpha > 0.8 && UI.IsMenuOpen() // эт чтобы типа случайно ничего не тыкалось когда меню не видно

    var MENU_POSITION = drag.get_position('menu')

    var HEADER_SCRIPT_NAME_FONT = render.GetFont('Segoeuib.ttf', 12 * menu.dpi_scale, true)
    var HEADER_TAB_NAME_FONT = render.GetFont('Segoeui.ttf', 12 * menu.dpi_scale, true)    
    var SUBTAB_NAME_FONT = render.GetFont('Segoeui.ttf', 10 * menu.dpi_scale, true)
    var ITEM_NAME_FONT = render.GetFont('Segoeui.ttf', 11 * menu.dpi_scale, true)
    var DROPDOWN_PREVIEW_FONT = render.GetFont('Segoeui.ttf', 9 * menu.dpi_scale, true)
    var BUTTON_NAME_FONT = render.GetFont('Segoeui.ttf', 10 * menu.dpi_scale, true)
    var KEYBINDS_KEY_PREVIEW_FONT = render.GetFont('Segoeui.ttf', 9 * menu.dpi_scale, true)
    var HINT_TEXT_FONT = render.GetFont('Segoeui.ttf', 11 * menu.dpi_scale, true)

    //сам себя благодарю, что придумал такое, ведь иначе не смог бы сделать нормально DPI Scale feature

    var HEADER_SIZE = [300 * menu.dpi_scale, 30 * menu.dpi_scale]
    var HEADER_SCRIPT_NAME_INDENT = [10 * menu.dpi_scale, 7 * menu.dpi_scale]
    var HEADER_PER_TAB_NAME_INDENT = 5 * menu.dpi_scale
    var HEADER_TAB_NAMES_INDENT = [10 * menu.dpi_scale, 7 * menu.dpi_scale]

    var SUBTAB_INDENT = 6 * menu.dpi_scale
    var SUBTAB_SIZE_W = (HEADER_SIZE[0] - SUBTAB_INDENT) / 2 
    var SUBTAB_NAME_IDENT = [10 * menu.dpi_scale, 10 * menu.dpi_scale]

    var ITEMS_INDENT = [SUBTAB_NAME_IDENT[0], 10 * menu.dpi_scale] //по X от левой грани сабтаба, по Y между друг другом

    var CHECKBOX_BOX_SIZE = [10 * menu.dpi_scale, 10 * menu.dpi_scale]
    var CHECKBOX_NAME_BOX_INDENT = 5 * menu.dpi_scale
    var CHECKBOX_ITEM_INDENT = CHECKBOX_BOX_SIZE[1] + ITEMS_INDENT[1] //по Y, между друг другом

    var SLIDER_BOX_SIZE = [SUBTAB_SIZE_W - ITEMS_INDENT[0] * 2, 7 * menu.dpi_scale]
    var SLIDER_NAME_INDENT = 7 * menu.dpi_scale
    var SLIDER_ITEM_INDENT = 11 * menu.dpi_scale + SLIDER_NAME_INDENT + SLIDER_BOX_SIZE[1] + ITEMS_INDENT[1]

    var DROPDOWN_BOX_SIZE = [SUBTAB_SIZE_W - ITEMS_INDENT[0] * 2, 18 * menu.dpi_scale]
    var DROPDOWN_NAME_INDENT = 7 * menu.dpi_scale
    var DROPDOWN_ITEM_INDENT = 11 * menu.dpi_scale + DROPDOWN_NAME_INDENT + DROPDOWN_BOX_SIZE[1] + ITEMS_INDENT[1]
    var DROPDOWN_PREVIEW_INDENT = 5 * menu.dpi_scale

    var COLORPICKER_BOX_SIZE = [10 * menu.dpi_scale, 10 * menu.dpi_scale]
    var COLORPICKER_NAME_BOX_INDENT = 5 * menu.dpi_scale
    var COLORPICKER_PICKER_INDENT = [5 * menu.dpi_scale, 5 * menu.dpi_scale]
    var COLORPICKER_ITEM_INDENT = COLORPICKER_BOX_SIZE[1] + ITEMS_INDENT[1]
    var COLORPICKER_PICKER_COLOR_SIZE = [90 * menu.dpi_scale, 90 * menu.dpi_scale]
    var COLORPICKER_PICKER_HUE_SIZE = [7 * menu.dpi_scale, 90 * menu.dpi_scale]
    var COLORPICKER_PICKER_ALPHA_SIZE = [7 * menu.dpi_scale, 90 * menu.dpi_scale]
    var COLORPICKER_PICKER_CROSSHAIR_SIZE = 3 * menu.dpi_scale
    var COLORPICKER_FILEDS_INDENT = ITEMS_INDENT[0]
    var COLORPICKER_PICKER_SIZE = [COLORPICKER_PICKER_COLOR_SIZE[0] + COLORPICKER_PICKER_HUE_SIZE[0] + COLORPICKER_PICKER_ALPHA_SIZE[0] + COLORPICKER_FILEDS_INDENT * 4, COLORPICKER_PICKER_COLOR_SIZE[1] + COLORPICKER_FILEDS_INDENT * 2]

    var BUTTON_BOX_SIZE = [SUBTAB_SIZE_W - ITEMS_INDENT[0] * 2, 18 * menu.dpi_scale]
    var BUTTON_ITEM_INDENT = BUTTON_BOX_SIZE[1] + ITEMS_INDENT[1]

    var KEYBIND_BOX_SIZE = [14 * menu.dpi_scale, 14 * menu.dpi_scale]
    var KEYBIND_PLACE_SIZE = SUBTAB_SIZE_W - ITEMS_INDENT[0] * 2
    var KEYBIND_ITEM_INDENT = KEYBIND_BOX_SIZE[1] + ITEMS_INDENT[1]
    var KEYBIND_KEY_PREVIEW_INDENT = 4 * menu.dpi_scale
    var KEYBIND_MODE_WINDOW_SIZE = [45 * menu.dpi_scale, KEYBIND_BOX_SIZE[1] * 1.5] 

    var HINT_INDENT = 6 * menu.dpi_scale

    // Header zone 

    var HEADER_POSITION = MENU_POSITION

    render.FilledRect(HEADER_POSITION[0],
        HEADER_POSITION[1],
        HEADER_SIZE[0],
        HEADER_SIZE[1],
        COLORS.BACKGROUND_COLOR)

        render.Rect(HEADER_POSITION[0],
        HEADER_POSITION[1],
        HEADER_SIZE[0],
        HEADER_SIZE[1],
        COLORS.BACKGROUND_OUTLINE_COLOR)

    var SCRIPT_NAME_SIZE = render.TextSize(script.name, HEADER_SCRIPT_NAME_FONT)

    render.String(HEADER_POSITION[0] + HEADER_SCRIPT_NAME_INDENT[0],
        HEADER_POSITION[1] + HEADER_SCRIPT_NAME_INDENT[1],
        0,
        script.name,
        COLORS.MAIN_THEME_COLOR,
        HEADER_SCRIPT_NAME_FONT)

    var TAB_OFFSET = 0

    var DROPDOWNS = []
    var COLORPICKERS = []
    var KEYBIND_TYPE_SELECTORS = []
    var HINTS = []

    var CURTIME = Globals.Curtime()

    for (tab in menu.items) {

        // tab zone
        var objTab = menu.items[tab]

        var TAB_NAME = objTab.name.toLowerCase()
        var TAB_NAME_SIZE = render.TextSize(TAB_NAME, HEADER_TAB_NAME_FONT)

        var TAB_NAME_COLOR = defines.alpha_override(
            visuals.new_animation(TAB_NAME + ' name color',
                menu.current_tab == tab ? COLORS.TAB_ACTIVE_COLOR : COLORS.TAB_INACTIVE_COLOR),
            menu_alpha)
        
        var TAB_NAME_POSITION = [HEADER_POSITION[0] + HEADER_SIZE[0] - HEADER_TAB_NAMES_INDENT[1] - TAB_OFFSET - TAB_NAME_SIZE[0], HEADER_POSITION[1] + HEADER_TAB_NAMES_INDENT[1]]

        render.String(TAB_NAME_POSITION[0],
            TAB_NAME_POSITION[1],
            0,
            TAB_NAME,
            TAB_NAME_COLOR,
            HEADER_TAB_NAME_FONT)

        var TAB_INTERACTION_PERMISSION = MENU_INTERACTION_PERMISSION

        if (input.pressed(0x01) && TAB_INTERACTION_PERMISSION) {
            if (defines.in_bounds(input.cursor(), TAB_NAME_POSITION, TAB_NAME_SIZE)) {
                menu.current_tab = tab
            }
        }

        if (!menu.subtab_offsets[TAB_NAME]) {
            menu.subtab_offsets[TAB_NAME] = []
        }

        var SUBTAB_ITEMS_OFFSET = []
        var SUBTABS_OFFSET = 0

        var IS_SOMETHING_OPEN = function () {
            return DROPDOWNS.length > 0 || COLORPICKERS.length > 0 || KEYBIND_TYPE_SELECTORS.length > 0 //эт чтобы низзя было нажимать на элементы, которые находятся за хуйнюшкой какой то (например колорпикер открытый или дропдаун)
        }

        for (subtab in objTab.items) {

            //subtab zone

            var objSubtab = objTab.items[subtab]

            var SUBTAB_INTERACTION_PERMISSION = TAB_INTERACTION_PERMISSION && objSubtab.tab == menu.current_tab

            var SUBTAB_NAME = objSubtab.name.toUpperCase()
            var SUBTAB_NAME_SIZE = render.TextSize(SUBTAB_NAME, SUBTAB_NAME_FONT)

            var SUBTAB_ALPHA = visuals.new_animation(subtab + tab + ' subtab alpha', 
                SUBTAB_INTERACTION_PERMISSION ? 1 : 0)
            
            var SUBTAB_POSITION = [HEADER_POSITION[0] + SUBTABS_OFFSET, HEADER_POSITION[1] + HEADER_SIZE[1] + SUBTAB_INDENT]

            if (!menu.subtab_offsets[TAB_NAME][SUBTAB_NAME]) {
                menu.subtab_offsets[TAB_NAME][SUBTAB_NAME] = 0
            }

            if (!SUBTAB_ITEMS_OFFSET[SUBTAB_NAME]) {
                SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] = SUBTAB_NAME_IDENT[1] * 2 + SUBTAB_NAME_SIZE[1]
            }

            render.FilledRect(SUBTAB_POSITION[0],
                SUBTAB_POSITION[1],
                SUBTAB_SIZE_W,
                menu.subtab_offsets[TAB_NAME][SUBTAB_NAME],
                defines.alpha_multiply(COLORS.BACKGROUND_COLOR, SUBTAB_ALPHA * menu_alpha))

            render.Rect(SUBTAB_POSITION[0],
                SUBTAB_POSITION[1],
                SUBTAB_SIZE_W,
                menu.subtab_offsets[TAB_NAME][SUBTAB_NAME],
                defines.alpha_multiply(COLORS.BACKGROUND_OUTLINE_COLOR, SUBTAB_ALPHA * menu_alpha))

            render.String(SUBTAB_POSITION[0] + SUBTAB_NAME_IDENT[0],
                SUBTAB_POSITION[1] + SUBTAB_NAME_IDENT[1],
                0,
                SUBTAB_NAME,
                defines.alpha_multiply(COLORS.SUBTAB_NAME_COLOR, SUBTAB_ALPHA * menu_alpha),
                SUBTAB_NAME_FONT)


            //где то читал что с этими for in циклами дохуя хавается
            for (item in objSubtab.items) {

                var objItem = objSubtab.items[item]

                if (!objItem) {
                    continue
                }

                var ITEM_VISIBILITY_CONDITION = objItem.visibility_condition()

                var ITEM_NAME = objItem.name
                var ITEM_NAME_SIZE = render.TextSize(ITEM_NAME, ITEM_NAME_FONT)

                var id_n = subtab + tab + item

                var ITEM_INTERACTION_PERMISSION = SUBTAB_INTERACTION_PERMISSION && ITEM_VISIBILITY_CONDITION
                var ITEM_ALPHA = visuals.new_animation(id_n + ' item alpha',
                    ITEM_INTERACTION_PERMISSION ? 1 : 0)
                var ITEM_POSITION = [SUBTAB_POSITION[0] + ITEMS_INDENT[0], SUBTAB_POSITION[1] + SUBTAB_ITEMS_OFFSET[SUBTAB_NAME]]
                
                if (objItem.type == 'checkbox') {
                    
                    var ITEM_VALUE_ANIM = visuals.new_animation(id_n + 'checkbox anim', objItem.value ? 1 : 0)

                    var CHECKBOX_BOX_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'checkbox box color',
                        objItem.value ? COLORS.CHECKBOX_BOX_ACTIVE : COLORS.CHECBKOX_BOX_INACTIVE), ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var CHECKBOX_OUTLINE_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'checkbox outline color',
                        objItem.value ? COLORS.CHECKBOX_BOX_ACTIVE : COLORS.CHECKBOX_OUTLINE), ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var CHECKBOX_NAME_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'checkbox name color',
                        objItem.value ? COLORS.CHECKBOX_NAME_ACTIVE : COLORS.CHECKBOX_NAME_INACTIVE), ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    render.FilledRect(ITEM_POSITION[0],
                        ITEM_POSITION[1],
                        CHECKBOX_BOX_SIZE[0],
                        CHECKBOX_BOX_SIZE[1],
                        CHECKBOX_BOX_COLOR)
                        
                    if (ITEM_VALUE_ANIM < 1) {
                        render.Rect(ITEM_POSITION[0],
                            ITEM_POSITION[1],
                            CHECKBOX_BOX_SIZE[0],
                            CHECKBOX_BOX_SIZE[1],
                            CHECKBOX_OUTLINE_COLOR)
                    }

                    render.String(ITEM_POSITION[0] + CHECKBOX_BOX_SIZE[0] + CHECKBOX_NAME_BOX_INDENT,
                        ITEM_POSITION[1] + CHECKBOX_BOX_SIZE[1] / 2 - ITEM_NAME_SIZE[1] / 2,
                        0,
                        ITEM_NAME,
                        CHECKBOX_NAME_COLOR,
                        ITEM_NAME_FONT)

                    if (defines.in_bounds(input.cursor(), ITEM_POSITION, [CHECKBOX_BOX_SIZE[0] + CHECKBOX_NAME_BOX_INDENT + ITEM_NAME_SIZE[0], CHECKBOX_BOX_SIZE[1]]) && ITEM_INTERACTION_PERMISSION && !IS_SOMETHING_OPEN()) {
                        if (input.pressed(0x01)) {
                            objItem.value = !objItem.value
                            objItem.subscribed_function()
                        }
                    } else {
                        objItem.hint_timer = CURTIME
                    }
                    
                    var HINT_ANIM = visuals.new_animation(id_n + 'hint anim', CURTIME - objItem.hint_timer > menu.hint_timer ? 1 : 0)

                    if (HINT_ANIM > 0) {
                        HINTS.push({
                            POSITION : [ITEM_POSITION[0] + CHECKBOX_BOX_SIZE[0] + CHECKBOX_NAME_BOX_INDENT + ITEM_NAME_SIZE[0], ITEM_POSITION[1] + CHECKBOX_BOX_SIZE[1] / 2],
                            ITEM : objItem,
                            ANIM : HINT_ANIM
                        })
                    }
                    
                    SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] = SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] + CHECKBOX_ITEM_INDENT * ITEM_ALPHA
                } else if (objItem.type == 'slider') {

                    var SLIDER_NAME_COLOR = defines.alpha_override(COLORS.SLIDER_NAME,
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var SLIDER_BOX_INACTIVE_COLOR = defines.alpha_override(COLORS.SLIDER_BOX_INACTIVE,
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var SLIDER_OUTLINE_COLOR = defines.alpha_override(COLORS.SLIDER_OUTLINE,
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var SLIDER_BOX_ACTIVE_COLOR = defines.alpha_override(COLORS.SLIDER_BOX_ACTIVE,
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    render.String(ITEM_POSITION[0],
                        ITEM_POSITION[1],
                        0,
                        ITEM_NAME,
                        SLIDER_NAME_COLOR,
                        ITEM_NAME_FONT)

                    render.FilledRect(ITEM_POSITION[0],
                        ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + SLIDER_NAME_INDENT,
                        SLIDER_BOX_SIZE[0],
                        SLIDER_BOX_SIZE[1],
                        SLIDER_BOX_INACTIVE_COLOR)

                    render.Rect(ITEM_POSITION[0],
                        ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + SLIDER_NAME_INDENT,
                        SLIDER_BOX_SIZE[0],
                        SLIDER_BOX_SIZE[1],
                        SLIDER_OUTLINE_COLOR)

                    var VALUE_FLOAT = Math.dLerpReverse(objItem.value, objItem.min, objItem.max)

                    var VALUE_TEXT = objItem.value.toString()
                    var VALUE_TEXT_SIZE = render.TextSize(VALUE_TEXT, ITEM_NAME_FONT)

                    render.String(ITEM_POSITION[0] + SLIDER_BOX_SIZE[0] - VALUE_TEXT_SIZE[0],
                        ITEM_POSITION[1],
                        0,
                        VALUE_TEXT,
                        SLIDER_NAME_COLOR,
                        ITEM_NAME_FONT)

                    if (VALUE_FLOAT > 0) {
                        render.FilledRect(ITEM_POSITION[0],
                            ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + SLIDER_NAME_INDENT,
                            SLIDER_BOX_SIZE[0] * VALUE_FLOAT,
                            SLIDER_BOX_SIZE[1],
                            SLIDER_BOX_ACTIVE_COLOR)
                    }
                    
                    if (defines.in_bounds(input.held_cursor(), [ITEM_POSITION[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + SLIDER_NAME_INDENT], SLIDER_BOX_SIZE) && ITEM_INTERACTION_PERMISSION && !IS_SOMETHING_OPEN()) {
                        if (input.pressed(0x25)) {
                            objItem.value = objItem.value - 1
                            objItem.hint_timer = CURTIME
                        }

                        if (input.pressed(0x27)) {
                            objItem.value = objItem.value + 1
                            objItem.hint_timer = CURTIME
                        }

                        if (input.held(0x01)) {
                            var cursor_value_clamped = Math.clamp(input.cursor()[0],
                                ITEM_POSITION[0],
                                ITEM_POSITION[0] + SLIDER_BOX_SIZE[0])
                            
                            var cursor_value = cursor_value_clamped - ITEM_POSITION[0]
                            var float_value = cursor_value / SLIDER_BOX_SIZE[0]

                            objItem.value = Math.round(Math.dLerp(float_value, objItem.min, objItem.max))
                            
                            if (objItem.cache_value != objItem.value) {
                                objItem.subscribed_function()
                                objItem.cache_value = objItem.value
                            }
                        }
                    }

                    if (!(defines.in_bounds(input.cursor(), ITEM_POSITION, [ITEM_NAME_SIZE[0] + SLIDER_BOX_SIZE[0], ITEM_NAME_SIZE[1] + SLIDER_BOX_SIZE[1] + SLIDER_NAME_INDENT]) && ITEM_INTERACTION_PERMISSION && !IS_SOMETHING_OPEN())) {
                        objItem.hint_timer = CURTIME
                    }
                        
                    var HINT_ANIM = visuals.new_animation(id_n + 'hint anim', CURTIME - objItem.hint_timer > menu.hint_timer ? 1 : 0)

                    if (HINT_ANIM > 0) {
                        HINTS.push({
                            POSITION : [ITEM_POSITION[0] + ITEM_NAME_SIZE[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] / 2],
                            ITEM : objItem,
                            ANIM : HINT_ANIM
                        })
                    }
                    
                    SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] = SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] + SLIDER_ITEM_INDENT * ITEM_ALPHA
                } else if (objItem.type == 'dropdown') {

                    var DROPDOWN_NAME_COLOR = defines.alpha_override(COLORS.DROPDOWN_NAME,
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var DROPDOWN_BOX_COLOR = defines.alpha_override(COLORS.DROPDOWN_BOX, 
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var DROPDOWN_OUTLINE_COLOR = defines.alpha_override(COLORS.DROPDOWN_OUTLINE,
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var DROPDOWN_VALUES_PREVIEW = defines.alpha_override(COLORS.DROPDOWN_VALUES_PREVIEW,
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    render.String(ITEM_POSITION[0],
                        ITEM_POSITION[1],
                        0,
                        ITEM_NAME,
                        DROPDOWN_NAME_COLOR,
                        ITEM_NAME_FONT)

                    render.FilledRect(ITEM_POSITION[0],
                        ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT,
                        DROPDOWN_BOX_SIZE[0],
                        DROPDOWN_BOX_SIZE[1],
                        DROPDOWN_BOX_COLOR)

                    render.Rect(ITEM_POSITION[0],
                        ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT,
                        DROPDOWN_BOX_SIZE[0],
                        DROPDOWN_BOX_SIZE[1],
                        DROPDOWN_OUTLINE_COLOR)

                    var PREVIEW_TEXT = objItem.options[objItem.value]
                    var PREVIEW_TEXT_SIZE = render.TextSize(PREVIEW_TEXT, DROPDOWN_PREVIEW_FONT)

                    render.String(ITEM_POSITION[0] + DROPDOWN_PREVIEW_INDENT,
                        ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT + DROPDOWN_BOX_SIZE[1] / 2 - PREVIEW_TEXT_SIZE[1] / 2,
                        0,
                        PREVIEW_TEXT,
                        DROPDOWN_VALUES_PREVIEW,
                        DROPDOWN_PREVIEW_FONT)
                    
                    if (input.pressed(0x01) && ITEM_INTERACTION_PERMISSION && !IS_SOMETHING_OPEN()) {
                        if (defines.in_bounds(input.cursor(), [ITEM_POSITION[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT], DROPDOWN_BOX_SIZE)) {
                            objItem.is_visible = !objItem.is_visible
                        }
                    }

                    if (!(defines.in_bounds(input.cursor(), [ITEM_POSITION[0], ITEM_POSITION[1]], [DROPDOWN_BOX_SIZE[0], ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT + DROPDOWN_BOX_SIZE[1]]) && ITEM_INTERACTION_PERMISSION && !IS_SOMETHING_OPEN())) {
                        objItem.hint_timer = CURTIME
                    }
                    
                    var HINT_ANIM = visuals.new_animation(id_n + 'hint anim', CURTIME - objItem.hint_timer > menu.hint_timer ? 1 : 0)

                    if (HINT_ANIM > 0) {
                        HINTS.push({
                            POSITION : [ITEM_POSITION[0] + ITEM_NAME_SIZE[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] / 2],
                            ITEM : objItem,
                            ANIM : HINT_ANIM
                        })
                    }

                    if (!ITEM_INTERACTION_PERMISSION) {
                        objItem.is_visible = false
                    }

                    var DROPDOWN_PREVIEW_ANIM = visuals.new_animation(id_n + 'dropdown preview anim', objItem.is_visible ? 1 : 0)

                    var OPTIONS_OFFSET = 0

                    if (DROPDOWN_PREVIEW_ANIM > 0) {

                        for (p in objItem.options) {

                            if (input.pressed(0x01) && ITEM_INTERACTION_PERMISSION && DROPDOWN_PREVIEW_ANIM > 0.8) {
                                if (defines.in_bounds(input.cursor(), [ITEM_POSITION[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT + DROPDOWN_BOX_SIZE[1] + OPTIONS_OFFSET], DROPDOWN_BOX_SIZE)) {
                                    objItem.value = p
                                    objItem.is_visible = false
                                    objItem.subscribed_function()
                                }
                            }

                            OPTIONS_OFFSET = OPTIONS_OFFSET + DROPDOWN_BOX_SIZE[1]
                        }
                    
                        if (input.pressed(0x01) && ITEM_INTERACTION_PERMISSION) {
                            if (!defines.in_bounds(input.cursor(), [ITEM_POSITION[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT], [DROPDOWN_BOX_SIZE[0], DROPDOWN_BOX_SIZE[1] * (objItem.options.length + 1)])) {
                                objItem.is_visible = false
                            }
                        }

                        DROPDOWNS.push({
                            POSITION : [ITEM_POSITION[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT + DROPDOWN_BOX_SIZE[1]],
                            ITEM : objItem,
                            ANIM : DROPDOWN_PREVIEW_ANIM
                        })
    
                    }
                    
                    SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] = SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] + DROPDOWN_ITEM_INDENT * ITEM_ALPHA
                } else if (objItem.type == 'multidropdown') {

                    var DROPDOWN_NAME_COLOR = defines.alpha_override(COLORS.DROPDOWN_NAME,
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var DROPDOWN_BOX_COLOR = defines.alpha_override(COLORS.DROPDOWN_BOX, 
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var DROPDOWN_OUTLINE_COLOR = defines.alpha_override(COLORS.DROPDOWN_OUTLINE,
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var DROPDOWN_VALUES_PREVIEW = defines.alpha_override(COLORS.DROPDOWN_VALUES_PREVIEW,
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    render.String(ITEM_POSITION[0],
                        ITEM_POSITION[1],
                        0,
                        ITEM_NAME,
                        DROPDOWN_NAME_COLOR,
                        ITEM_NAME_FONT)

                    render.FilledRect(ITEM_POSITION[0],
                        ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT,
                        DROPDOWN_BOX_SIZE[0],
                        DROPDOWN_BOX_SIZE[1],
                        DROPDOWN_BOX_COLOR)

                    render.Rect(ITEM_POSITION[0],
                        ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT,
                        DROPDOWN_BOX_SIZE[0],
                        DROPDOWN_BOX_SIZE[1],
                        DROPDOWN_OUTLINE_COLOR)

                    if (!(defines.in_bounds(input.cursor(), [ITEM_POSITION[0], ITEM_POSITION[1]], [DROPDOWN_BOX_SIZE[0], ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT + DROPDOWN_BOX_SIZE[1]]) && ITEM_INTERACTION_PERMISSION && !IS_SOMETHING_OPEN())) {
                        objItem.hint_timer = CURTIME
                    }

                    var HINT_ANIM = visuals.new_animation(id_n + 'hint anim', CURTIME - objItem.hint_timer > menu.hint_timer ? 1 : 0)

                    if (HINT_ANIM > 0) {
                        HINTS.push({
                            POSITION : [ITEM_POSITION[0] + ITEM_NAME_SIZE[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] / 2],
                            ITEM : objItem,
                            ANIM : HINT_ANIM
                        })
                    }

                    var amount = 0
                    var new_values = ''
                    new_values = amount == 0 ? 'None' : new_values
                    

                    //опять спасибо klient, у него спиздил

                    for (index = 0; index < objItem.options.length; index++) {
                        if (objItem.value[index]) {
                            if (amount > 0) {
                                new_values = new_values + ', '
                            }

                            new_values = new_values + objItem.options[index]
                            new_values = new_values.replace('None', '')

                            amount = amount + 1
                        }
                    }

                    var PREVIEW_TEXT = new_values
                    var PREVIEW_TEXT_SIZE = render.TextSize(PREVIEW_TEXT, DROPDOWN_PREVIEW_FONT)

                    if (PREVIEW_TEXT_SIZE[0] > DROPDOWN_BOX_SIZE[0] - DROPDOWN_PREVIEW_INDENT * 2) {
                        PREVIEW_TEXT = new_values.substring(0, 28) + '...'
                    }

                    render.String(ITEM_POSITION[0] + DROPDOWN_PREVIEW_INDENT,
                        ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT + DROPDOWN_BOX_SIZE[1] / 2 - PREVIEW_TEXT_SIZE[1] / 2,
                        0,
                        PREVIEW_TEXT,
                        DROPDOWN_VALUES_PREVIEW,
                        DROPDOWN_PREVIEW_FONT)
                    
                    if (input.pressed(0x01) && ITEM_INTERACTION_PERMISSION && !IS_SOMETHING_OPEN()) {
                        if (defines.in_bounds(input.cursor(), [ITEM_POSITION[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT], DROPDOWN_BOX_SIZE)) {
                            objItem.is_visible = !objItem.is_visible
                        }
                    }

                    if (!ITEM_INTERACTION_PERMISSION) {
                        objItem.is_visible = false
                    }

                    var DROPDOWN_PREVIEW_ANIM = visuals.new_animation(id_n + 'multidropdown preview anim', objItem.is_visible ? 1 : 0)

                    var OPTIONS_OFFSET = 0

                    if (DROPDOWN_PREVIEW_ANIM > 0) {

                        for (p in objItem.options) {

                            if (input.pressed(0x01) && ITEM_INTERACTION_PERMISSION && DROPDOWN_PREVIEW_ANIM > 0.8) {
                                if (defines.in_bounds(input.cursor(), [ITEM_POSITION[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT + DROPDOWN_BOX_SIZE[1] + OPTIONS_OFFSET], DROPDOWN_BOX_SIZE)) {
                                    objItem.value[p] = !objItem.value[p]
                                    objItem.subscribed_function()
                                }
                            }

                            OPTIONS_OFFSET = OPTIONS_OFFSET + DROPDOWN_BOX_SIZE[1]
                        }
                    
                        if (input.pressed(0x01) && ITEM_INTERACTION_PERMISSION) {
                            if (!defines.in_bounds(input.cursor(), [ITEM_POSITION[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT], [DROPDOWN_BOX_SIZE[0], DROPDOWN_BOX_SIZE[1] * (objItem.options.length + 1)])) {
                                objItem.is_visible = false
                            }
                        }

                        DROPDOWNS.push({
                            POSITION : [ITEM_POSITION[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] + DROPDOWN_NAME_INDENT + DROPDOWN_BOX_SIZE[1]],
                            ITEM : objItem,
                            ANIM : DROPDOWN_PREVIEW_ANIM
                        })
    
                    }
                    
                    SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] = SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] + DROPDOWN_ITEM_INDENT * ITEM_ALPHA
                } else if (objItem.type == 'colorpicker') {

                    var COLORPICKER_BOX_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'colorpicker box', COLORS.COLORPICKER_BOX),
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var COLORPICKER_OUTLINE_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'colorpicker outline', COLORS.COLORPICKER_OUTLINE),
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var COLORPICKER_NAME_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'colorpicker name', COLORS.COLORPICKER_NAME),
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)
                    
                    var COLORPICKER_VALUE = defines.alpha_override(objItem.value, 
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    render.FilledRect(ITEM_POSITION[0],
                        ITEM_POSITION[1],
                        COLORPICKER_BOX_SIZE[0],
                        COLORPICKER_BOX_SIZE[1],
                        COLORPICKER_VALUE)
                
                    render.Rect(ITEM_POSITION[0],
                        ITEM_POSITION[1],
                        COLORPICKER_BOX_SIZE[0],
                        COLORPICKER_BOX_SIZE[1],
                        COLORPICKER_OUTLINE_COLOR)

                    render.String(ITEM_POSITION[0] + COLORPICKER_BOX_SIZE[0] + COLORPICKER_NAME_BOX_INDENT,
                        ITEM_POSITION[1] + COLORPICKER_BOX_SIZE[1] / 2 - ITEM_NAME_SIZE[1] / 2,
                        0,
                        ITEM_NAME,
                        COLORPICKER_NAME_COLOR,
                        ITEM_NAME_FONT)

                    if (input.pressed(0x01) && ITEM_INTERACTION_PERMISSION && !IS_SOMETHING_OPEN()) { 
                        if (defines.in_bounds(input.cursor(), ITEM_POSITION , [COLORPICKER_BOX_SIZE[0] + COLORPICKER_NAME_BOX_INDENT + ITEM_NAME_SIZE[0], COLORPICKER_BOX_SIZE[1]])) {
                            objItem.is_visible = true
                        }
                    }

                    if (defines.in_bounds(input.cursor(), ITEM_POSITION , [COLORPICKER_BOX_SIZE[0] + COLORPICKER_NAME_BOX_INDENT + ITEM_NAME_SIZE[0], COLORPICKER_BOX_SIZE[1]]) && ITEM_INTERACTION_PERMISSION && !IS_SOMETHING_OPEN()) {
                        if (input.pressed(0x01)) { 
                            objItem.is_visible = true
                        }
                    } else {
                        objItem.hint_timer = CURTIME
                    }

                    var HINT_ANIM = visuals.new_animation(id_n + 'hint anim', CURTIME - objItem.hint_timer > menu.hint_timer ? 1 : 0)

                    if (HINT_ANIM > 0) {
                        HINTS.push({
                            POSITION : [ITEM_POSITION[0] + COLORPICKER_BOX_SIZE[0] + CHECKBOX_NAME_BOX_INDENT + ITEM_NAME_SIZE[0], ITEM_POSITION[1] + COLORPICKER_BOX_SIZE[1] / 2],
                            ITEM : objItem,
                            ANIM : HINT_ANIM
                        })
                    }

                    if (!ITEM_INTERACTION_PERMISSION) {
                        objItem.is_visible = false
                    }

                    var COLORPICKER_ANIM = visuals.new_animation(id_n + 'colorpicker anim', objItem.is_visible ? 1 : 0)

                    if (COLORPICKER_ANIM > 0) {
                        var COLORPICKER_TABLE = {
                            POSITION : [ITEM_POSITION[0] + COLORPICKER_PICKER_INDENT[0], ITEM_POSITION[1] + COLORPICKER_BOX_SIZE[1] + COLORPICKER_PICKER_INDENT[1]],
                            ITEM : objItem,
                            ANIM : COLORPICKER_ANIM
                        }

                        if (input.pressed(0x01) && ITEM_INTERACTION_PERMISSION) {
                            if (!(defines.in_bounds(input.cursor(), COLORPICKER_TABLE.POSITION, COLORPICKER_PICKER_SIZE) || defines.in_bounds(input.cursor(), ITEM_POSITION, [COLORPICKER_BOX_SIZE[0] + COLORPICKER_NAME_BOX_INDENT + ITEM_NAME_SIZE[0], COLORPICKER_BOX_SIZE[1]]))) {
                                objItem.is_visible = false
                            }
                        }
                        //render.String(COLORPICKER_TABLE.POSITION[0], COLORPICKER_TABLE.POSITION[1] + 200, 0, objItem.hsv.join(',') + ' - hsv', [255, 0, 0, 255], Render.GetFont('Verdana.ttf', 15, true))
                        // ^^^ это короче я че то когда конфиги делал ебался (лучше не знать, в чем была ошибка)))

                        if (input.held(0x01) && ITEM_INTERACTION_PERMISSION) {

                            if (defines.in_bounds(input.held_cursor(), [COLORPICKER_TABLE.POSITION[0] + COLORPICKER_PICKER_COLOR_SIZE[0] + COLORPICKER_FILEDS_INDENT * 2, COLORPICKER_TABLE.POSITION[1] + COLORPICKER_FILEDS_INDENT], COLORPICKER_PICKER_HUE_SIZE)) {
                                var hue_clamped = Math.clamp(input.cursor()[1],
                                    COLORPICKER_TABLE.POSITION[1] + COLORPICKER_FILEDS_INDENT,
                                    COLORPICKER_TABLE.POSITION[1] + COLORPICKER_FILEDS_INDENT + COLORPICKER_PICKER_HUE_SIZE[1])

                                var hue = hue_clamped - (COLORPICKER_TABLE.POSITION[1] + COLORPICKER_FILEDS_INDENT)
                                var float = hue / COLORPICKER_PICKER_HUE_SIZE[1]

                                objItem.hsv[0] = float
                            }

                            if (defines.in_bounds(input.held_cursor(), [COLORPICKER_TABLE.POSITION[0] + COLORPICKER_FILEDS_INDENT, COLORPICKER_TABLE.POSITION[1] + COLORPICKER_FILEDS_INDENT], COLORPICKER_PICKER_COLOR_SIZE)) {
                                var saturation_clamped = Math.clamp(input.cursor()[0],
                                    COLORPICKER_TABLE.POSITION[0] + COLORPICKER_FILEDS_INDENT,
                                    COLORPICKER_TABLE.POSITION[0] + COLORPICKER_FILEDS_INDENT + COLORPICKER_PICKER_COLOR_SIZE[0])

                                var saturation = saturation_clamped - (COLORPICKER_TABLE.POSITION[0] + COLORPICKER_FILEDS_INDENT)
                                var s_float = saturation / COLORPICKER_PICKER_COLOR_SIZE[0]

                                objItem.hsv[1] = s_float
                                
                                var value_clamped = Math.clamp(input.cursor()[1],
                                    COLORPICKER_TABLE.POSITION[1] + COLORPICKER_FILEDS_INDENT,
                                    COLORPICKER_TABLE.POSITION[1] + COLORPICKER_FILEDS_INDENT + COLORPICKER_PICKER_COLOR_SIZE[1])

                                var value = value_clamped - (COLORPICKER_TABLE.POSITION[1] + COLORPICKER_FILEDS_INDENT)
                                var v_float = value / COLORPICKER_PICKER_COLOR_SIZE[1]

                                objItem.hsv[2] = 1 - v_float
                            }

                            if (defines.in_bounds(input.held_cursor(), [COLORPICKER_TABLE.POSITION[0] + COLORPICKER_PICKER_COLOR_SIZE[0] + COLORPICKER_PICKER_HUE_SIZE[0] + COLORPICKER_FILEDS_INDENT * 3, COLORPICKER_TABLE.POSITION[1] + COLORPICKER_FILEDS_INDENT], COLORPICKER_PICKER_ALPHA_SIZE)) {
                                var alpha_clamped = Math.clamp(input.cursor()[1],
                                    COLORPICKER_TABLE.POSITION[1] + COLORPICKER_FILEDS_INDENT,
                                    COLORPICKER_TABLE.POSITION[1] + COLORPICKER_FILEDS_INDENT + COLORPICKER_PICKER_ALPHA_SIZE[1])

                                var alpha = alpha_clamped - (COLORPICKER_TABLE.POSITION[1] + COLORPICKER_FILEDS_INDENT)
                                var float = alpha / COLORPICKER_PICKER_ALPHA_SIZE[1]

                                objItem.hsv[3] = (1 - float) * 255
                            }

                            objItem.value = defines.hsv_to_rbg(objItem.hsv)
                            
                            if (!defines.colors_equal(objItem.cache_value, objItem.value)) {
                                objItem.subscribed_function()
                                objItem.cache_value = objItem.value
                            }
                        }

                        COLORPICKERS.push(COLORPICKER_TABLE)
                    }

                    SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] = SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] + COLORPICKER_ITEM_INDENT * ITEM_ALPHA
                } else if (objItem.type == 'button') {

                    var BUTTON_NAME_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'button name', COLORS.BUTTON_NAME),
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var BUTTON_BOX_1_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'button box 1', COLORS.BUTTON_BOX_1),
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var BUTTON_BOX_2_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'button box 2', COLORS.BUTTON_BOX_2),
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var BUTTON_OUTLINE_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'button outline', COLORS.BUTTON_OUTLINE),
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    render.GradientRect(ITEM_POSITION[0],
                        ITEM_POSITION[1],
                        BUTTON_BOX_SIZE[0],
                        BUTTON_BOX_SIZE[1],
                        0,
                        BUTTON_BOX_1_COLOR,
                        BUTTON_BOX_2_COLOR)

                    render.Rect(ITEM_POSITION[0],
                        ITEM_POSITION[1],
                        BUTTON_BOX_SIZE[0],
                        BUTTON_BOX_SIZE[1],
                        BUTTON_OUTLINE_COLOR)

                    render.String(ITEM_POSITION[0] + BUTTON_BOX_SIZE[0] / 2 - ITEM_NAME_SIZE[0] / 2,
                        ITEM_POSITION[1] + BUTTON_BOX_SIZE[1] / 2 - ITEM_NAME_SIZE[1] / 2,
                        0,
                        ITEM_NAME,
                        BUTTON_NAME_COLOR,
                        BUTTON_NAME_FONT)

                    if (defines.in_bounds(input.cursor(), ITEM_POSITION, BUTTON_BOX_SIZE) && ITEM_INTERACTION_PERMISSION && !IS_SOMETHING_OPEN()) {
                        if (input.pressed(0x01)) {
                            objItem.func()
                        }
                    } else {
                        objItem.hint_timer = CURTIME
                    }
                        
                    var HINT_ANIM = visuals.new_animation(id_n + 'hint anim', CURTIME - objItem.hint_timer > menu.hint_timer ? 1 : 0)

                    if (HINT_ANIM > 0) {
                        HINTS.push({
                            POSITION : [ITEM_POSITION[0] + BUTTON_BOX_SIZE[0], ITEM_POSITION[1] + BUTTON_BOX_SIZE[1] / 2],
                            ITEM : objItem,
                            ANIM : HINT_ANIM
                        })
                    }
                    
                    SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] = SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] + BUTTON_ITEM_INDENT * ITEM_ALPHA
                } else if (objItem.type == 'keybind') {

                    var KEYBIND_NAME_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'keybind name', COLORS.KEYBIND_NAME),
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var KEYBIND_BOX_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'keybind box', COLORS.KEYBIND_BOX),
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var KEYBIND_OUTLINE_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'keybind outline', COLORS.KEYBIND_OUTLINE),
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var KEYBIND_KEY_COLOR = defines.alpha_override(visuals.new_animation(id_n + 'keybind key', COLORS.KEYBIND_KEY),
                        ITEM_ALPHA * SUBTAB_ALPHA * menu_alpha)

                    var KEYBIND_BOUND_KEY = objItem.key

                    var KEYBIND_BOUND_KEY_PREVIEW = objItem.listening ? '...' : KEYBIND_BOUND_KEY == undefined ? 'None' : defines.key_names[KEYBIND_BOUND_KEY].toUpperCase()
                    var KEYBIND_BOUND_KEY_PREVIEW_SIZE = render.TextSize(KEYBIND_BOUND_KEY_PREVIEW, KEYBINDS_KEY_PREVIEW_FONT)

                    render.FilledRect(ITEM_POSITION[0] + KEYBIND_PLACE_SIZE - KEYBIND_BOUND_KEY_PREVIEW_SIZE[0] - KEYBIND_KEY_PREVIEW_INDENT * 2,
                        ITEM_POSITION[1],
                        KEYBIND_BOUND_KEY_PREVIEW_SIZE[0] + KEYBIND_KEY_PREVIEW_INDENT * 2,
                        KEYBIND_BOX_SIZE[1],
                        KEYBIND_BOX_COLOR)

                    render.Rect(ITEM_POSITION[0] + KEYBIND_PLACE_SIZE - KEYBIND_BOUND_KEY_PREVIEW_SIZE[0] - KEYBIND_KEY_PREVIEW_INDENT * 2,
                        ITEM_POSITION[1],
                        KEYBIND_BOUND_KEY_PREVIEW_SIZE[0] + KEYBIND_KEY_PREVIEW_INDENT * 2,
                        KEYBIND_BOX_SIZE[1],
                        KEYBIND_OUTLINE_COLOR)

                    render.String(ITEM_POSITION[0] + KEYBIND_PLACE_SIZE - KEYBIND_KEY_PREVIEW_INDENT - KEYBIND_BOUND_KEY_PREVIEW_SIZE[0],
                        ITEM_POSITION[1] + KEYBIND_BOX_SIZE[1] / 2 - KEYBIND_BOUND_KEY_PREVIEW_SIZE[1] / 2,
                        0,
                        KEYBIND_BOUND_KEY_PREVIEW,
                        KEYBIND_KEY_COLOR,
                        KEYBINDS_KEY_PREVIEW_FONT)

                    render.String(ITEM_POSITION[0], 
                        ITEM_POSITION[1] + KEYBIND_BOX_SIZE[1] / 2 - ITEM_NAME_SIZE[1] / 2,
                        0,
                        ITEM_NAME,
                        KEYBIND_NAME_COLOR,
                        ITEM_NAME_FONT)

                    if (!ITEM_INTERACTION_PERMISSION) {
                        objItem.listening = false
                        objItem.is_visible = false
                    }

                    if (defines.in_bounds(input.cursor(), ITEM_POSITION, [KEYBIND_PLACE_SIZE, KEYBIND_BOX_SIZE[1]]) && ITEM_INTERACTION_PERMISSION && !IS_SOMETHING_OPEN()) {
                        if (input.pressed(0x01)) {
                            objItem.listening = true
                        }
                    } else {
                        objItem.hint_timer = CURTIME
                    }
                        
                    var HINT_ANIM = visuals.new_animation(id_n + 'hint anim', CURTIME - objItem.hint_timer > menu.hint_timer ? 1 : 0)

                    if (HINT_ANIM > 0) {
                        HINTS.push({
                            POSITION : [ITEM_POSITION[0] + ITEM_NAME_SIZE[0], ITEM_POSITION[1] + ITEM_NAME_SIZE[1] / 2],
                            ITEM : objItem,
                            ANIM : HINT_ANIM
                        })
                    }

                    if (objItem.listening) {
                        var ignored_keys = [
                            'mouse1',
                            'mouse2',
                            'insert',
                            'delete', //надеюсь не будет долбоебов которые захотят хитшанс оверрайд на инсерт забиндить
                            'escape',
                            '-'
                        ]

                        var remove_keybind_key_code = 0x1B //escape

                        for (i = 1; i < 255; i++) {
                            if (input.pressed(i) && ignored_keys.indexOf(defines.key_names[i]) == -1) {
                                objItem.key = i
                                objItem.listening = false
                            }
                        }

                        if (input.pressed(remove_keybind_key_code)) {
                            objItem.key = undefined
                            objItem.listening = false
                        }

                        if (input.pressed(0x01)) {
                            if (!defines.in_bounds(input.cursor(), [ITEM_POSITION[0] + KEYBIND_PLACE_SIZE - KEYBIND_BOUND_KEY_PREVIEW_SIZE[0] - KEYBIND_KEY_PREVIEW_INDENT * 2, ITEM_POSITION[1]], [KEYBIND_BOUND_KEY_PREVIEW_SIZE[0] + KEYBIND_KEY_PREVIEW_INDENT * 2, KEYBIND_BOX_SIZE[1]])) {
                                objItem.listening = false
                            }
                        }
                    }

                    if (input.pressed(0x02) && ITEM_INTERACTION_PERMISSION && !IS_SOMETHING_OPEN()) {
                        if (defines.in_bounds(input.cursor(), [ITEM_POSITION[0] + KEYBIND_PLACE_SIZE - KEYBIND_BOUND_KEY_PREVIEW_SIZE[0] - KEYBIND_KEY_PREVIEW_INDENT * 2, ITEM_POSITION[1]], [KEYBIND_BOUND_KEY_PREVIEW_SIZE[0] + KEYBIND_KEY_PREVIEW_INDENT * 2, KEYBIND_BOX_SIZE[1]])) {
                            objItem.is_visible = true
                        }
                    }

                    var KEYBIND_ANIM = visuals.new_animation(id_n + 'keybind anim', objItem.is_visible ? 1 : 0)
                    var OPTIONS_OFFSET = 0

                    if (KEYBIND_ANIM > 0) {

                        var KEYBIND_MODE_WINDOW_TABLE = {
                            POSITION : [ITEM_POSITION[0] + KEYBIND_PLACE_SIZE + KEYBIND_KEY_PREVIEW_INDENT, ITEM_POSITION[1] + KEYBIND_BOX_SIZE[1] / 2],
                            ITEM : objItem,
                            ANIM : KEYBIND_ANIM
                        }

                        for (m in objItem.modes) {

                            if (input.pressed(0x01) && ITEM_INTERACTION_PERMISSION && KEYBIND_ANIM) {
                                if (defines.in_bounds(input.cursor(), [KEYBIND_MODE_WINDOW_TABLE.POSITION[0], KEYBIND_MODE_WINDOW_TABLE.POSITION[1] + OPTIONS_OFFSET], KEYBIND_MODE_WINDOW_SIZE)) {
                                    objItem.mode = m
                                    objItem.is_visible = false
                                }
                            }

                            OPTIONS_OFFSET = OPTIONS_OFFSET + KEYBIND_MODE_WINDOW_SIZE[1]
                        }

                        if (input.pressed(0x01) && ITEM_INTERACTION_PERMISSION) {
                            if (!defines.in_bounds(input.cursor(), [KEYBIND_MODE_WINDOW_TABLE.POSITION[0], KEYBIND_MODE_WINDOW_TABLE.POSITION[1] + OPTIONS_OFFSET], [KEYBIND_MODE_WINDOW_SIZE[0], KEYBIND_MODE_WINDOW_SIZE[1] * (objItem.modes.length + 1)])) {
                                objItem.is_visible = false
                            }
                        }

                        KEYBIND_TYPE_SELECTORS.push(KEYBIND_MODE_WINDOW_TABLE)

                    }
                    
                    SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] = SUBTAB_ITEMS_OFFSET[SUBTAB_NAME] + KEYBIND_ITEM_INDENT * ITEM_ALPHA
                    
                }
            }
            
            menu.subtab_offsets[TAB_NAME][SUBTAB_NAME] = SUBTAB_ITEMS_OFFSET[SUBTAB_NAME]
            SUBTABS_OFFSET = SUBTABS_OFFSET + SUBTAB_SIZE_W + SUBTAB_INDENT
        }

        TAB_OFFSET = TAB_OFFSET + TAB_NAME_SIZE[0] + HEADER_PER_TAB_NAME_INDENT
    }
    
    for (DROPDOWN_ID in DROPDOWNS) {
        var DROPDOWN = DROPDOWNS[DROPDOWN_ID]
        var OPTIONS_OFFSET = 0

        var DROPDOWN_BOX_COLOR = defines.alpha_override(COLORS.DROPDOWN_BOX, DROPDOWN.ANIM)
        
        render.FilledRect(DROPDOWN.POSITION[0],
            DROPDOWN.POSITION[1],
            DROPDOWN_BOX_SIZE[0],
            DROPDOWN_BOX_SIZE[1] * (DROPDOWN.ITEM.options.length) * DROPDOWN.ANIM,
            DROPDOWN_BOX_COLOR)

        for (i in DROPDOWN.ITEM.options) {
            if (DROPDOWN.ITEM.type == 'multidropdown') {
                var OPTION_NAME = DROPDOWN.ITEM.options[i]
                var OPTION_NAME_SIZE = render.TextSize(OPTION_NAME, DROPDOWN_PREVIEW_FONT)
                var OPTION_NAME_COLOR = defines.alpha_override(visuals.new_animation(DROPDOWN.ITEM.tab + DROPDOWN.ITEM.subtab + DROPDOWN.ITEM.name + i + 'mdd prvw vl',
                        DROPDOWN.ITEM.value[i] ? COLORS.DROPDOWN_VALUES_ACTIVE : COLORS.DROPDOWN_VALUES_INACTIVE),
                    DROPDOWN.ANIM)

                render.String(DROPDOWN.POSITION[0] + DROPDOWN_PREVIEW_INDENT,
                    DROPDOWN.POSITION[1] + DROPDOWN_BOX_SIZE[1] / 2 - OPTION_NAME_SIZE[1] / 2 + OPTIONS_OFFSET,
                    0,
                    OPTION_NAME,
                    OPTION_NAME_COLOR,
                    DROPDOWN_PREVIEW_FONT)

            } else {
                var OPTION_NAME = DROPDOWN.ITEM.options[i]
                var OPTION_NAME_SIZE = render.TextSize(OPTION_NAME, DROPDOWN_PREVIEW_FONT)
                var OPTION_NAME_COLOR = defines.alpha_override(visuals.new_animation(DROPDOWN.ITEM.tab + DROPDOWN.ITEM.subtab + DROPDOWN.ITEM.name + i + 'dd prvw vl',
                        i == DROPDOWN.ITEM.value ? COLORS.DROPDOWN_VALUES_ACTIVE : COLORS.DROPDOWN_VALUES_INACTIVE),
                    DROPDOWN.ANIM)

                render.String(DROPDOWN.POSITION[0] + DROPDOWN_PREVIEW_INDENT,
                    DROPDOWN.POSITION[1] + DROPDOWN_BOX_SIZE[1] / 2 - OPTION_NAME_SIZE[1] / 2 + OPTIONS_OFFSET,
                    0,
                    OPTION_NAME,
                    OPTION_NAME_COLOR,
                    DROPDOWN_PREVIEW_FONT)
            }

            OPTIONS_OFFSET = OPTIONS_OFFSET + DROPDOWN_BOX_SIZE[1] * DROPDOWN.ANIM
        }

        var DROPDOWN_OUTLINE_COLOR = defines.alpha_override(COLORS.DROPDOWN_OUTLINE, DROPDOWN.ANIM)

        render.Rect(DROPDOWN.POSITION[0],
            DROPDOWN.POSITION[1] - DROPDOWN_BOX_SIZE[1],
            DROPDOWN_BOX_SIZE[0],
            DROPDOWN_BOX_SIZE[1] * (DROPDOWN.ITEM.options.length + 1) * DROPDOWN.ANIM,
            DROPDOWN_OUTLINE_COLOR)
    }

    for (COLORPICKER_ID in COLORPICKERS) {
        
        var COLORPICKER = COLORPICKERS[COLORPICKER_ID]

        var COLORPICKER_PICKER_COLOR = defines.alpha_override(COLORS.COLORPICKER_BOX, COLORPICKER.ANIM)
        var COLORPICKER_PICKER_OUTLINE_COLOR = defines.alpha_override(COLORS.COLORPICKER_OUTLINE, COLORPICKER.ANIM)

        render.FilledRect(COLORPICKER.POSITION[0],
            COLORPICKER.POSITION[1],
            COLORPICKER_PICKER_SIZE[0],
            COLORPICKER_PICKER_SIZE[1],
            COLORPICKER_PICKER_COLOR) //фон

        render.Rect(COLORPICKER.POSITION[0],
            COLORPICKER.POSITION[1],
            COLORPICKER_PICKER_SIZE[0],
            COLORPICKER_PICKER_SIZE[1],
            COLORPICKER_PICKER_OUTLINE_COLOR) //обводка фона

        render.Gradient(COLORPICKER.POSITION[0] + COLORPICKER_FILEDS_INDENT,
            COLORPICKER.POSITION[1] + COLORPICKER_FILEDS_INDENT,
            COLORPICKER_PICKER_COLOR_SIZE[0],
            COLORPICKER_PICKER_COLOR_SIZE[1],
            [255, 255, 255, 255 * COLORPICKER.ANIM],
            defines.hsv_to_rbg([COLORPICKER.ITEM.hsv[0], 1, 1, 255 * COLORPICKER.ANIM]),
            [0, 0, 0, 255 * COLORPICKER.ANIM],
            [0, 0, 0, 255 * COLORPICKER.ANIM]) //насыщенность и значение  

        render.Rect(COLORPICKER.POSITION[0] + COLORPICKER_FILEDS_INDENT,
            COLORPICKER.POSITION[1] + COLORPICKER_FILEDS_INDENT,
            COLORPICKER_PICKER_COLOR_SIZE[0],
            COLORPICKER_PICKER_COLOR_SIZE[1],
            COLORPICKER_PICKER_OUTLINE_COLOR) //обводка пикера насыщенности и значения

        var colors = [
            [255, 0, 0, 255],
            [255, 255, 0, 255],
            [0, 255, 0, 255],
            [0, 255, 255, 255],
            [0, 0, 255, 255],
            [255, 0, 255, 255],
            [255, 0, 0, 255]
        ]    

        for (i = 0; i < colors.length - 1; i++) {

            var current_color = defines.alpha_override(colors[i], COLORPICKER.ANIM)
            var next_color = defines.alpha_override(colors[i + 1], COLORPICKER.ANIM)

            render.GradientRect(COLORPICKER.POSITION[0] + COLORPICKER_PICKER_COLOR_SIZE[0] + COLORPICKER_FILEDS_INDENT * 2,
                COLORPICKER.POSITION[1] + COLORPICKER_FILEDS_INDENT + i * COLORPICKER_PICKER_HUE_SIZE[1] / 6, 
                COLORPICKER_PICKER_HUE_SIZE[0],
                COLORPICKER_PICKER_HUE_SIZE[1] / 6,
                0,
                current_color,
                next_color) //пикер оттенка 
        }

        render.Rect(COLORPICKER.POSITION[0] + COLORPICKER_PICKER_COLOR_SIZE[0] + COLORPICKER_FILEDS_INDENT * 2,
            COLORPICKER.POSITION[1] + COLORPICKER_FILEDS_INDENT, 
            COLORPICKER_PICKER_HUE_SIZE[0],
            COLORPICKER_PICKER_HUE_SIZE[1],
            COLORPICKER_PICKER_OUTLINE_COLOR) //обводка пикера оттенка

        render.Rect(COLORPICKER.POSITION[0] + COLORPICKER_PICKER_COLOR_SIZE[0] + COLORPICKER_FILEDS_INDENT * 2 - 1,
            COLORPICKER.POSITION[1] + COLORPICKER_FILEDS_INDENT + COLORPICKER_PICKER_HUE_SIZE[1] * COLORPICKER.ITEM.hsv[0] - 1,
            COLORPICKER_PICKER_HUE_SIZE[0] + 2,
            3,
            [0, 0, 0, 255 * COLORPICKER.ANIM]) //обводка курсора пикера оттенка
        
        render.Rect(COLORPICKER.POSITION[0] + COLORPICKER_PICKER_COLOR_SIZE[0] + COLORPICKER_FILEDS_INDENT * 2,
            COLORPICKER.POSITION[1] + COLORPICKER_FILEDS_INDENT + COLORPICKER_PICKER_HUE_SIZE[1] * COLORPICKER.ITEM.hsv[0],
            COLORPICKER_PICKER_HUE_SIZE[0],
            1,
            [255, 255, 255, 255 * COLORPICKER.ANIM]) //курсор пикера оттенка

        render.GradientRect(COLORPICKER.POSITION[0] + COLORPICKER_PICKER_COLOR_SIZE[0] + COLORPICKER_PICKER_HUE_SIZE[0] + COLORPICKER_FILEDS_INDENT * 3,
            COLORPICKER.POSITION[1] + COLORPICKER_FILEDS_INDENT,
            COLORPICKER_PICKER_ALPHA_SIZE[0],
            COLORPICKER_PICKER_ALPHA_SIZE[1],
            0, 
            [255, 255, 255, 255 * COLORPICKER.ANIM],
            [0, 0, 0, 255 * COLORPICKER.ANIM]) //пикер прозрачности

        render.Rect(COLORPICKER.POSITION[0] + COLORPICKER_PICKER_COLOR_SIZE[0] + COLORPICKER_PICKER_HUE_SIZE[0] + COLORPICKER_FILEDS_INDENT * 3,
            COLORPICKER.POSITION[1] + COLORPICKER_FILEDS_INDENT,
            COLORPICKER_PICKER_ALPHA_SIZE[0],
            COLORPICKER_PICKER_ALPHA_SIZE[1],
            COLORPICKER_PICKER_OUTLINE_COLOR) //обводка пикера прозрачности

        render.Rect(COLORPICKER.POSITION[0] + COLORPICKER_PICKER_COLOR_SIZE[0] + COLORPICKER_PICKER_HUE_SIZE[0] + COLORPICKER_FILEDS_INDENT * 3,
            COLORPICKER.POSITION[1] + COLORPICKER_FILEDS_INDENT + COLORPICKER_PICKER_ALPHA_SIZE[1] * (1 - COLORPICKER.ITEM.hsv[3] / 255),
            COLORPICKER_PICKER_ALPHA_SIZE[0],
            1,
            [255, 255, 255, 255 * COLORPICKER.ANIM]) //курсор пикера прозрачности

        render.Rect(COLORPICKER.POSITION[0] + COLORPICKER_PICKER_COLOR_SIZE[0] + COLORPICKER_PICKER_HUE_SIZE[0] + COLORPICKER_FILEDS_INDENT * 3 - 1,
            COLORPICKER.POSITION[1] + COLORPICKER_FILEDS_INDENT + COLORPICKER_PICKER_ALPHA_SIZE[1] * (1 - COLORPICKER.ITEM.hsv[3] / 255) - 1,
            COLORPICKER_PICKER_ALPHA_SIZE[0] + 2,
            3,
            [0, 0, 0, 255 * COLORPICKER.ANIM]) //обводка курсора пикера прозрачности

        render.FilledCircle(COLORPICKER.POSITION[0] + COLORPICKER_FILEDS_INDENT + COLORPICKER_PICKER_COLOR_SIZE[0] * COLORPICKER.ITEM.hsv[1],
            COLORPICKER.POSITION[1] + COLORPICKER_FILEDS_INDENT + COLORPICKER_PICKER_COLOR_SIZE[1] * (1 - COLORPICKER.ITEM.hsv[2]),
            COLORPICKER_PICKER_CROSSHAIR_SIZE,
            [255, 255, 255, 255 * COLORPICKER.ANIM]) //курсор пикера насыщенности и значения

        render.Circle(COLORPICKER.POSITION[0] + COLORPICKER_FILEDS_INDENT + COLORPICKER_PICKER_COLOR_SIZE[0] * COLORPICKER.ITEM.hsv[1],
            COLORPICKER.POSITION[1] + COLORPICKER_FILEDS_INDENT + COLORPICKER_PICKER_COLOR_SIZE[1] * (1 - COLORPICKER.ITEM.hsv[2]),
            COLORPICKER_PICKER_CROSSHAIR_SIZE,
            [0, 0, 0, 255 * COLORPICKER.ANIM]) //обводка курсора пикера насыщенности и значения
    }

    for (KEYBIND_ID in KEYBIND_TYPE_SELECTORS) {
        
        var KEYBIND = KEYBIND_TYPE_SELECTORS[KEYBIND_ID]
        var OPTIONS_OFFSET = 0

        var BACKGROUND_COLOR = defines.alpha_override(COLORS.KEYBIND_BOX, KEYBIND.ANIM)
        var OUTLINE_COLOR = defines.alpha_override(COLORS.KEYBIND_OUTLINE, KEYBIND.ANIM)
        
        render.FilledRect(KEYBIND.POSITION[0],
            KEYBIND.POSITION[1],
            KEYBIND_MODE_WINDOW_SIZE[0],
            KEYBIND_MODE_WINDOW_SIZE[1] * (KEYBIND.ITEM.modes.length) * KEYBIND.ANIM,
            BACKGROUND_COLOR)

        for (i in KEYBIND.ITEM.modes) {
            
            var SELECTED = KEYBIND.ITEM.mode == i

            var MODE_TEXT = KEYBIND.ITEM.modes[i]
            var MODE_TEXT_SIZE = render.TextSize(MODE_TEXT, KEYBINDS_KEY_PREVIEW_FONT)

            var MODE_COLOR = defines.alpha_override(visuals.new_animation(KEYBIND.ITEM.tab + KEYBIND.ITEM.subtab + KEYBIND.ITEM.name + i + 'kbnds prvw md',
                    SELECTED ? COLORS.KEYBIND_MODE_ACTIVE : COLORS.KEYBIND_MODE_INACTIVE),
                KEYBIND.ANIM)

            render.String(KEYBIND.POSITION[0] + KEYBIND_KEY_PREVIEW_INDENT,
                KEYBIND.POSITION[1] + KEYBIND_MODE_WINDOW_SIZE[1] / 2 - MODE_TEXT_SIZE[1] / 2 + OPTIONS_OFFSET,
                0,
                MODE_TEXT,
                MODE_COLOR,
                KEYBINDS_KEY_PREVIEW_FONT)

            OPTIONS_OFFSET = OPTIONS_OFFSET + KEYBIND_MODE_WINDOW_SIZE[1] * KEYBIND.ANIM
        }

        render.Rect(KEYBIND.POSITION[0],
            KEYBIND.POSITION[1],
            KEYBIND_MODE_WINDOW_SIZE[0],
            KEYBIND_MODE_WINDOW_SIZE[1] * (KEYBIND.ITEM.modes.length) * KEYBIND.ANIM,
            OUTLINE_COLOR)

    }

    for (HINT_ID in HINTS) {

        var HINT = HINTS[HINT_ID]

        var POSITION = [
            HINT.POSITION[0] + HINT_INDENT,
            HINT.POSITION[1] + HINT_INDENT
        ]

        var BACKGROUND_COLOR = defines.alpha_override(COLORS.HINT_BACKGROUND, HINT.ANIM)
        var OUTLINE_COLOR = defines.alpha_override(COLORS.HINT_OUTLINE, HINT.ANIM)
        var NAME_COLOR = defines.alpha_override(COLORS.HINT_ITEM_NAME, HINT.ANIM)
        var DESCRIPTION_COLOR = defines.alpha_override(COLORS.HINT_DESCRIPTION, HINT.ANIM)

        var NAME = HINT.ITEM.name
        var HINT_ITEM = HINT.ITEM.hint

        var NAME_SIZE = render.TextSize(NAME, ITEM_NAME_FONT)
        var DESCRIPTION_SIZE = HINT_ITEM == undefined ? [0, 0] : render.TextSize(HINT_ITEM, HINT_TEXT_FONT)

        var HINT_BOX_SIZE = [
            NAME_SIZE[0] > DESCRIPTION_SIZE[0] ? NAME_SIZE[0] + HINT_INDENT * 2 : DESCRIPTION_SIZE[0] + HINT_INDENT * 2,
            NAME_SIZE[1] + DESCRIPTION_SIZE[1] + HINT_INDENT * (HINT_ITEM == undefined ? 2 : 3)
        ]

        render.FilledRect(POSITION[0],
            POSITION[1],
            HINT_BOX_SIZE[0],
            HINT_BOX_SIZE[1],
            BACKGROUND_COLOR)

        render.Rect(POSITION[0],
            POSITION[1],
            HINT_BOX_SIZE[0],
            HINT_BOX_SIZE[1],
            OUTLINE_COLOR)

        render.String(POSITION[0] + HINT_INDENT,
            POSITION[1] + HINT_INDENT,
            0,
            NAME,
            NAME_COLOR,
            ITEM_NAME_FONT)

        if (HINT_ITEM != undefined) {
            render.String(POSITION[0] + HINT_INDENT,
                POSITION[1] + HINT_INDENT * 2 + NAME_SIZE[1],
                0,
                HINT_ITEM,
                DESCRIPTION_COLOR,
                HINT_TEXT_FONT)
        }

    }

    drag.handle(MENU_POSITION[0], MENU_POSITION[1], SCRIPT_NAME_SIZE[0] + HEADER_SCRIPT_NAME_INDENT[0] * 2, HEADER_SIZE[1], 'menu')
}

//жаль что так по уебански

menu.handle_keybinds = function () {
    for (tab in menu.items) {

        var objTab = menu.items[tab]

        for (subtab in objTab.items) {
            
            var objSubtab = objTab.items[subtab]

            for (item in objSubtab.items) {

                var objItem = objSubtab.items[item]

                if (!objItem) {
                    continue
                }

                if (objItem.type == 'keybind') {
                    if (objItem.mode == 2) {
                        objItem.value = true
                    } else {
                        if (objItem.key != undefined) {
                            if (objItem.mode == 0) {
                                objItem.value = input.held(objItem.key)
                            } else if (objItem.mode == 1) {
                                if (input.pressed(objItem.key)) {
                                    objItem.value = !objItem.value
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

menu.add_dropdown('Settings', 'Menu', 'DPI Scale', ['100%', '125%', '150%', '175%', '200%'], 0, undefined, 'Changes menu size', undefined, true)

menu.dpi_scale_cache = 1

menu.handle_dpi_scale = function () {
    var dpi_scale_menu_value = menu.get_value('Settings', 'Menu', 'DPI Scale')

    if (menu.dpi_scale_table[dpi_scale_menu_value] != menu.dpi_scale_cache) {
        menu.dpi_scale = menu.dpi_scale_table[dpi_scale_menu_value]
        menu.dpi_scale_cache = menu.dpi_scale
    }
}

menu.subscribe('Settings', 'Menu', 'DPI Scale', menu.handle_dpi_scale)

menu.add_dropdown('Settings', 'Menu', 'Color scheme', menu.colors.themes_table, 0, undefined, 'Changes menu color scheme', undefined, true)

menu.color_scheme_cache = 'Default'

menu.handle_color_scheme = function () {
    var color_scheme_menu_value = menu.get_value('Settings', 'Menu', 'Color scheme')

    if (menu.colors.themes_table[color_scheme_menu_value] != menu.color_scheme_cache) {
        menu.colors.current_theme = menu.colors.themes_table[color_scheme_menu_value]
        menu.color_scheme_cache = menu.colors.current_theme
    }
}

menu.subscribe('Settings', 'Menu', 'Color scheme', menu.handle_color_scheme)

menu.add_dropdown('Settings', 'Configs', 'Config slot', ['Slot 1', 'Slot 2', 'Slot 3', 'Slot 4', 'Slot 5'], 0, undefined, 'Config slot selection', undefined, true)

var configs = {}

configs.extension = script.name

configs.name = 'slot'

configs.get_name = function (slot) {
    return configs.name + (slot + 1).toString() + '.' + configs.extension
}

configs.save = function () {
    var current_slot = Number(menu.get_value('Settings', 'Configs', 'Config slot'))
    var current_name = configs.get_name(current_slot)

    DataFile.Save(current_name)

    for (tab in menu.items) {
        var objTab = menu.items[tab]

        for (subtab in objTab.items) {
            var objSubtab = objTab.items[subtab]

            for (item in objSubtab.items) {
                var objItem = objSubtab.items[item]

                if (!objItem) {
                    continue
                }

                var current_item_key = [objTab.name, objSubtab.name, objItem.name].join('|')
                var value = menu.get_value(objTab.name, objSubtab.name, objItem.name)
                var string_value = undefined
                
                if (objItem.type == 'checkbox') {
                    var string_value = value.toString()
                    //"true"
                } else if (objItem.type == 'slider') {
                    Cheat.Print(objItem.name + ' | ' + value.toString() + ' SAVE\n')
                    var string_value = value.toString()
                    //"52"
                } else if (objItem.type == 'dropdown') {
                    var string_value = value.toString()
                    //"1"
                } else if (objItem.type == 'multidropdown') {
                    var string_value = value.join(',') //[true, false, true] -> "true, false, true"
                } else if (objItem.type == 'colorpicker') {
                    var string_value = value.join(',') //[255, 125, 100, 255] -> "255, 125, 100, 255"
                } else if (objItem.type == 'keybind') {
                    var item = menu.get_item(objTab.name, objSubtab.name, objItem.name)
                    var string_value = [
                        item.key == undefined ? 0 : item.key,
                        item.mode //0, 1, 2 - hold, toggle, always
                    ].join(',') // -> e.g "0, 1"
                }

                if (string_value != undefined) {
                    //Cheat.Print(current_item_key.toString() + ' | ' + string_value.toString() + ' | ' + typeof(string_value) + '\n')
                    DataFile.SetKey(current_name, current_item_key, string_value)
                }
            }
        }
    }

    DataFile.Save(current_name)
}

//сукааа уже обрадовался что все сделал, потом вспомнил что надо еще делать X-WAY конфиг

configs.load = function () {
    var current_slot = Number(menu.get_value('Settings', 'Configs', 'Config slot'))
    var current_name = configs.get_name(current_slot)

    DataFile.Load(current_name) //сука пидорасы почему так ху*во сделали Onetap developeri

    var empty_key = DataFile.GetKey(current_name, 'empty_key')
    
    var x_ways = []
    var x_way_identificator = 'XWAY'

    for (tab in menu.items) {
        var objTab = menu.items[tab]

        for (subtab in objTab.items) {
            var objSubtab = objTab.items[subtab]

            for (item in objSubtab.items) {
                var objItem = objSubtab.items[item]

                if (!objItem) {
                    continue
                }

                var current_item_key = [objTab.name, objSubtab.name, objItem.name].join('|')
                var string_value = DataFile.GetKey(current_name, current_item_key)

                if (string_value == empty_key) {
                    continue
                }

                if (objItem.name.indexOf(x_way_identificator) != -1) {
                    var item_name = objItem.name

                    var condition_name = item_name.substring(x_way_identificator.length, item_name.length) //XWAYStanding -> Standing
                    var quantity = Number(string_value)

                    x_ways[condition_name] = quantity
                }

                var new_value = undefined
                
                if (objItem.type == 'checkbox') {
                    new_value = string_value === 'true'
                } else if (objItem.type == 'slider') {
                    Cheat.Print(objItem.name + ' | ' + string_value + ' LOAD\n')
                    new_value = Number(string_value)
                } else if (objItem.type == 'dropdown') {
                    new_value = Number(string_value)
                } else if (objItem.type == 'multidropdown') {
                    var value = string_value.split(',')
                    new_value = (function () {
                        var new_table = []

                        for (i = 0; i < value.length; i++) {
                            new_table[i] = value[i] === 'true'
                        }

                        return new_table
                    })()
                } else if (objItem.type == 'colorpicker') {
                    var value = string_value.split(',')
                    new_value = (function () {
                        var new_table = []

                        for (i = 0; i < value.length; i++) {
                            new_table[i] = Number(value[i])
                        }

                        return new_table
                    })()
                } else if (objItem.type == 'keybind') {
                    var keybind_value = string_value.split(',')
                    menu.set_keybind(objTab.name, objSubtab.name, objItem.name, Number(keybind_value[0]), Number(keybind_value[1]))
                }

                if (new_value != undefined) {
                    menu.set_value(objTab.name, objSubtab.name, objItem.name, new_value)
                }
            }
        }
    }

    for (condition_name in x_ways) {
        var quantity = x_ways[condition_name]
        var menu_elements = anti_aims.x_way.menu_elements[condition_name]

        if (menu_elements.length > quantity) {
            while (menu_elements.length > quantity) {
                anti_aims.x_way.remove_way(condition_name)
            }
        } else if (menu_elements.length < quantity) {
            while (menu_elements.length < quantity) {
                anti_aims.x_way.add_way(condition_name)
            }
        }

        for (i = 0; i < menu_elements.length; i++) {
            var current_element = menu_elements[i]
            
            var current_item_key = [current_element.tab, current_element.subtab, current_element.name].join('|')
            var string_value = DataFile.GetKey(current_name, current_item_key)

            menu.set_value(current_element.tab, current_element.subtab, current_element.name, Number(string_value))
        }
    }
}

menu.add_button('Settings', 'Configs', 'Save config', configs.save, undefined, 'Loads config from selected slot')
menu.add_button('Settings', 'Configs', 'Load config', configs.load, undefined, 'Saves current config as selected slot')


menu.add_subtab('Rage', 'Main')

menu.add_checkbox('Rage', 'Main', 'Enable', false)

var rage = {}

rage.conditional_hitchance = {}

menu.add_checkbox('Rage', 'Main', 'Conditional hitchance', false, function () {
    return menu.get_value('Rage', 'Main', 'Enable')
})

menu.add_multidropdown('Rage', 'Main', 'Conditions', ['Error'], [false], function () {
    return menu.get_value('Rage', 'Main', 'Enable') && menu.get_value('Rage', 'Main', 'Conditional hitchance')
})

rage.conditional_hitchance.conditions = []
rage.conditional_hitchance.condition_list = []

rage.conditional_hitchance.on_land_timer = 0

rage.conditional_hitchance.new_condition = function(name, fn) {
    var id = rage.conditional_hitchance.conditions.length

    rage.conditional_hitchance.conditions.push({})
    rage.conditional_hitchance.condition_list.push(name)

    menu.update_list('Rage', 'Main', 'Conditions', rage.conditional_hitchance.condition_list)

    var current_condition = {}

    var show_condition = function () {
        return menu.get_value('Rage', 'Main', 'Enable') &&
            menu.get_value('Rage', 'Main', 'Conditional hitchance') &&
            menu.get_value('Rage', 'Main', 'Conditions')[id]
    }

    if (name == 'On key') {
        current_condition.key = menu.add_keybind('Rage', 'Main', 'Key', show_condition)
    }

    current_condition.value = menu.add_slider('Rage', 'Main', name + ' hitchance', 50, 0, 100, show_condition)
    

    rage.conditional_hitchance.conditions[id] = {
        reference : current_condition,
        fn : fn
    }
}

rage.conditional_hitchance.apply_condition = function (name) {
    for (i = 0; i < 64; i++) {
        Ragebot.ForceTargetHitchance(i, menu.get_value('Rage', 'Main', name + ' hitchance'))
    }

    return true
}

rage.conditional_hitchance.update_conditions = function () {
    if (!menu.get_value('Rage', 'Main', 'Enable') || !menu.get_value('Rage', 'Main', 'Conditional hitchance')) {
        return
    }

    var is_applied = false

    var localplayer = Entity.GetLocalPlayer()

    if (!localplayer) {
        return
    }

    var localplayer_flags = Entity.GetProp(localplayer, 'CBasePlayer', 'm_fFlags')

    if (!localplayer_flags) {
        return
    }

    for (i in rage.conditional_hitchance.conditions) {

        if (rage.conditional_hitchance.condition_list[i] == 'On key') {
            var state = rage.conditional_hitchance.conditions[i].fn(
                menu.get_value('Rage', 'Main', 'Conditions')[i] && menu.get_value('Rage', 'Main', 'Key'),
                localplayer_flags,
                localplayer
            )
        } else {
            var state = rage.conditional_hitchance.conditions[i].fn(
                menu.get_value('Rage', 'Main', 'Conditions')[i],
                localplayer_flags,
                localplayer
            )
        }

        if (state) {
            is_applied = rage.conditional_hitchance.apply_condition(rage.conditional_hitchance.condition_list[i])

            break
        }
    }
}

rage.conditional_hitchance.new_condition('In air', function (key, flags, localplayer) {
    if (!key) {
        return false
    }

    var on_ground = bit.band(flags, FL_ONGROUND) != 0

    return !on_ground
})

rage.conditional_hitchance.new_condition('No scope', function (key, flags, localplayer) {
    if (!key) {
        return false
    }

    var scoped = Entity.GetProp(localplayer, 'CCSPlayer', 'm_bIsScoped')

    return !scoped
})

rage.conditional_hitchance.new_condition('On land', function (key, flags, localplayer) {
    if (!key) {
        return false
    }

    var on_ground = bit.band(flags, FL_ONGROUND) != 0

    if (on_ground) {
        rage.conditional_hitchance.on_land_timer++
    } else {
        rage.conditional_hitchance.on_land_timer = 0
    }

    var condition = rage.conditional_hitchance.on_land_timer > 2 && rage.conditional_hitchance.on_land_timer < 16

    return condition
})

rage.conditional_hitchance.new_condition('On key', function (key, flags, localplayer) {
    return key
})

var anti_aims = {}

menu.add_subtab('Anti Aim', 'Main')
menu.add_subtab('Anti Aim', 'Builder')

menu.add_checkbox('Anti Aim', 'Main', 'Enable', false)

anti_aims.m_current_condition = menu.add_dropdown('Anti Aim', 'Main', 'Current Condition', ['Error'], 0, function () {
    return menu.get_value('Anti Aim', 'Main', 'Enable')
})


anti_aims.conditions = []
anti_aims.condition_list = []

anti_aims.packets = 0

anti_aims.packets_update = function () {
    if (Globals.ChokedCommands() == 0) {
        anti_aims.packets++
    }
}

anti_aims.current_state = 'unknown'

anti_aims.yaw_path = ['Rage', 'Anti Aim', 'Directions', 'Yaw offset']
anti_aims.inverter_path = ['Rage', 'Anti Aim', 'General', 'Key assignment', 'AA direction inverter']
anti_aims.slow_walk_path = ['Rage', 'Anti Aim', 'General', 'Key assignment', 'Slow walk']

menu.add_checkbox('Anti Aim', 'Main', 'Edge yaw', false, function () {
    return menu.get_value('Anti Aim', 'Main', 'Enable')
})

menu.add_keybind('Anti Aim', 'Main', 'Key', function () {
    return menu.get_value('Anti Aim', 'Main', 'Enable') && menu.get_value('Anti Aim', 'Main', 'Edge yaw')
})

menu.add_checkbox('Anti Aim', 'Main', 'Ignore yaw settings', false, function () {
    return menu.get_value('Anti Aim', 'Main', 'Enable') && menu.get_value('Anti Aim', 'Main', 'Edge yaw')
})

menu.add_checkbox('Anti Aim', 'Main', 'Additional settings', false, function () {
    return menu.get_value('Anti Aim', 'Main', 'Enable') && menu.get_value('Anti Aim', 'Main', 'Edge yaw')
}, 'Overrides default settings only if enabled')

menu.add_slider('Anti Aim', 'Main', 'Extrapolation', 2, 0, 8, function () {
    return menu.get_value('Anti Aim', 'Main', 'Enable') && menu.get_value('Anti Aim', 'Main', 'Edge yaw') && menu.get_value('Anti Aim', 'Main', 'Additional settings')
}, 'Scan position extrapolation.')

menu.add_slider('Anti Aim', 'Main', 'Segments', 18, 10, 90, function () {
    return menu.get_value('Anti Aim', 'Main', 'Enable') && menu.get_value('Anti Aim', 'Main', 'Edge yaw') && menu.get_value('Anti Aim', 'Main', 'Additional settings')
}, 'Scan segments. Recommended value is 18')

menu.add_slider('Anti Aim', 'Main', 'Radius', 40, 10, 100, function () {
    return menu.get_value('Anti Aim', 'Main', 'Enable') && menu.get_value('Anti Aim', 'Main', 'Edge yaw') && menu.get_value('Anti Aim', 'Main', 'Additional settings')
}, 'Scan radius. Recommended value is 40')

anti_aims.edge_yaw = {}

anti_aims.edge_yaw.is_active = false
anti_aims.edge_yaw.yaw = 0

anti_aims.edge_yaw.init = function () {
    var processed_points = []

    var menu_ignore_yaw_settings = menu.get_value('Anti Aim', 'Main', 'Ignore yaw settings')

    var menu_additional_settings = menu.get_value('Anti Aim', 'Main', 'Additional settings')
    var menu_extrapolation = menu.get_value('Anti Aim', 'Main', 'Extrapolation')
    var menu_segments = menu.get_value('Anti Aim', 'Main', 'Segments')
    var menu_radius = menu.get_value('Anti Aim', 'Main', 'Radius')

    var segments = menu_additional_settings ? menu_segments : 18
    var radius = menu_additional_settings ? menu_radius : 40
    var sensitivity = 0.9
    var extrapolation = menu_additional_settings ? menu_extrapolation : 2

    var localplayer = Entity.GetLocalPlayer() 

    if (!localplayer) {
        return
    }

    var viewangles = Local.GetViewAngles()

    if (!viewangles) {
        return
    }

    var eye_pos = Entity.GetEyePosition(localplayer)

    if (!eye_pos) {
        return
    }

    if (extrapolation != 0) {
        trace_start = Entity.Extrapolate(localplayer, extrapolation, eye_pos)
    } else {
        trace_start = eye_pos
    }
    
    var angle_per_segment = 360 / segments

    for (i = 0; i < segments; i++) {
        var angle = Math.yaw_normalize(angle_per_segment * i)

        var forward_angle = [0, viewangles[1] + angle, 0]

        var forwarded_vector = Math.forward(forward_angle, radius)
        var prepared_vector = Math.vector_sum(trace_start, forwarded_vector)

        var trace = Trace.Line(localplayer, trace_start, prepared_vector)

        if (Entity.GetClassName(trace[0]) == 'CWorld' && trace[1] <= sensitivity) {
            processed_points.push({
                vec : prepared_vector,
                entity : trace[0],
                fraction : trace[1],
                angle : angle
            })
        }
    }
        
    processed_points.sort(function (a, b) {
        return a.angle - b.angle
    })

    var edge_angle = false

    if (processed_points.length >= 2) {
        var center_vec = Math.vector_lerp(0.5, processed_points[0].vec, processed_points[processed_points.length - 1].vec)

        edge_angle = Math.vector_to_angle(Math.vector_sub(trace_start, center_vec))
    }

    if (edge_angle) {
        var yaw = viewangles[1]
        var edge_yaw = edge_angle[1]

        var difference = Math.yaw_normalize(edge_yaw - yaw)

        if (Math.abs(difference) < 90) {
            difference = 0
            yaw = Math.yaw_normalize(edge_yaw + 180)
        }

        var new_yaw = -yaw

        new_yaw = Math.yaw_normalize(new_yaw + edge_yaw + 180)

        new_yaw = Math.yaw_normalize(new_yaw + difference)

        anti_aims.edge_yaw.is_active = true
        anti_aims.edge_yaw.yaw = new_yaw
    }
}

anti_aims.edge_yaw.handle = function () {
    
    anti_aims.edge_yaw.is_active = false

    if (!menu.get_value('Anti Aim', 'Main', 'Enable')) {
        return
    }

    if (!menu.get_value('Anti Aim', 'Main', 'Edge yaw')) {
        return
    }

    if (!menu.get_value('Anti Aim', 'Main', 'Key')) {
        return
    }

    anti_aims.edge_yaw.init()
}

anti_aims.x_way = {}
anti_aims.x_way.menu_elements = []

anti_aims.x_way.add_way = function (name, show_condition) {
    if (!anti_aims.x_way.menu_elements[name]) {
        Cheat.Print('КОДЕР ПИДАРАЗ ХУЕВО СДЕЛАЛ ПОПРОСИТЕ ПЕРЕДЕЛАТЬ \n')
        return
    }

    if (anti_aims.x_way.menu_elements[name].length > 5) {
        return
    }

    var id = anti_aims.condition_list.indexOf(name)
    var id_n = (' ').repeat(id + 1)

    var current_way = anti_aims.x_way.menu_elements[name].length + 1
    
    var show_condition = function () {
        return menu.get_value('Anti Aim', 'Main', 'Enable') &&anti_aims.m_current_condition.options[anti_aims.m_current_condition.value] == name
    }

    if (name != 'Shared') {
        show_condition = function () {
            return menu.get_value('Anti Aim', 'Main', 'Enable') && anti_aims.m_current_condition.options[anti_aims.m_current_condition.value] == name && menu.get_value('Anti Aim', 'Builder', 'Override ' + name.toLowerCase())
        }
    }

    var element = menu.add_slider('Anti Aim', 'Builder', 'Way ' + current_way + ' degree'  + id_n, 0, -180, 180, function () {
        return show_condition() && menu.get_value('Anti Aim', 'Builder', 'Yaw mode' + id_n) == 1 
    })

    anti_aims.x_way.menu_elements[name].push(element)
    menu.set_value('Anti Aim', 'Builder', 'XWAY' + name, anti_aims.x_way.menu_elements[name].length)
}

anti_aims.x_way.remove_way = function (name) {
    if (!anti_aims.x_way.menu_elements[name]) {
        Cheat.Print('КОДЕР ПИДАРАЗ ХУЕВО СДЕЛАЛ ПОПРОСИТЕ ПЕРЕДЕЛАТЬ \n')
        return
    }

    if (anti_aims.x_way.menu_elements[name].length <= 3) {
        return
    }

    var id = anti_aims.condition_list.indexOf(name)
    var id_n = (' ').repeat(id + 1)

    var current_way = anti_aims.x_way.menu_elements[name].length

    menu.destroy('Anti Aim', 'Builder', 'Way ' + current_way + ' degree' + id_n)

    anti_aims.x_way.menu_elements[name].pop()
    menu.set_value('Anti Aim', 'Builder', 'XWAY' + name, anti_aims.x_way.menu_elements[name].length)
}

anti_aims.new_condition = function (name, fn) {
    var id = anti_aims.conditions.length

    anti_aims.conditions.push({})
    anti_aims.condition_list.push(name)

    menu.update_list('Anti Aim', 'Main', 'Current Condition', anti_aims.condition_list)

    var current_condition = {}

    var show_condition = function () {
        return menu.get_value('Anti Aim', 'Main', 'Enable') && anti_aims.m_current_condition.options[anti_aims.m_current_condition.value] == name
    }

    if (name != 'Shared') {
        current_condition.is_override = menu.add_checkbox('Anti Aim', 'Builder', 'Override ' + name.toLowerCase(), false, show_condition, 'Overrides anti aims when ' + name.toLowerCase()) //не дописал

        show_condition = function () {
            return menu.get_value('Anti Aim', 'Main', 'Enable') &&
            anti_aims.m_current_condition.options[anti_aims.m_current_condition.value] == name &&
                menu.get_value('Anti Aim', 'Builder', 'Override ' + name.toLowerCase())
        }
    }

    var id_n = (' ').repeat(id + 1)

    current_condition.fake_limit_type = menu.add_dropdown('Anti Aim', 'Builder', 'Fake limit type' + id_n, ['Static', 'Common', 'Right/Left'], 0, show_condition)

    current_condition.fake_limit_static = menu.add_slider('Anti Aim', 'Builder', 'Static limit' + id_n, 0, -60, 60, function () {
        return show_condition() && current_condition.fake_limit_type.value == 0
    }, 'Static limit is not affected by AA inverter key')

    current_condition.fake_limit_jitter = menu.add_checkbox('Anti Aim', 'Builder', 'Jitter' + id_n, false, function () {
        return show_condition() && current_condition.fake_limit_type.value != 0
    })

    current_condition.fake_limit_common = menu.add_slider('Anti Aim', 'Builder', 'Common limit' + id_n, 25, 0, 60, function () {
        return show_condition() && current_condition.fake_limit_type.value == 1
    })

    current_condition.fake_limit_right = menu.add_slider('Anti Aim', 'Builder', 'Right limit' + id_n, 25, 0, 60, function () {
        return show_condition() && current_condition.fake_limit_type.value == 2
    })

    current_condition.fake_limit_left = menu.add_slider('Anti Aim', 'Builder', 'Left limit' + id_n, 25, 0, 60, function () {
        return show_condition() && current_condition.fake_limit_type.value == 2
    })
    current_condition.yaw_type = menu.add_dropdown('Anti Aim', 'Builder', 'Yaw mode' + id_n, ['Default', 'X Way', 'Delay switch'], 0, show_condition, 'Select yaw setting mode')

    current_condition.yaw_add_type = menu.add_multidropdown('Anti Aim', 'Builder', 'Yaw add type' + id_n, ['Static', 'By current side', 'Modifier'], [false, false, false], function () {
        return show_condition() && current_condition.yaw_type.value == 0
    })

    current_condition.yaw_add_static = menu.add_slider('Anti Aim', 'Builder', 'Yaw add' + id_n, 0, -180, 180, function () {
        return show_condition() && current_condition.yaw_type.value == 0 && current_condition.yaw_add_type.value[0]
    }, 'Static yaw add')

    current_condition.yaw_add_right = menu.add_slider('Anti Aim', 'Builder', 'Yaw add right' + id_n, 0, -180, 180, function () {
        return show_condition() && current_condition.yaw_type.value == 0 && current_condition.yaw_add_type.value[1]
    }, 'Right side yaw add')

    current_condition.yaw_add_left = menu.add_slider('Anti Aim', 'Builder', 'Yaw add left' + id_n, 0, -180, 180, function () {
        return show_condition() && current_condition.yaw_type.value == 0 && current_condition.yaw_add_type.value[1]
    }, 'Left side yaw add')

    current_condition.yaw_modifier = menu.add_dropdown('Anti Aim', 'Builder', 'Modifier type' + id_n, ['Offset', 'Center'], 0, function () {
        return show_condition() && current_condition.yaw_type.value == 0 && current_condition.yaw_add_type.value[2]
    }, 'Additional yaw modifier')

    current_condition.yaw_modifier_degree = menu.add_slider('Anti Aim', 'Builder', 'Modifier degree' + id_n, 0, -180, 180, function () {
        return show_condition() && current_condition.yaw_type.value == 0 && current_condition.yaw_add_type.value[2] 
    })

    current_condition.delay_switch_delay = menu.add_slider('Anti Aim', 'Builder', 'Switch delay (ticks)' + id_n, 4, 2, 10, function () {
        return show_condition() && current_condition.yaw_type.value == 2
    }, 'Switch delay between two yaw values in ticks')

    current_condition.delay_switch_yaw_right = menu.add_slider('Anti Aim', 'Builder', 'Yaw right' + id_n, 0, -180, 180, function () {
        return show_condition() && current_condition.yaw_type.value == 2
    })

    current_condition.delay_switch_yaw_left = menu.add_slider('Anti Aim', 'Builder', 'Yaw left' + id_n, 0, -180, 180, function () {
        return show_condition() && current_condition.yaw_type.value == 2
    })

    anti_aims.x_way.menu_elements[name] = []

    current_condition.x_way_hidden = menu.add_slider('Anti Aim', 'Builder', 'XWAY' + name, 3, 3, 6, function () {return false})


    current_condition.x_way_add = menu.add_button('Anti Aim', 'Builder', 'Add way' + id_n, function () {
        anti_aims.x_way.add_way(name)
    }, function () {
        return show_condition() && current_condition.yaw_type.value == 1 
    })

    current_condition.x_way_remove = menu.add_button('Anti Aim', 'Builder', 'Remove way' + id_n, function () {
        anti_aims.x_way.remove_way(name)
    }, function () {
        return show_condition() && current_condition.yaw_type.value == 1 
    })

    for (i = 0; i < 3; i++) {
        anti_aims.x_way.add_way(name, show_condition)
    }

    anti_aims.conditions[id] = {
        conditions : current_condition,
        fn : fn
    }
}

anti_aims.variables = []

anti_aims.apply_condition = function (name) {

    AntiAim.SetOverride(1)

    var id = anti_aims.condition_list.indexOf(name)
    var id_n = (' ').repeat(id + 1)

    var angle_to_override = 0
    var yaw_to_override = 0
    
    if (!anti_aims.variables[name]) {
        anti_aims.variables[name] = {}

        anti_aims.variables[name].jitter = false
        anti_aims.variables[name].inverter = false
        anti_aims.variables[name].delay_switch = false
    }

    var choked_commands = Globals.ChokedCommands()

    if (choked_commands == 0) {
        anti_aims.variables[name].jitter = !anti_aims.variables[name].jitter
    }

    var fake_limit_type = menu.get_value('Anti Aim', 'Builder', 'Fake limit type' + id_n)

    if (fake_limit_type != 0) {
        var jitter = menu.get_value('Anti Aim', 'Builder', 'Jitter' + id_n)
        var inverter = UI.GetValue(anti_aims.inverter_path) == 1

        if (jitter) {
            anti_aims.variables[name].inverter = anti_aims.variables[name].jitter
        } else {
            anti_aims.variables[name].inverter = inverter
        }
    }

    if (fake_limit_type == 0) {
        var static_limit = menu.get_value('Anti Aim', 'Builder', 'Static limit' + id_n)

        angle_to_override = static_limit

    } else if (fake_limit_type == 1) {
        var common_limit = menu.get_value('Anti Aim', 'Builder', 'Common limit' + id_n)
        var inverter = anti_aims.variables[name].inverter

        var inverter_value = inverter ? 1 : -1

        angle_to_override = common_limit * inverter_value
    } else if (fake_limit_type == 2) {
        var right_limit = menu.get_value('Anti Aim', 'Builder', 'Right limit' + id_n)
        var left_limit = menu.get_value('Anti Aim', 'Builder', 'Left limit' + id_n)

        var inverter = anti_aims.variables[name].inverter
        
        var inverter_value = inverter ? 1 : -1
        var angle_value = inverter ? left_limit : right_limit

        angle_to_override = angle_value * inverter_value
    }

    var yaw_mode = menu.get_value('Anti Aim', 'Builder', 'Yaw mode' + id_n)

    if (yaw_mode == 0) {
        var yaw_add_type = menu.get_value('Anti Aim', 'Builder', 'Yaw add type' + id_n)

        if (yaw_add_type[0]) {
            var yaw_add = menu.get_value('Anti Aim', 'Builder', 'Yaw add' + id_n)

            yaw_to_override = yaw_to_override + yaw_add
        }

        if (yaw_add_type[1]) {
            var yaw_add_right = menu.get_value('Anti Aim', 'Builder', 'Yaw add right' + id_n)
            var yaw_add_left = menu.get_value('Anti Aim', 'Builder', 'Yaw add left' + id_n)

            var inverter = anti_aims.variables[name].inverter

            var yaw_add = inverter ? yaw_add_left : yaw_add_right

            yaw_to_override = yaw_to_override + yaw_add
        }

        if (yaw_add_type[2]) {
            var modifier_type = menu.get_value('Anti Aim', 'Builder', 'Modifier type' + id_n)
            var modifier_degree = menu.get_value('Anti Aim', 'Builder', 'Modifier degree' + id_n)

            var yaw_add = 0

            if (modifier_type == 0) {
                var inverter = anti_aims.variables[name].jitter

                yaw_add = inverter ? 0 : modifier_degree
            } else if (modifier_type == 1) {
                var inverter = anti_aims.variables[name].jitter

                yaw_add = inverter ? -modifier_degree / 2 : modifier_degree / 2
            }

            yaw_to_override = yaw_to_override + yaw_add
        }

    } else if (yaw_mode == 1) {
        var menu_elements = anti_aims.x_way.menu_elements[name]
        var ways = anti_aims.x_way.menu_elements[name].length

        var packets = anti_aims.packets
        var current_way = menu_elements[packets % ways]

        yaw_to_override = yaw_to_override + menu.get_value(current_way.tab, current_way.subtab, current_way.name)
        
    } else if (yaw_mode == 2) {
        var yaw_right = menu.get_value('Anti Aim', 'Builder', 'Yaw right' + id_n)
        var yaw_left = menu.get_value('Anti Aim', 'Builder', 'Yaw left' + id_n)

        var delay = menu.get_value('Anti Aim', 'Builder', 'Switch delay (ticks)' + id_n)

        var packets = anti_aims.packets

        if (choked_commands == 0) {
            if (packets % delay == 0) {
                anti_aims.variables[name].delay_switch = !anti_aims.variables[name].delay_switch
            }
        }

        var yaw_add = 0

        if (anti_aims.variables[name].delay_switch) {
            yaw_add = yaw_left
        } else {
            yaw_add = yaw_right
        }

        yaw_to_override = yaw_to_override + yaw_add
    }

    var ignore_yaw_settings = menu.get_value('Anti Aim', 'Main', 'Ignore yaw settings')
    var edge_yaw = menu.get_value('Anti Aim', 'Main', 'Edge yaw')

    if (edge_yaw) {
        if (anti_aims.edge_yaw.is_active) {
            if (ignore_yaw_settings) {
                yaw_to_override = anti_aims.edge_yaw.yaw
            } else {
                yaw_to_override = yaw_to_override + anti_aims.edge_yaw.yaw
            }
        }
    }

    UI.SetValue(anti_aims.yaw_path, yaw_to_override)
    AntiAim.SetRealOffset(angle_to_override)

    return true
}

anti_aims.update_conditions = function () {
    var is_applied = false

    var localplayer = Entity.GetLocalPlayer()

    if (!localplayer) {
        return
    }

    var flags = Entity.GetProp(localplayer, 'CBasePlayer', 'm_fFlags')

    if (!flags) {
        return
    }

    for (i in anti_aims.conditions) {
        if (i != 0) {
            var state = anti_aims.conditions[i].fn(
                menu.get_value('Anti Aim', 'Builder', 'Override ' + anti_aims.condition_list[i].toLowerCase()),
                flags,
                localplayer
            )

            if (state) {
                is_applied = anti_aims.apply_condition(anti_aims.condition_list[i])

                break
            }
        }
    }

    if (!is_applied) {
        is_applied = anti_aims.apply_condition('Shared')
    }
}

anti_aims.new_condition('Shared', function(key, flags, localplayer) {
    return true
})


anti_aims.new_condition('Standing', function(key, flags, localplayer) {
    if (!key) {
        return false
    }

    var is_crouching = bit.band(flags, FL_DUCKING) != 0
    var on_ground = bit.band(flags, FL_ONGROUND) != 0

    return on_ground && !is_crouching && UserCMD.GetMovement()[0] == 0 && UserCMD.GetMovement()[1] == 0 && UserCMD.GetMovement()[2] == 0
})


anti_aims.new_condition('Crouching', function(key, flags, localplayer) {
    if (!key) {
        return false
    }

    var is_crouching = bit.band(flags, FL_DUCKING) != 0
    var on_ground = bit.band(flags, FL_ONGROUND) != 0

    return on_ground && is_crouching && !Input.IsKeyPressed(0x20)
})


anti_aims.new_condition('Slow walk', function(key, flags, localplayer) {
    if (!key) {
        return false
    }

    var on_ground = bit.band(flags, FL_ONGROUND) != 0

    return on_ground && UI.GetValue(anti_aims.slow_walk_path) == 1 && (UserCMD.GetMovement()[0] != 0 || UserCMD.GetMovement()[1] != 0)
})


anti_aims.new_condition('Moving', function(key, flags, localplayer) {
    if (!key) {
        return false
    }

    var is_crouching = bit.band(flags, FL_DUCKING) != 0
    var on_ground = bit.band(flags, FL_ONGROUND) != 0
  
    return on_ground && !is_crouching && (UserCMD.GetMovement()[0] != 0 || UserCMD.GetMovement()[1] != 0) && UI.GetValue(anti_aims.slow_walk_path) != 1 && !Input.IsKeyPressed(0x20)
})

anti_aims.new_condition('Air', function(key, flags, localplayer) {
    if (!key) {
        return false
    }

    var is_crouching = bit.band(flags, FL_DUCKING) != 0
    var on_ground = bit.band(flags, FL_ONGROUND) != 0

    return !on_ground && !is_crouching
})

anti_aims.new_condition('Air Crouching', function(key, flags, localplayer) {
    if (!key) {
        return false
    }

    var is_crouching = bit.band(flags, FL_DUCKING) != 0
    var on_ground = bit.band(flags, FL_ONGROUND) != 0

    return !on_ground && is_crouching
})

anti_aims.update_player_condition = function () {
    var localplayer = Entity.GetLocalPlayer()

    if (!localplayer) {
        return
    }

    var flags = Entity.GetProp(localplayer, 'CBasePlayer', 'm_fFlags')

    if (!flags) {
        return
    }

    var is_crouching = bit.band(flags, FL_DUCKING) != 0
    var on_ground = bit.band(flags, FL_ONGROUND) != 0

    if (on_ground && !is_crouching && UserCMD.GetMovement()[0] == 0 && UserCMD.GetMovement()[1] == 0 && UserCMD.GetMovement()[2] == 0) {
        anti_aims.current_state = 'Standing'
    }

    if (on_ground && is_crouching && !Input.IsKeyPressed(0x20)) {
        anti_aims.current_state = 'Crouching'
    }

    if (on_ground && UI.GetValue(anti_aims.slow_walk_path) == 1 && (UserCMD.GetMovement()[0] != 0 || UserCMD.GetMovement()[1] != 0)) {
        anti_aims.current_state = 'Slow walk'
    }

    if (on_ground && !is_crouching && (UserCMD.GetMovement()[0] != 0 || UserCMD.GetMovement()[1] != 0) && UI.GetValue(anti_aims.slow_walk_path) != 1 && !Input.IsKeyPressed(0x20)) {
        anti_aims.current_state = 'Moving'
    }

    if (!on_ground && !is_crouching) {
        anti_aims.current_state = 'Air'
    }

    if (!on_ground && is_crouching) {
        anti_aims.current_state = 'Air Crouching'
    } 
}

/*
menu.add_checkbox('Anti Aim', 'Main', 'Freestanding', false, function () {
    return menu.get_value('Anti Aim', 'Main', 'Enable')
}, 'Default onetap freestanding')

menu.add_keybind('Anti Aim', 'Main', 'Key ', function () {
    return menu.get_value('Anti Aim', 'Main', 'Enable') && menu.get_value('Anti Aim', 'Main', 'Freestanding')
})

var freestanding = {}
*/



menu.add_subtab('Visuals', 'Main')

menu.add_checkbox('Visuals', 'Main', 'Enable', false)

menu.add_checkbox('Visuals', 'Main', 'Indicators', false, function () {
    return menu.get_value('Visuals', 'Main', 'Enable')
})
/*
menu.add_dropdown('Visuals', 'Main', 'Style', ['Default', 'Alternative'], 0, function () {
    return menu.get_value('Visuals', 'Main', 'Enable') && menu.get_value('Visuals', 'Main', 'Indicators')
})*/

menu.add_colorpicker('Visuals', 'Main', 'Main color', [255, 255, 255, 255], function () {
    return menu.get_value('Visuals', 'Main', 'Enable') && menu.get_value('Visuals', 'Main', 'Indicators')
})

var indicators = {}

indicators.default = {}

indicators.default.render = function () {

    var main_switch = menu.get_value('Visuals', 'Main', 'Enable')
    var indicators = menu.get_value('Visuals', 'Main', 'Indicators')
    var style = 0//menu.get_value('Visuals', 'Main', 'Style')

    var main_color = menu.get_value('Visuals', 'Main', 'Main color')

    var condition = main_switch && indicators && style == 0 && visuals.is_rendering

    var alpha = visuals.new_animation('default indicators alpha', condition ? 1 : 0)

    if (alpha == 0) {
        return
    }
    
    var screen_center = [
        defines.screen_size[0] / 2,
        defines.screen_size[1] / 2
    ]

    var SEGOE_UI_11 = render.GetFont('Segoeui.ttf', 11, true)

    var offset = 50
    var indent = 0

    var SCRIPT_NAME = script.name
    var SCRIPT_NAME_FONT = SEGOE_UI_11
    var SCRIPT_NAME_SIZE = render.TextSize(SCRIPT_NAME, SCRIPT_NAME_FONT)

    var SCRIPT_NAME_COLOR = defines.alpha_override(main_color, alpha)
    var SCRIPT_NAME_SHADOW = [0, 0, 0, 255 * alpha]

    render.String(screen_center[0] + 1,
        screen_center[1] + offset + 1,
        1,
        SCRIPT_NAME,
        SCRIPT_NAME_SHADOW,
        SCRIPT_NAME_FONT)

    render.String(screen_center[0],
        screen_center[1] + offset,
        1,
        SCRIPT_NAME,
        SCRIPT_NAME_COLOR,
        SCRIPT_NAME_FONT)

    offset += SCRIPT_NAME_SIZE[1] + indent

    var CONDITION_TEXT = anti_aims.current_state.toLowerCase()
    var CONDITION_TEXT_FONT = SEGOE_UI_11

    var CONDITION_TEXT_SIZE = render.TextSize(CONDITION_TEXT, CONDITION_TEXT_FONT)

    var CONDITION_TEXT_SIZE_ANIM = [
        visuals.new_animation('default indicators condition text size anim', CONDITION_TEXT_SIZE[0]),
        CONDITION_TEXT_SIZE[1]
    ]

    var CONDITION_TEXT_LEN_ANIM = Math.round(visuals.new_animation('default indicators condition text len anim', CONDITION_TEXT.length))

    var CONDITION_TEXT_COLOR = [255, 255, 255, 255 * alpha]
    var CONDITION_TEXT_SHADOW = [0, 0, 0, 255 * alpha]

    var CONDITION_TEXT_ANIM = CONDITION_TEXT.substring(0, CONDITION_TEXT_LEN_ANIM)

    render.String(screen_center[0] - CONDITION_TEXT_SIZE_ANIM[0] / 2 + 1,
        screen_center[1] + offset + 1,
        0,
        CONDITION_TEXT_ANIM,
        CONDITION_TEXT_SHADOW,
        CONDITION_TEXT_FONT)

    render.String(screen_center[0] - CONDITION_TEXT_SIZE_ANIM[0] / 2,
        screen_center[1] + offset,
        0,
        CONDITION_TEXT_ANIM,
        CONDITION_TEXT_COLOR,
        CONDITION_TEXT_FONT)

    offset += CONDITION_TEXT_SIZE_ANIM[1] + indent

    var DOUBLE_TAP_PATH = ["Rage", "Exploits", "Keys", "Key assignment", "Double tap"]
    var DOUBLE_TAP_VALUE = UI.GetValue(DOUBLE_TAP_PATH) == 1

    var DOUBLE_TAP_ALPHA = visuals.new_animation('default indicators double tap alpha', DOUBLE_TAP_VALUE ? 1 : 0)

    var DOUBLE_TAP_CHARGE = Exploit.GetCharge()

    var DOUBLE_TAP_TEXT = 'double tap'
    var DOUBLE_TAP_TEXT_ANIM = Math.round(visuals.new_animation('default indicators double tap charge anim', Math.floor(DOUBLE_TAP_CHARGE * DOUBLE_TAP_TEXT.length)))

    var DOUBLE_TAP_CHARGE_TEXT_1 = DOUBLE_TAP_TEXT.substring(0, DOUBLE_TAP_TEXT_ANIM)
    var DOUBLE_TAP_CHARGE_TEXT_2 = DOUBLE_TAP_TEXT.substring(DOUBLE_TAP_TEXT_ANIM, DOUBLE_TAP_TEXT.length)

    var DOUBLE_TAP_FONT = SEGOE_UI_11
    var DOUBLE_TAP_TEXT_SIZE = render.TextSize(DOUBLE_TAP_TEXT, DOUBLE_TAP_FONT)
    var DOUBLE_TAP_CHARGE_TEXT_2_SIZE = render.TextSize(DOUBLE_TAP_CHARGE_TEXT_2, DOUBLE_TAP_FONT)

    var DOUBLE_TAP_COLOR_CHARGED = [125, 255, 125, 255 * DOUBLE_TAP_ALPHA * alpha]
    var DOUBLE_TAP_COLOR_DISCHARGED = [255, 125, 125, 255 * DOUBLE_TAP_ALPHA * alpha]

    var DOUBLE_TAP_SHADOW = [0, 0, 0, 255 * DOUBLE_TAP_ALPHA * alpha]

    if (DOUBLE_TAP_TEXT_ANIM != DOUBLE_TAP_TEXT.length) {

        render.String(screen_center[0] + 1,
            screen_center[1] + offset + 1,
            1, 
            DOUBLE_TAP_TEXT,
            DOUBLE_TAP_SHADOW,
            DOUBLE_TAP_FONT)
    
        render.String(screen_center[0] - DOUBLE_TAP_TEXT_SIZE[0] / 2,
            screen_center[1] + offset,
            0, 
            DOUBLE_TAP_CHARGE_TEXT_1,
            DOUBLE_TAP_COLOR_CHARGED,
            DOUBLE_TAP_FONT)
    
        render.String(screen_center[0] + DOUBLE_TAP_TEXT_SIZE[0] / 2 - DOUBLE_TAP_CHARGE_TEXT_2_SIZE[0],
            screen_center[1] + offset,
            0, 
            DOUBLE_TAP_CHARGE_TEXT_2,
            DOUBLE_TAP_COLOR_DISCHARGED,
            DOUBLE_TAP_FONT)

    } else {
        render.String(screen_center[0] + 1,
            screen_center[1] + offset + 1,
            1, 
            DOUBLE_TAP_TEXT,
            DOUBLE_TAP_SHADOW,
            DOUBLE_TAP_FONT)
    
        render.String(screen_center[0],
            screen_center[1] + offset,
            1, 
            DOUBLE_TAP_TEXT,
            DOUBLE_TAP_COLOR_CHARGED,
            DOUBLE_TAP_FONT)
    }

    offset += DOUBLE_TAP_TEXT_SIZE[1] * DOUBLE_TAP_ALPHA + indent

    var HIDE_SHOTS_PATH = ["Rage", "Exploits", "Keys", "Key assignment", "Hide shots"]
    var HIDE_SHOTS_VALUE = UI.GetValue(HIDE_SHOTS_PATH) == 1

    var HIDE_SHOTS_ALPHA = visuals.new_animation('default indicators hide shots alpha', (HIDE_SHOTS_VALUE && !DOUBLE_TAP_VALUE) ? 1 : 0)
    
    var HIDE_SHOTS_TEXT = 'hide shots'
    var HIDE_SHOTS_FONT = SEGOE_UI_11
    var HIDE_SHOTS_SIZE = render.TextSize(HIDE_SHOTS_TEXT, HIDE_SHOTS_FONT)
    
    var HIDE_SHOTS_COLOR = [0, 196, 255, 255 * HIDE_SHOTS_ALPHA * alpha]
    var HIDE_SHOTS_SHADOW = [0, 0, 0, 255 * HIDE_SHOTS_ALPHA * alpha]

    render.String(screen_center[0] + 1,
        screen_center[1] + offset + 1,
        1, 
        HIDE_SHOTS_TEXT,
        HIDE_SHOTS_SHADOW,
        HIDE_SHOTS_FONT)

    render.String(screen_center[0],
        screen_center[1] + offset,
        1, 
        HIDE_SHOTS_TEXT,
        HIDE_SHOTS_COLOR,
        HIDE_SHOTS_FONT)

    offset += HIDE_SHOTS_SIZE[1] * HIDE_SHOTS_ALPHA + indent

    var DAMAGE_PATH = ["Rage", "General", "General", "Key assignment", "Damage override"]
    var DAMAGE_VALUE = UI.GetValue(DAMAGE_PATH) == 1

    var DAMAGE_ALPHA = visuals.new_animation('default indicators damage alpha', DAMAGE_VALUE ? 1 : 0)

    var DAMAGE_TEXT = 'min. damage'
    var DAMAGE_FONT = SEGOE_UI_11
    var DAMAGE_SIZE = render.TextSize(DAMAGE_TEXT, DAMAGE_FONT)

    var DAMAGE_COLOR = [168, 229, 255, 255 * DAMAGE_ALPHA * alpha]
    var DAMAGE_SHADOW = [0, 0, 0, 255 * DAMAGE_ALPHA * alpha]

    render.String(screen_center[0] + 1,
        screen_center[1] + offset + 1,
        1, 
        DAMAGE_TEXT,
        DAMAGE_SHADOW,
        DAMAGE_FONT)

    render.String(screen_center[0],
        screen_center[1] + offset,
        1, 
        DAMAGE_TEXT,
        DAMAGE_COLOR,
        DAMAGE_FONT)

    offset += DAMAGE_SIZE[1] * DAMAGE_ALPHA + indent

    var HITCHANCE_VALUE = menu.get_value('Rage', 'Main', 'Enable') && menu.get_value('Rage', 'Main', 'Conditional hitchance') && menu.get_value('Rage', 'Main', 'Conditions')[3] && menu.get_value('Rage', 'Main', 'Key')

    var HITCHANCE_ALPHA = visuals.new_animation('default indicators hitchance alpha', HITCHANCE_VALUE ? 1 : 0)

    var HITCHANCE_TEXT = 'hitchance'
    var HITCHANCE_FONT = SEGOE_UI_11
    var HITCHANCE_SIZE = render.TextSize(HITCHANCE_TEXT, HITCHANCE_FONT)

    var HITCHANCE_COLOR = [168, 229, 255, 255 * HITCHANCE_ALPHA * alpha]
    var HITCHANCE_SHADOW = [0, 0, 0, 255 * HITCHANCE_ALPHA * alpha]

    render.String(screen_center[0] + 1,
        screen_center[1] + offset + 1,
        1, 
        HITCHANCE_TEXT,
        HITCHANCE_SHADOW,
        HITCHANCE_FONT)

    render.String(screen_center[0],
        screen_center[1] + offset,
        1, 
        HITCHANCE_TEXT,
        HITCHANCE_COLOR,
        HITCHANCE_FONT)

    offset += HITCHANCE_SIZE[1] * HITCHANCE_ALPHA + indent




    


    
    
}


menu.add_subtab('Visuals', 'Markers')

menu.add_checkbox('Visuals', 'Markers', 'Hit marker', false, function () {
    return menu.get_value('Visuals', 'Main', 'Enable')
})

menu.add_multidropdown('Visuals', 'Markers', 'Markers', ['On screen', 'World'], [false, false], function () {
    return menu.get_value('Visuals', 'Main', 'Enable') && menu.get_value('Visuals', 'Markers', 'Hit marker') 
})

var markers = {}

markers.on_screen = {}

markers.on_screen.timer = 0
markers.on_screen.time = 0.5
markers.on_screen.headshot = false

markers.on_screen.update_timer = function () {
    if (!menu.get_value('Visuals', 'Main', 'Enable')) {
        return
    }

    if (!menu.get_value('Visuals', 'Markers', 'Hit marker')) {
        return
    }

    if (!menu.get_value('Visuals', 'Markers', 'Markers')[0]) {
        return
    }

    var localplayer = Entity.GetLocalPlayer() 

    if (!localplayer) {
        return
    }

    if (!Entity.IsAlive(localplayer)) {
        return
    }

    var userid = Event.GetInt('userid')

    if (!userid) {
        return 
    }

    var userid_entity = Entity.GetEntityFromUserID(userid)

    if (!userid_entity) {
        return
    }

    if (Entity.IsLocalPlayer(userid_entity)) {
        return
    }

    var attacker = Event.GetInt('attacker')

    if (!attacker) {
        return
    }

    var attacker_entity = Entity.GetEntityFromUserID(attacker)

    if (!attacker_entity) {
        return
    }

    if (!Entity.IsLocalPlayer(attacker_entity)) {
        return
    }

    var hitgroup = Event.GetInt('hitgroup') 

    if (!hitgroup) {
        return
    }

    markers.on_screen.timer = Globals.Curtime() + markers.on_screen.time
    markers.on_screen.headshot = hitgroup == 1
}

markers.on_screen.render = function () {
    if (!visuals.is_rendering) {
        return
    }

    if (!menu.get_value('Visuals', 'Main', 'Enable')) {
        return
    }

    if (!menu.get_value('Visuals', 'Markers', 'Hit marker')) {
        return
    }

    if (!menu.get_value('Visuals', 'Markers', 'Markers')[0]) {
        return
    }

    var curtime = Globals.Curtime()

    if (markers.on_screen.timer <= curtime) {
        return
    }

    var localplayer = Entity.GetLocalPlayer() 

    if (!localplayer) {
        return
    }
    
    if (!Entity.IsAlive(localplayer)) {
        return
    }

    var alpha = (markers.on_screen.timer - curtime) / markers.on_screen.time

    if (alpha <= 0) {
        return
    }

    var indent = 5
    var length = 5

    var screen_center = [
        defines.screen_size[0] / 2,
        defines.screen_size[1] / 2
    ]

    var color = markers.on_screen.headshot ? [255, 0, 0, 255 * alpha] : [255, 255, 255, 255 * alpha]
    
    render.Line(
        screen_center[0] - indent - length,
        screen_center[1] - indent - length,
        screen_center[0] - indent,
        screen_center[1] - indent,
        color
    )
    
    render.Line(
        screen_center[0] + indent + length,
        screen_center[1] + indent + length,
        screen_center[0] + indent,
        screen_center[1] + indent,
        color
    )
    
    render.Line(
        screen_center[0] - indent - length,
        screen_center[1] + indent + length,
        screen_center[0] - indent,
        screen_center[1] + indent,
        color
    )
    
    render.Line(
        screen_center[0] + indent + length,
        screen_center[1] - indent - length,
        screen_center[0] + indent,
        screen_center[1] - indent,
        color
    )
}

markers.world = {}

markers.world.shot_data = []
markers.world.markers = []

markers.world.marker_timer = 4

markers.world.bullet_impact = function () {
    if (!menu.get_value('Visuals', 'Main', 'Enable')) {
        return
    }

    if (!menu.get_value('Visuals', 'Markers', 'Hit marker')) {
        return
    }

    if (!menu.get_value('Visuals', 'Markers', 'Markers')[1]) {
        return
    }

    var localplayer = Entity.GetLocalPlayer()

    if (!localplayer) {
        return
    }

    if (!Entity.IsAlive(localplayer)) {
        return
    }

    var userid = Event.GetInt('userid')

    if (!userid) {
        return
    }

    var userid_entity = Entity.GetEntityFromUserID(userid)

    if (!userid_entity) {
        return
    }

    if (!Entity.IsLocalPlayer(userid_entity)) {
        return
    }

    var current_tick = Globals.Tickcount()

    if (!markers.world.shot_data[current_tick]) {
        markers.world.shot_data[current_tick] = {
            impacts : []
        }
    }

    var impact_vector = [
        Event.GetInt('x'),
        Event.GetInt('y'),
        Event.GetInt('z')
    ]
    
    markers.world.shot_data[current_tick].impacts.push(impact_vector)
}

markers.world.player_hurt = function () {
    if (!menu.get_value('Visuals', 'Main', 'Enable')) {
        return
    }

    if (!menu.get_value('Visuals', 'Markers', 'Hit marker')) {
        return
    }

    if (!menu.get_value('Visuals', 'Markers', 'Markers')[1]) {
        return
    }

    var localplayer = Entity.GetLocalPlayer() 

    if (!localplayer) {
        return
    }

    if (!Entity.IsAlive(localplayer)) {
        return
    }

    var userid = Event.GetInt('userid')

    if (!userid) {
        return 
    }

    var userid_entity = Entity.GetEntityFromUserID(userid)

    if (!userid_entity) {
        return
    }

    if (Entity.IsLocalPlayer(userid_entity)) {
        return
    }

    var attacker = Event.GetInt('attacker')

    if (!attacker) {
        return
    }

    var attacker_entity = Entity.GetEntityFromUserID(attacker)

    if (!attacker_entity) {
        return
    }

    if (!Entity.IsLocalPlayer(attacker_entity)) {
        return
    }

    var hitgroup = Event.GetInt('hitgroup') 

    if (!hitgroup) {
        return
    }

    var current_tick = Globals.Tickcount()
    var data = markers.world.shot_data[current_tick]

    if (data == undefined) {
        return
    }

    if (data.impacts == undefined) {
        return
    }

    var impacts = data.impacts
    var hitboxes = defines.hitboxes_by_hitgroup(hitgroup)

    if (hitboxes == undefined) {
        return
    }

    var hit = undefined
    var closest = Infinity

    for (i = 0; i < impacts.length; i++) {
        var impact = impacts[i]

        for (j = 0; j < hitboxes.length; j++) {

            var hitbox = hitboxes[j]

            var hitbox_position = Entity.GetHitboxPosition(userid_entity, hitbox)
            var distance = Math.distance(impact, hitbox_position)

            if (distance < closest) {
                hit = impact
                closest = distance
            }
        }
    }

    if (hit == undefined) {
        return
    }

    markers.world.markers.push({
        vector : hit,
        time : Globals.Curtime() + markers.world.marker_timer,
        alpha : 1
    })
}

markers.world.render = function () {
    if (!visuals.is_rendering) {
        return
    }

    if (!menu.get_value('Visuals', 'Main', 'Enable')) {
        return
    }

    if (!menu.get_value('Visuals', 'Markers', 'Hit marker')) {
        return
    }

    if (!menu.get_value('Visuals', 'Markers', 'Markers')[1]) {
        return
    }

    var localplayer = Entity.GetLocalPlayer() 

    if (!localplayer) {
        return
    }
    
    if (!Entity.IsAlive(localplayer)) {
        return
    }

    if (markers.world.markers.length == 0) {
        return
    }

    var indent = 3
    var length = 3

    var curtime = Globals.Curtime()

    for (i = 0; i < markers.world.markers.length; i++) {
        var marker = markers.world.markers[i]

        if (curtime < marker.time) {
            marker.alpha = 1
        } else {
            marker.alpha = 1 - visuals.new_animation(marker.time.toString() + i.toString(), 1)
        }

        var position = render.WorldToScreen(marker.vector)

        var color = [255, 255, 255, 255 * marker.alpha]
    
        render.Line(
            position[0] - indent - length,
            position[1] - indent - length,
            position[0] - indent,
            position[1] - indent,
            color
        )
        
        render.Line(
            position[0] + indent + length,
            position[1] + indent + length,
            position[0] + indent,
            position[1] + indent,
            color
        )
        
        render.Line(
            position[0] - indent - length,
            position[1] + indent + length,
            position[0] - indent,
            position[1] + indent,
            color
        )
        
        render.Line(
            position[0] + indent + length,
            position[1] - indent - length,
            position[0] + indent,
            position[1] - indent,
            color
        )

        if (marker.alpha == 0) {
            markers.world.markers.shift(i)
        }
    }
}

menu.add_subtab('Misc', 'Main') 

menu.add_checkbox('Misc', 'Main', 'Enable', false)

menu.add_checkbox('Misc', 'Main', 'Smart kill/death say', false, function () {
    return menu.get_value('Misc', 'Main', 'Enable')
})

menu.add_checkbox('Misc', 'Main', 'Hit sounds', false, function () {
    return menu.get_value('Misc', 'Main', 'Enable')
})

var sounds = {}

sounds.list = [
    ['None', undefined],
    ['Arena Switch Press', 'play buttons/arena_switch_press_02.wav'],
    ['Warning', 'play resource/warning.wav'],
    ['Door', 'doors/wood_stop1.wav'],
    ['Wood Plank', 'physics/wood/wood_plank_impact_hard4.wav']
]

sounds.get_list_menu = function () {
    var new_list = []
    
    for (i = 0; i < sounds.list.length; i++) {
        new_list[i] = sounds.list[i][0]
    }

    return new_list
}

sounds.list_menu = sounds.get_list_menu()

menu.add_dropdown('Misc', 'Main', 'Body hit sound', sounds.list_menu, 0, function () {
    return menu.get_value('Misc', 'Main', 'Enable') && menu.get_value('Misc', 'Main', 'Hit sounds')
})

menu.add_dropdown('Misc', 'Main', 'Head hit sound', sounds.list_menu, 0, function () {
    return menu.get_value('Misc', 'Main', 'Enable') && menu.get_value('Misc', 'Main', 'Hit sounds')
})

sounds.handle = function () {
    if (!menu.get_value('Misc', 'Main', 'Enable')) {
        return
    }

    if (!menu.get_value('Misc', 'Main', 'Hit sounds')) {
        return
    }

    if (menu.get_value('Misc', 'Main', 'Body hit sound') == 0 && menu.get_value('Misc', 'Main', 'Head hit sound') == 0) {
        return
    }

    var localplayer = Entity.GetLocalPlayer()

    if (!localplayer) {
        return
    }

    if (!Entity.IsAlive(localplayer)) {
        return
    }

    var current_sound_path = undefined
    var current_sound = undefined

    var attacker = Event.GetInt('attacker')

    if (!attacker) {
        return
    }

    var attacker_entity = Entity.GetEntityFromUserID(attacker)

    if (!attacker_entity) {
        return
    }

    if (!Entity.IsLocalPlayer(attacker_entity)) {
        return
    }

    var userid = Event.GetInt('userid')

    if (!userid) {
        return
    }

    var userid_entity = Entity.GetEntityFromUserID(userid)

    if (!userid_entity) {
        return
    }

    if (Entity.IsLocalPlayer(userid_entity)) {
        return
    }

    var hitgroup = Event.GetInt('hitgroup')

    if (!hitgroup) {
        return
    }
    
    if (hitgroup == 1) {
        current_sound = 'Head hit sound'
    } else {
        current_sound = 'Body hit sound'
    }

    if (current_sound == undefined) { //это на всякий случай вдруг реально ебантура произойдет какая то
        return
    }
    
    var current_sound_menu = menu.get_value('Misc', 'Main', current_sound)

    current_sound_path = sounds.list[current_sound_menu][1]

    if (current_sound_path == undefined) {
        return
    }
    
    Cheat.ExecuteCommand('play ' + current_sound_path)   
}




Cheat.RegisterCallback('player_hurt', 'sounds.handle')
Cheat.RegisterCallback('player_hurt', 'markers.on_screen.update_timer')
Cheat.RegisterCallback('bullet_impact', 'markers.world.bullet_impact')
Cheat.RegisterCallback('player_hurt', 'markers.world.player_hurt')

Cheat.RegisterCallback('CreateMove', 'anti_aims.edge_yaw.handle')
Cheat.RegisterCallback('CreateMove', 'anti_aims.update_conditions')
Cheat.RegisterCallback('CreateMove', 'rage.conditional_hitchance.update_conditions')
Cheat.RegisterCallback('CreateMove', 'anti_aims.packets_update')
Cheat.RegisterCallback('CreateMove', 'anti_aims.update_player_condition')

Cheat.RegisterCallback('Draw', 'visuals.start_render')

Cheat.RegisterCallback('Draw', 'menu.render')
Cheat.RegisterCallback('Draw', 'menu.handle_keybinds')
Cheat.RegisterCallback('Draw', 'indicators.default.render')
Cheat.RegisterCallback('Draw', 'markers.on_screen.render')
Cheat.RegisterCallback('Draw', 'markers.world.render')

Cheat.RegisterCallback('Draw', 'visuals.end_render')
