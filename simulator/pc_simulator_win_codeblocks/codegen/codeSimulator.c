#include "lvgl/lvgl.h"
LV_FONT_DECLARE(supermarket_60);


void codeSimulator() {
static lv_style_t style_screen;
lv_style_copy(&style_screen, &lv_style_plain);
style_screen.body.main_color = lv_color_hex(0x383838);
style_screen.body.grad_color = lv_color_hex(0x212121);
lv_obj_set_style(lv_scr_act(), &style_screen);

/* ========== txt1 ========== */
static lv_style_t txt1_style;
lv_obj_t* txt1;

lv_style_copy(&txt1_style, &lv_style_plain);
txt1_style.text.color = lv_color_hex(0xFFFFFF);
txt1_style.text.font = &supermarket_60;

txt1 = lv_label_create(lv_scr_act(), NULL);
lv_label_set_style(txt1, LV_LABEL_STYLE_MAIN, &txt1_style);
lv_label_set_long_mode(txt1, LV_LABEL_LONG_BREAK);
lv_label_set_align(txt1, LV_LABEL_ALIGN_LEFT);
lv_label_set_text(txt1, "กดรหัสผ่าน");
lv_obj_set_size(txt1, 300, 80);
lv_obj_align(txt1, NULL, LV_ALIGN_IN_TOP_LEFT, 20, 30);

lv_obj_set_hidden(txt1, false);
/* ====== END of txt1 ====== */

/* ========== obj1 ========== */
static lv_style_t obj1_style;
lv_obj_t* obj1;

lv_style_copy(&obj1_style, &lv_style_plain);
obj1_style.body.main_color = lv_color_hex(0xFFFFFF);
obj1_style.body.grad_color = lv_color_hex(0xFFFFFF);
obj1_style.body.radius = 20;
obj1_style.body.opa = 200;
obj1_style.body.border.color = lv_color_hex(0x000000);
obj1_style.body.border.width = 0;
obj1_style.body.border.opa = 255;
obj1_style.body.shadow.color = lv_color_hex(0x000000);
obj1_style.body.shadow.width = 0;
obj1_style.body.shadow.type = LV_SHADOW_FULL;

obj1 = lv_obj_create(lv_scr_act(), NULL);
lv_obj_set_style(obj1, &obj1_style);
lv_obj_set_size(obj1, 460, 80);
lv_obj_align(obj1, NULL, LV_ALIGN_IN_TOP_LEFT, 290, 30);

lv_obj_set_hidden(obj1, false);
/* ====== END of obj1 ====== */

/* ========== txtPassword ========== */
static lv_style_t txtPassword_style;
lv_obj_t* txtPassword;

lv_style_copy(&txtPassword_style, &lv_style_plain);
txtPassword_style.text.color = lv_color_hex(0x000000);
txtPassword_style.text.font = &supermarket_60;

txtPassword = lv_label_create(lv_scr_act(), NULL);
lv_label_set_style(txtPassword, LV_LABEL_STYLE_MAIN, &txtPassword_style);
lv_label_set_long_mode(txtPassword, LV_LABEL_LONG_BREAK);
lv_label_set_align(txtPassword, LV_LABEL_ALIGN_CENTER);
lv_label_set_text(txtPassword, "");
lv_obj_set_size(txtPassword, 460, 80);
lv_obj_align(txtPassword, NULL, LV_ALIGN_IN_TOP_LEFT, 290, 30);

lv_obj_set_hidden(txtPassword, false);
/* ====== END of txtPassword ====== */

/* ========== btn0 ========== */
static lv_style_t btn0_rel_style;
static lv_style_t btn0_pr_style;
lv_obj_t* btn0;
static lv_style_t btn0_label_style;
lv_obj_t* btn0_label;

lv_style_copy(&btn0_rel_style, &lv_style_plain);
btn0_rel_style.body.main_color = lv_color_hex(0x76A2D0);
btn0_rel_style.body.grad_color = lv_color_hex(0x193A5D);
btn0_rel_style.body.radius = 6;
btn0_rel_style.body.border.color = lv_color_hex(0x0B1928);
btn0_rel_style.body.border.width = 2;

lv_style_copy(&btn0_pr_style, &lv_style_plain);
btn0_pr_style.body.main_color = lv_color_hex(0x336294);
btn0_pr_style.body.grad_color = lv_color_hex(0x10263C);
btn0_pr_style.body.radius = 6;
btn0_pr_style.body.border.color = lv_color_hex(0x0B1928);
btn0_pr_style.body.border.width = 2;

btn0 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn0, event_handler); // TODO
lv_btn_set_style(btn0, LV_BTN_STATE_REL, &btn0_rel_style);
lv_btn_set_style(btn0, LV_BTN_STATE_PR, &btn0_pr_style);
lv_obj_set_size(btn0, 160, 70);
lv_obj_align(btn0, NULL, LV_ALIGN_IN_BOTTOM_MID, 120, -30);

lv_style_copy(&btn0_label_style, &lv_style_plain);
btn0_label_style.text.color = lv_color_hex(0xFFFFFF);
btn0_label_style.text.font = &supermarket_60;
btn0_label = lv_label_create(btn0, NULL);
lv_label_set_style(btn0_label, LV_LABEL_STYLE_MAIN, &btn0_label_style);
lv_label_set_text(btn0_label, "0");

lv_obj_set_hidden(btn0, false);
/* ====== END of btn0 ====== */

/* ========== btn1 ========== */
static lv_style_t btn1_rel_style;
static lv_style_t btn1_pr_style;
lv_obj_t* btn1;
static lv_style_t btn1_label_style;
lv_obj_t* btn1_label;

lv_style_copy(&btn1_rel_style, &lv_style_plain);
btn1_rel_style.body.main_color = lv_color_hex(0x76A2D0);
btn1_rel_style.body.grad_color = lv_color_hex(0x193A5D);
btn1_rel_style.body.radius = 6;
btn1_rel_style.body.border.color = lv_color_hex(0x0B1928);
btn1_rel_style.body.border.width = 2;

lv_style_copy(&btn1_pr_style, &lv_style_plain);
btn1_pr_style.body.main_color = lv_color_hex(0x336294);
btn1_pr_style.body.grad_color = lv_color_hex(0x10263C);
btn1_pr_style.body.radius = 6;
btn1_pr_style.body.border.color = lv_color_hex(0x0B1928);
btn1_pr_style.body.border.width = 2;

btn1 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn1, event_handler); // TODO
lv_btn_set_style(btn1, LV_BTN_STATE_REL, &btn1_rel_style);
lv_btn_set_style(btn1, LV_BTN_STATE_PR, &btn1_pr_style);
lv_obj_set_size(btn1, 160, 70);
lv_obj_align(btn1, NULL, LV_ALIGN_IN_TOP_LEFT, 260, 140);

lv_style_copy(&btn1_label_style, &lv_style_plain);
btn1_label_style.text.color = lv_color_hex(0xFFFFFF);
btn1_label_style.text.font = &supermarket_60;
btn1_label = lv_label_create(btn1, NULL);
lv_label_set_style(btn1_label, LV_LABEL_STYLE_MAIN, &btn1_label_style);
lv_label_set_text(btn1_label, "1");

lv_obj_set_hidden(btn1, false);
/* ====== END of btn1 ====== */

/* ========== btn2 ========== */
static lv_style_t btn2_rel_style;
static lv_style_t btn2_pr_style;
lv_obj_t* btn2;
static lv_style_t btn2_label_style;
lv_obj_t* btn2_label;

lv_style_copy(&btn2_rel_style, &lv_style_plain);
btn2_rel_style.body.main_color = lv_color_hex(0x76A2D0);
btn2_rel_style.body.grad_color = lv_color_hex(0x193A5D);
btn2_rel_style.body.radius = 6;
btn2_rel_style.body.border.color = lv_color_hex(0x0B1928);
btn2_rel_style.body.border.width = 2;

lv_style_copy(&btn2_pr_style, &lv_style_plain);
btn2_pr_style.body.main_color = lv_color_hex(0x336294);
btn2_pr_style.body.grad_color = lv_color_hex(0x10263C);
btn2_pr_style.body.radius = 6;
btn2_pr_style.body.border.color = lv_color_hex(0x0B1928);
btn2_pr_style.body.border.width = 2;

btn2 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn2, event_handler); // TODO
lv_btn_set_style(btn2, LV_BTN_STATE_REL, &btn2_rel_style);
lv_btn_set_style(btn2, LV_BTN_STATE_PR, &btn2_pr_style);
lv_obj_set_size(btn2, 160, 70);
lv_obj_align(btn2, NULL, LV_ALIGN_IN_TOP_LEFT, 440, 140);

lv_style_copy(&btn2_label_style, &lv_style_plain);
btn2_label_style.text.color = lv_color_hex(0xFFFFFF);
btn2_label_style.text.font = &supermarket_60;
btn2_label = lv_label_create(btn2, NULL);
lv_label_set_style(btn2_label, LV_LABEL_STYLE_MAIN, &btn2_label_style);
lv_label_set_text(btn2_label, "2");

lv_obj_set_hidden(btn2, false);
/* ====== END of btn2 ====== */

/* ========== btn3 ========== */
static lv_style_t btn3_rel_style;
static lv_style_t btn3_pr_style;
lv_obj_t* btn3;
static lv_style_t btn3_label_style;
lv_obj_t* btn3_label;

lv_style_copy(&btn3_rel_style, &lv_style_plain);
btn3_rel_style.body.main_color = lv_color_hex(0x76A2D0);
btn3_rel_style.body.grad_color = lv_color_hex(0x193A5D);
btn3_rel_style.body.radius = 6;
btn3_rel_style.body.border.color = lv_color_hex(0x0B1928);
btn3_rel_style.body.border.width = 2;

lv_style_copy(&btn3_pr_style, &lv_style_plain);
btn3_pr_style.body.main_color = lv_color_hex(0x336294);
btn3_pr_style.body.grad_color = lv_color_hex(0x10263C);
btn3_pr_style.body.radius = 6;
btn3_pr_style.body.border.color = lv_color_hex(0x0B1928);
btn3_pr_style.body.border.width = 2;

btn3 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn3, event_handler); // TODO
lv_btn_set_style(btn3, LV_BTN_STATE_REL, &btn3_rel_style);
lv_btn_set_style(btn3, LV_BTN_STATE_PR, &btn3_pr_style);
lv_obj_set_size(btn3, 160, 70);
lv_obj_align(btn3, NULL, LV_ALIGN_IN_TOP_LEFT, 620, 140);

lv_style_copy(&btn3_label_style, &lv_style_plain);
btn3_label_style.text.color = lv_color_hex(0xFFFFFF);
btn3_label_style.text.font = &supermarket_60;
btn3_label = lv_label_create(btn3, NULL);
lv_label_set_style(btn3_label, LV_LABEL_STYLE_MAIN, &btn3_label_style);
lv_label_set_text(btn3_label, "3");

lv_obj_set_hidden(btn3, false);
/* ====== END of btn3 ====== */

/* ========== btn4 ========== */
static lv_style_t btn4_rel_style;
static lv_style_t btn4_pr_style;
lv_obj_t* btn4;
static lv_style_t btn4_label_style;
lv_obj_t* btn4_label;

lv_style_copy(&btn4_rel_style, &lv_style_plain);
btn4_rel_style.body.main_color = lv_color_hex(0x76A2D0);
btn4_rel_style.body.grad_color = lv_color_hex(0x193A5D);
btn4_rel_style.body.radius = 6;
btn4_rel_style.body.border.color = lv_color_hex(0x0B1928);
btn4_rel_style.body.border.width = 2;

lv_style_copy(&btn4_pr_style, &lv_style_plain);
btn4_pr_style.body.main_color = lv_color_hex(0x336294);
btn4_pr_style.body.grad_color = lv_color_hex(0x10263C);
btn4_pr_style.body.radius = 6;
btn4_pr_style.body.border.color = lv_color_hex(0x0B1928);
btn4_pr_style.body.border.width = 2;

btn4 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn4, event_handler); // TODO
lv_btn_set_style(btn4, LV_BTN_STATE_REL, &btn4_rel_style);
lv_btn_set_style(btn4, LV_BTN_STATE_PR, &btn4_pr_style);
lv_obj_set_size(btn4, 160, 70);
lv_obj_align(btn4, NULL, LV_ALIGN_IN_TOP_LEFT, 260, 220);

lv_style_copy(&btn4_label_style, &lv_style_plain);
btn4_label_style.text.color = lv_color_hex(0xFFFFFF);
btn4_label_style.text.font = &supermarket_60;
btn4_label = lv_label_create(btn4, NULL);
lv_label_set_style(btn4_label, LV_LABEL_STYLE_MAIN, &btn4_label_style);
lv_label_set_text(btn4_label, "4");

lv_obj_set_hidden(btn4, false);
/* ====== END of btn4 ====== */

/* ========== btn5 ========== */
static lv_style_t btn5_rel_style;
static lv_style_t btn5_pr_style;
lv_obj_t* btn5;
static lv_style_t btn5_label_style;
lv_obj_t* btn5_label;

lv_style_copy(&btn5_rel_style, &lv_style_plain);
btn5_rel_style.body.main_color = lv_color_hex(0x76A2D0);
btn5_rel_style.body.grad_color = lv_color_hex(0x193A5D);
btn5_rel_style.body.radius = 6;
btn5_rel_style.body.border.color = lv_color_hex(0x0B1928);
btn5_rel_style.body.border.width = 2;

lv_style_copy(&btn5_pr_style, &lv_style_plain);
btn5_pr_style.body.main_color = lv_color_hex(0x336294);
btn5_pr_style.body.grad_color = lv_color_hex(0x10263C);
btn5_pr_style.body.radius = 6;
btn5_pr_style.body.border.color = lv_color_hex(0x0B1928);
btn5_pr_style.body.border.width = 2;

btn5 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn5, event_handler); // TODO
lv_btn_set_style(btn5, LV_BTN_STATE_REL, &btn5_rel_style);
lv_btn_set_style(btn5, LV_BTN_STATE_PR, &btn5_pr_style);
lv_obj_set_size(btn5, 160, 70);
lv_obj_align(btn5, NULL, LV_ALIGN_IN_TOP_LEFT, 440, 220);

lv_style_copy(&btn5_label_style, &lv_style_plain);
btn5_label_style.text.color = lv_color_hex(0xFFFFFF);
btn5_label_style.text.font = &supermarket_60;
btn5_label = lv_label_create(btn5, NULL);
lv_label_set_style(btn5_label, LV_LABEL_STYLE_MAIN, &btn5_label_style);
lv_label_set_text(btn5_label, "5");

lv_obj_set_hidden(btn5, false);
/* ====== END of btn5 ====== */

/* ========== btn6 ========== */
static lv_style_t btn6_rel_style;
static lv_style_t btn6_pr_style;
lv_obj_t* btn6;
static lv_style_t btn6_label_style;
lv_obj_t* btn6_label;

lv_style_copy(&btn6_rel_style, &lv_style_plain);
btn6_rel_style.body.main_color = lv_color_hex(0x76A2D0);
btn6_rel_style.body.grad_color = lv_color_hex(0x193A5D);
btn6_rel_style.body.radius = 6;
btn6_rel_style.body.border.color = lv_color_hex(0x0B1928);
btn6_rel_style.body.border.width = 2;

lv_style_copy(&btn6_pr_style, &lv_style_plain);
btn6_pr_style.body.main_color = lv_color_hex(0x336294);
btn6_pr_style.body.grad_color = lv_color_hex(0x10263C);
btn6_pr_style.body.radius = 6;
btn6_pr_style.body.border.color = lv_color_hex(0x0B1928);
btn6_pr_style.body.border.width = 2;

btn6 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn6, event_handler); // TODO
lv_btn_set_style(btn6, LV_BTN_STATE_REL, &btn6_rel_style);
lv_btn_set_style(btn6, LV_BTN_STATE_PR, &btn6_pr_style);
lv_obj_set_size(btn6, 160, 70);
lv_obj_align(btn6, NULL, LV_ALIGN_IN_TOP_LEFT, 620, 220);

lv_style_copy(&btn6_label_style, &lv_style_plain);
btn6_label_style.text.color = lv_color_hex(0xFFFFFF);
btn6_label_style.text.font = &supermarket_60;
btn6_label = lv_label_create(btn6, NULL);
lv_label_set_style(btn6_label, LV_LABEL_STYLE_MAIN, &btn6_label_style);
lv_label_set_text(btn6_label, "6");

lv_obj_set_hidden(btn6, false);
/* ====== END of btn6 ====== */

/* ========== btn7 ========== */
static lv_style_t btn7_rel_style;
static lv_style_t btn7_pr_style;
lv_obj_t* btn7;
static lv_style_t btn7_label_style;
lv_obj_t* btn7_label;

lv_style_copy(&btn7_rel_style, &lv_style_plain);
btn7_rel_style.body.main_color = lv_color_hex(0x76A2D0);
btn7_rel_style.body.grad_color = lv_color_hex(0x193A5D);
btn7_rel_style.body.radius = 6;
btn7_rel_style.body.border.color = lv_color_hex(0x0B1928);
btn7_rel_style.body.border.width = 2;

lv_style_copy(&btn7_pr_style, &lv_style_plain);
btn7_pr_style.body.main_color = lv_color_hex(0x336294);
btn7_pr_style.body.grad_color = lv_color_hex(0x10263C);
btn7_pr_style.body.radius = 6;
btn7_pr_style.body.border.color = lv_color_hex(0x0B1928);
btn7_pr_style.body.border.width = 2;

btn7 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn7, event_handler); // TODO
lv_btn_set_style(btn7, LV_BTN_STATE_REL, &btn7_rel_style);
lv_btn_set_style(btn7, LV_BTN_STATE_PR, &btn7_pr_style);
lv_obj_set_size(btn7, 160, 70);
lv_obj_align(btn7, NULL, LV_ALIGN_IN_TOP_LEFT, 260, 300);

lv_style_copy(&btn7_label_style, &lv_style_plain);
btn7_label_style.text.color = lv_color_hex(0xFFFFFF);
btn7_label_style.text.font = &supermarket_60;
btn7_label = lv_label_create(btn7, NULL);
lv_label_set_style(btn7_label, LV_LABEL_STYLE_MAIN, &btn7_label_style);
lv_label_set_text(btn7_label, "7");

lv_obj_set_hidden(btn7, false);
/* ====== END of btn7 ====== */

/* ========== btn8 ========== */
static lv_style_t btn8_rel_style;
static lv_style_t btn8_pr_style;
lv_obj_t* btn8;
static lv_style_t btn8_label_style;
lv_obj_t* btn8_label;

lv_style_copy(&btn8_rel_style, &lv_style_plain);
btn8_rel_style.body.main_color = lv_color_hex(0x76A2D0);
btn8_rel_style.body.grad_color = lv_color_hex(0x193A5D);
btn8_rel_style.body.radius = 6;
btn8_rel_style.body.border.color = lv_color_hex(0x0B1928);
btn8_rel_style.body.border.width = 2;

lv_style_copy(&btn8_pr_style, &lv_style_plain);
btn8_pr_style.body.main_color = lv_color_hex(0x336294);
btn8_pr_style.body.grad_color = lv_color_hex(0x10263C);
btn8_pr_style.body.radius = 6;
btn8_pr_style.body.border.color = lv_color_hex(0x0B1928);
btn8_pr_style.body.border.width = 2;

btn8 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn8, event_handler); // TODO
lv_btn_set_style(btn8, LV_BTN_STATE_REL, &btn8_rel_style);
lv_btn_set_style(btn8, LV_BTN_STATE_PR, &btn8_pr_style);
lv_obj_set_size(btn8, 160, 70);
lv_obj_align(btn8, NULL, LV_ALIGN_IN_TOP_LEFT, 440, 300);

lv_style_copy(&btn8_label_style, &lv_style_plain);
btn8_label_style.text.color = lv_color_hex(0xFFFFFF);
btn8_label_style.text.font = &supermarket_60;
btn8_label = lv_label_create(btn8, NULL);
lv_label_set_style(btn8_label, LV_LABEL_STYLE_MAIN, &btn8_label_style);
lv_label_set_text(btn8_label, "8");

lv_obj_set_hidden(btn8, false);
/* ====== END of btn8 ====== */

/* ========== btn9 ========== */
static lv_style_t btn9_rel_style;
static lv_style_t btn9_pr_style;
lv_obj_t* btn9;
static lv_style_t btn9_label_style;
lv_obj_t* btn9_label;

lv_style_copy(&btn9_rel_style, &lv_style_plain);
btn9_rel_style.body.main_color = lv_color_hex(0x76A2D0);
btn9_rel_style.body.grad_color = lv_color_hex(0x193A5D);
btn9_rel_style.body.radius = 6;
btn9_rel_style.body.border.color = lv_color_hex(0x0B1928);
btn9_rel_style.body.border.width = 2;

lv_style_copy(&btn9_pr_style, &lv_style_plain);
btn9_pr_style.body.main_color = lv_color_hex(0x336294);
btn9_pr_style.body.grad_color = lv_color_hex(0x10263C);
btn9_pr_style.body.radius = 6;
btn9_pr_style.body.border.color = lv_color_hex(0x0B1928);
btn9_pr_style.body.border.width = 2;

btn9 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn9, event_handler); // TODO
lv_btn_set_style(btn9, LV_BTN_STATE_REL, &btn9_rel_style);
lv_btn_set_style(btn9, LV_BTN_STATE_PR, &btn9_pr_style);
lv_obj_set_size(btn9, 160, 70);
lv_obj_align(btn9, NULL, LV_ALIGN_IN_TOP_LEFT, 620, 300);

lv_style_copy(&btn9_label_style, &lv_style_plain);
btn9_label_style.text.color = lv_color_hex(0xFFFFFF);
btn9_label_style.text.font = &supermarket_60;
btn9_label = lv_label_create(btn9, NULL);
lv_label_set_style(btn9_label, LV_LABEL_STYLE_MAIN, &btn9_label_style);
lv_label_set_text(btn9_label, "9");

lv_obj_set_hidden(btn9, false);
/* ====== END of btn9 ====== */

/* ========== btnOK ========== */
static lv_style_t btnOK_rel_style;
static lv_style_t btnOK_pr_style;
lv_obj_t* btnOK;
static lv_style_t btnOK_label_style;
lv_obj_t* btnOK_label;

lv_style_copy(&btnOK_rel_style, &lv_style_plain);
btnOK_rel_style.body.main_color = lv_color_hex(0x2BD01F);
btnOK_rel_style.body.grad_color = lv_color_hex(0x1D5D13);
btnOK_rel_style.body.radius = 6;
btnOK_rel_style.body.border.color = lv_color_hex(0xFFFFFF);
btnOK_rel_style.body.border.width = 4;

lv_style_copy(&btnOK_pr_style, &lv_style_plain);
btnOK_pr_style.body.main_color = lv_color_hex(0x1D5D13);
btnOK_pr_style.body.grad_color = lv_color_hex(0x2BD01F);
btnOK_pr_style.body.radius = 6;
btnOK_pr_style.body.border.color = lv_color_hex(0xFFFFFF);
btnOK_pr_style.body.border.width = 4;

btnOK = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btnOK, event_handler); // TODO
lv_btn_set_style(btnOK, LV_BTN_STATE_REL, &btnOK_rel_style);
lv_btn_set_style(btnOK, LV_BTN_STATE_PR, &btnOK_pr_style);
lv_obj_set_size(btnOK, 180, 150);
lv_obj_align(btnOK, NULL, LV_ALIGN_IN_TOP_LEFT, 30, 140);

lv_style_copy(&btnOK_label_style, &lv_style_plain);
btnOK_label_style.text.color = lv_color_hex(0xFFFFFF);
btnOK_label_style.text.font = &supermarket_60;
btnOK_label = lv_label_create(btnOK, NULL);
lv_label_set_style(btnOK_label, LV_LABEL_STYLE_MAIN, &btnOK_label_style);
lv_label_set_text(btnOK_label, "ตกลง");

lv_obj_set_hidden(btnOK, false);
/* ====== END of btnOK ====== */

/* ========== btn11 ========== */
static lv_style_t btn11_rel_style;
static lv_style_t btn11_pr_style;
lv_obj_t* btn11;
static lv_style_t btn11_label_style;
lv_obj_t* btn11_label;

lv_style_copy(&btn11_rel_style, &lv_style_plain);
btn11_rel_style.body.main_color = lv_color_hex(0xD00000);
btn11_rel_style.body.grad_color = lv_color_hex(0x5D0000);
btn11_rel_style.body.radius = 6;
btn11_rel_style.body.border.color = lv_color_hex(0xFFFFFF);
btn11_rel_style.body.border.width = 4;

lv_style_copy(&btn11_pr_style, &lv_style_plain);
btn11_pr_style.body.main_color = lv_color_hex(0x5D0000);
btn11_pr_style.body.grad_color = lv_color_hex(0xD00000);
btn11_pr_style.body.radius = 6;
btn11_pr_style.body.border.color = lv_color_hex(0xFFFFFF);
btn11_pr_style.body.border.width = 4;

btn11 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn11, event_handler); // TODO
lv_btn_set_style(btn11, LV_BTN_STATE_REL, &btn11_rel_style);
lv_btn_set_style(btn11, LV_BTN_STATE_PR, &btn11_pr_style);
lv_obj_set_size(btn11, 180, 150);
lv_obj_align(btn11, NULL, LV_ALIGN_IN_TOP_LEFT, 30, 300);

lv_style_copy(&btn11_label_style, &lv_style_plain);
btn11_label_style.text.color = lv_color_hex(0xFFFFFF);
btn11_label_style.text.font = &supermarket_60;
btn11_label = lv_label_create(btn11, NULL);
lv_label_set_style(btn11_label, LV_LABEL_STYLE_MAIN, &btn11_label_style);
lv_label_set_text(btn11_label, "ยกเลิก");

lv_obj_set_hidden(btn11, false);
/* ====== END of btn11 ====== */


}
