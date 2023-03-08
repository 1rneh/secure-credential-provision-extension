const TOPIC = "passwordmgr-on-receive-credential-info";

this.credentials = class extends ExtensionAPI {
  getAPI(context) {
    let EventManager = ExtensionCommon.EventManager;

    return {
      experiments: {
        credentials: {
          onCredentialInfo: new EventManager({
            context,
            name: "experiments.credentials.onCredentialInfo",
            register: (fire) => {
              let observer = (subject, topic, data) => {
                fire.async(data);
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
