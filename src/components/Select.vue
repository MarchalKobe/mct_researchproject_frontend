<script setup lang="ts">
    const props = defineProps({
        label: String,
        description: String,
        model: Object,
        modelName: String,
        options: Object,
        required: Boolean as () => boolean | null,
    });

    console.log(props);
    
</script>

<template>
    <label class="c-select__container u-margin-bottom-md" :for="props.label">
        <span class="c-select__label">{{ props.label }}<span v-if="props.required" class="u-color-alpha">*</span></span>
        <div class="c-select">
            <svg class="c-select__symbol" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>

            <select class="c-select__field" :name="props.label" :id="props.label" v-model="props.model![props.modelName!]" onchange="this.dataset.selected = this.value;" :data-selected="props.model![props.modelName!]">
                <option value="" disabled selected>{{ props.description }}</option>
                <option v-for="(option, index) in props.options" :key="index" :value="option.id">{{ option.value }}</option>
            </select>
        </div>
    </label>
</template>
