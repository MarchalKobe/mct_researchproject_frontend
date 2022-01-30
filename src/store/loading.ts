import { ref } from 'vue';

const loading = ref<number[]>([]);

export const useLoading = () => {
    const addLoading = () => {
        loading.value.push(1);
    };

    const removeLoading = () => {
        loading.value.pop();
    };

    return {
        loading,
        addLoading,
        removeLoading,
    };
};
