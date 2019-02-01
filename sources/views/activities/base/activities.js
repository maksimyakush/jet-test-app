import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activityTypes } from "models/activityTypes";
import FormPopup from "views/form-popup";

export default class ActivitiesView extends JetView {
	constructor(app, name) {
		super(app, name);
		this._ = this.app.getService("locale")._;
	}

	config() {
		const activitiesSegmentedFilter = {
			view: "segmented",
			localId: "activites:segmentedFilter",
			on: {
				onChange: () => {
					this.$$("datatable").filterByAll();
				}
			},
			options: [
				{
					value: this._("All")
				},
				{
					value: this._("Completed")
				},
				{
					value: this._("Overdue")
				},
				{
					value: this._("Today")
				},
				{
					value: this._("Tomorrow")
				},
				{
					value: this._("This Week")
				},
				{
					value: this._("This Month")
				}
			]
		};
		const addActivityBtn = {
			view: "toolbar",
			localId: "activities:toolbar",
			borderless: true,
			cols: [
				{
					localId: "activities:label",
					view: "label",
					label: this._("Activities")
				},
				{
					view: "button",
					value: this._("Add"),
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
						text: this._(
							"Are you sure you want to remove this activity? Removing cannot be undone!"
						),
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
					header: [this._("Activity"), { content: "selectFilter" }],
					sort: "string",
					collection: activityTypes,
					width: 200
				},
				{
					id: "DueDate",

					header: [this._("DueDate"), { content: "dateRangeFilter" }],
					sort: "date",
					fillspace: true,
					format: webix.Date.dateToStr("%d %M %Y %H:%i")
				},

				{
					id: "Details",
					header: [this._("Details"), { content: "textFilter" }],
					sort: "string",
					fillspace: true
				},
				{
					id: "ContactID",
					header: [this._("Contact"), { content: "selectFilter" }],
					sort: "string",
					fillspace: true,
					collection: contacts
				},
				{
					template: "{common.editIcon()}",
					width: 60
				},
				{
					id: "removeActivity&&registerFilter",
					header: "",
					template: "{common.trashIcon()}",
					width: 60
				}
			]
		};
		if (this.getParentView().getRoot().config.localId == "contact-info") {
			return {
				rows: [activitiesSegmentedFilter, dataTable, addActivityBtn]
			};
		}
		return {
			rows: [activitiesSegmentedFilter, addActivityBtn, dataTable]
		};
	}

	activitiesRagisterFilter() {
		return this.$$("datatable").registerFilter(
			this.$$("activites:segmentedFilter"),
			{
				columnId: "removeActivity&&registerFilter",
				compare: (value, filter, item) => {
					const currentDate = new Date();
					const dayToString = webix.Date.dateToStr("%d");
					const weekToString = webix.Date.dateToStr("%W");
					const monthToString = webix.Date.dateToStr("%m");
					const yearToString = webix.Date.dateToStr("%y");

					if (filter == this._("All")) return item;
					if (filter == this._("Completed")) return item.State == "Close";
					if (filter == this._("Overdue"))
						return item.DueDate < currentDate && item.State == "Open";
					if (filter == this._("Today"))
						return (
							dayToString(item.DueDate) == dayToString(currentDate) &&
							monthToString(item.DueDate) == monthToString(currentDate) &&
							yearToString(item.DueDate) == yearToString(currentDate)
						);
					if (filter == this._("Tomorrow"))
						return dayToString(item.DueDate) == +dayToString(currentDate) + 1;
					if (filter == this._("This Week"))
						return weekToString(item.DueDate) == weekToString(currentDate);
					if (filter == this._("This Month"))
						return monthToString(item.DueDate) == monthToString(currentDate);
					else return;
				}
			},
			{
				getValue: node => node.getValue(),
				setValue: (node, value) => node.setValue(value)
			}
		);
	}

	activitiesAfterAddEvent() {
		this.on(activities, "onAfterAdd", () => {
			this.$$("datatable").filterByAll();
		});
	}
	activitiesAfterDeleteEvent() {
		this.on(activities, "onAfterDelete", () => {
			this.$$("datatable").filterByAll();
		});
	}
	activitiesDataUpdateEvent() {
		this.on(activities, "onDataUpdate", () => {
			this.$$("datatable").filterByAll();
		});
	}

	init() {
		activities.filter();
		this.$$("datatable").sync(activities);
		this.activitiesRagisterFilter();
		this.activitiesAfterDeleteEvent();
		this.activitiesAfterDeleteEvent();
		this.activitiesDataUpdateEvent();
		this._jetPopup = this.ui(FormPopup);
	}
}
