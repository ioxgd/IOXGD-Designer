let updatePos = function(element) {
  let left = 0;
  if (this.property.alignX == 0) { // Left
    left = this.property.x;
  } else if (this.property.alignX == 1) { // Center
    left = `calc(50% - ${(element.offsetWidth / 2) - this.property.x}px)`
  } else if (this.property.alignX == 2) { // Right
    left = `calc(100% - ${element.offsetWidth - this.property.x}px)`
  }

  let top = 0;
  if (this.property.alignY == 0) { // Top
    top = this.property.y;
  } else if (this.property.alignY == 1) { // Mid
    top = `calc(50% - ${(element.offsetHeight / 2) - this.property.y}px)`
  } else if (this.property.alignY == 2) { // Bottom
    top = `calc(100% - ${element.offsetHeight - this.property.y}px)`
  }

  $(element).css({
    left: left,
    top: top,
  });
};

addComponent({
  name: "Label",
  icon: '<i class="fas fa-font"></i>',
  property: {
    name: {
      label: "Name",
      type: "text",
      pattern: /^\w+$/,
      default: function() {
        if (typeof countText === "undefined") {
          countText = 1;
        } else {
          countText++;
        }
        return "txt" + countText;
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
      default: 0
    },
    y: {
      label: "Y offset",
      type: "number",
      default: 0
    },
    width: {
      label: "Width",
      type: "number",
      default: 0
    },
    height: {
      label: "Height",
      type: "number",
      default: 0
    },
    text: {
      label: "Text",
      type: "text",
      // pattern: /^[\0-\xff]{1,50}$/,
      default: "Hello"
    },
    text_align: {
      label: "Text Align",
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
    color: {
      label: "Text Color",
      type: "color",
      default: "#000000"
    },
    mode: {
      label: "Text Wrap",
      type: "choice",
      choice: [
        {
          label: "Expand",
          value: 0
        },
        {
          label: "Wrap",
          value: 1
        },
        {
          label: "Write dots",
          value: 2
        },
        {
          label: "Scroll",
          value: 3
        },
        {
          label: "Scroll circularly",
          value: 4
        },
        {
          label: "Crop",
          value: 5
        },
      ],
      default: 0
    },
    font: {
      label: "Font",
      type: "choice",
      choice: [
        {
          label: "default",
          value: 0
        },
      ]
    }
  },
  render: {
    create: function(id) {
      let group = document.createElement("div");
      let p = document.createElement("p");
      $(p).css({ padding: 0, margin: 0 });
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
      let alignList = ["left", "center", "right"];

      $(element).find("p").text(this.property.text);

      $(element).css({
        width: this.property.width == 0 ? "auto" : this.property.width,
        height: this.property.height == 0 ? "auto" : this.property.height,
        "text-align": alignList[this.property.text_align],
        color: this.property.color
      });

      updatePos.bind(this)(element);
    },
  },
  build: async function() {
    let long_mode_list = [
      'LV_LABEL_LONG_EXPAND',
      'LV_LABEL_LONG_BREAK',
      'LV_LABEL_LONG_DOTS',
      'LV_LABEL_LONG_SROLL',
      'LV_LABEL_LONG_SROLL_CIRC',
      'LV_LABEL_LONG_CROP'
    ]
    let text_align_list = [
      'LV_LABEL_ALIGN_LEFT',
      'LV_LABEL_ALIGN_CENTER',
      'LV_LABEL_ALIGN_RIGHT'
    ]

    let code;

    // Style
    code += `static lv_style_t ${this.property.id}_style;\n`;
    code += `lv_style_copy(&${this.property.id}_style, &lv_style_plain);\n`;
    code += `${this.property.id}_style.text.color = lv_color_hex(0x${this.property.color.substring(1)});\n`;
    code += `\n`;

    // Label object
    code += `lv_obj_t* ${this.property.id} = lv_label_create(lv_scr_act(), NULL);\n`;
    code += `lv_label_set_style(${this.property.id}, LV_LABEL_STYLE_MAIN, &${this.property.id}_style);`;
    code += `lv_label_set_long_mode(${this.property.id}, ${long_mode_list[this.property.mode]});\n`;
    code += `lv_label_set_align(${this.property.id}, ${text_align_list[this.property.text_align]});\n`;
    code += `lv_label_set_text(${this.property.id}, "${this.property.text}");\n`;
    code += `lv_obj_set_size(${this.property.id}, ${this.property.width}, ${this.property.height});\n`;
    code += `lv_obj_align(${this.property.id}, NULL, LV_ALIGN_CENTER, ${this.property.x}, ${this.property.y});\n`;

    return code;
  }
});

addComponent({
  name: "Button",
  icon: '',
  property: {
    name: {
      label: "Name",
      type: "text",
      pattern: /^\w+$/,
      default: function() {
        if (typeof countBtn === "undefined") {
          countBtn = 1;
        } else {
          countBtn++;
        }
        return "btn" + countBtn;
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
      default: 0
    },
    y: {
      label: "Y offset",
      type: "number",
      default: 0
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
      // pattern: /^[\0-\xff]{1,50}$/,
      default: "Button"
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
      default: "#76A2D0"
    },
    pr_grad_color: {
      label: "Press Gradient color",
      type: "color",
      default: "#193A5D"
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
      type: "choice",
      choice: [
        {
          label: "Roboto (16)",
          value: "roboto:16"
        },
      ],
      default: "roboto:16"
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
        "text-align": "center"
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
      $(element).find("p").text(this.property.text);

      $(element).css({
        width: this.property.width,
        height: this.property.height,
        color: this.property.color,
        background: `linear-gradient(180deg, ${this.property.rel_main_color} 0%, ${this.property.rel_grad_color} 100%)`,
        border: `${this.property.border_width}px solid ${this.property.border_color}`,
        "border-radius": `${this.property.radius}px`,
        "font-family": this.property.font.split(':')[0],
        "font-size": `${this.property.font.split(':')[1]}px`
      });

      updatePos.bind(this)(element);
    },
  },
  build: async function() {
    let code;

    // Button REL Style
    code += `static lv_style_t ${this.property.id}_rel_style;\n`;
    code += `lv_style_copy(&${this.property.id}_rel_style, &lv_style_plain);\n`;
    code += `${this.property.id}_rel_style.body.main_color = lv_color_hex(0x${this.property.rel_main_color.substring(1)});\n`;
    code += `${this.property.id}_rel_style.body.grad_color = lv_color_hex(0x${this.property.rel_grad_color.substring(1)});\n`;
    code += `${this.property.id}_rel_style.body.radius = ${this.property.radius};\n`;
    code += `${this.property.id}_rel_style.body.border.color = lv_color_hex(0x${this.property.border_color.substring(1)});\n`;
    code += `${this.property.id}_rel_style.body.border.width = ${this.property.border_width};\n`;
    code += `\n`;

    // Button PR Style
    code += `static lv_style_t ${this.property.id}_pr_style;\n`;
    code += `lv_style_copy(&${this.property.id}_pr_style, &lv_style_plain);\n`;
    code += `${this.property.id}_pr_style.body.main_color = lv_color_hex(0x${this.property.pr_main_color.substring(1)});\n`;
    code += `${this.property.id}_pr_style.body.grad_color = lv_color_hex(0x${this.property.pr_grad_color.substring(1)});\n`;
    code += `${this.property.id}_pr_style.body.radius = ${this.property.radius};\n`;
    code += `${this.property.id}_pr_style.body.border.color = lv_color_hex(0x${this.property.border_color.substring(1)});\n`;
    code += `${this.property.id}_pr_style.body.border.width = ${this.property.border_width};\n`;
    code += `\n`;

    // Button object
    code += `lv_obj_t* ${this.property.id} = lv_btn_create(lv_scr_act(), NULL);\n`;
    code += `// lv_obj_set_event_cb(${this.property.id}, event_handler); // TODO\n`;
    code += `lv_btn_set_style(${this.property.id}, LV_BTN_STATE_REL, &${this.property.id}_rel_style);\n`;
    code += `lv_btn_set_style(${this.property.id}, LV_BTN_STATE_PR, &${this.property.id}_pr_style);\n`;
    code += `lv_obj_set_size(${this.property.id}, ${this.property.width}, ${this.property.height});\n`;
    code += `lv_obj_align(${this.property.id}, NULL, LV_ALIGN_CENTER, ${this.property.x}, ${this.property.y});\n`;
    code += `\n`;

    // Label object
    code += `static lv_style_t ${this.property.id}_label_style;\n`;
    code += `lv_style_copy(&${this.property.id}_label_style, &lv_style_plain);\n`;
    code += `${this.property.id}_label_style.text.color = lv_color_hex(0x${this.property.color.substring(1)});\n`;
    code += `lv_obj_t* ${this.property.id} = lv_label_create(${this.property.id}, NULL);\n`;
    code += `lv_label_set_style(${this.property.id}, LV_LABEL_STYLE_MAIN, &${this.property.id}_style);`;
    code += `lv_label_set_text(${this.property.id}, "${this.property.text}");\n`;

    return code;
  }
});

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
        return "led" + countLED;
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
      default: 0
    },
    y: {
      label: "Y offset",
      type: "number",
      default: 0
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
        border: `${this.property.border_width}px solid ${this.property.border_color}`,
        "border-radius": `100%`,
        "box-shadow": `0 0 ${this.property.shadow_width}px ${this.property.shadow_color}`,
      });

      updatePos.bind(this)(element);
    },
  },
  build: async function() {
    let code;

    // Style
    code += `static lv_style_t ${this.property.id}_style;\n`;
    code += `lv_style_copy(&${this.property.id}_style, &lv_style_plain);\n`;
    code += `${this.property.id}_style.body.main_color = lv_color_hex(0x${this.property.main_color.substring(1)});\n`;
    code += `${this.property.id}_style.body.grad_color = lv_color_hex(0x${this.property.grad_color.substring(1)});\n`;
    code += `${this.property.id}_style.body.radius = LV_RADIUS_CIRCLE;\n`;
    code += `${this.property.id}_style.body.border.color = lv_color_hex(0x${this.property.border_color.substring(1)});\n`;
    code += `${this.property.id}_style.body.border.width = ${this.property.border_width};\n`;
    code += `${this.property.id}_style.body.border.opa = ${this.property.border_opacity};\n`;
    code += `${this.property.id}_style.body.shadow.color = ${this.property.shadow_color.substring(1)};\n`;
    code += `${this.property.id}_style.body.shadow.width = ${this.property.shadow_width};\n`;
    code += `\n`;

    // LED object
    code += `lv_obj_t* ${this.property.id} = lv_led_create(lv_scr_act(), NULL);\n`;
    code += `lv_obj_set_style(${this.property.id}, &${this.property.id}_style);\n`;
    code += `lv_obj_set_size(${this.property.id}, ${this.property.width}, ${this.property.height});\n`;
    code += `lv_obj_align(${this.property.id}, NULL, LV_ALIGN_CENTER, ${this.property.x}, ${this.property.y});\n`;
    code += `lv_led_set_bright(${this.property.id}, ${this.property.bright});\n`;
    code += `\n`;

    return code;
  }
});



