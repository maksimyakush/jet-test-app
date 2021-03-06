import { activities } from "models/activities";
import FormPopup from "views/form-popup";
import ActivitiesView from "views/activities/base/activities";

export default class ContactActivitiesView extends ActivitiesView {
	constructor(app, name) {
		super(app, name);
	}

	urlChange() {
		activities.filter(data => data.ContactID == this.getParam("id", true));
	}

	init() {
		this.$$("datatable").sync(activities);
		this.$$("activities:label").hide();
		this.$$("datatable").hideColumn("ContactID");
		this.activitiesRagisterFilter();
		this.activitiesAfterDeleteEvent();
		this.activitiesAfterDeleteEvent();
		this.activitiesDataUpdateEvent();
		this._jetPopup = this.ui(FormPopup);
	}
}
