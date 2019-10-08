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
lv_obj_set_size(btn1, 120, 50);
lv_obj_align(btn1, NULL, LV_ALIGN_CENTER, 0, -40);

static lv_style_t btn1_label_style;
lv_style_copy(&btn1_label_style, &lv_style_plain);
btn1_label_style.text.color = lv_color_hex(0xFFFFFF);
lv_obj_t* btn1_label = lv_label_create(btn1, NULL);
lv_label_set_style(btn1_label, LV_LABEL_STYLE_MAIN, &btn1_label_style);
lv_label_set_text(btn1_label, "Button1");

static lv_style_t btn2_rel_style;
lv_style_copy(&btn2_rel_style, &lv_style_plain);
btn2_rel_style.body.main_color = lv_color_hex(0x76A2D0);
btn2_rel_style.body.grad_color = lv_color_hex(0x193A5D);
btn2_rel_style.body.radius = 6;
btn2_rel_style.body.border.color = lv_color_hex(0x0B1928);
btn2_rel_style.body.border.width = 2;

static lv_style_t btn2_pr_style;
lv_style_copy(&btn2_pr_style, &lv_style_plain);
btn2_pr_style.body.main_color = lv_color_hex(0x336294);
btn2_pr_style.body.grad_color = lv_color_hex(0x10263C);
btn2_pr_style.body.radius = 6;
btn2_pr_style.body.border.color = lv_color_hex(0x0B1928);
btn2_pr_style.body.border.width = 2;

lv_obj_t* btn2 = lv_btn_create(lv_scr_act(), NULL);
// lv_obj_set_event_cb(btn2, event_handler); // TODO
lv_btn_set_style(btn2, LV_BTN_STATE_REL, &btn2_rel_style);
lv_btn_set_style(btn2, LV_BTN_STATE_PR, &btn2_pr_style);
lv_obj_set_size(btn2, 130, 50);
lv_obj_align(btn2, NULL, LV_ALIGN_CENTER, 0, 40);

static lv_style_t btn2_label_style;
lv_style_copy(&btn2_label_style, &lv_style_plain);
btn2_label_style.text.color = lv_color_hex(0xFFFFFF);
lv_obj_t* btn2_label = lv_label_create(btn2, NULL);
lv_label_set_style(btn2_label, LV_LABEL_STYLE_MAIN, &btn2_label_style);
lv_label_set_text(btn2_label, "Button2");

static lv_style_t led1_style;
lv_style_copy(&led1_style, &lv_style_plain);
led1_style.body.main_color = lv_color_hex(0xB00F48);
led1_style.body.grad_color = lv_color_hex(0x500702);
led1_style.body.radius = LV_RADIUS_CIRCLE;
led1_style.body.border.color = lv_color_hex(0xFA0F00);
led1_style.body.border.width = 3;
led1_style.body.border.opa = 255;
led1_style.body.shadow.color = lv_color_hex(0xB00F48);
led1_style.body.shadow.width = 2;

lv_obj_t* led1 = lv_led_create(lv_scr_act(), NULL);
lv_obj_set_style(led1, &led1_style);
lv_obj_set_size(led1, 30, 30);
lv_obj_align(led1, NULL, LV_ALIGN_CENTER, -100, -40);
lv_led_set_bright(led1, 255);


static lv_style_t txt1_style;
lv_style_copy(&txt1_style, &lv_style_plain);
txt1_style.text.color = lv_color_hex(0x000000);

lv_obj_t* txt1 = lv_label_create(lv_scr_act(), NULL);
lv_label_set_style(txt1, LV_LABEL_STYLE_MAIN, &txt1_style);lv_label_set_long_mode(txt1, LV_LABEL_LONG_EXPAND);
lv_label_set_align(txt1, LV_LABEL_ALIGN_LEFT);
lv_label_set_text(txt1, "Test !");
lv_obj_set_size(txt1, 0, 0);
lv_obj_align(txt1, NULL, LV_ALIGN_CENTER, 0, 0);


}
