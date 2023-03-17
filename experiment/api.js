const TOPIC = "passwordmgr-on-receive-credential-info";

/**
 * experiments.credentials (WebExtension API)
 */
this.credentials = class extends ExtensionAPI {
  getAPI(context) {
    let EventManager = ExtensionCommon.EventManager;

    return {
      experiments: {
        credentials: {
          /**
           * Defining the event onCredentialInfo
           *
           * context:   ExtensionContext instance
           * name:      Event name
           * register:  The first time a listener is added for onCredentialInfo
           *            an observer is registered for the browser event passwordmgr-on-receive-credential-info
           *            with the callback to fire the data (CredentialInfo object) asynchronously
           */
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
