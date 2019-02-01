import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activityTypes } from "models/activityTypes";

export default class ActivityFormView extends JetView {
	constructor(app, name, Popup) {
		super(app, name);
		this.Popup = Popup;
		this._ = this.app.getService("locale")._;
	}

	addActivity() {
		const strDateFormat = webix.Date.dateToStr("%d-%m-%Y");
		const strTimeFormat = webix.Date.dateToStr("%H:%i");
		const { id, Date, Time } = this.$$("activities:form").getValues();

		const DueDate = `${strDateFormat(Date)} ${strTimeFormat(Time)}`;
		if (activities.exists(id)) {
			activities.updateItem(id, {
				...this.$$("activities:form").getValues(),
				DueDate
			});
		} else {
			activities.add({ ...this.$$("activities:form").getValues(), DueDate });
		}
		this.$$("activities:form").clear();
		this.$$("activities:form").clearValidation();
	}

	setFormValuesDependOnAddOrUpdate(item) {
		if (item) {
			this.$$("activities:form").setValues(item);
			this.$$("activities:form:addsave-btn").setValue(this._("Save"));
			this.$$("activities:formlabel").setValue(this._("Edit Activity"));
		} else {
			this.$$("activities:form:addsave-btn").setValue(this._("Add"));
			this.$$("activities:formlabel").setValue(this._("Add Activity"));
		}
	}

	onShow(item) {
		if (this.getParam("id", true)) {
			this.$$("activities:form:richselect").setValue(this.getParam("id", true));
			this.$$("activities:form:richselect").define("readonly", true);
			this.$$("activities:form:richselect").refresh();
			this.setFormValuesDependOnAddOrUpdate(item);
		} else {
			this.setFormValuesDependOnAddOrUpdate(item);
		}
	}

	config() {
		const activitiesForm = {
			view: "form",
			localId: "activities:form",
			rules: {
				Details: webix.rules.isNotEmpty,
				ContactID: webix.rules.isNotEmpty,
				TypeID: webix.rules.isNotEmpty,
				Date: webix.rules.isNotEmpty,
				Time: webix.rules.isNotEmpty
			},
			elementsConfig: {
				labelWidth: 130
			},
			elements: [
				{
					view: "textarea",
					label: this._("Details"),
					name: "Details",
					invalidMessage: this._("Fill the details field!"),
					required: true
				},
				{
					view: "richselect",
					label: this._("Contacts"),
					options: contacts,
					localId: "activities:form:richselect",
					name: "ContactID",
					invalidMessage: this._("Choose the contact!"),
					required: true
				},
				{
					view: "richselect",
					label: this._("Activity"),
					options: {
            body: {
              data: activityTypes,
              template: obj => this._(obj.value)
            }
          },
					name: "TypeID",
					invalidMessage: this._("Choose the activity!"),
					required: true
				},

				{
					view: "datepicker",
					label: this._("Date"),
					name: "Date",
					format: "%d-%m-%Y",
					invalidMessage: this._("Choose date!"),
					required: true
				},
				{
					view: "datepicker",
					label: this._("Time"),
					name: "Time",
					type: "time",
					format: "%H:%i",
					invalidMessage: this._("Choose time!"),
					required: true
				},
				{
					view: "checkbox",
					checkValue: "Close",
					uncheckValue: "Open",
					label: this._("Completed"),
					name: "State"
				},
				{
					view: "button",
					localId: "activities:form:addsave-btn",
					value: "Add(*save)",
					click: () => {
						if (!this.$$("activities:form").validate()) return;
						this.addActivity();
						if (this.Popup) this.Popup.getRoot().hide();
					}
				},
				{
					view: "button",
					value: this._("Close"),
					click: () => {
						this.$$("activities:form").clear();
						this.$$("activities:form").clearValidation();
						if (this.Popup) this.Popup.getRoot().hide();
					}
				}
			]
		};
		return {
			rows: [
				{
					view: "label",
					localId: "activities:formlabel",
					align: "center",
					label: this._("Add")
				},
				activitiesForm
			]
		};
	}
	init() {
		if (!this.Popup) this.onShow();
	}
}
