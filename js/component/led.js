addComponent({
  name: "LED",
  icon: '<i class="far fa-circle"></i>',
  property: {
    name: {
      label: "Name",
      type: "text",
      pattern: /^\w+$/,
      default: function() {
        if (typeof countLED === "undefined") {
          countLED = 1;
        } else {
          countLED++;
        }
        return objectNameGen("led");
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
      default: 30
    },
    height: {
      label: "Height",
      type: "number",
      default: 30
    },
    main_color: {
      label: "Main color",
      type: "color",
      default: "#FF0000"
    },
    grad_color: {
      label: "Gradient color",
      type: "color",
      default: "#FFFFFF"
    },
    grad_dir: {
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
    border_width: {
      label: "Border Width",
      type: "number",
      default: 2
    },
    border_color: {
      label: "Border Color",
      type: "color",
      default: "#FA0F00"
    },
    border_opacity: {
      label: "Border Opacity",
      type: "number",
      min: 0,
      max: 255,
      default: 50
    },
    shadow_color: {
      label: "Shadow Color",
      type: "color",
      default: "#FF0000"
    },
    shadow_width: {
      label: "Shadow Width",
      type: "number",
      default: 15
    },
    bright: {
      label: "Brightness",
      type: "number",
      min: 0,
      max: 255,
      default: 255
    }
  },
  render: {
    create: function(id) {
      return document.createElement("div");
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
        width: this.property.width,
        height: this.property.height,
        background: +this.property.grad_dir === 0 ? this.property.main_color : `linear-gradient(${+this.property.grad_dir === 1 ? '90' : '180' }deg, ${this.property.main_color} 0%, ${this.property.grad_color} 100%)`,
        border: `${this.property.border_width}px solid ${hexToRgbA(this.property.border_color, this.property.border_opacity / 255)}`,
        "border-radius": `100%`,
        "box-shadow": `0 0 ${this.property.shadow_width}px ${this.property.shadow_color}`,
        position: 'absolute',
      });

      updatePos.bind(this)(element);
    },
  },
  build: async function(simulator, pagename, output_path) {
    let indexGradDir2Var = [ 'LV_GRAD_DIR_NONE', 'LV_GRAD_DIR_HOR', 'LV_GRAD_DIR_VER' ];

    let code = "";
    let header = "";

    // LED object
    header += `lv_obj_t* ${this.property.name};\n`;

    code += `${this.property.name} = lv_led_create(${!this.property.parent ? 'lv_scr_act()' : this.property.parent}, NULL);\n`;
    code += `\n`;

    code += `lv_obj_set_style_local_bg_color(${this.property.name}, LV_LED_PART_MAIN, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.main_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_bg_grad_color(${this.property.name}, LV_LED_PART_MAIN, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.grad_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_bg_grad_dir(${this.property.name}, LV_LED_PART_MAIN, LV_STATE_DEFAULT, ${indexGradDir2Var[+this.property.grad_dir]});\n`;
    code += `lv_obj_set_style_local_radius(${this.property.name}, LV_LED_PART_MAIN, LV_STATE_DEFAULT, LV_RADIUS_CIRCLE);\n`;
    code += `lv_obj_set_style_local_border_color(${this.property.name}, LV_LED_PART_MAIN, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.border_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_border_width(${this.property.name}, LV_LED_PART_MAIN, LV_STATE_DEFAULT, ${this.property.border_width});\n`;
    code += `lv_obj_set_style_local_border_opa(${this.property.name}, LV_LED_PART_MAIN, LV_STATE_DEFAULT, ${this.property.border_opacity});\n`;
    code += `lv_obj_set_style_local_shadow_color(${this.property.name}, LV_LED_PART_MAIN, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.shadow_color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_shadow_width(${this.property.name}, LV_LED_PART_MAIN, LV_STATE_DEFAULT, ${this.property.shadow_width});\n`;
    code += `\n`;

    code += `lv_obj_set_size(${this.property.name}, ${this.property.width}, ${this.property.height});\n`;
    code += `lv_obj_align(${this.property.name}, NULL, ${propertyToAlign(this.property)}, ${this.property.x}, ${this.property.y});\n`;
    code += `lv_led_set_bright(${this.property.name}, ${this.property.bright});\n`;
    code += `\n`;

    code += `lv_obj_set_hidden(${this.property.name}, ${this.property.hidden === 0 ? 'true' : 'false'});`;
    code += `\n`;

    if (this.property.define == 0) { // define local
      code = `${header}\n${code}`;
      header = "";
    }

    return { header, content: code };
  }
});
