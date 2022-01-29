import { ref } from 'vue';
import Alert from '../types/Alert';

const alerts = ref<Alert[]>([]);

export const useAlerts = () => {
    const addAlert = (type: string, text: string) => {
        const alert: Alert = {
            type: type,
            text: text,
        };

        alerts.value.push(alert);
    };

    const removeAlert = (alert: Alert) => {
        alerts.value = alerts.value.filter((al: Alert) => al !== alert);
    };

    return {
        alerts,
        addAlert,
        removeAlert,
    };
};
