import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
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
					invalidMessage: "Fill the details field!",
					required: true
				},
				{
					view: "text",
					label: "Last Name",
					name: "LastName",
					invalidMessage: "Fill the details field!",
					required: true
				},
				{
					view: "button",
					localId: "addBtn",
					value: "Add(*save)",
					click() {
					contacts.add(this.getFormView().getValues());
					}
				},
				{
					view: "button",
					value: "Close",
					click() {
            webix.confirm({
              text:
                "Are you sure you want to close form?",
              callback: (result) => {
                if (result) this.$scope.show("contact-info");
              }
            });
						this.$scope.getRoot().hide();
						this.getFormView().clear();
						this.getFormView().clearValidation();
            return false;
					}
				}
			]
		};
		return form;
	}
}
