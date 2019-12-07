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
      default: "#B00F48"
    },
    grad_color: {
      label: "Gradient color",
      type: "color",
      default: "#500702"
    },
    border_width: {
      label: "Border Width",
      type: "number",
      default: 3
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
      default: 255
    },
    shadow_color: {
      label: "Shadow Color",
      type: "color",
      default: "#B00F48"
    },
    shadow_width: {
      label: "Shadow Width",
      type: "number",
      default: 2
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
        background: `linear-gradient(180deg, ${this.property.main_color} 0%, ${this.property.grad_color} 100%)`,
        border: `${this.property.border_width}px solid ${hexToRgbA(this.property.border_color, this.property.border_opacity / 255)}`,
        "border-radius": `100%`,
        "box-shadow": `0 0 ${this.property.shadow_width}px ${this.property.shadow_color}`,
      });

      updatePos.bind(this)(element);
    },
  },
  build: async function() {
    let code = "";

    // Style
    code += `static lv_style_t ${this.property.name}_style;\n`;
    code += `lv_style_copy(&${this.property.name}_style, &lv_style_plain);\n`;
    code += `${this.property.name}_style.body.main_color = lv_color_hex(0x${this.property.main_color.substring(1)});\n`;
    code += `${this.property.name}_style.body.grad_color = lv_color_hex(0x${this.property.grad_color.substring(1)});\n`;
    code += `${this.property.name}_style.body.radius = LV_RADIUS_CIRCLE;\n`;
    code += `${this.property.name}_style.body.border.color = lv_color_hex(0x${this.property.border_color.substring(1)});\n`;
    code += `${this.property.name}_style.body.border.width = ${this.property.border_width};\n`;
    code += `${this.property.name}_style.body.border.opa = ${this.property.border_opacity};\n`;
    code += `${this.property.name}_style.body.shadow.color = lv_color_hex(0x${this.property.shadow_color.substring(1)});\n`;
    code += `${this.property.name}_style.body.shadow.width = ${this.property.shadow_width};\n`;
    code += `\n`;

    // LED object
    code += `lv_obj_t* ${this.property.name} = lv_led_create(lv_scr_act(), NULL);\n`;
    code += `lv_obj_set_style(${this.property.name}, &${this.property.name}_style);\n`;
    code += `lv_obj_set_size(${this.property.name}, ${this.property.width}, ${this.property.height});\n`;
    code += `lv_obj_align(${this.property.name}, NULL, ${propertyToAlign(this.property)}, ${this.property.x}, ${this.property.y});\n`;
    code += `lv_led_set_bright(${this.property.name}, ${this.property.bright});\n`;
    code += `\n`;

    code += `lv_obj_set_hidden(${this.property.name}, ${this.property.hidden === 0 ? 'true' : 'false'});`;
    code += `\n`;

    return code;
  }
});
