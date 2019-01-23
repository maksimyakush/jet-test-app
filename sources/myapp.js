import "./styles/app.css";
import { JetApp, EmptyRouter, HashRouter } from "webix-jet";

export default class MyApp extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: true,
			start: "/top/contacts"
		};

		super({ ...defaults, ...config });
	}
}

const app = new MyApp();
if (!BUILD_AS_MODULE) {
	webix.ready(() => app.render());
}

app.attachEvent("app:error:resolve", (err, url, result) => {
	webix.delay(() => app.show("/top/empty"));
});
