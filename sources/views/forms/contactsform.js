import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";

import { activities } from "models/activities";
import { activityTypes } from "models/activityTypes";

export default class FormPopupView extends JetView {
	config() {
		const form = {
			view: "form",
			autoheight: false,
			localId: "contact:form",

			elements: [
				{
					view: "text",
					label: "First Name",
					name: "FirstName",
					invalidMessage: "Fill the details field!"
				},
				{
					view: "text",
					label: "Last Name",
					name: "LastName"
				},
				{
					view: "text",
					label: "Email",
					name: "Email"
				},
				{
					view: "datepicker",
					label: "Joining Date",
					name: "StartDate"
					// invalidMessage: "Fill the details field!",
					// required: true
				},

				{
					view: "button",
					localId: "form:addsave",
					value: "Add(*save)",
					click: () => {
						if (this.getParam("id", true)) {
							contacts.updateItem(
								this.getParam("id", true),
								this.getRoot().getValues()
							);
							this.show("contact-info");
						} else {
							contacts.add(this.getRoot().getValues());
							this.app.callEvent("contacts:selectfirstitem")
						}
					}
				},
				{
					view: "button",
					value: "Close",
					click: () => {
						if (!this.getParam("id", true)) {
								this.app.callEvent("contacts:selectfirstitem")
						} else {
							this.show("contact-info");
						}
						// return false;
					}
				}
			]
		};
		return form;
	}

	urlChange(view) {}
	ready(view) {}
	destroy() {}
	init(view) {
		this.$$("form:addsave").setValue("Add");
		view.clear();
		view.clearValidation();
		if (this.getParam("id", true)) {
			webix.promise.all([contacts.waitData, statuses.waitData]).then(() => {
				view.setValues(contacts.getItem(this.getParam("id", true)));
				this.$$("form:addsave").setValue("Save");
			});
		}
	}
}
