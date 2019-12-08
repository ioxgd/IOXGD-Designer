addComponent({
  name: "Button",
  icon: '<i class="fas fa-stop"></i>',
  property: {
    name: {
      label: "Name",
      type: "text",
      pattern: /^\w+$/,
      default: function() {
        return objectNameGen("btn");
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
      default: 80
    },
    height: {
      label: "Height",
      type: "number",
      default: 50
    },
    toggle: {
      label: "Toggle",
      type: "choice",
      choice: [
        {
          label: "No",
          value: 0
        },
        {
          label: "Yes",
          value: 1
        },
      ],
      default: 0
    },
    text: {
      label: "Text",
      type: "text",
      default: "Button",
      validate: 'font'
    },
    rel_main_color: {
      label: "Release Main color",
      type: "color",
      default: "#76A2D0"
    },
    rel_grad_color: {
      label: "Release Gradient color",
      type: "color",
      default: "#193A5D"
    },
    pr_main_color: {
      label: "Press Main color",
      type: "color",
      default: "#336294"
    },
    pr_grad_color: {
      label: "Press Gradient color",
      type: "color",
      default: "#10263C"
    },
    border_width: {
      label: "Border Width",
      type: "number",
      default: 2
    },
    border_color: {
      label: "Border Color",
      type: "color",
      default: "#0B1928"
    },
    radius: {
      label: "Corner radius",
      type: "number",
      default: 6
    },
    color: {
      label: "Text Color",
      type: "color",
      default: "#FFFFFF"
    },
    font: {
      label: "Font",
      type: "font"
    }
  },
  render: {
    create: function(id) {
      let group = document.createElement("div");
      let p = document.createElement("p");
      $(p).css({ 
        padding: 0, 
        margin: 0, 
        position: "absolute", 
        top: "50%", 
        left: "50%", 
        transform: "translateY(-50%) translateX(-50%)",
        "text-align": "center",
        width: "100%",
      });
      group.appendChild(p);

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
      let font = getFontFromName(this.property.font);

      $(element).find("p").text(textFilter(this.property.text, font.range));

      $(element).css({
        width: this.property.width,
        height: this.property.height,
        color: this.property.color,
        background: `linear-gradient(180deg, ${this.property.rel_main_color} 0%, ${this.property.rel_grad_color} 100%)`,
        border: `${this.property.border_width}px solid ${this.property.border_color}`,
        "border-radius": `${this.property.radius}px`,
        "font-family": font.name,
        "font-size": `${font.size}px`
      });

      updatePos.bind(this)(element);
    },
  },
  build: async function() {
    let font = getFontFromName(this.property.font);

    let code = "";
    let header = "";

    // Button REL Style
    header += `static lv_style_t ${this.property.name}_rel_style;\n`;

    code += `lv_style_copy(&${this.property.name}_rel_style, &lv_style_plain);\n`;
    code += `${this.property.name}_rel_style.body.main_color = lv_color_hex(0x${this.property.rel_main_color.substring(1)});\n`;
    code += `${this.property.name}_rel_style.body.grad_color = lv_color_hex(0x${this.property.rel_grad_color.substring(1)});\n`;
    code += `${this.property.name}_rel_style.body.radius = ${this.property.radius};\n`;
    code += `${this.property.name}_rel_style.body.border.color = lv_color_hex(0x${this.property.border_color.substring(1)});\n`;
    code += `${this.property.name}_rel_style.body.border.width = ${this.property.border_width};\n`;
    code += `\n`;

    // Button PR Style
    header += `static lv_style_t ${this.property.name}_pr_style;\n`;

    code += `lv_style_copy(&${this.property.name}_pr_style, &lv_style_plain);\n`;
    code += `${this.property.name}_pr_style.body.main_color = lv_color_hex(0x${this.property.pr_main_color.substring(1)});\n`;
    code += `${this.property.name}_pr_style.body.grad_color = lv_color_hex(0x${this.property.pr_grad_color.substring(1)});\n`;
    code += `${this.property.name}_pr_style.body.radius = ${this.property.radius};\n`;
    code += `${this.property.name}_pr_style.body.border.color = lv_color_hex(0x${this.property.border_color.substring(1)});\n`;
    code += `${this.property.name}_pr_style.body.border.width = ${this.property.border_width};\n`;
    code += `\n`;

    // Button object
    header += `lv_obj_t* ${this.property.name};\n`;
    
    code += `${this.property.name} = lv_btn_create(lv_scr_act(), NULL);\n`;
    code += `// lv_obj_set_event_cb(${this.property.name}, event_handler); // TODO\n`;
    code += `lv_btn_set_style(${this.property.name}, LV_BTN_STATE_REL, &${this.property.name}_rel_style);\n`;
    code += `lv_btn_set_style(${this.property.name}, LV_BTN_STATE_PR, &${this.property.name}_pr_style);\n`;
    code += `lv_obj_set_size(${this.property.name}, ${this.property.width}, ${this.property.height});\n`;
    code += `lv_obj_align(${this.property.name}, NULL, ${propertyToAlign(this.property)}, ${this.property.x}, ${this.property.y});\n`;
    code += `\n`;

    // Label object
    header += `static lv_style_t ${this.property.name}_label_style;\n`;

    code += `lv_style_copy(&${this.property.name}_label_style, &lv_style_plain);\n`;
    code += `${this.property.name}_label_style.text.color = lv_color_hex(0x${this.property.color.substring(1)});\n`;
    code += `${this.property.name}_label_style.text.font = &${typeof font.variable !== "undefined" ? font.variable : font.name};\n`;

    header += `lv_obj_t* ${this.property.name}_label;\n`;

    code += `${this.property.name}_label = lv_label_create(${this.property.name}, NULL);\n`;
    code += `lv_label_set_style(${this.property.name}_label, LV_LABEL_STYLE_MAIN, &${this.property.name}_label_style);\n`;
    code += `lv_label_set_text(${this.property.name}_label, "${this.property.text}");\n`;
    code += `\n`;

    code += `lv_obj_set_hidden(${this.property.name}, ${this.property.hidden === 0 ? 'true' : 'false'});`;
    code += `\n`;

    return { header, content: code };
  }
});