import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";

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
				labelWidth: 100,
				marginY: 200
			},
			rules: {
				FirstName: webix.rules.isNotEmpty,
				LastName: webix.rules.isNotEmpty,
				Email: webix.rules.isNotEmpty,
				StatusID: webix.rules.isNotEmpty
			},
			elements: [
				{
					cols: [
						{
							view: "text",
							label: "First Name",
							name: "FirstName",
							required: true,
							invalidMessage: "First Name is requred!"
						},
						{
							view: "text",
							label: "Last Name",
							name: "LastName",
							height: 50,
							required: true,
							invalidMessage: "Last Name is requred!"
						}
					]
				},
				{
					cols: [
						{
							view: "text",
							label: "Email",
							name: "Email",
							type: "email",
							required: true,
							invalidMessage: "Email is requred!"
						},
						{
							view: "datepicker",
							label: "Joining Date",
							name: "StartDate",
							format: webix.Date.dateToStr("%d %M %Y")
						}
					]
				},
				{
					cols: [
						{
							view: "richselect",
							label: "Status",
							name: "StatusID",
							options: statuses,
							required: true,
							invalidMessage: "Select your status!"
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
						}
					]
				},
				{
					margin: 10,
					cols: [
						{
							localId: "contactsform:previewImg",
							view: "template",
							template: obj =>
								`<img src=${obj.Photo ||
									"https://avatars1.githubusercontent.com/u/4639085?s=200&v=4"} width="100" height="100" style="max-width: 100%; max-height: 100%;" alt="Contact Image"} />`,
							name: "Photo",
							height: 100,
							width: 100
						},
						{
							elementsConfig: { inputWidth: 150 },

							rows: [
								{
									localId: "contactsform:uploadbtn",
									view: "uploader",
									multiple: false,
									autosend: false,
									accept: "image/png, image/gif, image/jpeg, image/jpg",
									label: "Select Photo",
									labelWidth: 150,
									on: {
										onBeforeFileAdd: file => {
											const reader = new FileReader();
											const type = file.type.toLowerCase();
											if (
												type != "png" &&
												type != "jpeg" &&
												type != "gif" &&
												type != "jpg"
											) {
												webix.message({
													text: "Invalid photo",
													type: "error"
												});
												return;
											}
											reader.addEventListener("load", event => {
												const base64 = reader.result;
												this.$$("contactsform:previewImg").setValues({
													Photo: base64
												});
												this.$$("contacts:form").setValues({
													...this.$$("contacts:form").getValues(),
													Photo: base64
												});
											});
											if (file) {
												reader.readAsDataURL(file.file);
											}
										}
									}
								},
								{
									view: "button",
									value: "Delete",
									click: () => {
										const { Photo } = this.$$("contacts:form").getValues();
										if (Photo) {
											this.$$("contacts:form").setValues({
												...this.$$("contacts:form").getValues(),
												Photo: ""
											});
											this.$$("contactsform:previewImg").setValues({
												Photo: ""
											});
										}
									}
								}
							]
						}
					]
				},

				{
					view: "button",
					localId: "form:addsave",
					value: "Add(*save)",
					click: () => {
						if (!this.$$("contacts:form").validate()) return;
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
							text: "Are you sure you want to exit?",
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

	init() {
		this.$$("form:addsave").setValue("Add");
		this.$$("contacts:formLabel").setValue("Add Contact");
		this.$$("contacts:form").clear();
		this.$$("contacts:form").clearValidation();

		webix.promise.all([contacts.waitData, statuses.waitData]).then(() => {
			this.$$("contactsform:previewImg").setValues({
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
