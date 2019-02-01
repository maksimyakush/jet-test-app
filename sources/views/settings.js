import { JetView } from "webix-jet";

export default class SettingsView extends JetView {
	toggleLanguage() {
		const langs = this.app.getService("locale");
		const value = this.getRoot()
			.queryView({ name: "lang" })
			.getValue();
		langs.setLang(value);
	}

	config() {
		const _ = this.app.getService("locale")._;

		const headerData = {
			template: _("Settings"),
			type: "header",
			css: "webix_header app_header"
		};
		const lang = this.app.getService("locale").getLang();
		const segmentedData = {
			view: "segmented",
			name: "lang",
			options: [
				{ id: "en", value: _("English") },
				{ id: "ru", value: _("Russian") }
			],
			click: () => this.toggleLanguage(),
			value: lang
		};

		return {
			css: "webix_shadow_medium",
			rows: [headerData, segmentedData]
		};
	}
}
