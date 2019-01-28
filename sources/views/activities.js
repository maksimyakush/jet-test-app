import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activityTypes } from "models/activityTypes";
import FormPopup from "./form-popup";
import ActivityForm from "views/forms/activityform";

export default class ActivitiesView extends JetView {
	constructor(app, name) {
		super(app, name);
  }
  urlChange() {
    console.log('urlchange activities');

  }
	config() {
		const testCompare = (value, filter, obj) => {
			if (obj.ContactID != this.getParam("id", true) || !obj.ContactID) return false;
			console.log(value, filter, obj);
			return value == filter;
		};
		this.addActivityBtn = {
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
					click: () => {
						this._jetPopup.showWindow();
					}
				}
			]
		};
		this.dataTable = {
			view: "datatable",
			localId: "datatable",
			borderless: true,
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
      on: {
        onAfterRender: () => console.log('onafterrender')
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
							content: "selectFilter",

							// compare: testCompare
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
		return {
			id: "activities",
			rows: [this.addActivityBtn, this.dataTable]
		};
	}

	ready(view) {}

	init(view) {
    activities.filter();
    console.log('init activities')
		this.on(this.app, "activities:reconstruct", () => {
			view.define("rows", [this.dataTable, this.addActivityBtn]);
			view.reconstruct();
			this.$$("datatable").hideColumn("ContactID");
		});
		this.$$("datatable").sync(activities);
		this._jetPopup = this.ui(FormPopup);
		console.log("activitiesinit");
		this.on(this.app, "activities:sync&&filter", param => {
			console.log("sync");
			this.on(this.$$("datatable"), "onBeforeFilter", (id, value, config) => {
				console.log(value);
			});
			activities.waitData.then(() => {
        this.$$("datatable").sync(activities);
        // this.$$("datatable").filter();
        activities.filter(data => {
						return data.ContactID == param;
					});
				// });
			});
		});
	}
}
