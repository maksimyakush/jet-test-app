import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import ContactInfo from "views/contact-info";

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
			on: {
				onAfterSelect: id => {
          if(this.getSubView().getRoot().config.localId !== "contact-info") {
            this.show('contact-info').then(() => this.setParam("id", id, true))
          } else {
            this.setParam("id", id, true);
          }
        }
			},
			template: contact => {
				return `
        <div class="user-listitem">
        <img class="user-listitem__img" alt="Contact image" src=${contact.Photo ||
					"https://avatars1.githubusercontent.com/u/4639085?s=200&v=4"} width="50" height="50">
          <div class="user-listitem__info">
          <div class="user-listitem__name">${contact.FirstName ||
						"Unknown"} ${contact.LastName || "Unknown"}</div>
          <sub class="user-listitem__email">${contact.Email}</sub>
          </div>
        </div>
        `;
			}
		};
		return {
			rows: [
				{
					view: "toolbar",
					css: "webix_dark",
					cols: [{ view: "label", label: "Contacts" }]
				},
				{
					cols: [
						{
							rows: [
								contactsList,
								{
									view: "button",
									type: "icon",
									icon: "wxi-plus",
									label: "Add",
									click: () => {
                    this.show("contact-form");
                    this.$$("contacts:list").unselectAll();
                    this.setParam("id", "", true);
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
	selectListItemOnInit() {
    const firstId = contacts.getFirstId();
		this.setParam("id", firstId, true);
		this.$$("contacts:list").select(firstId);
	}
	init() {
    this.$$("contacts:list").sync(contacts);
		contacts.waitData.then(() => this.show("contact-info")).then(() => this.selectListItemOnInit());
	}
}
