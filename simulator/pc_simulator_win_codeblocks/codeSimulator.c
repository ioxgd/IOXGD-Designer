#include "lvgl/lvgl.h"
void codeSimulator() {
static lv_style_t btn1_rel_style;
lv_style_copy(&btn1_rel_style, &lv_style_plain);
btn1_rel_style.body.main_color = lv_color_hex(0x76A2D0);
btn1_rel_style.body.grad_color = lv_color_hex(0x193A5D);
btn1_rel_style.body.radius = 6;
btn1_rel_style.body.border.color = lv_color_hex(0x0B1928);
btn1_rel_style.body.border.width = 2;

static lv_style_t btn1_pr_style;
lv_style_copy(&btn1_pr_style, &lv_style_plain);
btn1_pr_style.body.main_color = lv_color_hex(0x336294);
btn1_pr_style.body.grad_color = lv_color_hex(0x10263C);
btn1_pr_style.body.radius = 6;
btn1_pr_style.body.border.color = lv_color_hex(0x0B1928);
btn1_pr_style.body.border.width = 2;

lv_obj_t* btn1 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn1, event_handler); // TODO
lv_btn_set_style(btn1, LV_BTN_STATE_REL, &btn1_rel_style);
lv_btn_set_style(btn1, LV_BTN_STATE_PR, &btn1_pr_style);
lv_obj_set_size(btn1, 80, 50);
lv_obj_align(btn1, NULL, LV_ALIGN_IN_BOTTOM_RIGHT, 0, 0);

static lv_style_t btn1_label_style;
lv_style_copy(&btn1_label_style, &lv_style_plain);
btn1_label_style.text.color = lv_color_hex(0xFFFFFF);
lv_obj_t* btn1_label = lv_label_create(btn1, NULL);
lv_label_set_style(btn1_label, LV_LABEL_STYLE_MAIN, &btn1_label_style);
lv_label_set_text(btn1_label, "Button");


}
