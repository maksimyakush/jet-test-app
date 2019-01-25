import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";

export default class ContactInfoView extends JetView {
	urlChange() {
		if (this.getParam("id")) {
			const id = this.getParam("id");
			webix.promise.all([contacts.waitData, statuses.waitData]).then(() => {
				const contact = contacts.getItem(id);
				const status = statuses.getItem(contact.StatusID);
				this.$$("template").setValues({
					...contact,
					StatusValue: status.Value,
					StatusIcon: status.Icon
				});
			});
		}
	}

	config() {
		const toolbar = {
			view: "toolbar",
			localId: "toolbar",
			cols: [
				{ view: "button", value: "Delete" },
				{ view: "button", value: "Edit" }
			]
		};
		const template = {
			view: "template",
			localId: "template",
			autoheight: true,
			template: contact => {
				return `
          <div class="contact">
            <h2 class="contact__name">${contact.FirstName ||
							"Unknown"} ${contact.LastName || "Unknown"}</h2>
            <div class="contact__info">
              <div class="contact__img-wrapper">
                <img src=${contact.Photo ||
									"https://avatars1.githubusercontent.com/u/4639085?s=200&v=4"} width="150" height="150" alt="Contact Image" class="contact__img" />
                 <div class="contact__status"><i class="webix_icon wxi-${contact.StatusIcon}"></i> ${contact.StatusValue}</div>
              </div>
              <div class="contact__details">
                <div><i class="far fa-envelope"></i> ${contact.Email}</div>
                <div><i class="fab fa-skype"></i> ${contact.Skype}</div>
                <div><i class="fas fa-tag"></i> ${contact.Job}</div>
                <div><i class="fas fa-briefcase"></i> ${contact.Company}</div>
                <div><i class="far fa-calendar-alt"></i> ${contact.Birthday}</div>
                <div><i class="fas fa-mouse-pointer"></i> ${contact.Website}</div>
                <div><i class="fas fa-map-marker-alt"></i> ${contact.Address}</div>
              </div>
            </div>
          </div> `;
			}
		};
		return { gravity: 3, rows: [template, toolbar, { view: "template" }] };
	}
}
