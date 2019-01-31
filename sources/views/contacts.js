import { JetView } from "webix-jet";
import { contacts, dpContacts } from "models/contacts";
import { activities } from "models/activities";
import { cutString } from "helpers/helpers.js";

export default class ContactsListView extends JetView {
	config() {
		const contactsList = {
			view: "list",
			localId: "contacts:list",
			select: true,
			width: 300,
			type: {
				height: 70
			},

			onClick: {
				"wxi-close": (e, id) => {
					webix.confirm({
						text:
							"Are you sure you want to remove the contact? Removing cannot be undone!",
						callback: result => {
							if (result) {
								contacts.remove(id);
								if (contacts.count() < 1) this.show("empty");
							}
						}
					});
					return false;
				}
			},
			template: contact => {
				return `
        <div class="user-listitem">
        <img class="user-listitem__img" alt="Contact image" src=${contact.Photo ||
					"https://avatars1.githubusercontent.com/u/4639085?s=200&v=4"} width="50" height="50">
          <div class="user-listitem__info">
            <div class="user-listitem__name">${cutString(
		`${contact.FirstName} ${contact.LastName}`,
		21
	)}</div>
            <sub class="user-listitem__email">${cutString(
		`${contact.Email}`,
		21
	)}</sub>
          </div>
          <i class="webix_icon wxi-close" style:{"minWidth": 60px}></i>
        </div>
        `;
			}
		};
		return {
			rows: [
				{
					view: "toolbar",
					cols: [{ view: "label", label: "Contacts" }]
				},
				{
					cols: [
						{
							rows: [
								contactsList,
								{
									view: "button",
									localId: "contacts:addBtn",
									type: "icon",
									icon: "wxi-plus",
									label: "Add",
									click: () => {
										this.show("contactsform").then(() => {
											this.$$("contacts:list").unselectAll();
											this.setParam("id", "", true);
										});
									}
								}
							]
						},
						{ $subview: true }
					]
				}
			]
		};
	}

	urlChange() {
		if (this.getSubView()) {
			if (
				this.getSubView().getRoot().config.localId === "contact-info" ||
				contacts.count() < 1
			)
				this.$$("contacts:addBtn").enable();
			else this.$$("contacts:addBtn").disable();
		}
	}

	selectContact(id) {
		if (!contacts.count()) {
			this.show("empty");
			return;
		}
		if (id) this.$$("contacts:list").select(id);
		else {
			const firstId = contacts.getFirstId();
			this.$$("contacts:list").select(firstId);
		}
	}

	contactsListOnAfterSelectEvent() {
		this.on(this.$$("contacts:list"), "onAfterSelect", id => {
			if (this.getSubView().getRoot().config.localId !== "contact-info") {
				this.show("contact-info").then(() => this.setParam("id", id, true));
			} else {
				this.setParam("id", id, true);
			}
		});
	}

	contactsOnBeforeDeleteEvent() {
		this.on(contacts, "onBeforeDelete", id => {
			if (this.$$("contacts:list").getSelectedId() == id) this.selectContact();
			activities.data.each(activity => {
				Promise.resolve().then(() =>
					activity.ContactID == id ? activities.remove(activity.id) : ""
				);
			});
		});
	}

	dpContactsAfterInsertEvent() {
		this.on(dpContacts, "onAfterInsert", obj => {
			contacts.waitData.then(() => {
				this.app.callEvent("contacts:showContactInfo&&selectContact", [obj.id]);
			});
		});
	}

	showContactInfoAndSelectContactEvent() {
		this.on(this.app, "contacts:showContactInfo&&selectContact", id => {
			this.show("contact-info").then(() => this.selectContact(id));
		});
	}

	init() {
		this.$$("contacts:list").sync(contacts);
		contacts.waitData
			.then(() => this.show("contact-info"))
			.then(() => this.selectContact());

		this.contactsListOnAfterSelectEvent();
		this.contactsOnBeforeDeleteEvent();
		this.dpContactsAfterInsertEvent();

		//app event
		this.showContactInfoAndSelectContactEvent();
	}
}
