#!/usr/bin/env seed
/*global imports, Seed*/
/*jslint stupid: true*/

var Gtk = imports.gi.Gtk;
var GObject = imports.gi.GObject;
var Soup = imports.gi.Soup;
var WebKit = imports.gi.WebKit;

var API = "http://rudloff.strasweb.fr/admin/api.php";

Gtk.init(Seed.argv);


var window = new Gtk.Window({"title": "Bobcat"});
window.signal.hide.connect(Gtk.main_quit);
var view = new Gtk.TreeView();
var columns = ["Article", "ID", "Date"];
var GObjects = [];
var i;
for (i = 0; i < columns.length; i += 1) {
	var column = new Gtk.TreeViewColumn();
	column.title = columns[i];
	var renderer = new Gtk.CellRendererText();
	column.pack_start(renderer);
	column.add_attribute(renderer, "text", i);
	view.append_column(column);
	GObjects.push(GObject.TYPE_STRING);
}

var list = new Gtk.ListStore();
list.set_column_types(columns.length, GObjects);

var session = new Soup.SessionSync();
var uri = new Soup.URI.c_new(API);
var request = new Soup.Message({method: "GET", uri: uri});
var status = session.send_message(request);
var articles = JSON.parse(request.response_body.data);

var openArticle = function (treeview, path, view_column) {
    "use strict";
    var uri, request, status, article, dialog, area, box, box2, textarea;
    uri = new Soup.URI.c_new(API + "?article=" + articles[path.to_string()].id);
    request = new Soup.Message({method: "GET", uri: uri});
    status = session.send_message(request);
    article = JSON.parse(request.response_body.data);
    dialog = new Gtk.Dialog({"title": "Bobcat - " + article.title});
    area = dialog.get_content_area();
    box = new Gtk.HBox();
	area.add(box);
	box.pack_start(new Gtk.Label({label : "Title:"}));
	box.pack_start(new Gtk.Entry({text: article.title}));
    box2 = new Gtk.VBox();
	area.add(box2);
	box2.pack_start(new Gtk.Label({label : "Content:"}));
    textarea = new WebKit.WebView();
	textarea.load_string(article.content);
	box2.pack_start(textarea);
	dialog.add_button(Gtk.STOCK_OK, 1);
	dialog.resize(800, 600);
	textarea.signal.load_finished.connect(function () {dialog.show_all(); textarea.set_editable(true); });
	textarea.signal.navigation_requested.connect(function () {return WebKit.NavigationResponse.IGNORE; });
};

view.signal.row_activated.connect(openArticle);


var r = {};
for (i = 0; i < articles.length; i += 1) {
	list.append(r);
	list.set_value(r.iter, 0, articles[i].title);
	list.set_value(r.iter, 1, articles[i].id);
	list.set_value(r.iter, 2, articles[i].date);
}

view.set_model(list);
window.add(view);

window.show_all();
window.resize(300, 300);

Gtk.main();
