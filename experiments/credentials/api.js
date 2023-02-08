const { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");

const TOPIC = "secure-credential-provision";

this.credentials = class extends ExtensionAPI {
  getAPI() {
    let EventManager = ExtensionCommon.EventManager;

    return {
      experiments: {
        credentials: {
          onPasswordReceived: new EventManager({
            context,
            name: "experiments.credentials.onPasswordReceived",
            register: (fire) => {
              let observer = (pw) => {
                fire.sync(pw);
              };
              Services.obs.addObserver(observer, TOPIC);
              return () => {
                Services.obs.removeObserver(observer, TOPIC);
              };
            },
          }).api(),
        },
      },
    };
  }
};
