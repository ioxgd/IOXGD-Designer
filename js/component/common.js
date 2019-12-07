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

let hexToRgbA = (hex, opa) => {
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
      c= hex.substring(1).split('');
      if(c.length== 3){
          c= [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c= '0x'+c.join('');
      return `rgba(${(c>>16)&255}, ${(c>>8)&255}, ${c&255}, ${opa})`;
  }
  throw new Error('Bad Hex');
}

let objectNameGen = (offset) => {
  let nextNumber = 1;
  for (let component of Object.keys(pageAndComponent[pageFocus].component)) {
    component = pageAndComponent[pageFocus].component[component];
    if (typeof component.property.name !== "undefined") {
      if (component.property.name.indexOf(offset) === 0) {
        let number = parseInt(component.property.name.replace(/\D/g,''));
        if (number >= nextNumber) {
          nextNumber = number + 1;
        }
      }
    }
  }

  return offset + nextNumber;
};

let propertyToAlign = (property) => {
  let obj_align;
  if (property.alignX === 0 && property.alignY === 0) {
    obj_align = "LV_ALIGN_IN_TOP_LEFT";
  } else if (property.alignX === 1 && property.alignY === 0) {
    obj_align = "LV_ALIGN_IN_TOP_MID";
  } else if (property.alignX === 2 && property.alignY === 0) {
    obj_align = "LV_ALIGN_IN_TOP_RIGHT";
  } else if (property.alignX === 0 && property.alignY === 1) {
    obj_align = "LV_ALIGN_IN_LEFT_MID";
  } else if (property.alignX === 1 && property.alignY === 1) {
    obj_align = "LV_ALIGN_CENTER";
  } else if (property.alignX === 2 && property.alignY === 1) {
    obj_align = "LV_ALIGN_IN_RIGHT_MID";
  } else if (property.alignX === 0 && property.alignY === 2) {
    obj_align = "LV_ALIGN_IN_BOTTOM_LEFT";
  } else if (property.alignX === 1 && property.alignY === 2) {
    obj_align = "LV_ALIGN_IN_BOTTOM_MID";
  } else if (property.alignX === 2 && property.alignY === 2) {
    obj_align = "LV_ALIGN_IN_BOTTOM_RIGHT";
  }
  return obj_align;
}
