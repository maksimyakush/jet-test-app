const dateFormat = webix.Date.strToDate("%d-%m-%Y");

export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: {
		url: "rest-> http://localhost:8096/api/v1/contacts/"
	},
	scheme: {
		$change: obj => {
			obj.Birthday = dateFormat(obj.Birthday);
			obj.StartDate = dateFormat(obj.StartDate);
			obj.value = `${obj.FirstName} ${obj.LastName}`;
		}
		// $save: obj => {
		// 	obj.DueDate = `${strDateFormat(obj.Date)} ${strTimeFormat(obj.Time)}`;
		// }
	}
});

export const dpContacts = webix.dp(contacts);
