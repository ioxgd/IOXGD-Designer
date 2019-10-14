#include "lvgl/lvgl.h"
void codeSimulator() {
static lv_style_t style_screen;
lv_style_copy(&style_screen, &lv_style_plain);
style_screen.body.main_color = lv_color_hex(0xF1C40F);
style_screen.body.grad_color = lv_color_hex(0xF1C40F);
lv_obj_set_style(lv_scr_act(), &style_screen);

/* ========== img1 ========== */
lv_obj_t* img1 = lv_img_create(lv_scr_act(), NULL);
// lv_img_set_src(img1, "C:\Users\Max\Dropbox\ioxhop\300x-logo-website.png"); // TODO
lv_obj_align(img1, NULL, LV_ALIGN_IN_BOTTOM_MID, 0, -30);
/* ====== END of img1 ====== */

/* ========== chart1 ========== */
static lv_style_t chart1_style;
lv_style_copy(&chart1_style, &lv_style_plain);
chart1_style.body.main_color = lv_color_hex(0xFFFFFF);
chart1_style.body.grad_color = lv_color_hex(0xC0C0C0);
chart1_style.body.radius = 6;
chart1_style.body.border.color = lv_color_hex(0x404040);
chart1_style.body.border.width = 2;
chart1_style.line.color = lv_color_hex(0x202020);
chart1_style.line.width = 2;

lv_obj_t* chart1 = lv_chart_create(lv_scr_act(), NULL);
lv_chart_set_style(chart1, LV_CHART_STYLE_MAIN, &chart1_style);
lv_obj_set_size(chart1, 200, 150);
lv_obj_align(chart1, NULL, LV_ALIGN_IN_LEFT_MID, 70, 0);
lv_chart_set_type(chart1, LV_CHART_TYPE_POINT | LV_CHART_TYPE_LINE);
lv_chart_set_series_opa(chart1, LV_OPA_70);
lv_chart_set_series_width(chart1, 2);
lv_chart_set_div_line_count(chart1, 3, 5);
lv_chart_set_range(chart1, 0, 100);
/* ====== END of chart1 ====== */

/* ========== txt1 ========== */
static lv_style_t txt1_style;
lv_style_copy(&txt1_style, &lv_style_plain);
txt1_style.text.color = lv_color_hex(0xFFFFFF);

lv_obj_t* txt1 = lv_label_create(lv_scr_act(), NULL);
lv_label_set_style(txt1, LV_LABEL_STYLE_MAIN, &txt1_style);lv_label_set_long_mode(txt1, LV_LABEL_LONG_EXPAND);
lv_label_set_align(txt1, LV_LABEL_ALIGN_LEFT);
lv_label_set_text(txt1, "Light level");
lv_obj_set_size(txt1, 0, 0);
lv_obj_align(txt1, NULL, LV_ALIGN_IN_TOP_LEFT, 70, 140);
/* ====== END of txt1 ====== */

/* ========== led2 ========== */
static lv_style_t led2_style;
lv_style_copy(&led2_style, &lv_style_plain);
led2_style.body.main_color = lv_color_hex(0xB00F48);
led2_style.body.grad_color = lv_color_hex(0x500702);
led2_style.body.radius = LV_RADIUS_CIRCLE;
led2_style.body.border.color = lv_color_hex(0xFA0F00);
led2_style.body.border.width = 3;
led2_style.body.border.opa = 255;
led2_style.body.shadow.color = lv_color_hex(0xB00F48);
led2_style.body.shadow.width = 2;

lv_obj_t* led2 = lv_led_create(lv_scr_act(), NULL);
lv_obj_set_style(led2, &led2_style);
lv_obj_set_size(led2, 30, 30);
lv_obj_align(led2, NULL, LV_ALIGN_IN_TOP_MID, 0, 220);
lv_led_set_bright(led2, 255);
/* ====== END of led2 ====== */

/* ========== txt2 ========== */
static lv_style_t txt2_style;
lv_style_copy(&txt2_style, &lv_style_plain);
txt2_style.text.color = lv_color_hex(0x000000);

lv_obj_t* txt2 = lv_label_create(lv_scr_act(), NULL);
lv_label_set_style(txt2, LV_LABEL_STYLE_MAIN, &txt2_style);lv_label_set_long_mode(txt2, LV_LABEL_LONG_EXPAND);
lv_label_set_align(txt2, LV_LABEL_ALIGN_LEFT);
lv_label_set_text(txt2, "D0");
lv_obj_set_size(txt2, 0, 0);
lv_obj_align(txt2, NULL, LV_ALIGN_IN_TOP_MID, 0, 190);
/* ====== END of txt2 ====== */

/* ========== txt3 ========== */
static lv_style_t txt3_style;
lv_style_copy(&txt3_style, &lv_style_plain);
txt3_style.text.color = lv_color_hex(0x000000);

lv_obj_t* txt3 = lv_label_create(lv_scr_act(), NULL);
lv_label_set_style(txt3, LV_LABEL_STYLE_MAIN, &txt3_style);lv_label_set_long_mode(txt3, LV_LABEL_LONG_EXPAND);
lv_label_set_align(txt3, LV_LABEL_ALIGN_LEFT);
lv_label_set_text(txt3, "D2");
lv_obj_set_size(txt3, 0, 0);
lv_obj_align(txt3, NULL, LV_ALIGN_IN_TOP_MID, 80, 190);
/* ====== END of txt3 ====== */

/* ========== led3 ========== */
static lv_style_t led3_style;
lv_style_copy(&led3_style, &lv_style_plain);
led3_style.body.main_color = lv_color_hex(0xB00F48);
led3_style.body.grad_color = lv_color_hex(0x500702);
led3_style.body.radius = LV_RADIUS_CIRCLE;
led3_style.body.border.color = lv_color_hex(0xFA0F00);
led3_style.body.border.width = 3;
led3_style.body.border.opa = 255;
led3_style.body.shadow.color = lv_color_hex(0xB00F48);
led3_style.body.shadow.width = 2;

lv_obj_t* led3 = lv_led_create(lv_scr_act(), NULL);
lv_obj_set_style(led3, &led3_style);
lv_obj_set_size(led3, 30, 30);
lv_obj_align(led3, NULL, LV_ALIGN_IN_TOP_MID, 79, 220);
lv_led_set_bright(led3, 255);
/* ====== END of led3 ====== */


}
