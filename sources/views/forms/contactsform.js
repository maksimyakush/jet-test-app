import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";

import { activities } from "models/activities";
import { activityTypes } from "models/activityTypes";

export default class FormPopupView extends JetView {
	config() {
		const contactsFormLabel = {
			view: "label",
			label: "Add(Edit) Contact",
			marginX: 10,
			localId: "contacts:formLabel"
		};
		const contactsForm = {
			view: "form",
			autoheight: false,
			localId: "contacts:form",
			elementsConfig: {
				inputWidth: 300,
				labelWidth: 100
			},
			elements: [
				{
					cols: [
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
						}
					]
				},
				{
					cols: [
						{
							view: "text",
							label: "Email",
							name: "Email"
						},
						{
							view: "datepicker",
							label: "Joining Date",
							name: "StartDate",
							format: webix.Date.dateToStr("%d %M %Y")
							// invalidMessage: "Fill the details field!",
							// required: true
						}
					]
				},
				{
					cols: [
						{
							view: "richselect",
							label: "Status",
							name: "StatusID",
							options: statuses
						},
						{
							view: "text",
							label: "Job",
							name: "Job"
						}
					]
				},
				{
					cols: [
						{
							view: "text",
							label: "Company",
							name: "Company"
						},
						{
							view: "text",
							label: "Website",
							name: "Website"
						}
					]
				},
				{
					cols: [
						{
							view: "text",
							label: "Address",
							name: "Address"
						},
						{
							view: "text",
							label: "Skype",
							name: "Skype"
						}
					]
				},
				{
					cols: [
						{
							view: "text",
							label: "Phone",
							name: "Phone"
						},
						{
							view: "datepicker",
							label: "Birthday",
							name: "Birthday",
							format: webix.Date.dateToStr("%d %M %Y")

							// invalidMessage: "Fill the details field!",
							// required: true
						}
					]
				},
				{
					cols: [
						{
							id: "preview",
							view: "template",
							template: "<img src=#Photo# />",
							name: "Photo",
							height: 100,
							width: 100
						},
						{
							id: "btnUploadPhoto",
							view: "uploader",
							multiple: false,
							autosend: false,
							accept: "image/png, image/gif, image/jpeg",
							label: "Select Photo",
							labelWidth: 150,
							on: {
								onAfterFileAdd: file => {
									const reader = new FileReader();
									console.log(reader);
									reader.addEventListener("load", event => {
										const base64 = reader.result;
										$$("preview").setValues({ Photo: base64 });
										this.$$("contact:form").setValues({
											...this.$$("contact:form").getValues(),
											Photo: base64
										});
									});

									if (file) {
										reader.readAsDataURL(file.file);
									}
									return false;
								}
							}
						}
					]
				},

				{
					view: "button",
					localId: "form:addsave",
					value: "Add(*save)",
					click: () => {
						if (this.getParam("id", true)) {
							contacts.updateItem(
								this.getParam("id", true),
								this.$$("contacts:form").getValues()
							);
							this.show("contact-info");
						} else {
							contacts.add(this.$$("contacts:form").getValues());
						}
					}
				},
				{
					view: "button",
					value: "Close",
					click: () => {
						webix.confirm({
							text:
								"Are you sure you want to remove this activity? Deleting cannot be undone!",
							callback: result => {
								if (result) {
									if (!this.getParam("id", true)) {
										this.app.callEvent(
											"contacts:showContactInfo&&selectContact"
										);
									} else {
										this.show("contact-info");
									}
								}
							}
						});

						return false;
					}
				}
			]
		};
		return { rows: [contactsFormLabel, contactsForm] };
	}

	init(view) {
		this.$$("form:addsave").setValue("Add");
		this.$$("contacts:formLabel").setValue("Add Contact");
		this.$$("contacts:form").clear();
		this.$$("contacts:form").clearValidation();
		if (this.getParam("id", true)) {
			webix.promise.all([contacts.waitData, statuses.waitData]).then(() => {
				$$("preview").setValues({
					Photo: contacts.getItem(this.getParam("id", true)).Photo
				});
				this.$$("contacts:form").setValues(
					contacts.getItem(this.getParam("id", true))
				);
				this.$$("form:addsave").setValue("Save");
				this.$$("contacts:formLabel").setValue("Edit Contact");
			});
		}
	}
}
