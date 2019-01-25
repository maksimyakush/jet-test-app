import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activityTypes } from "models/activityTypes";
import FormPopup from "./form-popup";

export default class ActivitiesView extends JetView {
	config() {
		const addActivityBtn = {
			view: "toolbar",
			css: "webix_dark",
			label: "Activities",
			cols: [
				{ view: "label", label: "Activities" },
				{
					view: "button",
					value: "Add",
					inputWidth: 100,
					align: "right",
					click: () => {
						this._jetPopup.showWindow();
					}
				}
			]
		};
		const dataTable = {
			view: "datatable",
			localId: "datatable",
			select: true,
			scroll: "y",
			onClick: {
				"wxi-trash": (e, id) => {
					webix.confirm({
						text:
							"Are you sure you want to remove this activity? Deleting cannot be undone!",
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
					header: ["Activity", { content: "selectFilter" }],
					sort: "string",
					collection: activityTypes
				},
				{
					id: "DueDate",
					header: ["DueDate", { content: "dateRangeFilter" }],
					sort: "date",
					fillspace: true,
					format: webix.Date.dateToStr("%d/%m/%Y %H:%i")
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
		return { rows: [addActivityBtn, dataTable] };
	}

	init() {
		this.$$("datatable").sync(activities);
		this._jetPopup = this.ui(FormPopup);
	}
}
