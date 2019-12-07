addComponent({
  name: "Image",
  icon: '<i class="far fa-image"></i>',
  property: {
    name: {
      label: "Name",
      type: "text",
      pattern: /^\w+$/,
      default: function() {
        return objectNameGen("img");
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
    src: {
      label: "Src",
      type: "file",
      default: "./image/noimage.png"
    }
  },
  render: {
    create: function(id) {
      return document.createElement("img");
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
      $(element).attr("src", this.property.src)

      updatePos.bind(this)(element);
    },
  },
  build: async function() {
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

    let code = "";

    // Image object
    code += `lv_obj_t* ${this.property.name} = lv_img_create(lv_scr_act(), NULL);\n`;
    code += `// lv_img_set_src(${this.property.name}, "${this.property.src}"); // TODO\n`;
    code += `lv_obj_align(${this.property.name}, NULL, ${obj_align}, ${this.property.x}, ${this.property.y});\n`;
    code += `\n`;

    code += `lv_obj_set_hidden(${this.property.name}, ${this.property.hidden === 0 ? 'true' : 'false'});`;
    code += `\n`;
    
    return code;
  }
});
