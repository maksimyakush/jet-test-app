import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";

export default class ContactsFormView extends JetView {
	constructor(app, name) {
		super(app, name);
		this._ = this.app.getService("locale")._;
	}
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
				// inputWidth: 300,
				margin: 50,
				labelWidth: 150
				// marginY: 200
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
							label: this._("First Name"),
							name: "FirstName",
							required: true,
							invalidMessage: this._("First Name is requred!")
						},
						{
							view: "text",
							label: this._("Last Name"),
							name: "LastName",
							height: 50,
							required: true,
							invalidMessage: this._("Last Name is requred!")
						}
					]
				},
				{
					cols: [
						{
							view: "text",
							label: this._("Email"),
							name: "Email",
							type: "email",
							required: true,
							invalidMessage: this._("Email is requred!")
						},
						{
							view: "datepicker",
							label: this._("Joining Date"),
							name: "StartDate",
							format: webix.Date.dateToStr("%d %M %Y")
						}
					]
				},
				{
					cols: [
						{
							view: "richselect",
							label: this._("Status"),
							name: "StatusID",
							options: {
								body: {
									data: statuses,
									template: obj => this._(obj.value)
								}
							},
							required: true,
							invalidMessage: this._("Select your status!")
						},
						{
							view: "text",
							label: this._("Job"),
							name: "Job"
						}
					]
				},
				{
					cols: [
						{
							view: "text",
							label: this._("Company"),
							name: "Company"
						},
						{
							view: "text",
							label: this._("Website"),
							name: "Website"
						}
					]
				},
				{
					cols: [
						{
							view: "text",
							label: this._("Address"),
							name: "Address"
						},
						{
							view: "text",
							label: this._("Skype"),
							name: "Skype"
						}
					]
				},
				{
					cols: [
						{
							view: "text",
							label: this._("Phone"),
							name: "Phone"
						},
						{
							view: "datepicker",
							label: this._("Birthday"),
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
									"https://avatars1.githubusercontent.com/u/4639085?s=200&v=4"} width="150" height="150" style="max-width: 100%; max-height: 100%;" alt="Contact Image"} />`,
							name: "Photo",
							height: 150,
							width: 150
						},
						{
							elementsConfig: { inputWidth: 250, margin: 10 },

							rows: [
								{
									localId: "contactsform:uploadbtn",
									view: "uploader",
									multiple: false,
									autosend: false,
									accept: "image/png, image/gif, image/jpeg, image/jpg",
									label: this._("Select Photo"),
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
													text: this._("Invalid photo"),
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
									value: this._("Delete"),
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
					inputWidth: 250,
					align: "right",

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
					inputWidth: 250,
					align: "right",
					value: this._("Close"),
					click: () => {
						webix.confirm({
							text: this._("Are you sure you want to exit?"),
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
		this.$$("form:addsave").setValue(this._("Add"));
		this.$$("contacts:formLabel").setValue(this._("Add Contact"));
		this.$$("contacts:form").clear();
		this.$$("contacts:form").clearValidation();

		webix.promise.all([contacts.waitData, statuses.waitData]).then(() => {
			this.$$("contactsform:previewImg").setValues({
				Photo: contacts.getItem(this.getParam("id", true)).Photo
			});
			this.$$("contacts:form").setValues(
				contacts.getItem(this.getParam("id", true))
			);
			this.$$("form:addsave").setValue(this._("Save"));
			this.$$("contacts:formLabel").setValue(this._("Edit Contact"));
		});
	}
}
