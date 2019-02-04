import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";
import ContactActivities from "views/activities/contactactivities";
import ContactFiles from "views/contactfiles";

export default class ContactInfoView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;

		const toolbar = {
			view: "toolbar",
			localId: "toolbar",
			width: 150,
			borderless: true,
			rows: [
				{
					view: "button",
					value: _("Delete"),
					click: () => {
						webix.confirm({
							text: _(
								"Are you sure you want to remove the contact? Removing cannot be undone!"
							),
							callback: result => {
								if (result) {
									const id = this.getParam("id", true);
									contacts.remove(id);
									this.app.callEvent("contacts:showContactInfo&&selectContact");
								}
							}
						});
					}
				},
				{
					view: "button",
					value: _("Edit"),
					click: () => {
						this.show("contactsform");
					}
				}
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
                 <div class="contact__status"><i class="webix_icon wxi-${
										contact.StatusIcon
									}"></i> ${_(contact.StatusValue)}</div>
              </div>
              <div class="contact__details">
                <div><i class="far fa-envelope"></i> ${contact.Email}</div>
                <div><i class="fab fa-skype"></i> ${contact.Skype}</div>
                <div><i class="fas fa-tag"></i> ${contact.Job}</div>
                <div><i class="fas fa-briefcase"></i> ${contact.Company}</div>
                <div><i class="far fa-calendar-alt"></i> ${webix.Date.dateToStr(
									"%d %M %Y"
								)(contact.Birthday)}</div>
                <div><i class="fas fa-clock"></i> ${webix.Date.dateToStr(
									"%d %M %Y"
								)(contact.StartDate)}</div>
                <div><i class="fas fa-mouse-pointer"></i> ${
									contact.Website
								}</div>
                <div><i class="fas fa-map-marker-alt"></i> ${
									contact.Address
								}</div>
              </div>
            </div>
          </div> `;
			}
		};
		return {
			localId: "contact-info",
			gravity: 3,
			type: "space",
			rows: [
				{ borderless: true, cols: [template, toolbar] },
				{
					type: "wide",
					rows: [
						{
							view: "segmented",
							inputWidth: "400",
							multiview: true,
							options: [
								{ id: "activities", value: _("Activities") },
								{ id: "files", value: _("Files") }
							]
						},
						{
							cells: [
								{ id: "activities", $subview: ContactActivities },
								{ id: "files", $subview: ContactFiles }
							]
						}
					]
				}
			]
		};
	}

	urlChange() {
		if (this.getParam("id", true)) {
			const id = this.getParam("id", true);
			webix.promise.all([contacts.waitData, statuses.waitData]).then(() => {
				const contact = contacts.getItem(id);
				let status = statuses.getItem(contact.StatusID);
				if (!status) {
					status = {
						Value: _("Status is not defined"),
						Icon: ""
					};
				}
				this.$$("template").setValues({
					...contact,
					StatusValue: status.Value,
					StatusIcon: status.Icon
				});
			});
		}
	}
}
