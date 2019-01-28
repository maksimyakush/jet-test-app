import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activityTypes } from "models/activityTypes";

export default class ActivityFormView extends JetView {
	constructor(app, name, Popup) {
		super(app, name);
		this.Popup = Popup;
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
			this.$$("activities:form:addsave-btn").setValue("Save");
			this.$$("activities:formlabel").setValue("Edit Activity");
		} else {
			this.$$("activities:form:addsave-btn").setValue("Add");
			this.$$("activities:formlabel").setValue("Add Activity");
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
					localId: "activities:form:richselect",
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
					localId: "activities:form:addsave-btn",
					value: "Add(*save)",
					click: () => {
						if (!this.$$("activities:form").validate()) return;
						this.addActivity();
						if(this.Popup) this.Popup.getRoot().hide();
					}
				},
				{
					view: "button",
					value: "Close",
					click: () => {
						this.$$("activities:form").clear();
						this.$$("activities:form").clearValidation();
						if(this.Popup) this.Popup.getRoot().hide();
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
					label: "Add"
				},
				activitiesForm
			]
		};
  }
  init() {
    if(!this.Popup) this.onShow()
  }
}
