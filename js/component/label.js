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
      default: "Hello",
      validate: 'font'
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
      type: "font"
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

      let font = getFontFromName(this.property.font);

      $(element).find("p").text(textFilter(this.property.text, font.range));

      $(element).css({
        width: this.property.width == 0 ? "auto" : this.property.width,
        height: this.property.height == 0 ? "auto" : this.property.height,
        "text-align": alignList[this.property.text_align],
        color: this.property.color,
        "font-family": font.name,
        "font-size": `${font.size}px`
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
    ];
    let text_align_list = [
      'LV_LABEL_ALIGN_LEFT',
      'LV_LABEL_ALIGN_CENTER',
      'LV_LABEL_ALIGN_RIGHT'
    ];

    let obj_align;
    if (this.property.alignX === 0 && this.property.alignY === 0) {
      obj_align = "LV_ALIGN_IN_TOP_LEFT";
    } else if (this.property.alignX === 1 && this.property.alignY === 0) {
      obj_align = "LV_ALIGN_IN_TOP_MID";
    } else if (this.property.alignX === 2 && this.property.alignY === 0) {
      obj_align = "LV_ALIGN_IN_TOP_RIGHT";
    } else if (this.property.alignX === 0 && this.property.alignY === 1) {
      obj_align = "LV_ALIGN_IN_LEFT_MID";
    } else if (this.property.alignX === 1 && this.property.alignY === 1) {
      obj_align = "LV_ALIGN_CENTER";
    } else if (this.property.alignX === 2 && this.property.alignY === 1) {
      obj_align = "LV_ALIGN_IN_RIGHT_MID";
    } else if (this.property.alignX === 0 && this.property.alignY === 2) {
      obj_align = "LV_ALIGN_IN_BOTTOM_LEFT";
    } else if (this.property.alignX === 1 && this.property.alignY === 2) {
      obj_align = "LV_ALIGN_IN_BOTTOM_MID";
    } else if (this.property.alignX === 2 && this.property.alignY === 2) {
      obj_align = "LV_ALIGN_IN_BOTTOM_RIGHT";
    }

    let font = getFontFromName(this.property.font);

    let code = "";

    // Style
    code += `static lv_style_t ${this.property.name}_style;\n`;
    code += `lv_style_copy(&${this.property.name}_style, &lv_style_plain);\n`;
    code += `${this.property.name}_style.text.color = lv_color_hex(0x${this.property.color.substring(1)});\n`;
    code += `${this.property.name}_style.text.font = &${typeof font.variable !== "undefined" ? font.variable : font.name};\n`;
    code += `\n`;

    // Label object
    code += `lv_obj_t* ${this.property.name} = lv_label_create(lv_scr_act(), NULL);\n`;
    code += `lv_label_set_style(${this.property.name}, LV_LABEL_STYLE_MAIN, &${this.property.name}_style);\n`;
    code += `lv_label_set_long_mode(${this.property.name}, ${long_mode_list[this.property.mode]});\n`;
    code += `lv_label_set_align(${this.property.name}, ${text_align_list[this.property.text_align]});\n`;
    code += `lv_label_set_text(${this.property.name}, "${this.property.text}");\n`;
    code += `lv_obj_set_size(${this.property.name}, ${this.property.width}, ${this.property.height});\n`;
    code += `lv_obj_align(${this.property.name}, NULL, ${obj_align}, ${this.property.x}, ${this.property.y});\n`;

    return code;
  }
});
