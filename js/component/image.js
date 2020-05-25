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
    src: {
      label: "Src",
      type: "file",
      default: "./image/noimage.png"
    },
    storage: {
      label: "Storage",
      type: "choice",
      choice: [
        {
          label: "Flash",
          value: 0
        },
        {
          label: "MicroSD Card",
          value: 1
        },
      ],
      default: 0
    },
    angle: {
      label: "Rotation Angle",
      type: "number",
      default: 0,
    },
  },
  render: {
    create: function(id) {
      let img = document.createElement("img");
      img.setAttribute("draggable", false);
      return img;
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
        position: 'absolute',
        transform: `rotate(${this.property.angle}deg)`
      });
      $(element).attr("src", this.property.src)

      updatePos.bind(this)(element);
    },
  },
  build: async function(simulator, pagename, output_path) {
    let code = "";
    let header = "";

    // let objName = `${pagename}_${this.property.name}`;
    let objName = `${this.property.name}`;

    // Image object
    if (this.property.define == 0) { // define local
      code += `lv_obj_t* ${objName};\n`;
      code += `\n`;
    } else {
      header += `lv_obj_t* ${objName};\n`;
    }

    code += `${objName} = lv_img_create(${!this.property.parent ? 'lv_scr_act()' : this.property.parent}, NULL);\n`;
    let imgObj = `img_${path.basename(this.property.src).replace(/\-/g,'_').split('.').slice(0, -1).join('_')}`;
    if (this.property.storage == 0 || simulator) { // Flash or Simulator
      header += `LV_IMG_DECLARE(${imgObj});\n`;
      code += `lv_img_set_src(${objName}, &${imgObj});\n`;
    } else if (this.property.storage == 1) { // MicroSD Card
      code += `lv_img_set_src(${objName}, "S:/path/to/${path.basename(this.property.src)}"); // TODO\n`;
    }
    code += `lv_img_set_angle(${objName}, ${this.property.angle * 10});\n`;
    code += `lv_obj_align(${objName}, NULL, ${propertyToAlign(this.property)}, ${this.property.x}, ${this.property.y});\n`;
    code += `\n`;

    code += `lv_obj_set_hidden(${objName}, ${this.property.hidden === 0 ? 'true' : 'false'});`;
    code += `\n`;

    /*
    if (this.property.define == 0) { // define local
      code = `${header}\n${code}`;
      header = "";
    }
    */

    if (this.property.storage == 0 || simulator) { // Flash or Simulator -> Convart file
      await img_covt(this.property.src, imgObj, output_path);
    }

    return { header, content: code };
  }
});
