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

	init(view) {
		view.define("rows", [this.dataTable, this.addActivityBtn]);
		view.reconstruct();
		this.$$("datatable").sync(activities);
		this.$$("activities:label").hide();
		this.$$("datatable").hideColumn("ContactID");
		this._jetPopup = this.ui(FormPopup);
	}
}
