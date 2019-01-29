import { JetView } from "webix-jet";
import ActivityForm from "views/forms/activityform";

export default class FormPopupView extends JetView {
	config() {
		this.ActivityForm = new ActivityForm(this.app, "", this);
		return {
			view: "popup",
			modal: true,
			width: 500,
			height: 500,
			position: "center",
			body: this.ActivityForm
		};
	}
	showWindow(item) {
		this.getRoot().show();
		this.ActivityForm.onShow(item);
	}
}
