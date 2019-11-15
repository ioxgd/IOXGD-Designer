const svgNS = "http://www.w3.org/2000/svg";
const htmlNS = "http://www.w3.org/1999/xhtml";
var svgSketch = document.getElementById("sketch");

var componentCount = 0;
var abstractComponentList = [];

var pageFocus = 0;
var pageAndComponent = [
  {
    name: 'index',
    component: {

    }
  } 
];
var pageBackground = {
  main_color: "#FFFFFF",
  grad_color: "#FFFFFF"
};

function addComponent(comp) {
  abstractComponentList.push(comp);
}

function createComponent(name) {
  let comp, element, id;
  
  abstractComponentList.forEach(function(element) {
    if (element.name === name) {
      comp = element;
    }
  });
  if (typeof comp === "undefined") {
    alert("Error!, not found " + name);
    return;
  }
  
  id = "component-" + componentCount;
  componentCount++;
  
  // console.log(comp);
  pageAndComponent[pageFocus].component[id] = {};
  pageAndComponent[pageFocus].component[id].name = comp.name;
  pageAndComponent[pageFocus].component[id].property = {};
  Object.keys(comp.property).forEach(function(propertyName) {
    // console.log(propertyName);
    let propertyValue;
    let property = comp.property[propertyName];
    if (typeof property === "object") {
      if (typeof property.default === "undefined") {
        if (property.type === "font") {
          propertyValue = listFont[0].name;
        }
      } else if (typeof property.default === "function") {
        propertyValue = property.default();
      } else {
        propertyValue = property.default;
      }
    } else {
      propertyValue = property;
    }
    pageAndComponent[pageFocus].component[id].property[propertyName] = propertyValue;
  });
  
  // console.log(pageAndComponent[pageFocus].component[id]);
  
  element = comp.render.create();
  element.setAttribute("data-id", id);
  element.setAttribute("class", "component");
  comp.render.update.bind(pageAndComponent[pageFocus].component[id])(element);
  
  svgSketch.appendChild(element);
  
  reconfigDraggable();
}

function allPageToJson() {
  return JSON.stringify(pageAndComponent, null, '\t');
}

function allPageFromJson(json) {
  pageAndComponent = JSON.parse(json);

  rerenderComponent();
}

function waitFor(selector) {
  return new Promise(function (res, rej) {
    console.log("Wait");
    setTimeout(() => {
      console.log("Load end");
      res();
    }, 10);
  });
}

async function rerenderComponent() {
  // $(svgSketch).find(".component").remove();
  removeAllComponent();

  let arrNumber = [];
  for (let id in pageAndComponent[pageFocus].component) {
    let name = pageAndComponent[pageFocus].component[id].name;
	// console.log(id, id.match(/[0-9]+/));
    arrNumber.push(+(id.match(/[0-9]+/)[0]));
	
    let comp, element;

    abstractComponentList.forEach(function(element) {
      if (element.name === name) {
        comp = element;
      }
    });
    if (typeof comp === "undefined") {
      alert("Error!, not found " + name);
      return;
    }

    element = comp.render.create();
    element.setAttribute("data-id", id);
    element.setAttribute("class", "component");

    svgSketch.appendChild(element);

    if (element.nodeName == 'IMG') {
      element.onload = () => {
        comp.render.update.bind(pageAndComponent[pageFocus].component[id])(element);
      }
    }

    comp.render.update.bind(pageAndComponent[pageFocus].component[id])(element);
  }
  
  if (arrNumber.length > 0) {
    componentCount = Math.max.apply(null, arrNumber) + 1;
  } else {
    componentCount = 0;
  }
  
  reconfigDraggable();
}

function updateComponentPosition(id, x, y) {
  let name = pageAndComponent[pageFocus].component[id].name;
      
  let comp;
      
  // Find component name in list
  abstractComponentList.forEach(function(element) {
    if (element.name === name) {
      comp = element;
    }
  });
  if (typeof comp === "undefined") {
    alert("Error!, not found " + name);
    return;
  }
  
  
  let element = $(svgSketch).find("[data-id='" + id + "']")[0];
  let box = element.getBBox();
  comp.render.move.bind(pageAndComponent[pageFocus].component[id])(x, y, box.width, box.height);
  comp.render.update.bind(pageAndComponent[pageFocus].component[id])(element);
}

function updateComponentProperty(id) {
  let name = pageAndComponent[pageFocus].component[id].name;
      
  let comp;
      
  // Find component name in list
  abstractComponentList.forEach(function(element) {
    if (element.name === name) {
      comp = element;
    }
  });
  if (typeof comp === "undefined") {
    alert("Error!, not found " + name);
    return;
  }

  comp.render.update.bind(pageAndComponent[pageFocus].component[id])($(svgSketch).find("[data-id='" + id + "']")[0]);
}

function getAbstractComponent() {
  return abstractComponentList;
}

function updatePropertyTable() {
  let focus = $(".focus")[0];
  let id = focus.getAttribute("data-id");
  let name = pageAndComponent[pageFocus].component[id].name;
  
  let comp;
  
  abstractComponentList.forEach(function(element) {
    if (element.name === name) {
      comp = element;
    }
  });
  if (typeof comp === "undefined") {
    alert("Error!, not found " + name);
    return;
  }
  
  var html = "";
  Object.keys(comp.property).forEach(function(propertyName) {
    
    let property = comp.property[propertyName];
    if (typeof property === "object") {
      html += "<li>";
      html += `<div class="label">${(typeof property.label !== "undefined" ? property.label : propertyName)}</div>`;
      html += `<div class="value">`;
      
      if (property.type === "text") {
        html += "<input type=\"text\" class=\"property\" data-property=\"" + propertyName + "\" value=\"" + pageAndComponent[pageFocus].component[id].property[propertyName] + "\">";
      } else if (property.type === "number") {
        html += `<input type="number" class="property${(typeof property.inputOffset !== "undefined" ? ` input-${property.inputOffset}-offset` : '')}" data-property="${propertyName}" value="${pageAndComponent[pageFocus].component[id].property[propertyName]}">`;
      } else if (property.type === "color") {
        html += "<input type=\"text\" class=\"input-color property\" data-property=\"" + propertyName + "\" value=\"" + pageAndComponent[pageFocus].component[id].property[propertyName] + "\">";
      } else if (property.type === "choice") {
        html += "<select class=\"property\" data-property=\"" + propertyName + "\">";
        for (let i=0;i<property.choice.length;i++) {
          html += "<option value=\"" + property.choice[i].value + "\"" + (property.choice[i].value === pageAndComponent[pageFocus].component[id].property[propertyName] ? " selected" : "") + ">" + property.choice[i].label + "</option>";
        }
        html += "</select>";
      } else if (property.type === "file") {
        html += "<button class=\"property file-select\" data-property=\"" + propertyName + "\" value=\"" + pageAndComponent[pageFocus].component[id].property[propertyName] + "\">Choose</button>";
      } else if (property.type === "font") {
        html += "<select class=\"property\" data-property=\"" + propertyName + "\">";
        for (let item of listFont) {
          html += "<option value=\"" + item.name + "\"" + (item.name === pageAndComponent[pageFocus].component[id].property[propertyName] ? " selected" : "") + ">" + item.name + "</option>";
        }
        html += "</select>";

        
      }
      
      html += "</div>";
      html += "</li>";
    } else {
      /* html += pageAndComponent[pageFocus].component[id].property[propertyName]; */
    }
    
  });

  $("#property-box").html(html);
  
  $(".input-color").each(function() {
    // console.log(this);
    let a = new jscolor(this, { hash:true });
  });
  
  $(".property").change(async function(e) {
    // console.log("Hi2");
    let propertyName = e.target.getAttribute("data-property");
    let propertyValue = e.target.value;
                               
    let focus = $(".focus")[0];
    let id = focus.getAttribute("data-id");
    
    let name = pageAndComponent[pageFocus].component[id].name;
  
    let comp;

    abstractComponentList.forEach(function(element) {
      if (element.name === name) {
        comp = element;
      }
    });
    
    if (typeof comp === "undefined") {
      alert("Error!, not found " + name);
      return;
    }
    
    let property = comp.property[propertyName];
    if (property.type === "number") {
      propertyValue = +propertyValue;
      if (typeof property.min !== "undefined") {
        let min;
        if (typeof property.min !== "function") {
          min = property.min;
        } else {
          min = property.min.bind(pageAndComponent[pageFocus].component[id])();
        }
        if (propertyValue < min) {
          alert("Error, Minimum value of this property is " + min);
          e.target.value = min;
          return;
        }
      }
      if (typeof property.max !== "undefined") {
        let max;
        if (typeof property.max !== "function") {
          max = property.max;
        } else {
          max = property.max.bind(pageAndComponent[pageFocus].component[id])();
        }
        if (propertyValue > max) {
          alert("Error, Maximum value of this property is " + max);
          e.target.value = max;
          return;
        }
      }
      pageAndComponent[pageFocus].component[id].property[propertyName] = propertyValue;
    } else if (property.type === "choice") {
      if (typeof comp.property[propertyName].choice[0].value === "number") {
        pageAndComponent[pageFocus].component[id].property[propertyName] = +propertyValue;
      } else {
        pageAndComponent[pageFocus].component[id].property[propertyName] = propertyValue;
      }
    } else if (property.type === "text") {
      if (typeof property.pattern === "object") {
        if (property.pattern.test(propertyValue) === false) {
          alert("Error, Value not match");
          e.target.value = pageAndComponent[pageFocus].component[id].property[propertyName];
          return;
        }
      }
/*       if (typeof property.validate !== "undefined") {
        if (property.validate === "font") {
          propertyValue = textFilter(propertyValue, getFontFromName(pageAndComponent[pageFocus].component[id].property.font).range);
        }
      } */
      pageAndComponent[pageFocus].component[id].property[propertyName] = propertyValue;
    } else if (property.type === "color") {
      if (/^#[0-9a-fA-F]{6}$/.test(propertyValue) === false) {
        alert("Error, Value not match of #RGB");
        e.target.value = pageAndComponent[pageFocus].component[id].property[propertyName];
        return;
      }
      pageAndComponent[pageFocus].component[id].property[propertyName] = propertyValue;
    } else if (property.type === "file") {
      pageAndComponent[pageFocus].component[id].property[propertyName] = propertyValue;
    } else if (property.type === "font") {
      pageAndComponent[pageFocus].component[id].property[propertyName] = propertyValue;
    }
    
    if (typeof property.change === "function") {
      await property.change.bind(pageAndComponent[pageFocus].component[id])();
      updatePropertyTable();
    }
    
    updateComponentProperty(id);
    updateComponentFrame();
  });
  
  $(".file-select").click(async function(e) {
    let result = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: "Image", extensions: ["png", "jpg", "jpeg"] }] });
    if (!result.canceled) {
      $(this).attr("value", result.filePaths).trigger("change");
    }
  });
}

async function buildComponentsGetCode() {
  var code = "";
  code += "static lv_style_t style_screen;\n";
  code += "lv_style_copy(&style_screen, &lv_style_plain);\n";
  code += `style_screen.body.main_color = lv_color_hex(0x${pageBackground.main_color.substring(1)});\n`;
  code += `style_screen.body.grad_color = lv_color_hex(0x${pageBackground.grad_color.substring(1)});\n`;
  code += "lv_obj_set_style(lv_scr_act(), &style_screen);\n"
  code += "\n";
  
  for (const id of Object.keys(pageAndComponent[pageFocus].component)) {
    let name = pageAndComponent[pageFocus].component[id].name;
  
    let comp;

    abstractComponentList.forEach(function(element) {
      if (element.name === name) {
        comp = element;
      }
    });
    
    if (typeof comp === "undefined") {
      return;
    }

    code += `/* ========== ${pageAndComponent[pageFocus].component[id].property.name} ========== */\n`;
    code += await comp.build.bind(pageAndComponent[pageFocus].component[id])();
    code += `/* ====== END of ${pageAndComponent[pageFocus].component[id].property.name} ====== */\n`;
    code += "\n";
  }
  
  return code;
}

function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
        }
        resolve(stdout ? stdout : stderr);
      });
    });
}

async function buildFontSaveFileGetCode(path, callback) {
  let code = "";

  for (let font of listFont) {
    if (typeof font.variable !== "undefined") {
      continue;
    }
    if (typeof callback === "function") callback(`Convarting ${font.name} to C Array`);
    try {
      let cmd = `${__dirname}\\bin\\lv_font_conv_v0.3.1_x64.exe --font "${font.file}" --bpp 4 --size ${font.size} -r ${font.range} --format lvgl --no-compress -o "${path}\\${font.name}.c"`;
      await execShellCommand(cmd);
      code += `LV_FONT_DECLARE(${font.name});\n`;
    } catch(e) {
      dialog.showErrorBox('Oops! Something went wrong!', `${font.name} can't convert to C array`);
    }
  }

  return code;
}

