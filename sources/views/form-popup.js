import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activityTypes } from "models/activityTypes";

export default class FormPopupView extends JetView {
	config() {
		const form = {
			view: "form",
			localId: "form",
			rules: {
				Details: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty,
				TypeID: webix.rules.isNotEmpty,
				Date: webix.rules.isNotEmpty,
				Time: webix.rules.isNotEmpty
			},
			elements: [
				{
					view: "textarea",
					label: "Details",
					name: "Details",
					invalidMessage: "Fill the details field!",
					required: true
				},
				{
					view: "richselect",
					label: "Contacts",
					options: contacts,
					name: "ContactID",
					invalidMessage: "Choose the contact, please!",
					required: true
				},
				{
					view: "richselect",
					label: "Activity",
					options: activityTypes,
					name: "TypeID",
					invalidMessage: "Choose the activity, please!",
					required: true
				},

				{
					view: "datepicker",
					label: "Date",
					name: "Date",
					format: "%d-%m-%Y",
					invalidMessage: "Choose date, please!",
					required: true
				},
				{
					view: "datepicker",
					label: "Time",
					name: "Time",
					type: "time",
					format: "%H:%i",
					invalidMessage: "Choose time, please!",
					required: true
				},
				{
					view: "checkbox",
					checkValue: "Close",
					uncheckValue: "Open",
					label: "Completed",
					name: "State"
				},
				{
					view: "button",
					localId: "addBtn",
					value: "Add(*save)",
					click() {
						if (!this.getFormView().validate()) return;
						const strDateFormat = webix.Date.dateToStr("%d-%m-%Y");
						const strTimeFormat = webix.Date.dateToStr("%H:%i");
						const { id, Date, Time } = this.getFormView().getValues();

						const DueDate = `${strDateFormat(Date)} ${strTimeFormat(Time)}`;
						console.log(DueDate);
						if (activities.exists(id)) {
							activities.updateItem(id, {
								...this.getFormView().getValues(),
								DueDate
							});
							console.log(activities.getItem(id));
						} else {
							activities.add({ ...this.getFormView().getValues(), DueDate });
						}
						this.getFormView().clear();
						this.getFormView().clearValidation();
						this.$scope.getRoot().hide();
					}
				},
				{
					view: "button",
					value: "Close",
					click() {
						this.$scope.getRoot().hide();
						this.getFormView().clear();
						this.getFormView().clearValidation();
					}
				}
			]
		};
		return {
			view: "popup",
			locaId: "window",
			modal: true,
			width: 500,
			height: 500,
			position: "center",
			body: {
				rows: [
					{
						view: "label",
						localId: "form:label",
						align: "center",
						label: "Add"
					},
					form
				]
			}
		};
	}
	showWindow(item) {
		if (item) {
			this.$$("form").setValues(item);
			this.$$("addBtn").setValue("Save");
			this.$$("form:label").setValue("Edit Activity");
		} else {
			this.$$("addBtn").setValue("Add");
			this.$$("form:label").setValue("Add Activity");
		}
		this.getRoot().show();
	}
}
