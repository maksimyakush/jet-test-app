import { JetView } from "webix-jet";
import icons from "data/icons.js";

export default class SettingsTableView extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this.data = data;
	}
	config() {
		const _ = this.app.getService("locale")._;

		const commonDatatable = {
			view: "datatable",
			localId: "commonDatatable",
			select: true,
			scroll: "y",
			editable: true,
			columns: [
				{
					id: "Value",
					header: _("Value"),
					editor: "text",
					fillspace: true
				},
				{
					id: "Icon",
					template: "<i class='fa fa-#Icon#'></i> #Icon#",
					data: icons,
					width: 200,
					editor: "richselect",
					options: icons,
					header: _("Icon")
				},
				{
					template: "{common.trashIcon()}",
					width: 65
				}
			],
			onClick: {
				"wxi-trash": (e, id) => {
					this.data.remove(id);
					return false;
				}
			}
		};

		const commonForm = {
			view: "form",
			localId: "commonForm",
			elements: [
				{
					view: "text",
					name: "Value"
				},
				{
					view: "richselect",
					options: {
						body: {
							data: icons,
							width: 300,
							template: "<i class='fa fa-#value#'></i> #value#"
						}
					},
					name: "Icon"
				},
				{
					view: "button",
					value: _("Add"),
					click() {
						this.$scope.data.add(this.getFormView().getValues());
					}
				}
			]
		};

		return {
			rows: [commonDatatable, commonForm]
		};
	}

	init() {
		this.$$("commonDatatable").sync(this.data);
	}
}
