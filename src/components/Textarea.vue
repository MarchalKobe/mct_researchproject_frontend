<script setup lang="ts">
    const props = defineProps({
        label: String,
        placeholder: String,
        rows: Number,
        model: Object,
        modelName: String,
    });
</script>

<template>
    <label class="c-textarea__container" :for="props.label">
        <span class="c-textarea__label">{{ props.label }}</span>
        <textarea class="c-textarea__field" :name="props.label" :id="props.label" :rows="props.rows" :placeholder="props.placeholder" v-model="props.model![props.modelName!]" />
    </label>
</template>
