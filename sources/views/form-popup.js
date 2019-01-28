import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activityTypes } from "models/activityTypes";
import activityForm from "views/forms/activityform";


export default class FormPopupView extends JetView {
	config() {
    this.activityForm = new activityForm(this.app, "", this);
		return {
			view: "popup",
			locaId: "window",
			modal: true,
			width: 500,
			height: 500,
			position: "center",
			body: this.activityForm
		};
	}
	showWindow(item) {
		this.getRoot().show();
    this.activityForm.onShow(item);


  }
  init(view, url) {
    console.log(url);
  }
}
