addComponent({
  name: "Chart",
  icon: '<i class="fas fa-chart-line"></i>',
  property: {
    name: {
      label: "Name",
      type: "text",
      pattern: /^\w+$/,
      default: function() {
        return objectNameGen("chart");
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
      default: 200
    },
    height: {
      label: "Height",
      type: "number",
      default: 150
    },
    range_min: {
      label: "Range min",
      type: "number",
      default: 0
    },
    range_max: {
      label: "Range max",
      type: "number",
      default: 100
    },
    division_h: {
      label: "Division Horizontal",
      type: "number",
      default: 3
    },
    division_v: {
      label: "Division Vertical",
      type: "number",
      default: 5
    },
    background_main_color: {
      label: "Background Main color",
      type: "color",
      default: "#FFFFFF"
    },
    background_grad_color: {
      label: "Background Gradient color",
      type: "color",
      default: "#C0C0C0"
    },
    border_width: {
      label: "Border Width",
      type: "number",
      default: 2
    },
    border_color: {
      label: "Border Color",
      type: "color",
      default: "#404040"
    },
    radius: {
      label: "Corner radius",
      type: "number",
      default: 6
    },
    line_width: {
      label: "Line Width",
      type: "number",
      default: 2
    },
    line_color: {
      label: "Line Color",
      type: "color",
      default: "#202020"
    },
    series_width: {
      label: "Series Width",
      type: "number",
      default: 2
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
      element.innerHTML = "";
      for (let i=1;i<=this.property.division_h;i++) {
        let line = document.createElement("div");
        $(line).css({
          padding: 0, 
          margin: 0, 
          position: "absolute", 
          top: `${i * (this.property.height / (this.property.division_h + 1))}px`, 
          left: "0px", 
          width: "100%",
          height: "0px",
          border: 'none',
          'border-top': `${this.property.line_width}px solid ${this.property.line_color}`,
        });
        element.appendChild(line);
      }
      for (let i=1;i<=this.property.division_v;i++) {
        let line = document.createElement("div");
        $(line).css({
          padding: 0, 
          margin: 0, 
          position: "absolute", 
          top: "0px",
          left: `${i * (this.property.width / (this.property.division_v + 1))}px`, 
          width: "0px",
          height: "100%",
          border: 'none',
          'border-left': `${this.property.line_width}px solid ${this.property.line_color}`,
        });
        element.appendChild(line);
      }

      $(element).css({
        width: this.property.width,
        height: this.property.height,
        background: `linear-gradient(180deg, ${this.property.background_main_color} 0%, ${this.property.background_grad_color} 100%)`,
        border: `${this.property.border_width}px solid ${this.property.border_color}`,
        "border-radius": `${this.property.radius}px`,
      });

      updatePos.bind(this)(element);
    },
  },
  build: async function() {
    let code = "";
    let header = "";

    // Button PR Style
    header += `static lv_style_t ${this.property.name}_style;\n`;

    code += `lv_style_copy(&${this.property.name}_style, &lv_style_plain);\n`;
    code += `${this.property.name}_style.body.main_color = lv_color_hex(0x${this.property.background_main_color.substring(1)});\n`;
    code += `${this.property.name}_style.body.grad_color = lv_color_hex(0x${this.property.background_grad_color.substring(1)});\n`;
    code += `${this.property.name}_style.body.radius = ${this.property.radius};\n`;
    code += `${this.property.name}_style.body.border.color = lv_color_hex(0x${this.property.border_color.substring(1)});\n`;
    code += `${this.property.name}_style.body.border.width = ${this.property.border_width};\n`;
    code += `${this.property.name}_style.line.color = lv_color_hex(0x${this.property.line_color.substring(1)});\n`;
    code += `${this.property.name}_style.line.width = ${this.property.line_width};\n`;
    code += `\n`;

    // Button object
    header += `lv_obj_t* ${this.property.name};\n`;

    code += `${this.property.name} = lv_chart_create(lv_scr_act(), NULL);\n`;
    code += `lv_chart_set_style(${this.property.name}, LV_CHART_STYLE_MAIN, &${this.property.name}_style);\n`;
    code += `lv_obj_set_size(${this.property.name}, ${this.property.width}, ${this.property.height});\n`;
    code += `lv_obj_align(${this.property.name}, NULL, ${propertyToAlign(this.property)}, ${this.property.x}, ${this.property.y});\n`;
    code += `lv_chart_set_type(${this.property.name}, LV_CHART_TYPE_POINT | LV_CHART_TYPE_LINE);\n`;
    code += `lv_chart_set_series_opa(${this.property.name}, LV_OPA_70);\n`;
    code += `lv_chart_set_series_width(${this.property.name}, ${this.property.series_width});\n`;
    code += `lv_chart_set_div_line_count(${this.property.name}, ${this.property.division_h}, ${this.property.division_v});\n`;
    code += `lv_chart_set_range(${this.property.name}, ${this.property.range_min}, ${this.property.range_max});\n`;
    code += `\n`;

    code += `lv_obj_set_hidden(${this.property.name}, ${this.property.hidden === 0 ? 'true' : 'false'});`;
    code += `\n`;

    return { header, content: code };
  }
});
