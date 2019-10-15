import * as appSettings from '../../settings-store.json';
import { MqttClientSettings } from '../../view/mqtt/SignalMqttClient.js';

export default class Settings {
    private static instance: Settings;

    private _mqttClientSettings: MqttClientSettings;

    get mqttClientSettings(): MqttClientSettings {
        return this._mqttClientSettings;
    }

    private constructor() {
        this._mqttClientSettings = appSettings.mqttClientSettings;

        //override with environment variables
        this._mqttClientSettings.protocol = process.env.RDS_MQTT_PROTOCOL || this._mqttClientSettings.protocol;
        this._mqttClientSettings.host = process.env.RDS_MQTT_HOST || this._mqttClientSettings.host;
        this._mqttClientSettings.port = process.env.RDS_MQTT_PORT ? parseInt(process.env.RDS_MQTT_PORT) : this._mqttClientSettings.port;
        this._mqttClientSettings.username = process.env.RDS_MQTT_USERNAME || this._mqttClientSettings.username;
        this._mqttClientSettings.password = process.env.RDS_MQTT_PASSWORD || this._mqttClientSettings.password;
    }

    toString(): string {
        return JSON.stringify(this, null, 2);
    }

    static getInstance(): Settings {
        if (!Settings.instance) {
            Settings.instance = new Settings();
        }

        return Settings.instance;
    }
}