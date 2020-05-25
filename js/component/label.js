addComponent({
  name: "Label",
  icon: '<i class="fas fa-font"></i>',
  property: {
    name: {
      label: "Name",
      type: "text",
      pattern: /^\w+$/,
      default: function() {
        return objectNameGen("txt");
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
        "font-size": `${font.size}px`,
        position: 'absolute',
      });

      updatePos.bind(this)(element);
    },
  },
  build: async function(simulator, pagename, output_path) {
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

    let font = getFontFromName(this.property.font);

    let code = "";
    let header = "";

    // Label object
    header += `lv_obj_t* ${this.property.name};\n`;

    code += `${this.property.name} = lv_label_create(${!this.property.parent ? 'lv_scr_act()' : this.property.parent}, NULL);\n`;
    code += `lv_obj_set_style_local_text_color(${this.property.name}, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, lv_color_hex(0x${this.property.color.substring(1)}));\n`;
    code += `lv_obj_set_style_local_text_font(${this.property.name}, LV_LABEL_PART_MAIN, LV_STATE_DEFAULT, &${typeof font.variable !== "undefined" ? font.variable : font.name});\n`;
    code += `lv_label_set_long_mode(${this.property.name}, ${long_mode_list[this.property.mode]});\n`;
    code += `lv_label_set_align(${this.property.name}, ${text_align_list[this.property.text_align]});\n`;
    code += `lv_label_set_text(${this.property.name}, "${this.property.text}");\n`;
    code += `lv_obj_set_size(${this.property.name}, ${this.property.width}, ${this.property.height});\n`;
    code += `lv_obj_align(${this.property.name}, NULL, ${propertyToAlign(this.property)}, ${this.property.x}, ${this.property.y});\n`;
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
