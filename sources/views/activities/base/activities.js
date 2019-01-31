import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activityTypes } from "models/activityTypes";
import FormPopup from "views/form-popup";

export default class ActivitiesView extends JetView {
	constructor(app, name) {
		super(app, name);
	}

	config() {
		const addActivityBtn = {
			view: "toolbar",
			localId: "activities:toolbar",
			borderless: true,
			cols: [
				{ localId: "activities:label", view: "label", label: "Activities" },
				{
					view: "button",
					value: "Add",
					inputWidth: 150,
					align: "right",
					click: () => this._jetPopup.showWindow()
				}
			]
		};

		const dataTable = {
			view: "datatable",
			localId: "datatable",
			borderless: true,
			select: true,
			scroll: "y",
			onClick: {
				"wxi-trash": (e, id) => {
					webix.confirm({
						text:
							"Are you sure you want to remove this activity? Removing cannot be undone!",
						callback(result) {
							if (result) activities.remove(id);
						}
					});
					return false;
				},
				"wxi-pencil": (e, id) => {
					const activity = activities.getItem(id);
					this._jetPopup.showWindow(activity);
					return false;
				}
			},

			columns: [
				{
					id: "State",
					header: "",
					checkValue: "Close",
					uncheckValue: "Open",
					template: "{common.checkbox()}",
					width: 60
				},
				{
					id: "TypeID",
					header: [
						"Activity",
						{
							content: "selectFilter"
						}
					],
					sort: "string",
					collection: activityTypes
				},
				{
					id: "DueDate",
					header: ["DueDate", { content: "dateRangeFilter" }],
					sort: "date",
					fillspace: true,
					format: webix.Date.dateToStr("%d %M %Y %H:%i")
				},

				{
					id: "Details",
					header: ["Details", { content: "textFilter" }],
					sort: "string",
					fillspace: true
				},
				{
					id: "ContactID",
					header: ["Contact", { content: "selectFilter" }],
					sort: "string",
					fillspace: true,
					collection: contacts
				},
				{
					template: "{common.editIcon()}",
					width: 60
				},
				{
					template: "{common.trashIcon()}",
					width: 60
				}
			]
		};
		if (this.getParentView().getRoot().config.localId == "contact-info") {
			return {
				rows: [dataTable, addActivityBtn]
			};
		}
		return {
			rows: [addActivityBtn, dataTable]
		};
	}

	init() {
		activities.filter();
		this.$$("datatable").sync(activities);
		this._jetPopup = this.ui(FormPopup);
	}
}
