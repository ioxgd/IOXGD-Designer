
let getImageData = (file) => {
  let canvas = document.createElement("canvas");
  let img = new Image();

  return new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      delete img; // Saveing Memory
      delete canvas; // Saveing Memory

      resolve(imgData);
    }
    img.src = file;
  });
}

let intToHex = (integer) => {
  let number = (+integer).toString(16).toUpperCase();
  if( (number.length % 2) > 0 ) number = "0" + number;
  return number
}

async function img_covt(img_file, output_name, output_path) {
  let imgData = await getImageData(img_file);

  let code = "";

  code += `#include "lvgl.h"\n`;
  code += `\n`;
  code += `#ifndef LV_ATTRIBUTE_MEM_ALIGN\n`;
  code += `#define LV_ATTRIBUTE_MEM_ALIGN\n`;
  code += `#endif\n`;
  code += `\n`;
  code += `#ifndef LV_ATTRIBUTE_IMG_${output_name.toUpperCase()}\n`;
  code += `#define LV_ATTRIBUTE_IMG_${output_name.toUpperCase()}\n`;
  code += `#endif\n`;
  code += `\n`;
  code += `const LV_ATTRIBUTE_MEM_ALIGN LV_ATTRIBUTE_IMG_${output_name.toUpperCase()} uint8_t ${output_name}_map[] = {\n`;
  code += `#if LV_COLOR_DEPTH == 1 || LV_COLOR_DEPTH == 8\n`;
  code += `  /*Pixel format: Alpha 8 bit, Red: 3 bit, Green: 3 bit, Blue: 2 bit*/\n`;
  for (let y=0;y<imgData.height;y++) {
    code += `  `;
    for (let x=0;x<imgData.width;x++) {
      let index = (y * imgData.width + x) * 4;

      let c8 = (imgData.data[index] & 0xE0) | ((imgData.data[index + 1] & 0xE0) >> 3) | ((imgData.data[index + 2] & 0xE0) >> 6);	// RGB332
      let alpha = imgData.data[index + 3];
      if(alpha & 0x02) alpha |= 0x01; /*Repeate the last bit: 0000000 -> 00000000; 1111110 -> 11111111*/
      // alpha = 255 - alpha;

      code += `0x${intToHex(c8)}, 0x${intToHex(alpha)}, `;
    }
    code += `\n`;
  }
  code += `#endif\n`;
  code += `#if LV_COLOR_DEPTH == 16 && LV_COLOR_16_SWAP == 0\n`;
  code += `  /*Pixel format: Alpha 8 bit, Red: 5 bit, Green: 6 bit, Blue: 5 bit*/\n`;
  for (let y=0;y<imgData.height;y++) {
    code += `  `;
    for (let x=0;x<imgData.width;x++) {
      let index = (y * imgData.width + x) * 4;

      let c16 = ((imgData.data[index] & 0xF8) << 8) | ((imgData.data[index + 1] & 0xFC) << 3) | ((imgData.data[index + 2] & 0xF8) >> 3);	//RGB565
      let alpha = imgData.data[index + 3];
      if(alpha & 0x02) alpha |= 0x01; /*Repeate the last bit: 0000000 -> 00000000; 1111110 -> 11111111*/
      // alpha = 255 - alpha;

      code += `0x${intToHex(c16 & 0xFF)}, 0x${intToHex((c16 >> 8) & 0xFF)}, 0x${intToHex(alpha)}, `;
    }
    code += `\n`;
  }
  code += `#endif\n`;
  code += `#if LV_COLOR_DEPTH == 16 && LV_COLOR_16_SWAP != 0\n`;
  code += `  /*Pixel format: Alpha 8 bit, Red: 5 bit, Green: 6 bit, Blue: 5 bit  BUT the 2  color bytes are swapped*/\n`;
  for (let y=0;y<imgData.height;y++) {
    code += `  `;
    for (let x=0;x<imgData.width;x++) {
      let index = (y * imgData.width + x) * 4;

      let c16 = ((imgData.data[index] & 0xF8) << 8) | ((imgData.data[index + 1] & 0xFC) << 3) | ((imgData.data[index + 2] & 0xF8) >> 3);	//RGB565
      let alpha = imgData.data[index + 3];
      if(alpha & 0x02) alpha |= 0x01; /*Repeate the last bit: 0000000 -> 00000000; 1111110 -> 11111111*/
      // alpha = 255 - alpha;

      code += `0x${intToHex((c16 >> 8) & 0xFF)}, 0x${intToHex(c16 & 0xFF)}, 0x${intToHex(alpha)}, `;
    }
    code += `\n`;
  }
  code += `#endif\n`;
  code += `#if LV_COLOR_DEPTH == 32\n`;
  code += `  /*Pixel format: Alpha 8 bit, Red: 5 bit, Green: 6 bit, Blue: 5 bit  BUT the 2  color bytes are swapped*/\n`;
  for (let y=0;y<imgData.height;y++) {
    code += `  `;
    for (let x=0;x<imgData.width;x++) {
      let index = (y * imgData.width + x) * 4;

      let alpha = imgData.data[index + 3];
      if(alpha & 0x02) alpha |= 0x01; /*Repeate the last bit: 0000000 -> 00000000; 1111110 -> 11111111*/
      // alpha = 255 - alpha;

      code += `0x${intToHex(imgData.data[index + 2])}, 0x${intToHex(imgData.data[index + 1])}, 0x${intToHex(imgData.data[index])}, 0x${intToHex(alpha)}, `;
    }
    code += `\n`;
  }
  code += `#endif\n`;
  code += `};\n`;
  code += `\n`;
  code += `const lv_img_dsc_t ${output_name} = {\n`;
  code += `  .header.always_zero = 0,\n`;
  code += `  .header.w = ${imgData.width},\n`;
  code += `  .header.h = ${imgData.height},\n`;
  code += `  .data_size = ${imgData.width * imgData.height} * LV_IMG_PX_SIZE_ALPHA_BYTE,\n`;
  code += `  .header.cf = LV_IMG_CF_TRUE_COLOR_ALPHA,\n`;
  code += `  .data = ${output_name}_map,\n`;
  code += `};\n`;

  // console.log(code);
  // console.log(`${output_path}/${output_name}.c`);

  return fs.writeFile(`${output_path}/${output_name}.c`, code, () => {});
}