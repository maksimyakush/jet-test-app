const dateFormat = webix.Date.strToDate("%d-%m-%Y %H:%i");
// const strFormat = webix.Date.dateToStr("%Y-%m-%d %H:%i");
const strDateFormat = webix.Date.dateToStr("%Y-%m-%d");
const strTimeFormat = webix.Date.dateToStr("%H:%i");

export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest-> http://localhost:8096/api/v1/activities/",
	scheme: {
		$change: obj => {
			if (typeof obj.DueDate === "string") {
				obj.DueDate = dateFormat(obj.DueDate);
				obj.Date = dateFormat(obj.DueDate);
				obj.Time = dateFormat(obj.DueDate);
			}
		},
		$save: obj => {
			obj.DueDate = `${strDateFormat(obj.Date)} ${strTimeFormat(obj.Time)}`;
		}
	}
});
