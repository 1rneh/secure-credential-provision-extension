    "browser_specific_settings": {
        "gecko": {
            "id": "credentials@experiments.addons.mozilla.org"
        }
    },
    "experiment_apis": {
        "credentials": {
            "schema": "experiments/credentials/schema.json",
            "parent": {
                "scopes": [
                    "addon_parent"
                ],
                "script": "experiments/credentials/api.js",
                "paths": [
                    [
                        "experiments",
                        "credentials"
                    ]
                ]
            }
        }
    }