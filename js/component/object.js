addComponent({
    name: "Object",
    icon: '<i class="far fa-edit"></i>',
    property: {
      name: {
        label: "Name",
        type: "text",
        pattern: /^\w+$/,
        default: function() {
          return objectNameGen("obj");
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
        default: 100
      },
      height: {
        label: "Height",
        type: "number",
        default: 100
      },
      main_color: {
        label: "Main color",
        type: "color",
        default: "#000000"
      },
      grad_color: {
        label: "Gradient color",
        type: "color",
        default: "#000000"
      },
      radius: {
        label: "Corner radius",
        type: "number",
        default: 0
      },
      opacity: {
        label: "Opacity",
        type: "number",
        default: 255
      },
      border_width: {
        label: "Border Width",
        type: "number",
        default: 0
      },
      border_color: {
        label: "Border Color",
        type: "color",
        default: "#000000"
      },
      border_opacity: {
        label: "Border Opacity",
        type: "number",
        default: 255
      },
      shadow_width: {
        label: "Shadow Width",
        type: "number",
        default: 0
      },
      shadow_color: {
        label: "Shadow Color",
        type: "color",
        default: "#000000"
      },
      shadow_type: {
        label: "Shadow Type",
        type: "choice",
        choice: [
          {
            label: "Full",
            value: 1
          },
          {
            label: "Bottom only",
            value: 0
          },
        ],
        default: 1
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
          background: `linear-gradient(180deg, ${hexToRgbA(this.property.main_color, this.property.opacity / 255)} 0%, ${hexToRgbA(this.property.grad_color, this.property.opacity / 255)} 100%)`,
          // opacity: this.property.opacity / 255,
          border: `${this.property.border_width}px solid ${hexToRgbA(this.property.border_color, this.property.border_opacity / 255)}`,
          "border-radius": `${this.property.radius}px`,
          "box-shadow": `0 ${this.property.shadow_type == 0 ? this.property.shadow_width : 0}px ${this.property.shadow_width}px ${this.property.shadow_color}`,
        });
  
        updatePos.bind(this)(element);
      },
    },
    build: async function() {
      let code = "";
      code += `static lv_style_t ${this.property.name}_style;\n`;
      code += `lv_style_copy(&${this.property.name}_style, &lv_style_plain);\n`;
      code += `${this.property.name}_style.body.main_color = lv_color_hex(0x${this.property.main_color.substring(1)});\n`;
      code += `${this.property.name}_style.body.grad_color = lv_color_hex(0x${this.property.grad_color.substring(1)});\n`;
      code += `${this.property.name}_style.body.radius = ${this.property.radius};\n`;
      code += `${this.property.name}_style.body.opa = ${this.property.opacity};\n`;
      code += `${this.property.name}_style.body.border.color = lv_color_hex(0x${this.property.border_color.substring(1)});\n`;
      code += `${this.property.name}_style.body.border.width = ${this.property.border_width};\n`;
      code += `${this.property.name}_style.body.border.opa = ${this.property.border_opacity};\n`;
      code += `${this.property.name}_style.body.shadow.color = lv_color_hex(0x${this.property.shadow_color.substring(1)});\n`;
      code += `${this.property.name}_style.body.shadow.width = ${this.property.shadow_width};\n`;
      code += `${this.property.name}_style.body.shadow.type = ${this.property.shadow_type == 0 ? 'LV_SHADOW_BOTTOM' : 'LV_SHADOW_FULL'};\n`;
      code += `\n`;
  
      // Button object
      code += `lv_obj_t* ${this.property.name} = lv_obj_create(lv_scr_act(), NULL);\n`;
      code += `lv_obj_set_style(${this.property.name}, &${this.property.name}_style);\n`;
      code += `lv_obj_set_size(${this.property.name}, ${this.property.width}, ${this.property.height});\n`;
      code += `lv_obj_align(${this.property.name}, NULL, ${propertyToAlign(this.property)}, ${this.property.x}, ${this.property.y});\n`;
      code += `\n`;
      
      code += `lv_obj_set_hidden(${this.property.name}, ${this.property.hidden === 0 ? 'true' : 'false'});`;
      code += `\n`;

      return code;
    }
  });