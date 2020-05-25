addComponent({
  name: "Switch",
  icon: '<i class="fas fa-toggle-on"></i>',
  property: {
    name: {
      label: "Name",
      type: "text",
      pattern: /^\w+$/,
      default: function() {
        return objectNameGen("sw");
      }
    },
    parent: {
      label: "Parent",
      type: "parent"
    },
    hidden: {
      label: "Hidden",
      type: "choice",
      choice: [
        {
          label: "Show",
          value: 1
        },
        {
          label: "Hides",
          value: 0
        },
      ],
      default: 1
    },
    define: {
      label: "Definition",
      type: "choice",
      choice: [
        {
          label: "Local",
          value: 0
        },
        {
          label: "Global",
          value: 1
        },
      ],
      default: 0
    },
    alignX: {
      label: "Align X",
      type: "choice",
      choice: [
        {
          label: "Left",
          value: 0
        },
        {
          label: "Center",
          value: 1
        },
        {
          label: "Right",
          value: 2
        },
      ],
      default: 0
    },
    alignY: {
      label: "Align Y",
      type: "choice",
      choice: [
        {
          label: "Top",
          value: 0
        },
        {
          label: "Mid",
          value: 1
        },
        {
          label: "Bottom",
          value: 2
        },
      ],
      default: 0
    },
    x: {
      label: "X offset",
      type: "number",
      default: 0,
      inputOffset: 'x'
    },
    y: {
      label: "Y offset",
      type: "number",
      default: 0,
      inputOffset: 'y'
    },
    width: {
      label: "Width",
      type: "number",
      default: 70
    },
    height: {
      label: "Height",
      type: "number",
      default: 40
    },
    /*
    padding: {
      label: "Padding",
      type: "number",
      default: 0
    },
    */
    background_main_color: {
      label: "Background Main color",
      type: "color",
      default: "#EEEEEE"
    },
    background_grad_color: {
      label: "Background Gradient color",
      type: "color",
      default: "#FFFFFF"
    },
    background_grad_dir: {
      label: "Gradient direction",
      type: "choice",
      choice: [
        {
          label: "None",
          value: 0
        },
        {
          label: "Horizontal",
          value: 1
        },
        {
          label: "Vertical",
          value: 2
        },
      ],
      default: 0
    },
    background_border_width: {
      label: "Background Border Width",
      type: "number",
      default: 0
    },
    background_border_color: {
      label: "Background Border Color",
      type: "color",
      default: "#404040"
    },
    indicator_main_color: {
      label: "Indicator Main color",
      type: "color",
      default: "#FF0000"
    },
    indicator_grad_color: {
      label: "Indicator Gradient color",
      type: "color",
      default: "#FFFFFF"
    },
    indicator_grad_dir: {
      label: "Gradient direction",
      type: "choice",
      choice: [
        {
          label: "None",
          value: 0
        },
        {
          label: "Horizontal",
          value: 1
        },
        {
          label: "Vertical",
          value: 2
        },
      ],
      default: 0
    },
    indicator_border_width: {
      label: "Indicator Border Width",
      type: "number",
      default: 0
    },
    indicator_border_color: {
      label: "Indicator Border Color",
      type: "color",
      default: "#FFFFFF"
    },
    knob_main_color: {
      label: "Knob ON Main color",
      type: "color",
      default: "#FFFFFF"
    },
    knob_grad_color: {
      label: "Knob ON Gradient color",
      type: "color",
      default: "#FFFFFF"
    },
    knob_grad_dir: {
      label: "Gradient direction",
      type: "choice",
      choice: [
        {
          label: "None",
          value: 0
        },
        {
          label: "Horizontal",
          value: 1
        },
        {
          label: "Vertical",
          value: 2
        },
      ],
      default: 0
    },
    knob_border_width: {
      label: "Knob ON Border Width",
      type: "number",
      default: 0
    },
    knob_border_color: {
      label: "Knob ON Border Color",
      type: "color",
      default: "#FFFFFF"
    },
    /*
    knob_on_main_color: {
      label: "Knob ON Main color",
      type: "color",
      default: "#6b9ac7"
    },
    knob_on_grad_color: {
      label: "Knob ON Gradient color",
      type: "color",
      default: "#2b598b"
    },
    knob_on_border_width: {
      label: "Knob ON Border Width",
      type: "number",
      default: 2
    },
    knob_on_border_color: {
      label: "Knob ON Border Color",
      type: "color",
      default: "#152c42"
    },
    knob_off_main_color: {
      label: "Knob OFF Main color",
      type: "color",
      default: "#FFFFFF"
    },
    knob_off_grad_color: {
      label: "Knob OFF Gradient color",
      type: "color",
      default: "#C0C0C0"
    },
    knob_off_border_width: {
      label: "Knob OFF Border Width",
      type: "number",
      default: 2
    },
    knob_off_border_color: {
      label: "Knob OFF Border Color",
      type: "color",
      default: "#404040"
    },
    knob_shadow_width: {
      label: "Knob Shadow width",
      type: "number",
      default: 4
    },
    knob_shadow_color: {
      label: "Knob Shadow color",
      type: "color",
      default: "#808080"
    },
    */
    value: {
      label: "Value",
      type: "choice",
      choice: [
        {
          label: "OFF",
          value: 0
        },
        {
          label: "ON",
          value: 1
        },
      ]
    },
    handler: {
      label: "Handler",
      type: "text",
      default: ""
    },
  },
  render: {
    create: function(id) {
      let group = document.createElement("div");

      let bg = document.createElement("div");
      bg.className = "bg";
      $(bg).css({
        width: "100%",
        height: "100%"
      });
      group.appendChild(bg);

      let knob = document.createElement("div");
      knob.className = "knob";
      $(knob).css({
        position: "absolute",
        top: "3px",
        "border-radius": "100%"
      });
      group.appendChild(knob);
      return group;
    },
    /* move: function(x, y, width, height) {
      this.property.x = x + 1; // Fix offset bug
      this.property.y = y + 6; // Fix offset bug
      if (this.property.align === 1) { // Center
        this.property.x = this.property.x + (width / 2);
      } else if (this.property.align === 2) { // Right
        this.property.x = this.property.x + width;
      }
      this.property.x = Math.round(this.property.x);
      this.property.y = Math.round(this.property.y);
    }, */
    frame: function() {
      return [];
    },
    update: function(element) {
      $(element).css({
        width: this.property.width == 0 ? "auto" : this.property.width,
        height: this.property.height == 0 ? "auto" : this.property.height,
/*         "padding-top": `${this.property.padding}px`,
        "padding-bottom": `${this.property.padding}px`, */
        position: 'absolute',
      });

      if (this.property.value) {
        $(element).find(".bg").css({
          "border-radius": `${this.property.height / 2}px`,
          background: +this.property.indicator_grad_dir === 0 ? this.property.indicator_main_color : `linear-gradient(${+this.property.indicator_grad_dir === 1 ? '90' : '180' }deg, ${this.property.indicator_main_color} 0%, ${this.property.indicator_grad_color} 100%)`,
          border: `${this.property.indicator_border_width}px solid ${this.property.indicator_border_color}`,
          height: `${this.property.height - (this.property.padding * 2)}px`,
          transform: `translateY(${this.property.padding}px)`,
        });
      } else {
        $(element).find(".bg").css({
          "border-radius": `${this.property.height / 2}px`,
          background: +this.property.background_grad_dir === 0 ? this.property.background_main_color : `linear-gradient(${+this.property.background_grad_dir === 1 ? '90' : '180' }deg, ${this.property.background_main_color} 0%, ${this.property.background_grad_color} 100%)`,
          border: `${this.property.background_border_width}px solid ${this.property.background_border_color}`,
          height: `${this.property.height - (this.property.padding * 2)}px`,
          transform: `translateY(${this.property.padding}px)`,
        });
      }

      $(element).find(".knob").css({
        width: (this.property.height - (3 * 2)),
        height: (this.property.height - (3 * 2)),
        background: +this.property.knob_grad_dir === 0 ? this.property.knob_main_color : `linear-gradient(${+this.property.knob_grad_dir === 1 ? '90' : '180' }deg, ${this.property.knob_main_color} 0%, ${this.property.knob_grad_color} 100%)`,
        border: `${this.property.knob_border_width}px solid ${this.property.knob_border_color}`,
        left: this.property.value ? "auto" : "3px",
        right: this.property.value ? "3px" : "auto",
        // "box-shadow": `0 ${this.property.knob_shadow_width}px ${this.property.knob_shadow_width}px ${this.property.knob_shadow_color}`,
      });

      updatePos.bind(this)(element);
    },
  },
  build: async function(simulator, pagename, output_path) {
    let indexGradDir2Var = [ 'LV_GRAD_DIR_NONE', 'LV_GRAD_DIR_HOR', 'LV_GRAD_DIR_VER' ];

    let code = "";
    let header = "";

    header += `lv_obj_t* ${this.property.name};\n`;
    if (this.property.handler.length > 0 && !simulator) {
      header += `extern void ${this.property.handler}(lv_obj_t*, lv_event_t);\n`;
    }

    code += `${this.property.name} = lv_switch_create(${!this.property.parent ? 'lv_scr_act()' : this.property.parent}, NULL);\n`;
    code += "\n";

    code += `lv_obj_set_style_local_bg_color(${this.property.name}, LV_SWITCH_PART_BG, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.background_main_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_bg_grad_color(${this.property.name}, LV_SWITCH_PART_BG, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.background_grad_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_bg_grad_dir(${this.property.name}, LV_SWITCH_PART_BG, LV_STATE_DEFAULT, ${indexGradDir2Var[+this.property.background_grad_dir]});\n`;
    code += `lv_obj_set_style_local_radius(${this.property.name}, LV_SWITCH_PART_BG, LV_STATE_DEFAULT, LV_RADIUS_CIRCLE);\n`;
    code += `lv_obj_set_style_local_border_color(${this.property.name}, LV_SWITCH_PART_BG, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.background_border_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_border_width(${this.property.name}, LV_SWITCH_PART_BG, LV_STATE_DEFAULT, ${this.property.background_border_width});\n`;
    code += "\n";

    code += `lv_obj_set_style_local_bg_color(${this.property.name}, LV_SWITCH_PART_INDIC, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.indicator_main_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_bg_grad_color(${this.property.name}, LV_SWITCH_PART_INDIC, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.indicator_grad_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_bg_grad_dir(${this.property.name}, LV_SWITCH_PART_INDIC, LV_STATE_DEFAULT, ${indexGradDir2Var[+this.property.indicator_grad_dir]});\n`;
    code += `lv_obj_set_style_local_radius(${this.property.name}, LV_SWITCH_PART_INDIC, LV_STATE_DEFAULT, LV_RADIUS_CIRCLE);\n`;
    code += `lv_obj_set_style_local_border_color(${this.property.name}, LV_SWITCH_PART_INDIC, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.indicator_border_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_border_width(${this.property.name}, LV_SWITCH_PART_INDIC, LV_STATE_DEFAULT, ${this.property.indicator_border_width});\n`;
    code += "\n";

    code += `lv_obj_set_style_local_bg_color(${this.property.name}, LV_SWITCH_PART_KNOB, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.knob_main_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_bg_grad_color(${this.property.name}, LV_SWITCH_PART_KNOB, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.knob_grad_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_bg_grad_dir(${this.property.name}, LV_SWITCH_PART_KNOB, LV_STATE_DEFAULT, ${indexGradDir2Var[+this.property.knob_grad_dir]});\n`;
    code += `lv_obj_set_style_local_radius(${this.property.name}, LV_SWITCH_PART_KNOB, LV_STATE_DEFAULT, LV_RADIUS_CIRCLE);\n`;
    code += `lv_obj_set_style_local_border_color(${this.property.name}, LV_SWITCH_PART_KNOB, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.knob_border_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_border_width(${this.property.name}, LV_SWITCH_PART_KNOB, LV_STATE_DEFAULT, ${this.property.knob_border_width});\n`;
    code += "\n";

    code += `lv_obj_set_style_local_outline_width(${this.property.name}, LV_SWITCH_PART_BG, LV_STATE_DEFAULT, 0);\n`;
    code += "\n";

    code += `lv_obj_set_size(${this.property.name}, ${this.property.width}, ${this.property.height});\n`;
    code += `lv_obj_align(${this.property.name}, NULL, ${propertyToAlign(this.property)}, ${this.property.x}, ${this.property.y});\n`;
    code += `${this.property.handler.length > 0 && !simulator ? '' : '// '}lv_obj_set_event_cb(${this.property.name}, ${this.property.handler});\n`;
    code += "\n";

    code += `lv_switch_${this.property.value ? 'on' : 'off'}(${this.property.name}, LV_ANIM_OFF);\n`;
    code += "\n";

    code += `lv_obj_set_hidden(${this.property.name}, ${this.property.hidden === 0 ? 'true' : 'false'});`;
    code += "\n";

    if (this.property.define == 0) { // define local
      code = `${header}\n${code}`;
      header = "";
    }
    
    return { header, content: code };
  }
});
