import { JetView } from "webix-jet";
import { files } from "models/files";

export default class ContactFilesView extends JetView {
	config() {
		return {
			rows: [
				{
					view: "datatable",
					select: true,
					localId: "contact:files",
					scroll: "y",
					columns: [
						{
							header: "Name",
							fillspace: 1,
							id: "FileName",
							sort: "string"
						},
						{
							header: "Change date",
							id: "ChangeDate",
							sort: "date",
							format: webix.Date.dateToStr("%d %M %Y")
						},
						{
							header: "Size",
							id: "FileSize",
							sort: "string"
						},
						{
							template: "{common.trashIcon()}",
							width: 60
						}
					],
					onClick: {
						"wxi-trash": (e, id) => {
							webix.confirm({
								text: "Are you sure you want to remove the file?",
								callback: result => (result ? files.remove(id) : "")
							});
						}
					}
				},
				{
					view: "uploader",
					localId: "contact:filesuploader",
					label: " Upload file",
					icon: "wxi-download",
					type: "iconButton",
					inputWidth: 150,
					align: "right",
					autosend: false
				}
			]
		};
	}

	urlChange() {
		files.filter(obj => obj.ContactID == this.getParam("id", true));
	}

	contactsFileUploaderOnBeforeFileAdd() {
		this.on(this.$$("contact:filesuploader"), "onBeforeFileAdd", obj => {
			const { name, file, sizetext } = obj;

			files.add({
				ContactID: this.getParam("id", true),
				FileName: name,
				FileSize: sizetext,
				ChangeDate: file.lastModifiedDate
			});
		});
	}

	init() {
		this.$$("contact:files").sync(files);
		this.contactsFileUploaderOnBeforeFileAdd();
	}
}
